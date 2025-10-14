# DISC Personalized Questions Prompt - Updated Implementation

## Overview

The DISC personality game now uses a highly personalized Claude AI prompt to generate 5 brutally honest follow-up questions after the user completes the initial 30 Filipino scenarios. This new system creates questions that are impossible to game and reveal authentic personality traits.

## Implementation Details

### Location
- **File**: `src/app/api/games/disc/personalized/route.ts`
- **Endpoint**: `/api/games/disc/personalized`
- **Method**: POST

### Key Features

#### 1. Real User Data Integration
The system now fetches actual user profile data from the database:
```sql
SELECT id, email, first_name, last_name, location, position, bio, birthday
FROM users 
WHERE id = $1
```

#### 2. Dynamic Age Calculation
Calculates user's actual age from their birthday:
```javascript
const birthDate = new Date(user.birthday)
const today = new Date()
age = today.getFullYear() - birthDate.getFullYear()
// Adjusts for month/day differences
```

#### 3. Response Pattern Analysis
Analyzes all 30 responses by context to identify personality conflicts:
```javascript
const personalityPatterns = {}
responses.forEach((r) => {
  const context = r.context || 'UNKNOWN'
  if (!personalityPatterns[context]) {
    personalityPatterns[context] = { D: 0, I: 0, S: 0, C: 0, total: 0 }
  }
  personalityPatterns[context][r.discType]++
  personalityPatterns[context].total++
})
```

#### 4. Personalized Prompt Template
The new prompt includes:
- User's real name, age, location, position, bio, and email
- Complete analysis of their 30 responses with timing data
- Personality patterns broken down by context (FAMILY, WORK, SOCIAL, etc.)
- Current DISC scores with percentages
- Instructions to create "brutal" questions that exploit personality conflicts

### Prompt Structure

```
You are a Filipino psychology expert creating brutally honest personality assessment questions.

REAL USER PROFILE:
Name: [User's actual name]
Age: [Calculated from birthday]
Location: [User's location]
Position: [User's job position]
Bio: [User's bio]
Email: [User's email]

ACTUAL 30 RESPONSES ANALYSIS:
[Detailed response analysis with timing]

PERSONALITY PATTERNS BY CONTEXT:
[JSON breakdown of DISC choices by context]

CURRENT DISC SCORES AFTER 30 QUESTIONS:
D (Eagle): [Score] - [Percentage]% dominance
I (Peacock): [Score] - [Percentage]% influence  
S (Turtle): [Score] - [Percentage]% steadiness
C (Owl): [Score] - [Percentage]% conscientiousness

PERSONALITY CONFLICTS TO EXPLOIT:
Based on the actual responses, [User's name] shows conflicting patterns that need deeper testing.

Create 5 BRUTAL personalized questions that:
1. Use [User's name]'s exact name and situation
2. Reference their actual location
3. Match their professional level
4. Force choices between competing personality sides
5. Make it impossible to fake - reveal TRUE authentic self
```

### Question Format

Each generated question follows this structure:
```json
{
  "id": 31,
  "context": "PERSONALIZED",
  "title": "Brutally honest title using User's name",
  "scenario": "Specific situation with User's context, addressing them directly",
  "options": [
    {"id": "A", "disc": "D", "animal": "🦅 ACTION NAME", "text": "What User would do", "reaction": "Real outcome for User"},
    {"id": "B", "disc": "I", "animal": "🦚 SOCIAL NAME", "text": "Alternative for User", "reaction": "Different result"},
    {"id": "C", "disc": "S", "animal": "🐢 STEADY NAME", "text": "Safe option for User", "reaction": "Stable outcome"},
    {"id": "D", "disc": "C", "animal": "🦉 WISE NAME", "text": "Logical approach for User", "reaction": "Analytical result"}
  ]
}
```

### Fallback System

If Claude AI is unavailable, the system provides 5 generic personalized questions starting with ID 31, maintaining the same format but without the deep personalization.

### Error Handling

- Graceful fallback if user data fetch fails
- Default values for missing user profile fields
- Safe score calculations with fallbacks to 0
- Comprehensive error logging for debugging

## Benefits

1. **Impossible to Game**: Questions are tailored to the user's actual response patterns
2. **Deeply Personal**: Uses real names, locations, and life context
3. **Culturally Authentic**: Maintains Filipino context while being personal
4. **Conflict-Focused**: Targets areas where personality types compete
5. **Professional Relevance**: Matches user's actual career level and situation

## Usage

The system is automatically triggered after a user completes all 30 core DISC questions. The personalized questions appear as questions 31-35 in the game flow, providing deeper psychological profiling for more accurate BPO career matching.
