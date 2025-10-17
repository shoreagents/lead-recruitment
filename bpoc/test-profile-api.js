const fetch = require('node-fetch')

async function testProfileAPI() {
  console.log('🧪 Testing profile update API...')
  
  // Test data
  const testData = {
    userId: 'd7bb528f-4093-41b1-bf32-407c671b34a5', // Your user ID
    first_name: 'TestFirstName',
    last_name: 'TestLastName',
    full_name: 'TestFirstName TestLastName',
    location: 'Test Location',
    phone: '123-456-7890',
    position: 'Test Position'
  }
  
  console.log('📊 Test data:', testData)
  
  try {
    const response = await fetch('http://localhost:3000/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    
    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Profile API test successful!')
      console.log('✅ Response:', result)
    } else {
      console.error('❌ Profile API test failed:', result)
    }
  } catch (error) {
    console.error('❌ Error testing profile API:', error.message)
  }
}

testProfileAPI()

