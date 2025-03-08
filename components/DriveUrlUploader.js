import { useState } from 'react'

export default function DriveUrlUploader({ onTranscriptionStarted, disabled }) {
  const [driveUrl, setDriveUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [convertedUrl, setConvertedUrl] = useState(null)

  // Function to convert Google Drive sharing URL to direct download URL
  const convertGoogleDriveUrl = (url) => {
    try {
      // Extract the file ID from various Google Drive URL formats
      let fileId = null;
      
      // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
      if (url.includes('drive.google.com/file/d/')) {
        const match = url.match(/\/file\/d\/([^/]+)/);
        if (match && match[1]) {
          fileId = match[1];
        }
      } 
      // Format: https://drive.google.com/open?id=FILE_ID
      else if (url.includes('drive.google.com/open?id=')) {
        const match = url.match(/open\?id=([^&]+)/);
        if (match && match[1]) {
          fileId = match[1];
        }
      }
      // Format: Already a uc?id format
      else if (url.includes('drive.google.com/u/0/uc?id=')) {
        const match = url.match(/uc\?id=([^&]+)/);
        if (match && match[1]) {
          fileId = match[1];
        }
      }
      
      if (!fileId) {
        throw new Error('Could not extract file ID from the provided URL');
      }
      
      // Construct the direct download URL
      return `https://drive.google.com/u/0/uc?id=${fileId}&export=download`;
    } catch (error) {
      console.error('Error converting URL:', error);
      return null;
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setDriveUrl(url);
    
    // If it looks like a Google Drive URL, attempt to convert it
    if (url.includes('drive.google.com')) {
      const converted = convertGoogleDriveUrl(url);
      setConvertedUrl(converted);
    } else {
      setConvertedUrl(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!driveUrl) {
      setError('Please enter a Google Drive URL')
      return
    }
    
    // Basic validation for Google Drive URL format
    if (!driveUrl.includes('drive.google.com')) {
      setError('Please enter a valid Google Drive URL')
      return
    }
    
    setIsProcessing(true)
    setError(null)
    
    try {
      // Use the converted URL if available, otherwise use the original URL
      const urlToUse = convertedUrl || driveUrl;
      
      // Start transcription with the Drive URL
      const response = await fetch('/api/start-transcription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioUrl: urlToUse }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed with status ${response.status}`)
      }
      
      const data = await response.json()
      onTranscriptionStarted(data.id)
    } catch (err) {
      console.error('Error starting transcription:', err)
      setError(`Failed to start transcription: ${err.message}`)
    } finally {
      setIsProcessing(false)
    }
  }
  
  const resetForm = () => {
    setDriveUrl('')
    setConvertedUrl(null)
    setError(null)
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
          Google Drive Audio URL
        </label>
        <input
          type="url"
          value={driveUrl}
          onChange={handleUrlChange}
          disabled={isProcessing || disabled}
          placeholder="https://drive.google.com/file/d/..."
          className="block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-blue-500 focus:ring-blue-500 
            disabled:opacity-50 disabled:bg-gray-100 p-2"
        />
        <p className="mt-1 text-sm text-gray-500">
          Make sure your Drive file is publicly accessible (anyone with the link can view)
        </p>
        
        {convertedUrl && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
            <p className="text-xs text-green-700">
              ✓ Your link will be automatically converted to a direct download URL
            </p>
          </div>
        )}
      </div>
      
      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={!driveUrl || isProcessing || disabled}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Starting Transcription...' : 'Start Transcription'}
        </button>
        
        {driveUrl && !isProcessing && (
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset
          </button>
        )}
      </div>
    </form>
  )
}