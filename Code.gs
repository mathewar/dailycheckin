// keys below

// const GEMINI_API_KEY =  
// const ELEVENLABS_API_KEY =

/**
 * Converts the last day's unread emails into a podcast and emails it.
 * Uses Google Gemini for summarization and ElevenLabs for text-to-speech.
 */

const VOICE_ID = ""; // Replace with your voice ID from elevenlabs
const RECIPIENT_EMAIL = ""; // Replace with your email address
const RECIPIENT_NAME = ""; // Replace with your name for personalized podcast


function emailToPodcast() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const formattedDate = yesterday.toISOString().split('T')[0]; // Split at 'T' and take the first part
  Logger.log("Searching for emails after : " + formattedDate); 
  const maxThreads = 10;
  const threads = GmailApp.search(`label:inbox after:${formattedDate}`, 0, maxThreads);

  const emails = threads.flatMap(thread => thread.getMessages().filter(message => message.isUnread()).map(message => ({
    from: message.getFrom(),
    subject: message.getSubject(),
    body: message.getPlainBody().substring(0, 1000)
  })));

  if (emails.length === 0) {
    Logger.log("No unread emails found.");
    return;
  }

  const summary = summarizeWithGemini(emails);
  if (summary) {
    const audio = generatePodcastAudio(summary);
    if (audio) {
      emailPodcast(audio);
    }
  }

}

function summarizeWithGemini(emails) {
  const prompt = `Summarize the following emails for a concise, quirky and engaging personalized podcast for ${RECIPIENT_NAME}, it is from his Gmail inbox. Prioritize key details and format for spoken word. Keep it under 500 words:\n\n${emails.map(email => `From: ${email.from}\nSubject: ${email.subject}\nBody: ${email.body}\n\n`).join('')}`; // Removed "---" separators

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': { 'x-goog-api-key': GEMINI_API_KEY },
    'payload': JSON.stringify({
      "contents": [{
        "parts": [{
          "text": prompt
        }]
      }],
      "generationConfig": {
        "maxOutputTokens": 600,
        "temperature": 0.7
      }
    })
  };

  try {
    const response = UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', options);
    const data = JSON.parse(response.getContentText());
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    Logger.log("Gemini API Error: " + error);
    return null;
  }
}

function generatePodcastAudio(text) {
  const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`; // Use single VOICE_ID
  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    'payload': JSON.stringify({ "text": text }),
    'muteHttpExceptions': true
  };

  try {
    const response = UrlFetchApp.fetch(endpoint, options);
    if (response.getResponseCode() === 200) {
      return response.getBlob().setContentType('audio/mpeg');
    } else {
      Logger.log(`ElevenLabs API Error: ${response.getResponseCode()} - ${response.getContentText()}`);
      return null; // Return null on error
    }
  } catch (error) {
    Logger.log(`Error fetching from ElevenLabs: ${error}`);
    return null; // Return null on error
  }
}


function emailPodcast(audioFile) {
  if (!audioFile) {
    Logger.log("No podcast audio to email.");
    return;
  }

  MailApp.sendEmail({
    to: RECIPIENT_EMAIL,
    subject: 'Your Daily Email Podcast',
    body: 'Here is your daily digest of unread emails in podcast form.',
    attachments: [audioFile]
  });

  Logger.log('Podcast email sent successfully!');
}