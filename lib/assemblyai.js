import { AssemblyAI } from 'assemblyai'

// Initialize AssemblyAI client
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_AI_API_KEY,
})

// Create a transcription
export async function createTranscription(fileUrl) {
  try {
    // Request parameters with speaker_labels enabled
    const data = {
      audio: fileUrl,
      speaker_labels: true,
    }
    
    // Start transcription
    const transcript = await client.transcripts.transcribe(data)
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