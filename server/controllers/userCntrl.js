import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import Residency from '../models/Residency.js'

const createUser = asyncHandler(async (req, res) => {
  console.log('Creating a user')
  const { email } = req.body

  let user = await User.findOne({ email })
  if (!user) {
    user = await User.create(req.body)
    return res.send({ message: 'User created successfully', user })
  }
  res.status(200).send({ message: 'User already exists', user })
})

// bookvisit for residency

const bookVisit = asyncHandler(async (req, res) => {
    const { email, date } = req.body
    const { id } = req.params
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: 'User not found' })

        // Check if residency exists
        const residency = await Residency.findById(id)
        if (!residency) return res.status(404).json({ message: 'Property not found' })

        // Check for existing active booking
        const existingBooking = user.bookedVisits.find(
            (v) => String(v.residency) === String(id) && v.status === 'confirmed'
        )
        if (existingBooking) {
            return res.status(400).json({ message: 'This property is already booked' })
        }

        // Parse date properly - handle both DD/MM/YYYY and ISO formats
        let bookingDate
        if (typeof date === 'string' && date.includes('/')) {
            const [day, month, year] = date.split('/')
            bookingDate = new Date(year, month - 1, day)
        } else {
            bookingDate = new Date(date)
        }

        user.bookedVisits.push({ 
            residency: id, 
            date: bookingDate,
            status: 'confirmed',
            bookingDate: new Date(),
            modificationHistory: []
        })
        await user.save()
        res.status(200).send({ 
            message: 'Visit booked successfully', 
            booking: { residency: id, date: bookingDate, status: 'confirmed' } 
        })
    } catch (error) {
        throw new Error(error.message)
    }
})

const getAllBookings = asyncHandler(async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email }).populate({ path: 'bookedVisits.residency', model: 'Residency' })
        if (!user) return res.status(404).send({ message: 'User not found' })
        res.status(200).send({ bookedVisits: user.bookedVisits })
    } catch (error) {
        throw new Error(error.message)
    }
})

const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req.body
  const { id } = req.params
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const booking = user.bookedVisits.find((v) => String(v._id) === String(id))
    if (!booking) return res.status(400).json({ message: 'Booking not found' })

    // Calculate cancellation charge based on days until visit
    const daysUntilVisit = Math.ceil((new Date(booking.date) - new Date()) / (1000 * 60 * 60 * 24))
    let cancellationCharge = 0
    
    if (daysUntilVisit < 7) {
      cancellationCharge = 50 // $50 if cancelled within 7 days
    } else if (daysUntilVisit < 14) {
      cancellationCharge = 25 // $25 if cancelled within 14 days
    }
    // Free cancellation if more than 14 days

    booking.status = 'cancelled'
    booking.cancellationDate = new Date()
    booking.cancellationCharge = cancellationCharge

    await user.save()
    res.status(200).send({ 
      message: 'Booking cancelled successfully', 
      cancellationCharge,
      refundMessage: cancellationCharge > 0 
        ? `A cancellation fee of $${cancellationCharge} will be charged.`
        : 'Free cancellation - no charges applied.'
    })
  } catch (error) {
    throw new Error(error.message)
  }
})

const toFav = asyncHandler(async (req, res) => {
  const { email } = req.body
  const { rid } = req.params
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const exists = user.favResidenciesID.some((id) => String(id) === String(rid))
    if (exists) {
      user.favResidenciesID = user.favResidenciesID.filter((id) => String(id) !== String(rid))
      await user.save()
      return res.status(200).send({ message: 'Removed from fav', user })
    }

    user.favResidenciesID.push(rid)
    await user.save()
    res.status(200).send({ message: 'Added to fav', user })
  } catch (error) {
    throw new Error(error.message)
  }
})

// Modify booking date
const modifyBooking = asyncHandler(async (req, res) => {
  const { email, newDate } = req.body
  const { id } = req.params
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const booking = user.bookedVisits.find((v) => String(v._id) === String(id))
    if (!booking) return res.status(400).json({ message: 'Booking not found' })
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'Can only modify confirmed bookings' })
    }

    // Parse new date
    let parsedNewDate
    if (typeof newDate === 'string' && newDate.includes('/')) {
      const [day, month, year] = newDate.split('/')
      parsedNewDate = new Date(year, month - 1, day)
    } else {
      parsedNewDate = new Date(newDate)
    }

    // Calculate modification charge
    const daysUntilVisit = Math.ceil((new Date(booking.date) - new Date()) / (1000 * 60 * 60 * 24))
    let modificationCharge = 0
    
    if (daysUntilVisit < 7) {
      modificationCharge = 30 // $30 if modified within 7 days
    } else if (daysUntilVisit < 14) {
      modificationCharge = 15 // $15 if modified within 14 days
    }
    // Free modification if more than 14 days

    // Store modification history
    booking.modificationHistory.push({
      previousDate: booking.date,
      newDate: parsedNewDate,
      modifiedAt: new Date(),
      charge: modificationCharge
    })

    booking.date = parsedNewDate
    booking.status = 'modified'

    await user.save()
    res.status(200).send({ 
      message: 'Booking date modified successfully', 
      modificationCharge,
      chargeMessage: modificationCharge > 0 
        ? `A modification fee of $${modificationCharge} will be charged.`
        : 'Free modification - no charges applied.',
      newDate: parsedNewDate
    })
  } catch (error) {
    throw new Error(error.message)
  }
})

const getAllFav = asyncHandler(async (req, res) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email }).populate('favResidenciesID')
    if (!user) return res.status(404).json({ message: 'User not found' })
    // Return both populated residencies and their ids for client compatibility
    const favResidencies = user.favResidenciesID
    const favResidenciesID = user.favResidenciesID.map((r) => (r._id ? String(r._id) : String(r)))
    res.status(200).send({ favResidencies, favResidenciesID })
  } catch (error) {
    throw new Error(error.message)
  }
})

export const getAllFavorites = async (req, res) => {
    try {
        // Alias for getAllFav - keep backward compatibility
        return getAllFav(req, res)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
  

export { createUser, bookVisit, getAllBookings, cancelBooking, modifyBooking, toFav, getAllFav }