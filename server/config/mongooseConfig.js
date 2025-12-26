import mongoose from 'mongoose'

const url = process.env.DATABASE_URL || process.env.MONGO || 'mongodb://localhost:27017/realestate'

async function connect() {
  try {
    await mongoose.connect(url, {
      // useNewUrlParser/useUnifiedTopology not needed for modern mongoose but options kept for clarity
      autoIndex: true,
    })
    console.log('✅ Mongoose connected to', url)
  } catch (err) {
    console.error('❌ Mongoose connection error:', err)
    process.exit(1)
  }
}

connect()

const graceful = async () => {
  try {
    await mongoose.disconnect()
    console.log('⚠️ Mongoose disconnected')
  } catch (err) {
    console.error('Error disconnecting mongoose:', err)
  }
  process.exit(0)
}

process.on('SIGINT', graceful)
process.on('SIGTERM', graceful)

export default mongoose
