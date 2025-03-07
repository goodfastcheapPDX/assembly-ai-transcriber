import formidable from 'formidable'
import { createTranscription } from '../../lib/assemblyai'
import { saveFile, getFullUrl } from '../../lib/helpers'

// Disable the default body parser to handle form data
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Configure formidable for file uploads
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

    // Read and save the file
    const fileBuffer = await new Promise((resolve, reject) => {
      const fileReader = new (require('fs')).readFileSync;
      resolve(fileReader(audioFile.filepath));
    });

    // Save the file to the uploads directory
    const relativeFilePath = await saveFile(
      fileBuffer, 
      audioFile.originalFilename
    )
    
    // Get the full URL of the file
    const fileUrl = getFullUrl(req, relativeFilePath)
    
    // Start transcription with AssemblyAI
    const transcription = await createTranscription(fileUrl)
    
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