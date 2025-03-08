# Audio Transcription App with Google Drive Integration

A Next.js application that allows you to transcribe audio files from Google Drive URLs using AssemblyAI for transcription and diarization.

## Features

- Transcribe audio directly from Google Drive links
- No file size limitations (transcribe files of any length)
- Transcription with speaker diarization using AssemblyAI
- View diarized transcription with speaker labels and timestamps
- View and download the full transcript

## Prerequisites

- Node.js 14.x or later
- An AssemblyAI API key (sign up at [AssemblyAI](https://www.assemblyai.com/))
- Google Drive account for hosting audio files

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with your AssemblyAI API key:

```
ASSEMBLY_AI_API_KEY=your_api_key_here
```

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. Upload your audio file to Google Drive
2. Make the file publicly accessible (anyone with the link can view)
3. Copy the Google Drive link
4. Paste the link into the application
5. The application sends the link to AssemblyAI for transcription
6. View the diarized transcript when processing completes

## Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Vercel
3. Add your AssemblyAI API key as an environment variable:
   - Name: `ASSEMBLY_AI_API_KEY`
   - Value: Your API key from AssemblyAI

4. Deploy!

### Creating a Vercel Secret

To securely store your API key on Vercel, you can use Vercel CLI to create a secret:

```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Add your API key as a secret
vercel secrets add assembly_ai_api_key "your_api_key_here"
```

## Technical Details

### Google Drive Integration

- The application accepts Google Drive URLs for audio files
- AssemblyAI can directly access public Google Drive links
- This approach bypasses file size limitations in browsers and serverless functions

### AssemblyAI Integration

- The app uses the official AssemblyAI Node.js SDK
- Speaker diarization is enabled to identify different speakers
- The API provides timestamps and speaker labels for each utterance

## Troubleshooting

### URL Issues

- Ensure your Google Drive link is publicly accessible
- Use the shareable link option in Google Drive (not the URL from your address bar)
- The link should look like: `https://drive.google.com/file/d/[file-id]/view?usp=sharing`

### Transcription Issues

- Check the AssemblyAI console for detailed logs
- Ensure your audio file format is supported by AssemblyAI

## Additional Features to Consider

- Add support for other cloud storage providers (Dropbox, OneDrive, etc.)
- Add authentication to protect your transcriptions
- Add a history of past transcriptions

## License

MIT