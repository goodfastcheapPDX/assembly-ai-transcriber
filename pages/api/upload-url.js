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

    // Get a temporary upload URL from AssemblyAI
    // This doesn't actually upload a file, just gets a URL where we can upload to
    const response = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'Authorization': `${process.env.ASSEMBLY_AI_API_KEY}`
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to get upload URL: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Return the upload URL to the client
    return res.status(200).json({ 
      uploadUrl: data.upload_url,
      message: 'Upload URL generated successfully',
    })
  } catch (error) {
    console.error('Upload URL error:', error)
    return res.status(500).json({ 
      error: error.message || 'An error occurred while generating an upload URL' 
    })
  }
}