import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { OAuth2Client } from 'google-auth-library'

import User from '../models/User.js'

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // Basic validations
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Name, email and password are required')
  }
  const emailRe = /^\S+@\S+\.\S+$/
  if (!emailRe.test(email)) {
    res.status(400)
    throw new Error('Invalid email address')
  }
  // Password strength: min 8 chars, at least one number and one letter
  const passRe = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/
  if (!passRe.test(password)) {
    res.status(400)
    throw new Error('Password must be at least 8 characters long and include at least one letter and one number')
  }

  const existing = await User.findOne({ email })
  if (existing) {
    res.status(400)
    throw new Error('User already exists')
  }
  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password: hashed })
  res.status(201).json({ token: signToken(user._id), user })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400)
    throw new Error('Email and password are required')
  }
  const emailRe = /^\S+@\S+\.\S+$/
  if (!emailRe.test(email)) {
    res.status(400)
    throw new Error('Invalid email address')
  }
  const user = await User.findOne({ email })
  if (!user) {
    res.status(400)
    throw new Error('Invalid credentials')
  }
  if (!user.password) {
    res.status(400)
    throw new Error('No local password set for this user')
  }
  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    res.status(400)
    throw new Error('Invalid credentials')
  }
  res.json({ token: signToken(user._id), user })
})

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email) {
    res.status(400)
    throw new Error('Email required')
  }
  const emailRe = /^\S+@\S+\.\S+$/
  if (!emailRe.test(email)) {
    res.status(400)
    throw new Error('Invalid email address')
  }
  const user = await User.findOne({ email })
  if (!user) {
    res.status(200).json({ message: 'If that email exists, a reset token was sent' })
    return
  }
  const token = crypto.randomBytes(32).toString('hex')
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
  user.passwordResetToken = hashedToken
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000 // 1 hour
  await user.save()
  // In production send token via email; for development return token in response
  res.json({ message: 'Password reset token generated', resetToken: token })
})

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body
  if (!token || !password) {
    res.status(400)
    throw new Error('Token and new password required')
  }
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })
  if (!user) {
    res.status(400)
    throw new Error('Token invalid or expired')
  }
  user.password = await bcrypt.hash(password, 10)
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()
  res.json({ message: 'Password reset successful', token: signToken(user._id), user })
})

if (!process.env.GOOGLE_CLIENT_ID) {
  console.warn('WARNING: GOOGLE_CLIENT_ID is not set. Google login will not work until it is configured in server/.env')
}
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body
  if (!idToken) {
    res.status(400)
    throw new Error('idToken required')
  }
  if (!process.env.GOOGLE_CLIENT_ID) {
    res.status(500)
    throw new Error('Server: GOOGLE_CLIENT_ID is not configured')
  }
  const ticket = await googleClient.verifyIdToken({ idToken })
  const payload = ticket.getPayload()
  const { sub: googleId, email, name, picture } = payload
  let user = await User.findOne({ $or: [{ googleId }, { email }] })
  if (!user) {
    user = await User.create({ name, email, googleId, image: picture })
  } else if (!user.googleId) {
    user.googleId = googleId
    user.image = user.image || picture
    await user.save()
  }
  res.json({ token: signToken(user._id), user })
})
