import { AssemblyAI } from 'assemblyai'
import fs from 'fs'

// Initialize AssemblyAI client
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_AI_API_KEY,
})

// Create a transcription from a file path or URL
export async function createTranscription(filePathOrUrl) {
  try {
    // Determine if we're dealing with a URL or a file path
    const isUrl = filePathOrUrl.startsWith('http')
    
    let transcriptParams = {
      speaker_labels: true,
    }
    
    if (isUrl) {
      // If it's a URL, use it directly
      transcriptParams.audio = filePathOrUrl
    } else {
      // If it's a file path, create a readable stream
      const fileStream = fs.createReadStream(filePathOrUrl)
      
      // Use direct upload to AssemblyAI
      const uploadResponse = await client.files.upload(fileStream)
      
      // Use the uploaded audio URL for transcription
      transcriptParams.audio = uploadResponse.audio_url
    }
    
    // Start transcription with parameters
    const transcript = await client.transcripts.transcribe(transcriptParams)
    return transcript
  } catch (error) {
    console.error('AssemblyAI transcription error:', error)
    throw new Error(error.message || 'Failed to create transcription')
  }
}

// Check status of a transcription
export async function getTranscription(transcriptId) {
  try {
    const transcript = await client.transcripts.get(transcriptId)
    return transcript
  } catch (error) {
    console.error('AssemblyAI get transcription error:', error)
    throw new Error(error.message || 'Failed to get transcription status')
  }
}