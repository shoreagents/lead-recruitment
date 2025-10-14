// Test script to verify DISC API data format
// This helps us understand exactly what data structure the API expects

const mockDiscData = {
  sessionStartTime: new Date().toISOString(),
  
  coreResponses: Array.from({ length: 30 }, (_, i) => ({
    questionId: i + 1,
    selectedChoice: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
    discType: ['D', 'I', 'S', 'C'][Math.floor(Math.random() * 4)],
    responseTime: Math.floor(Math.random() * 5000) + 500,
    timestamp: new Date().toISOString()
  })),
  
  coreScores: { D: 25, I: 30, S: 20, C: 25 },
  
  personalizedResponses: Array.from({ length: 5 }, (_, i) => ({
    questionId: 31 + i,
    selectedChoice: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
    discType: ['D', 'I', 'S', 'C'][Math.floor(Math.random() * 4)],
    responseTime: Math.floor(Math.random() * 7000) + 1000,
    timestamp: new Date().toISOString()
  })),
  
  personalizedQuestions: Array.from({ length: 5 }, (_, i) => ({
    id: 1001 + i,
    context: 'PERSONAL',
    title: `AI Challenge ${i + 1}`,
    scenario: `AI generated scenario for question ${i + 1}...`,
    options: [
      { text: 'Option A', discType: 'D' },
      { text: 'Option B', discType: 'I' },
      { text: 'Option C', discType: 'S' },
      { text: 'Option D', discType: 'C' }
    ]
  })),
  
  finalResults: {
    primaryType: 'I',
    secondaryType: 'D',
    scores: { D: 28, I: 32, S: 18, C: 22 },
    confidence: 92,
    culturalAlignment: 96,
    authenticity: 88
  },
  
  // THIS IS THE KEY PART - AI Assessment should be a STRING
  aiAssessment: `Based on your responses, you demonstrate strong Influence (I) characteristics with significant Decision-maker (D) tendencies. 

Your personality profile suggests you are:
- Highly sociable and people-oriented
- Confident in leadership situations
- Quick to make decisions when needed
- Enthusiastic about collaborative projects

In BPO environments, you would excel in roles that combine people interaction with leadership responsibilities. Your natural ability to build relationships while driving results makes you ideal for team leadership positions.

Your cultural alignment score of 96% indicates excellent fit with Filipino workplace values, particularly in areas of teamwork and relationship-building.`,

  // THIS IS THE KEY PART - AI BPO Roles should be an ARRAY of objects with 'title' property
  aiBpoRoles: [
    { title: "Customer Experience Manager" },
    { title: "Team Lead - Technical Support" },
    { title: "Training and Development Specialist" },
    { title: "Quality Assurance Supervisor" }
  ],
  
  userContext: {
    position: "Customer Service Representative",
    location: "Manila, Philippines",
    bio: "Experienced in customer support with a passion for problem-solving and team collaboration."
  }
};

console.log('📋 DISC API Data Structure Test');
console.log('=====================================');
console.log('✅ Session Start Time:', typeof mockDiscData.sessionStartTime);
console.log('✅ Core Responses:', mockDiscData.coreResponses.length, 'items');
console.log('✅ Personalized Responses:', mockDiscData.personalizedResponses.length, 'items');
console.log('✅ Final Results:', typeof mockDiscData.finalResults);
console.log('✅ AI Assessment Type:', typeof mockDiscData.aiAssessment);
console.log('✅ AI Assessment Length:', mockDiscData.aiAssessment.length, 'characters');
console.log('✅ AI BPO Roles Type:', Array.isArray(mockDiscData.aiBpoRoles) ? 'Array' : typeof mockDiscData.aiBpoRoles);
console.log('✅ AI BPO Roles Count:', mockDiscData.aiBpoRoles.length);
console.log('✅ BPO Roles Preview:', mockDiscData.aiBpoRoles.map(r => r.title));
console.log('✅ User Context:', typeof mockDiscData.userContext);

console.log('\n🔍 JSON Preview (first 200 chars):');
console.log(JSON.stringify(mockDiscData, null, 2).substring(0, 200) + '...');

console.log('\n📝 Key Points for API:');
console.log('- aiAssessment should be a STRING (not object)');
console.log('- aiBpoRoles should be ARRAY of objects with "title" property');
console.log('- All other data structures look correct');

// Test the exact data that will be sent to stats table
console.log('\n📊 Stats Table Data Preview:');
console.log('- latest_ai_assessment (TEXT):', mockDiscData.aiAssessment.substring(0, 50) + '...');
console.log('- latest_bpo_roles (JSONB):', JSON.stringify(mockDiscData.aiBpoRoles));

module.exports = { mockDiscData };
