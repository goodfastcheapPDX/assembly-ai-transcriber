import { AssemblyAI } from 'assemblyai'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  const { id } = req.query
  
  if (!id) {
    return res.status(400).json({ error: 'Transcription ID is required' })
  }
  
  try {
    // Initialize AssemblyAI client
    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLY_AI_API_KEY,
    })
    
    // Get the transcription status from AssemblyAI
    const transcript = await client.transcripts.get(id)
    
    // Map the response based on status
    if (transcript.status === 'completed') {
      return res.status(200).json({
        id: transcript.id,
        status: 'completed',
        text: transcript.text,
        utterances: transcript.utterances || [],
        audio_duration: transcript.audio_duration,
        created: transcript.created_at,
      })
    } else if (transcript.status === 'error') {
      return res.status(200).json({
        id: transcript.id,
        status: 'error',
        error: transcript.error || 'An error occurred during transcription',
      })
    } else {
      // Still processing
      return res.status(200).json({
        id: transcript.id,
        status: transcript.status,
        message: 'Transcription is still processing',
      })
    }
  } catch (error) {
    console.error('Transcription status error:', error)
    return res.status(500).json({ 
      error: error.message || 'An error occurred while checking transcription status' 
    })
  }
}