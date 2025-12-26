import express from 'express'
import {
  getDashboard,
  getAllUsers,
  toggleBlockUser,
  getAllProperties,
  togglePropertyStatus,
  getAllBookings
} from '../controllers/adminCtrl.js'
import { adminProtect } from '../config/adminAuth.js'

const router = express.Router()

// All admin routes require admin authentication
router.use(adminProtect)

// Dashboard route
router.get('/dashboard', getDashboard)

// User management routes
router.get('/users', getAllUsers)
router.put('/users/:id/block', toggleBlockUser)

// Property management routes
router.get('/properties', getAllProperties)
router.put('/properties/:id/approve', togglePropertyStatus)

// Booking management routes
router.get('/bookings', getAllBookings)

export default router

