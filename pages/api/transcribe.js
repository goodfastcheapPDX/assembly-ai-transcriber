import { getTranscription } from '../../lib/assemblyai'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  const { id } = req.query
  
  if (!id) {
    return res.status(400).json({ error: 'Transcription ID is required' })
  }
  
  try {
    // Get the transcription status from AssemblyAI
    const transcription = await getTranscription(id)
    
    // Map the response based on status
    if (transcription.status === 'completed') {
      return res.status(200).json({
        id: transcription.id,
        status: 'completed',
        text: transcription.text,
        utterances: transcription.utterances || [],
        audio_duration: transcription.audio_duration,
        created: transcription.created_at,
      })
    } else if (transcription.status === 'error') {
      return res.status(200).json({
        id: transcription.id,
        status: 'error',
        error: transcription.error || 'An error occurred during transcription',
      })
    } else {
      // Still processing
      return res.status(200).json({
        id: transcription.id,
        status: transcription.status,
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