import './config/mongooseConfig.js'
import User from './models/User.js'
import Residency from './models/Residency.js'

async function main() {
  console.log('Seeding database...')

  const userEmail = 'seed@local'
  let user = await User.findOne({ email: userEmail })
  if (!user) {
    user = await User.create({
      name: 'Seed User',
      email: userEmail,
      image: null,
      bookedVisits: [],
      favResidenciesID: [],
    })
    console.log('Created user:', user.email)
  } else {
    console.log('User already exists:', user.email)
  }

  const title = 'Seed Residency'
  const existing = await Residency.findOne({ title })
  if (!existing) {
    const residency = await Residency.create({
      title,
      description: 'A sample seeded residency for testing',
      price: 100,
      address: '123 Seed St',
      country: 'Local',
      city: 'LocalCity',
      image: '',
      facilities: { wifi: true },
      owner: user._id,
    })
    console.log('Created residency:', residency.title)
  } else {
    console.log('Residency already exists:', existing.title)
  }

  console.log('Seeding complete')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    process.exit(0)
  })
