/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Configure to handle large file uploads
    api: {
      bodyParser: false,
    },
    // Increase the maximum payload size
    serverRuntimeConfig: {
      maxBodySize: '100mb', // Adjust as needed
    },
  }
  
  module.exports = nextConfig