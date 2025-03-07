import { useState } from 'react'

export default function TranscriptionViewer({ transcription }) {
  const [viewMode, setViewMode] = useState('diarized') // 'diarized' or 'full'
  
  if (!transcription) return null
  
  const { utterances, text } = transcription
  
  // Format timestamp (seconds to MM:SS format)
  const formatTimestamp = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  // Get a color for each speaker
  const getSpeakerColor = (speakerId) => {
    const colors = [
      'bg-blue-100 border-blue-200',
      'bg-green-100 border-green-200',
      'bg-purple-100 border-purple-200',
      'bg-yellow-100 border-yellow-200',
      'bg-pink-100 border-pink-200',
      'bg-indigo-100 border-indigo-200'
    ]
    
    // Convert the speaker ID to a number to use as index
    const numericId = parseInt(speakerId.replace('speaker_', ''))
    return colors[numericId % colors.length]
  }
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Transcription Results</h2>
        
        {/* Toggle between view modes */}
        <div className="flex space-x-4 mb-4">
          <button 
            onClick={() => setViewMode('diarized')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewMode === 'diarized' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Diarized View
          </button>
          <button 
            onClick={() => setViewMode('full')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewMode === 'full' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Full Transcript
          </button>
        </div>
        
        {/* Download options */}
        <div className="mb-4">
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(transcription, null, 2)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'transcription.json'
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
            }}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Download JSON
          </button>
        </div>
      </div>
      
      {viewMode === 'diarized' && utterances && utterances.length > 0 ? (
        <div className="space-y-4">
          {utterances.map((utterance, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${getSpeakerColor(utterance.speaker)}`}
            >
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Speaker {utterance.speaker.replace('speaker_', '')}</span>
                <span className="text-gray-500 text-sm">
                  {formatTimestamp(utterance.start)} - {formatTimestamp(utterance.end)}
                </span>
              </div>
              <p>{utterance.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <pre className="whitespace-pre-wrap text-sm">{text}</pre>
        </div>
      )}
    </div>
  )
}