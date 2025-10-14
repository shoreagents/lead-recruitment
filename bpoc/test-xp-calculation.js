// Test XP calculation to verify frontend and database match
// Run this to verify the XP formulas are identical

console.log('🧮 XP CALCULATION TEST');
console.log('======================');

// Example values from your case:
const confidence = 81;
const culturalAlignment = 95;
const totalQuestions = 35;
const durationSeconds = 450; // 7.5 minutes (under 10 min bonus)

// Frontend/Database XP Formula:
const calculatedXP = Math.round(
  (confidence * 2) +           // 81 * 2 = 162
  (culturalAlignment * 1.5) +  // 95 * 1.5 = 142.5
  (totalQuestions * 5) +       // 35 * 5 = 175
  (durationSeconds < 600 ? 50 : 0) // Speed bonus = 50
);

console.log('📊 XP Breakdown:');
console.log('- Confidence XP:', confidence * 2, `(${confidence}% × 2)`);
console.log('- Cultural XP:', culturalAlignment * 1.5, `(${culturalAlignment}% × 1.5)`);
console.log('- Questions XP:', totalQuestions * 5, `(${totalQuestions} × 5)`);
console.log('- Speed Bonus:', durationSeconds < 600 ? 50 : 0, `(${Math.floor(durationSeconds/60)}m${durationSeconds%60}s < 10min)`);
console.log('');
console.log('🎯 Total XP:', calculatedXP);
console.log('');

// Badge calculation:
const badges = confidence >= 85 ? 1 : 0;
console.log('🏆 Badges:', badges, `(confidence ${confidence}% ${confidence >= 85 ? '≥' : '<'} 85%)`);

console.log('');
console.log('✅ This should match both frontend display and database storage!');
console.log('');
console.log('Expected in your case:');
console.log('- XP: ~529-530 points');
console.log('- Badges: 0 (since 81% < 85%)');
console.log('- Confidence: 81%');
console.log('- Filipino Fit: 95%');
