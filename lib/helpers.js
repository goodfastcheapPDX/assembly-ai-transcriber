import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// Create upload directory if it doesn't exist
export async function ensureUploadDir() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  try {
    await fs.access(uploadDir)
  } catch (error) {
    await fs.mkdir(uploadDir, { recursive: true })
  }
  return uploadDir
}

// Save an uploaded file
export async function saveFile(file, filename) {
  const uploadDir = await ensureUploadDir()
  
  // Create a unique filename
  const uniqueFilename = `${uuidv4()}-${filename}`
  const filePath = path.join(uploadDir, uniqueFilename)
  
  // Move the temporary file to the upload directory
  await fs.writeFile(filePath, file)
  
  // Return the relative URL for the file
  return `/uploads/${uniqueFilename}`
}

// Get the full URL from a relative path
export function getFullUrl(req, path) {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const host = req.headers.host
  return `${protocol}://${host}${path}`
}