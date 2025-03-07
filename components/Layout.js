import Head from 'next/head'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Audio Transcription Service</title>
        <meta name="description" content="Upload and transcribe audio files with AssemblyAI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Audio Transcription Service
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              Powered by NextJS and AssemblyAI
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}