import { AssemblyAI } from 'assemblyai'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Initialize AssemblyAI client
    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLY_AI_API_KEY,
    })

    // Get the upload URL from AssemblyAI
    const uploadUrl = await client.files.upload_url()

    // Return the upload URL to the client
    return res.status(200).json({ 
      uploadUrl: uploadUrl.upload_url,
      message: 'Upload URL generated successfully',
    })
  } catch (error) {
    console.error('Upload URL error:', error)
    return res.status(500).json({ 
      error: error.message || 'An error occurred while generating an upload URL' 
    })
  }
}