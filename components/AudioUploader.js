import { useState, useRef } from 'react'

export default function AudioUploader({ onTranscriptionStarted, disabled }) {
  const [file, setFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  
  const maxFileSize = process.env.NEXT_PUBLIC_MAX_FILE_SIZE || 500000000 // 500MB default

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    setError(null)
    
    if (!selectedFile) {
      setFile(null)
      return
    }
    
    // Check file type
    if (!selectedFile.type.includes('audio')) {
      setError('Please select an audio file (MP3, WAV, etc.)')
      setFile(null)
      return
    }
    
    // Check file size
    if (selectedFile.size > maxFileSize) {
      setError(`File is too large. Maximum size is ${Math.floor(maxFileSize / 1000000)}MB.`)
      setFile(null)
      return
    }
    
    setFile(selectedFile)
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!file) {
      setError('Please select an audio file')
      return
    }
    
    setIsUploading(true)
    setError(null)
    
    try {
      // Step 1: Get an upload URL from AssemblyAI
      const uploadUrlResponse = await fetch('/api/upload-url')
      if (!uploadUrlResponse.ok) {
        throw new Error(`Failed to get upload URL: ${uploadUrlResponse.status}`)
      }
      
      const uploadUrlData = await uploadUrlResponse.json()
      const uploadUrl = uploadUrlData.uploadUrl
      
      if (!uploadUrl) {
        throw new Error('Failed to get upload URL from server')
      }
      
      // Step 2: Upload the file directly to AssemblyAI using the URL
      const xhr = new XMLHttpRequest()
      
      // Set up progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(progress)
        }
      })
      
      // Set up completion handler for upload
      xhr.addEventListener('load', async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            // Step 3: Start the transcription with the uploaded file's URL
            const transcriptionResponse = await fetch('/api/start-transcription', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ audioUrl: uploadUrl }),
            })
            
            if (!transcriptionResponse.ok) {
              throw new Error(`Failed to start transcription: ${transcriptionResponse.status}`)
            }
            
            const transcriptionData = await transcriptionResponse.json()
            onTranscriptionStarted(transcriptionData.id)
          } catch (err) {
            console.error('Error starting transcription:', err)
            setError(`Failed to start transcription: ${err.message}`)
          }
        } else {
          setError(`Upload failed with status ${xhr.status}`)
        }
        setIsUploading(false)
      })
      
      // Set up error handler
      xhr.addEventListener('error', () => {
        setError('Network error occurred during upload')
        setIsUploading(false)
      })
      
      // Send the direct upload to AssemblyAI
      xhr.open('PUT', uploadUrl, true)
      xhr.send(file)
    } catch (err) {
      console.error('Error in upload process:', err)
      setError(`Upload failed: ${err.message}`)
      setIsUploading(false)
    }
  }
  
  const resetUpload = () => {
    setFile(null)
    setUploadProgress(0)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Audio File (MP3, WAV)
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          disabled={isUploading || disabled}
          ref={fileInputRef}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <p className="mt-1 text-sm text-gray-500">
          Maximum file size: {Math.floor(maxFileSize / 1000000)}MB
        </p>
      </div>
      
      {file && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">Selected file:</p>
          <p className="text-sm text-gray-500">{file.name} ({(file.size / 1000000).toFixed(2)}MB)</p>
        </div>
      )}
      
      {isUploading && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Uploading: {uploadProgress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={!file || isUploading || disabled}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Upload & Transcribe'}
        </button>
        
        {file && !isUploading && (
          <button
            type="button"
            onClick={resetUpload}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset
          </button>
        )}
      </div>
    </form>
  )
}