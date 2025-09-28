# Email to Podcast - Daily Check-in

Transform your daily emails into a personalized podcast! This Google Apps Script automatically converts your unread Gmail messages into an engaging audio summary using AI.

## Overview

**Email to Podcast** is a Google Apps Script that automates your daily email digest by:
- Fetching unread emails from your Gmail inbox from the previous day
- Using Google's Gemini AI to create a concise, engaging summary
- Converting the summary to high-quality speech using ElevenLabs
- Emailing you the podcast as an audio attachment

Perfect for busy professionals who want to stay on top of their inbox while commuting, exercising, or multitasking.

## Features

- 📧 **Smart Email Filtering**: Automatically fetches yesterday's unread emails
- 🤖 **AI Summarization**: Uses Google Gemini to create personalized, engaging summaries
- 🎙️ **High-Quality Audio**: ElevenLabs text-to-speech with customizable voices
- 📱 **Email Delivery**: Receives your daily podcast directly in your inbox
- ⚙️ **Fully Configurable**: Easy setup with your own API keys and preferences
- 🔄 **Automated**: Set up once and receive daily podcasts automatically

## Installation

### Step 1: Set up Google Apps Script

1. **Create a New Project**:
   - Go to [Google Apps Script](https://script.google.com/)
   - Click **"New Project"**
   - Replace the default code with the contents of `Code.gs` from this repository

2. **Configure Your Settings**:
   - Update the configuration constants at the top of the script:
   ```javascript
   const GEMINI_API_KEY = "your-gemini-api-key-here";
   const ELEVENLABS_API_KEY = "your-elevenlabs-api-key-here";
   const VOICE_ID = "your-preferred-voice-id";
   const RECIPIENT_EMAIL = "your-email@example.com";
   const RECIPIENT_NAME = "Your Name";
   ```

3. **Authorize the Script**:
   - Click **"Run"** to execute the function for the first time
   - Grant the necessary Gmail and email permissions when prompted

4. **Set up Daily Automation** (Optional):
   - Click the **clock icon** (Triggers) in the toolbar
   - Click **"+ Add Trigger"**
   - Choose function: `emailToPodcast`
   - Event source: **Time-driven**
   - Type: **Day timer**
   - Time of day: Choose your preferred time (e.g., 8:00 AM)

## Getting API Keys

### Google Gemini API Key (for AI Summarization)

1. **Access Google AI Studio**:
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Sign in with your Google account

2. **Generate API Key**:
   - Click **"Get API key"** in the left sidebar
   - Click **"Create API key in new project"** or select an existing project
   - Copy the generated API key immediately
   - The API key will be in the format: `AIza...`

3. **Enable the API** (if needed):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to "APIs & Services" > "Library"
   - Search for "Generative Language API" and enable it

4. **Pricing**: Gemini Pro has a generous free tier with 15 requests per minute, 1500 requests per day. Paid usage starts at very low rates.

### ElevenLabs API Key (for Text-to-Speech)

1. **Sign up for ElevenLabs**:
   - Visit [ElevenLabs](https://elevenlabs.io/)
   - Create a free account (includes 10,000 characters/month)

2. **Get Your API Key**:
   - Go to your [Profile Settings](https://elevenlabs.io/speech-synthesis)
   - Find your **API Key** in the profile section
   - Copy the key

3. **Choose a Voice**:
   - Browse the [Voice Library](https://elevenlabs.io/voice-library)
   - Click on a voice you like and copy its **Voice ID**
   - Or use the default voices (check ElevenLabs documentation for IDs)

4. **Pricing**: Free tier includes 10,000 characters/month. Paid plans start at $5/month for 30,000 characters.

## Usage

### Manual Execution
- Open your Google Apps Script project
- Click **"Run"** to execute `emailToPodcast()` manually
- Check your email for the podcast attachment

### Automated Daily Delivery
- Once you've set up the trigger (see Installation Step 4), the script will run automatically
- You'll receive your daily email podcast at the scheduled time
- The script processes emails from the previous day only

### Customization Options
- **Adjust email filtering**: Modify the Gmail search query in the code
- **Change summary style**: Edit the Gemini prompt to match your preferences
- **Voice selection**: Try different ElevenLabs voices by changing the `VOICE_ID`
- **Email limits**: Adjust `maxThreads` to process more or fewer emails

## Project Structure

```
dailycheckin/
├── README.md          # This file
└── Code.gs           # Main Google Apps Script file
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Troubleshooting

### Common Issues

**"Authorization required"**: 
- Make sure you've run the script once manually and granted all permissions
- Check that your Google account has access to Gmail

**"API key invalid"**:
- Verify your API keys are correctly copied (no extra spaces)
- Ensure your Gemini API key starts with "AIza" and is properly formatted
- Check that your ElevenLabs account is active
- Make sure the Generative Language API is enabled in Google Cloud Console

**"No emails found"**:
- The script looks for emails from yesterday - make sure you have unread emails from the previous day
- Check the Gmail search query in the code if you want to modify the filtering

**Audio quality issues**:
- Try different voice IDs from ElevenLabs
- Check your ElevenLabs account usage limits

## Roadmap

- [ ] Add support for multiple email accounts
- [ ] Implement custom email filtering rules
- [ ] Add summary length customization
- [ ] Support for different AI models (Claude, GPT)
- [ ] Web interface for easier configuration
- [ ] Integration with calendar events
- [ ] Multi-language support

## Contact

For questions or suggestions, please open an issue on this repository.

---

*Start your daily check-in journey today! 🚀*
