import { useState } from 'react'
import DriveUrlUploader from '../components/DriveUrlUploader'
import TranscriptionViewer from '../components/TranscriptionViewer'

export default function Home() {
  const [transcriptionId, setTranscriptionId] = useState(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcriptionData, setTranscriptionData] = useState(null)
  const [error, setError] = useState(null)

  const handleTranscriptionStarted = (id) => {
    setTranscriptionId(id)
    setIsTranscribing(true)
    setError(null)
    
    // Start polling for results
    pollTranscriptionStatus(id)
  }

  const pollTranscriptionStatus = async (id) => {
    try {
      const response = await fetch(`/api/transcribe?id=${id}`)
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        setIsTranscribing(false)
        return
      }

      if (data.status === 'completed') {
        setTranscriptionData(data)
        setIsTranscribing(false)
      } else if (data.status === 'error') {
        setError(data.error || 'An error occurred during transcription')
        setIsTranscribing(false)
      } else {
        // Continue polling if still processing
        setTimeout(() => pollTranscriptionStatus(id), 5000)
      }
    } catch (err) {
      console.error('Error checking transcription status:', err)
      setError('Failed to check transcription status. Please try again.')
      setIsTranscribing(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Transcribe Audio from Google Drive</h2>
        
        <DriveUrlUploader 
          onTranscriptionStarted={handleTranscriptionStarted}
          disabled={isTranscribing}
        />
      </div>
      
      <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
        <h3 className="font-medium text-gray-700 mb-2">How to share your Google Drive audio file:</h3>
        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
          <li>Upload your audio file to Google Drive</li>
          <li>Right-click on the file and select "Share"</li>
          <li>Click "Get link" and set access to "Anyone with the link"</li>
          <li>Copy the link and paste it above</li>
          <li>Our app will automatically convert it to the correct format</li>
        </ol>
        <p className="mt-2 text-sm text-gray-500">Note: Your audio file must be publicly accessible or AssemblyAI won't be able to access it.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {isTranscribing && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <p className="text-blue-700">
            Transcription in progress... This may take some time for longer audio files.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
            <div className="bg-blue-600 h-2.5 rounded-full progress-bar animate-pulse w-full"></div>
          </div>
        </div>
      )}

      {transcriptionData && !isTranscribing && (
        <TranscriptionViewer transcription={transcriptionData} />
      )}
    </div>
  )
}