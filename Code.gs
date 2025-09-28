/**
 * Converts the last day's unread emails into a podcast and emails it.
 * Uses Google Gemini for summarization and ElevenLabs for text-to-speech.
 * 
 * Required Script Properties (set in Project Settings > Script Properties):
 * - GEMINI_API_KEY: Your Google Gemini API key
 * - ELEVENLABS_API_KEY: Your ElevenLabs API key
 * - ELEVENLABS_VOICE_ID: Your preferred voice ID from ElevenLabs
 * - RECIPIENT_EMAIL: Your email address
 * - RECIPIENT_NAME: Your name for personalized podcast
 */

function getConfigFromProperties() {
  const properties = PropertiesService.getScriptProperties();
  const requiredKeys = ['GEMINI_API_KEY', 'ELEVENLABS_API_KEY', 'ELEVENLABS_VOICE_ID', 'RECIPIENT_EMAIL', 'RECIPIENT_NAME'];
  
  const config = {};
  const missingProperties = [];
  
  requiredKeys.forEach(key => {
    const value = properties.getProperty(key);
    if (!value?.trim()) {
      missingProperties.push(key);
    } else {
      config[key] = value;
    }
  });
  
  if (missingProperties.length > 0) {
    throw new Error(`Missing required script properties: ${missingProperties.join(', ')}. Please set these in Project Settings > Script Properties.`);
  }
  
  return config;
}


function emailToPodcast() {
  const config = getConfigFromProperties();
  
  // Get yesterday's date in YYYY-MM-DD format
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  Logger.log(`Searching for emails after: ${yesterday}`);
  
  // Get unread emails from yesterday
  const threads = GmailApp.search(`label:inbox after:${yesterday}`, 0, 10);
  const emails = threads.flatMap(thread => 
    thread.getMessages()
      .filter(message => message.isUnread())
      .map(message => ({
        from: message.getFrom(),
        subject: message.getSubject(),
        body: message.getPlainBody().substring(0, 1000)
      }))
  );

  if (!emails.length) {
    Logger.log("No unread emails found.");
    return;
  }

  // Process emails through the pipeline
  const summary = summarizeWithGemini(emails, config);
  const audio = summary ? generatePodcastAudio(summary, config) : null;
  if (audio) emailPodcast(audio, config);
}

function summarizeWithGemini(emails, config) {
  const emailText = emails.map(email => 
    `From: ${email.from}\nSubject: ${email.subject}\nBody: ${email.body}\n`
  ).join('\n');
  
  const prompt = `You are creating a script that will be directly converted to audio using text-to-speech. Summarize the following emails into a concise, engaging personalized podcast script for ${config.RECIPIENT_NAME}. 

IMPORTANT: This text will be read aloud by ElevenLabs TTS, so:
- Write in a conversational, natural speaking style
- Use short, clear sentences that flow well when spoken
- Avoid complex punctuation that might confuse the TTS
- Include natural pauses and transitions
- Keep it under 500 words
- Make it sound like a friendly, engaging podcast host

Emails to summarize:\n\n${emailText}`;

  try {
    const response = UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent', {
      method: 'POST',
      headers: { 'x-goog-api-key': config.GEMINI_API_KEY, 'Content-Type': 'application/json' },
      payload: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 600, temperature: 0.7 }
      })
    });
    
    return JSON.parse(response.getContentText()).candidates[0].content.parts[0].text;
  } catch (error) {
    Logger.log(`Gemini API Error: ${error}`);
    return null;
  }
}

function generatePodcastAudio(text, config) {
  try {
    const response = UrlFetchApp.fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.ELEVENLABS_VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': config.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({ text }),
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() === 200) {
      return response.getBlob().setContentType('audio/mpeg');
    }
    
    Logger.log(`ElevenLabs API Error: ${response.getResponseCode()} - ${response.getContentText()}`);
    return null;
  } catch (error) {
    Logger.log(`ElevenLabs Error: ${error}`);
    return null;
  }
}


function emailPodcast(audioFile, config) {
  try {
    MailApp.sendEmail({
      to: config.RECIPIENT_EMAIL,
      subject: 'Your Daily Email Podcast',
      body: 'Here is your daily digest of unread emails in podcast form.',
      attachments: [audioFile]
    });
    Logger.log('Podcast email sent successfully!');
  } catch (error) {
    Logger.log(`Email sending error: ${error}`);
  }
}