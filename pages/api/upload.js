import formidable from 'formidable'
import { createTranscription } from '../../lib/assemblyai'

// Disable the default body parser to handle form data
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Configure formidable for file uploads with streaming to AssemblyAI
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 500 * 1024 * 1024, // 500MB limit
    })

    // Parse the form
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve([fields, files])
      })
    })

    // Check if file was uploaded
    if (!files || !files.audioFile) {
      return res.status(400).json({ error: 'No audio file uploaded' })
    }

    const audioFile = files.audioFile
    
    // Verify it's an audio file
    if (!audioFile.mimetype || !audioFile.mimetype.includes('audio')) {
      return res.status(400).json({ error: 'Uploaded file is not an audio file' })
    }

    // Instead of saving the file, we'll use the direct upload to AssemblyAI feature
    // by providing the file path (which is temporary but still accessible)
    // This avoids the need to save the file permanently on the server
    const transcription = await createTranscription(audioFile.filepath)
    
    // Return the transcription ID to the client
    return res.status(200).json({ 
      id: transcription.id,
      status: transcription.status,
      message: 'Transcription started successfully',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({ 
      error: error.message || 'An error occurred during file upload' 
    })
  }
}