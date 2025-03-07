# Audio Transcription App

A Next.js application that allows you to upload MP3 files, send them to AssemblyAI for transcription and diarization, and display the results.

## Features

- Large file upload support (up to 500MB by default)
- Real-time upload progress tracking
- Transcription with speaker diarization using AssemblyAI
- View diarized transcription with speaker labels and timestamps
- View and download the full transcript

## Prerequisites

- Node.js 14.x or later
- An AssemblyAI API key (sign up at [AssemblyAI](https://www.assemblyai.com/))

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with your AssemblyAI API key:

```
ASSEMBLY_AI_API_KEY=your_api_key_here
NEXT_PUBLIC_MAX_FILE_SIZE=500000000  # 500MB in bytes
```

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Vercel
3. Add your AssemblyAI API key as an environment variable:
   - Name: `ASSEMBLY_AI_API_KEY`
   - Value: Your API key from AssemblyAI

4. Deploy!

### Environment Variables on Vercel

Make sure to add the following environment variables in your Vercel project settings:

- `ASSEMBLY_AI_API_KEY`: Your AssemblyAI API key
- `NEXT_PUBLIC_MAX_FILE_SIZE`: Maximum file size in bytes (e.g., 500000000 for 500MB)

### Creating a Vercel Secret

To securely store your API key on Vercel, you can use Vercel CLI to create a secret:

```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Add your API key as a secret
vercel secrets add assembly_ai_api_key "your_api_key_here"
```

## Technical Details

### File Upload Process

1. The front-end collects the audio file via a form
2. The file is uploaded to the server with progress tracking via XMLHttpRequest
3. The server saves the file to the `public/uploads` directory
4. The file URL is sent to AssemblyAI for processing
5. The client polls for transcription status until complete

### Large File Handling

- The application is configured to handle large files (up to 500MB by default)
- Vercel's serverless functions have a 4.5MB payload limit, but this app circumvents that by saving the file to the filesystem
- For very large files or production use, consider integrating with S3 or another storage service

### AssemblyAI Integration

- The app uses the official AssemblyAI Node.js SDK
- Speaker diarization is enabled to identify different speakers
- The API provides timestamps and speaker labels for each utterance

## Customization

### Maximum File Size

You can adjust the maximum file size in the `.env.local` file:

```
NEXT_PUBLIC_MAX_FILE_SIZE=1000000000  # 1GB in bytes
```

### Additional AssemblyAI Features

The current implementation uses speaker diarization. You can enable additional features by modifying the `lib/assemblyai.js` file:

```javascript
const data = {
  audio: fileUrl,
  speaker_labels: true,
  // Add other features:
  // sentiment_analysis: true,
  // entity_detection: true,
  // summarization: true,
}
```

## Troubleshooting

### Upload Issues

- If you're having trouble with large uploads, check your server timeout settings
- For local development, you may need to increase the body size limit in Next.js config

### Transcription Issues

- Check the AssemblyAI console for detailed logs
- Ensure your audio file format is supported by AssemblyAI

## License

MIT