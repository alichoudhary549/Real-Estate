import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Middleware to protect admin routes - requires authentication AND admin role
export const adminProtect = asyncHandler(async (req, res, next) => {
  let token
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, token missing')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    
    if (!user) {
      res.status(401)
      throw new Error('Not authorized, user not found')
    }

    // Check if user is blocked
    if (user.isBlocked) {
      res.status(403)
      throw new Error('Account is blocked. Please contact administrator.')
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      res.status(403)
      throw new Error('Not authorized. Admin access required.')
    }

    req.user = user
    next()
  } catch (err) {
    res.status(401)
    throw new Error('Not authorized, token failed')
  }
})

