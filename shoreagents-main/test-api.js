const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing save-pricing-info API...');
    
    const response = await fetch('http://localhost:3001/api/save-pricing-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'test_user_123',
        teamSize: '3',
        roleType: 'different',
        roles: 'Developer, Designer, Manager',
        experience: 'mid',
        description: 'Building a web application'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ API Success:', result);
    } else {
      const error = await response.text();
      console.log('❌ API Error:', error);
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testAPI();
