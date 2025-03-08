import { AssemblyAI } from 'assemblyai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { audioUrl } = req.body

  if (!audioUrl) {
    return res.status(400).json({ error: 'Audio URL is required' })
  }

  try {
    // Initialize AssemblyAI client
    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLY_AI_API_KEY,
    })

    // Prepare transcription options
    const transcriptionOptions = {
      audio_url: audioUrl,
      speaker_labels: true
    }
    
    // Log information about the transcription request (helps with debugging)
    console.log('Starting transcription with options:', JSON.stringify({
      url_provided: audioUrl,
      has_api_key: !!process.env.ASSEMBLY_AI_API_KEY,
      options: {
        ...transcriptionOptions,
        audio_url: audioUrl.substring(0, 30) + '...' // Truncate for security
      }
    }))

    // Start transcription
    const transcript = await client.transcripts.create(transcriptionOptions)

    // Return the transcription ID to the client
    return res.status(200).json({ 
      id: transcript.id,
      status: transcript.status,
      message: 'Transcription started successfully',
    })
  } catch (error) {
    console.error('Transcription error:', error)
    return res.status(500).json({ 
      error: error.message || 'An error occurred while starting transcription' 
    })
  }
}