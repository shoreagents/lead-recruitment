// Test script to check if the recruiter jobs API is working
// Run this with: node test-recruiter-jobs-api.js

const testRecruiterJobsAPI = async () => {
  try {
    console.log('Testing /api/recruiter/jobs endpoint...');
    
    // Test without authentication (should fail)
    console.log('\n1. Testing without authentication:');
    const response1 = await fetch('http://localhost:3000/api/recruiter/jobs');
    console.log('Status:', response1.status);
    const data1 = await response1.json();
    console.log('Response:', data1);
    
    // Test with fake user ID (should fail)
    console.log('\n2. Testing with fake user ID:');
    const response2 = await fetch('http://localhost:3000/api/recruiter/jobs', {
      headers: {
        'x-user-id': 'fake-user-id'
      }
    });
    console.log('Status:', response2.status);
    const data2 = await response2.json();
    console.log('Response:', data2);
    
    // Test with a real user ID (you'll need to replace this with an actual user ID from your database)
    console.log('\n3. Testing with real user ID (replace with actual user ID):');
    const response3 = await fetch('http://localhost:3000/api/recruiter/jobs', {
      headers: {
        'x-user-id': 'replace-with-actual-user-id'
      }
    });
    console.log('Status:', response3.status);
    const data3 = await response3.json();
    console.log('Response:', data3);
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
};

// Run the test
testRecruiterJobsAPI();
