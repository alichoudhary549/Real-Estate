// Environment variable validation
export function validateEnv() {
  const required = ['DATABASE_URL', 'JWT_SECRET']
  const missing = required.filter((key) => !process.env[key])
  
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`)
    console.error('Please check your .env file')
    process.exit(1)
  }
  
  // Warnings for optional but recommended vars
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.warn('⚠️  GOOGLE_CLIENT_ID not set - Google OAuth login will be disabled')
  }
  
  console.log('✅ Environment variables validated')
}
