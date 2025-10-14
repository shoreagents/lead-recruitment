// Test script for DISC API endpoint
// Run this in browser console or as a Node.js script to test the API

const testDiscAPI = async () => {
  console.log('🧪 Testing DISC API endpoint...');
  
  // Sample test data (similar to what the frontend sends)
  const testData = {
    sessionStartTime: new Date().toISOString(),
    sessionData: {
      totalResponses: 35,
      completionTime: 180, // 3 minutes
      culturalContexts: ['FAMILY', 'WORK', 'SOCIAL', 'TRAFFIC', 'MONEY', 'CRISIS'],
      personalizedQuestionsUsed: 5
    },
    coreResponses: Array.from({ length: 30 }, (_, i) => ({
      questionId: i + 1,
      selectedChoice: 'A',
      discType: ['D', 'I', 'S', 'C'][i % 4],
      responseTime: 2000 + Math.random() * 3000,
      timestamp: new Date()
    })),
    coreScores: { D: 25, I: 30, S: 20, C: 25 },
    personalizedResponses: Array.from({ length: 5 }, (_, i) => ({
      questionId: 31 + i,
      selectedChoice: 'B',
      discType: ['I', 'S'][i % 2],
      responseTime: 3000 + Math.random() * 2000,
      timestamp: new Date()
    })),
    personalizedQuestions: [],
    finalResults: {
      primaryType: 'I',
      secondaryType: 'D',
      scores: { D: 25, I: 30, S: 20, C: 25 },
      confidence: 88,
      culturalAlignment: 95
    },
    aiAssessment: 'Test AI assessment for debugging purposes. This person shows strong I-type characteristics with secondary D traits.',
    aiBpoRoles: [
      { title: 'Customer Experience Specialist' },
      { title: 'Team Lead - Customer Success' },
      { title: 'Training Coordinator' },
      { title: 'Quality Assurance Lead' }
    ],
    userContext: {
      position: 'Test Developer',
      location: 'Manila, Philippines',
      bio: 'Test user bio for debugging'
    }
  };

  try {
    console.log('📤 Sending test data to API...');
    console.log('Data keys:', Object.keys(testData));
    
    const response = await fetch('/api/games/disc/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-for-debugging'
      },
      body: JSON.stringify(testData)
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseData = await response.json();
    console.log('📋 Response data:', responseData);
    
    if (response.ok) {
      console.log('✅ API test successful!');
      console.log('🆔 Session ID:', responseData.sessionId);
    } else {
      console.error('❌ API test failed');
      console.error('Error details:', responseData);
    }
    
  } catch (error) {
    console.error('💥 Network or parsing error:', error);
  }
};

// Run the test
testDiscAPI();

// Alternative: Test with minimal data
const testMinimalData = async () => {
  console.log('🧪 Testing with minimal data...');
  
  const minimalData = {
    sessionStartTime: new Date().toISOString(),
    finalResults: {
      primaryType: 'D',
      scores: { D: 40, I: 20, S: 20, C: 20 }
    },
    coreScores: { D: 40, I: 20, S: 20, C: 20 },
    coreResponses: [{ questionId: 1, selectedChoice: 'A', discType: 'D', responseTime: 2000 }]
  };
  
  try {
    const response = await fetch('/api/games/disc/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify(minimalData)
    });
    
    const data = await response.json();
    console.log('Minimal test result:', { status: response.status, data });
    
  } catch (error) {
    console.error('Minimal test error:', error);
  }
};

// Instructions for use:
console.log(`
🔧 DISC API Test Instructions:

1. Open browser dev tools (F12)
2. Go to Console tab
3. Paste this entire script and press Enter
4. Check the console output for results

OR

1. Check Network tab in dev tools
2. Complete a DISC assessment normally
3. Look for the /api/games/disc/session request
4. Check if it returns 200 status or an error

Expected success output:
✅ API test successful!
🆔 Session ID: [uuid]

Common issues to check:
- Authentication (401 error)
- Database connection (500 error)
- Missing environment variables
- Table doesn't exist (SQL error)
`);
