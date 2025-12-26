import 'dotenv/config'
import './config/mongooseConfig.js'
import User from './models/User.js'
import Residency from './models/Residency.js'
import bcrypt from 'bcryptjs'

async function clearDatabase() {
  console.log('🗑️  Clearing existing data...')
  await User.deleteMany({})
  await Residency.deleteMany({})
  console.log('✅ Database cleared')
}

async function seedUsers() {
  console.log('👥 Creating users...')
  
  const users = [
    {
      name: 'John Doe',
      email: 'john@test.com',
      password: await bcrypt.hash('Test123456', 10),
    },
    {
      name: 'Jane Smith',
      email: 'jane@test.com',
      password: await bcrypt.hash('Test123456', 10),
    },
    {
      name: 'Bob Johnson',
      email: 'bob@test.com',
      password: await bcrypt.hash('Test123456', 10),
    },
  ]

  const createdUsers = await User.insertMany(users)
  console.log(`✅ Created ${createdUsers.length} users`)
  return createdUsers
}

async function seedProperties(users) {
  console.log('🏠 Creating properties...')
  
  const properties = [
    {
      title: 'Modern Family House',
      description: 'Beautiful 3-bedroom family house with a spacious backyard and modern amenities. Perfect for families looking for comfort and style.',
      price: 450000,
      address: '123 Main Street',
      city: 'New York',
      country: 'USA',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
      facilities: {
        bedrooms: 3,
        bathrooms: 2,
        parkings: 2
      },
      owner: users[0]._id
    },
    {
      title: 'Luxury Downtown Apartment',
      description: 'Stunning 2-bedroom apartment in the heart of downtown. Features include high ceilings, modern kitchen, and city views.',
      price: 350000,
      address: '456 Park Avenue',
      city: 'Los Angeles',
      country: 'USA',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
      facilities: {
        bedrooms: 2,
        bathrooms: 2,
        parkings: 1
      },
      owner: users[1]._id
    },
    {
      title: 'Cozy Suburban Home',
      description: 'Charming 4-bedroom home in a quiet suburban neighborhood. Large garden, updated kitchen, and excellent schools nearby.',
      price: 380000,
      address: '789 Oak Lane',
      city: 'Chicago',
      country: 'USA',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
      facilities: {
        bedrooms: 4,
        bathrooms: 3,
        parkings: 2
      },
      owner: users[0]._id
    },
    {
      title: 'Beach House Paradise',
      description: 'Spectacular beachfront property with panoramic ocean views. 3 bedrooms, open floor plan, and direct beach access.',
      price: 750000,
      address: '321 Ocean Drive',
      city: 'Miami',
      country: 'USA',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227',
      facilities: {
        bedrooms: 3,
        bathrooms: 3,
        parkings: 2
      },
      owner: users[2]._id
    },
    {
      title: 'Modern Studio Loft',
      description: 'Stylish studio loft in trendy arts district. High ceilings, exposed brick, hardwood floors, and modern appliances.',
      price: 225000,
      address: '555 Arts Street',
      city: 'Portland',
      country: 'USA',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      facilities: {
        bedrooms: 1,
        bathrooms: 1,
        parkings: 1
      },
      owner: users[1]._id
    },
    {
      title: 'Mountain View Estate',
      description: 'Luxurious 5-bedroom estate with breathtaking mountain views. Wine cellar, home theater, and infinity pool.',
      price: 1200000,
      address: '777 Mountain Road',
      city: 'Denver',
      country: 'USA',
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',
      facilities: {
        bedrooms: 5,
        bathrooms: 4,
        parkings: 3
      },
      owner: users[2]._id
    },
    {
      title: 'Urban Townhouse',
      description: 'Contemporary 3-story townhouse in vibrant neighborhood. Rooftop terrace, garage, and smart home features.',
      price: 520000,
      address: '888 Urban Avenue',
      city: 'Seattle',
      country: 'USA',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      facilities: {
        bedrooms: 3,
        bathrooms: 3,
        parkings: 2
      },
      owner: users[0]._id
    },
    {
      title: 'Historic Victorian Home',
      description: 'Beautifully restored Victorian home with original details. 4 bedrooms, wrap-around porch, and vintage charm.',
      price: 480000,
      address: '999 Heritage Lane',
      city: 'San Francisco',
      country: 'USA',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
      facilities: {
        bedrooms: 4,
        bathrooms: 3,
        parkings: 1
      },
      owner: users[1]._id
    }
  ]

  const createdProperties = await Residency.insertMany(properties)
  console.log(`✅ Created ${createdProperties.length} properties`)
  return createdProperties
}

async function seedBookingsAndFavorites(users, properties) {
  console.log('📅 Creating bookings and favorites...')
  
  // User 1: Book 2 properties, favorite 3
  users[0].bookedVisits = [
    {
      residency: properties[1]._id,
      date: new Date('2026-01-15')
    },
    {
      residency: properties[3]._id,
      date: new Date('2026-01-20')
    }
  ]
  users[0].favResidenciesID = [properties[1]._id, properties[3]._id, properties[4]._id]
  await users[0].save()

  // User 2: Book 1 property, favorite 4
  users[1].bookedVisits = [
    {
      residency: properties[0]._id,
      date: new Date('2026-01-18')
    }
  ]
  users[1].favResidenciesID = [properties[0]._id, properties[2]._id, properties[5]._id, properties[6]._id]
  await users[1].save()

  // User 3: Book 3 properties, favorite 2
  users[2].bookedVisits = [
    {
      residency: properties[0]._id,
      date: new Date('2026-01-25')
    },
    {
      residency: properties[2]._id,
      date: new Date('2026-01-28')
    },
    {
      residency: properties[7]._id,
      date: new Date('2026-02-05')
    }
  ]
  users[2].favResidenciesID = [properties[1]._id, properties[7]._id]
  await users[2].save()

  console.log('✅ Created bookings and favorites')
}

async function main() {
  console.log('🌱 Starting database seed...\n')
  
  try {
    // Clear existing data
    await clearDatabase()
    console.log('')

    // Seed users
    const users = await seedUsers()
    console.log('')

    // Seed properties
    const properties = await seedProperties(users)
    console.log('')

    // Seed bookings and favorites
    await seedBookingsAndFavorites(users, properties)
    console.log('')

    console.log('═'.repeat(60))
    console.log('🎉 SEED COMPLETE!')
    console.log('═'.repeat(60))
    console.log('\n📊 Summary:')
    console.log(`   Users: ${users.length}`)
    console.log(`   Properties: ${properties.length}`)
    console.log(`   Bookings: 6 total`)
    console.log(`   Favorites: 9 total\n`)
    
    console.log('👤 Test Credentials:')
    console.log('   Email: john@test.com')
    console.log('   Email: jane@test.com')
    console.log('   Email: bob@test.com')
    console.log('   Password (all): Test123456\n')
    
    console.log('✅ You can now login and test all functionalities!')
    console.log('═'.repeat(60))
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

main()
  .then(() => {
    console.log('\n✅ Seed script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
