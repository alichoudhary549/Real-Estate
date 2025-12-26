// Ensure environment variables are loaded before any other modules import them
import dotenv from 'dotenv'
dotenv.config()


import 'dotenv/config'

// Debug: Log SMTP configuration (remove in production)
console.log("SMTP_HOST =", process.env.SMTP_HOST);
console.log("SMTP_PORT =", process.env.SMTP_PORT);
console.log("SMTP_USER =", process.env.SMTP_USER);
console.log("CONTACT_EMAIL =", process.env.CONTACT_EMAIL);

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateEnv } from './startup.js'
// initialize mongoose connection before importing routes/controllers
import './config/mongooseConfig.js'
import { userRoute } from './routes/userRoute.js';
import { residencyRoute } from './routes/residencyRoute.js';
import authRoute from './routes/authRoute.js'
import uploadRoute from './routes/uploadRoute.js'
import adminRoute from './routes/adminRoute.js'
import contactRoute from './routes/contactRoute.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate environment variables
validateEnv()


const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}))

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/user', userRoute)
app.use("/api/residency", residencyRoute)
app.use('/api/auth', authRoute)
app.use('/api/upload', uploadRoute)
app.use('/api/admin', adminRoute)
app.use('/api/contact', contactRoute)

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  })
})

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});