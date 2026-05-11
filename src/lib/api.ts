// When running as a Capacitor app, API calls go to your deployed server.
// Set NEXT_PUBLIC_API_URL to your deployed Next.js server URL (e.g., https://your-app.vercel.app)
// For local dev, it defaults to '' (relative paths work on web).
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''
