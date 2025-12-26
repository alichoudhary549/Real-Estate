// API Test Script
// Run this with: node test-api.js

const API_BASE = 'http://localhost:8000/api';

// Test colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

let testResults = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function log(message, type = 'info') {
  const colors = {
    success: GREEN,
    error: RED,
    warning: YELLOW,
    info: RESET
  };
  console.log(`${colors[type]}${message}${RESET}`);
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  const data = await response.json();
  return { status: response.status, data };
}

// Test 1: Check if server is running
async function testServerStatus() {
  try {
    const { status, data } = await apiRequest(`${API_BASE}/residency/status`);
    if (status === 200) {
      log('✅ Test 1: Server is running and responding', 'success');
      log(`   Users: ${data.usersCount}, Properties: ${data.residenciesCount}`, 'info');
      testResults.passed++;
      return true;
    }
  } catch (error) {
    log('❌ Test 1: Server not responding', 'error');
    testResults.failed++;
    return false;
  }
}

// Test 2: Get all properties
async function testGetAllProperties() {
  try {
    const { status, data } = await apiRequest(`${API_BASE}/residency/allresd`);
    if (status === 200) {
      log('✅ Test 2: Can fetch all properties', 'success');
      log(`   Found ${data.length} properties`, 'info');
      testResults.passed++;
      return true;
    }
  } catch (error) {
    log('❌ Test 2: Failed to fetch properties', 'error');
    testResults.failed++;
    return false;
  }
}

// Test 3: User signup
async function testUserSignup() {
  try {
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'Test123456'
    };
    
    const { status, data } = await apiRequest(`${API_BASE}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify(testUser)
    });
    
    if (status === 201) {
      log('✅ Test 3: User signup working', 'success');
      testResults.passed++;
      return { token: data.token, email: testUser.email };
    }
  } catch (error) {
    log(`❌ Test 3: User signup failed`, 'error');
    testResults.failed++;
    return null;
  }
}

// Test 4: User login
async function testUserLogin() {
  try {
    const { status, data } = await apiRequest(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test123456'
      })
    });
    
    if (status === 200) {
      log('✅ Test 4: User login working', 'success');
      testResults.passed++;
      return { token: data.token, email: 'test@example.com' };
    }
  } catch (error) {
    log('⚠️  Test 4: Login failed (test user may not exist)', 'warning');
    testResults.warnings++;
    return null;
  }
}

// Test 5: Create property (requires auth)
async function testCreateProperty(token, email) {
  if (!token) {
    log('⚠️  Test 5: Skipped (no auth token)', 'warning');
    testResults.warnings++;
    return;
  }

  try {
    const propertyData = {
      data: {
        title: `Test Property ${Date.now()}`,
        description: 'This is a test property',
        price: 250000,
        address: `123 Test St ${Date.now()}`,
        city: 'Test City',
        country: 'Test Country',
        facilities: {
          bedrooms: 3,
          bathrooms: 2,
          parkings: 1
        },
        image: 'https://via.placeholder.com/400',
        userEmail: email
      }
    };

    const { status, data } = await apiRequest(`${API_BASE}/residency/create`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(propertyData)
    });
    
    if (status === 201) {
      log('✅ Test 5: Property creation working', 'success');
      testResults.passed++;
      return data.residency._id;
    }
  } catch (error) {
    log(`❌ Test 5: Property creation failed`, 'error');
    testResults.failed++;
    return null;
  }
}

// Test 6: Book a visit (requires auth and property)
async function testBookVisit(token, email, propertyId) {
  if (!token || !propertyId) {
    log('⚠️  Test 6: Skipped (no auth token or property)', 'warning');
    testResults.warnings++;
    return;
  }

  try {
    const { status } = await apiRequest(`${API_BASE}/user/bookVisit/${propertyId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        email,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      })
    });
    
    if (status === 200) {
      log('✅ Test 6: Booking visit working', 'success');
      testResults.passed++;
      return true;
    }
  } catch (error) {
    log(`❌ Test 6: Booking failed`, 'error');
    testResults.failed++;
    return false;
  }
}

// Test 7: Get all bookings
async function testGetBookings(token, email) {
  if (!token) {
    log('⚠️  Test 7: Skipped (no auth token)', 'warning');
    testResults.warnings++;
    return;
  }

  try {
    const { status, data } = await apiRequest(`${API_BASE}/user/allBookings`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email })
    });
    
    if (status === 200) {
      log('✅ Test 7: Fetching bookings working', 'success');
      log(`   Found ${data.bookedVisits.length} bookings`, 'info');
      testResults.passed++;
      return true;
    }
  } catch (error) {
    log(`❌ Test 7: Fetching bookings failed`, 'error');
    testResults.failed++;
    return false;
  }
}

// Test 8: Add to favorites
async function testAddToFavorites(token, email, propertyId) {
  if (!token || !propertyId) {
    log('⚠️  Test 8: Skipped (no auth token or property)', 'warning');
    testResults.warnings++;
    return;
  }

  try {
    const { status } = await apiRequest(`${API_BASE}/user/toFav/${propertyId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email })
    });
    
    if (status === 200) {
      log('✅ Test 8: Add to favorites working', 'success');
      testResults.passed++;
      return true;
    }
  } catch (error) {
    log(`❌ Test 8: Add to favorites failed`, 'error');
    testResults.failed++;
    return false;
  }
}

// Test 9: Get all favorites
async function testGetFavorites(token, email) {
  if (!token) {
    log('⚠️  Test 9: Skipped (no auth token)', 'warning');
    testResults.warnings++;
    return;
  }

  try {
    const { status, data } = await apiRequest(`${API_BASE}/user/allFav`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email })
    });
    
    if (status === 200) {
      log('✅ Test 9: Fetching favorites working', 'success');
      log(`   Found ${data.favResidenciesID?.length || 0} favorites`, 'info');
      testResults.passed++;
      return true;
    }
  } catch (error) {
    log(`❌ Test 9: Fetching favorites failed`, 'error');
    testResults.failed++;
    return false;
  }
}

// Run all tests
async function runTests() {
  log('\n🧪 Starting API Tests...\n', 'info');
  log('═'.repeat(50), 'info');

  await testServerStatus();
  await testGetAllProperties();
  
  const signupResult = await testUserSignup();
  let authData = signupResult;
  
  if (!authData) {
    authData = await testUserLogin();
  }

  let propertyId = null;
  if (authData) {
    propertyId = await testCreateProperty(authData.token, authData.email);
    await testBookVisit(authData.token, authData.email, propertyId);
    await testGetBookings(authData.token, authData.email);
    await testAddToFavorites(authData.token, authData.email, propertyId);
    await testGetFavorites(authData.token, authData.email);
  }

  log('\n' + '═'.repeat(50), 'info');
  log('\n📊 Test Results:', 'info');
  log(`   ✅ Passed: ${testResults.passed}`, 'success');
  log(`   ❌ Failed: ${testResults.failed}`, 'error');
  log(`   ⚠️  Warnings: ${testResults.warnings}`, 'warning');
  log(`   Total: ${testResults.passed + testResults.failed + testResults.warnings}\n`, 'info');

  if (testResults.failed === 0) {
    log('🎉 All critical tests passed! The application is working correctly.\n', 'success');
  } else {
    log('⚠️  Some tests failed. Please review the errors above.\n', 'warning');
  }
}

// Run the tests
runTests().catch(error => {
  log(`\n❌ Test suite failed: ${error.message}`, 'error');
  process.exit(1);
});
