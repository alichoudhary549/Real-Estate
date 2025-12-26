import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import Residency from '../models/Residency.js'

// GET /admin/dashboard - Get dashboard statistics
export const getDashboard = asyncHandler(async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' })
    const totalProperties = await Residency.countDocuments()
    const totalBookings = await User.aggregate([
      { $unwind: '$bookedVisits' },
      { $match: { 'bookedVisits.status': 'confirmed' } },
      { $count: 'total' }
    ])

    const pendingProperties = await Residency.countDocuments({ status: 'pending' })
    const blockedUsers = await User.countDocuments({ isBlocked: true })

    res.status(200).json({
      totalUsers,
      totalProperties,
      totalBookings: totalBookings[0]?.total || 0,
      pendingProperties,
      blockedUsers
    })
  } catch (error) {
    res.status(500)
    throw new Error(error.message)
  }
})

// GET /admin/users - Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password -passwordResetToken -passwordResetExpires')
      .sort({ createdAt: -1 })
      .lean()

    res.status(200).json(users)
  } catch (error) {
    res.status(500)
    throw new Error(error.message)
  }
})

// PUT /admin/users/:id/block - Block or unblock a user
export const toggleBlockUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)

    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    if (user.role === 'admin') {
      res.status(403)
      throw new Error('Cannot block admin users')
    }

    user.isBlocked = !user.isBlocked
    await user.save()

    res.status(200).json({
      message: user.isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked
      }
    })
  } catch (error) {
    res.status(500)
    throw new Error(error.message)
  }
})

// GET /admin/properties - Get all properties
export const getAllProperties = asyncHandler(async (req, res) => {
  try {
    const properties = await Residency.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .lean()

    res.status(200).json(properties)
  } catch (error) {
    res.status(500)
    throw new Error(error.message)
  }
})

// PUT /admin/properties/:id/approve - Approve or reject a property
export const togglePropertyStatus = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      res.status(400)
      throw new Error('Status must be either "approved" or "rejected"')
    }

    const property = await Residency.findById(id).populate('owner', 'name email')

    if (!property) {
      res.status(404)
      throw new Error('Property not found')
    }

    property.status = status
    await property.save()

    res.status(200).json({
      message: `Property ${status} successfully`,
      property
    })
  } catch (error) {
    res.status(500)
    throw new Error(error.message)
  }
})

// GET /admin/bookings - Get all bookings
export const getAllBookings = asyncHandler(async (req, res) => {
  try {
    const users = await User.find()
      .select('name email bookedVisits')
      .populate({
        path: 'bookedVisits.residency',
        model: 'Residency',
        select: 'title address city country price image'
      })
      .lean()

    // Flatten bookings with user info
    const allBookings = []
    users.forEach(user => {
      user.bookedVisits.forEach(booking => {
        allBookings.push({
          _id: booking._id,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email
          },
          property: booking.residency,
          date: booking.date,
          status: booking.status,
          bookingDate: booking.bookingDate,
          createdAt: booking.createdAt
        })
      })
    })

    // Sort by booking date (newest first)
    allBookings.sort((a, b) => new Date(b.bookingDate || b.createdAt) - new Date(a.bookingDate || a.createdAt))

    res.status(200).json(allBookings)
  } catch (error) {
    res.status(500)
    throw new Error(error.message)
  }
})

