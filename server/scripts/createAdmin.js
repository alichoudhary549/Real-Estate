/**
 * Script to create an admin user
 * Usage: node server/scripts/createAdmin.js <email> <password> <name>
 * Example: node server/scripts/createAdmin.js admin@example.com admin123 Admin User
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import '../config/mongooseConfig.js'

const createAdmin = async () => {
  try {
    const email = process.argv[2]
    const password = process.argv[3]
    const name = process.argv[4] || 'Admin User'

    if (!email || !password) {
      console.error('Usage: node createAdmin.js <email> <password> [name]')
      process.exit(1)
    }

    // Check if admin already exists
    const existing = await User.findOne({ email })
    if (existing) {
      if (existing.role === 'admin') {
        console.log('Admin user already exists with this email')
        process.exit(0)
      } else {
        // Update existing user to admin
        existing.role = 'admin'
        existing.password = await bcrypt.hash(password, 10)
        await existing.save()
        console.log('User updated to admin successfully')
        console.log(`Email: ${email}`)
        console.log(`Name: ${existing.name}`)
        process.exit(0)
      }
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 10)
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    })

    console.log('Admin user created successfully!')
    console.log(`Email: ${admin.email}`)
    console.log(`Name: ${admin.name}`)
    console.log(`Role: ${admin.role}`)
    
    process.exit(0)
  } catch (error) {
    console.error('Error creating admin:', error.message)
    process.exit(1)
  }
}

createAdmin()

