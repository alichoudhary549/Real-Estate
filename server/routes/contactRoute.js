import express from 'express'
import { sendContactEmail } from '../controllers/contactCtrl.js'

const router = express.Router()

// Contact form route
router.post('/send', sendContactEmail)

export default router


