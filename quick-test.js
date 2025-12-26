#!/usr/bin/env node

// Quick Test Script - Run with: node quick-test.js

console.log('\n' + '='.repeat(60));
console.log('🧪 REAL ESTATE BOOKING WEBSITE - QUICK TEST');
console.log('='.repeat(60) + '\n');

const tests = [
  {
    name: 'Server Running',
    check: () => fetch('http://localhost:8000/api/residency/status').then(r => r.ok),
    success: '✅ Server is running on port 8000',
    failure: '❌ Server is not running. Run: cd server && npm start'
  },
  {
    name: 'MongoDB Connected',
    check: async () => {
      const res = await fetch('http://localhost:8000/api/residency/status');
      const data = await res.json();
      return data.usersCount !== undefined;
    },
    success: '✅ MongoDB is connected',
    failure: '❌ MongoDB connection issue'
  },
  {
    name: 'Client Running',
    check: () => fetch('http://localhost:5173').then(r => r.ok).catch(() => false),
    success: '✅ Client is running on port 5173',
    failure: '❌ Client is not running. Run: cd client && npm run dev'
  },
  {
    name: 'Test Image URL',
    check: () => fetch('https://images.unsplash.com/photo-1568605114967-8130f3a36994', { method: 'HEAD' }).then(r => r.ok),
    success: '✅ Test image URL is accessible',
    failure: '⚠️ Test image URL check failed (network issue)'
  }
];

async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.check();
      if (result) {
        console.log(test.success);
        passed++;
      } else {
        console.log(test.failure);
        failed++;
      }
    } catch (error) {
      console.log(test.failure);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 Results: ${passed}/${tests.length} checks passed`);
  console.log('='.repeat(60) + '\n');

  if (failed === 0) {
    console.log('🎉 All systems ready! You can test the application.\n');
    console.log('📝 To test image upload:');
    console.log('   1. Go to http://localhost:5173');
    console.log('   2. Login → Add Property → Fill Location → Next');
    console.log('   3. In Images step, paste this URL:');
    console.log('      https://images.unsplash.com/photo-1568605114967-8130f3a36994');
    console.log('   4. Click "Use This URL" → Next → Complete\n');
  } else {
    console.log('⚠️ Some systems are not ready. Please check the errors above.\n');
  }
}

runTests().catch(console.error);
