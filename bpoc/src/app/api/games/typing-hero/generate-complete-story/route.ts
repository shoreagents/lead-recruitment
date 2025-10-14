import { NextRequest, NextResponse } from 'next/server';
import { createCompleteStory, type StoryChapter } from '@/lib/story-storage';

interface UserProfile {
  userId: string;
  name: string;
  position?: string;
  skills?: string[];
  careerGoals?: string[];
  currentEmployer?: string;
  workStatus?: string;
  location?: string;
  bio?: string;
  gender?: string;
  age?: number;
}

interface GameProgressData {
  difficulty: string;
  currentWPM?: number;
  accuracy?: number;
  completedStories?: number;
  totalWordsTyped?: number;
  averageSessionTime?: number;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🎮 Complete 5-chapter story generation API called');
    
    const body = await request.json();
    const { userProfile, gameData } = body;
    
    console.log('📋 User Profile:', userProfile);
    console.log('🎯 Game Progress:', gameData);

    // Validate required data
    if (!userProfile || !gameData) {
      return NextResponse.json(
        { error: 'Missing userProfile or gameData' },
        { status: 400 }
      );
    }

    // Get Claude API key
    const claudeApiKey = process.env.CLAUDE_API_KEY;
    if (!claudeApiKey) {
      console.error('❌ Missing CLAUDE_API_KEY');
      return NextResponse.json(
        { error: 'Claude API key not configured' },
        { status: 500 }
      );
    }

    // Generate complete 5-chapter story prompt
    const storyPrompt = generateComplete5ChapterPrompt(userProfile, gameData);
    console.log('📝 Generated complete story prompt length:', storyPrompt.length);

    // Call Claude API for complete story
    console.log('🤖 Calling Claude API for complete 5-chapter story...');
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 8000, // Increased for 5 chapters
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: storyPrompt
          }
        ]
      })
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error('❌ Claude API Error:', claudeResponse.status, errorText);
      return NextResponse.json(
        { error: `Claude API Error: ${claudeResponse.status}` },
        { status: 500 }
      );
    }

    const claudeData = await claudeResponse.json();
    console.log('✅ Claude response received for complete story');

    // Parse the Claude response
    let storyText = '';
    if (claudeData.content && claudeData.content[0] && claudeData.content[0].text) {
      storyText = claudeData.content[0].text;
    } else {
      throw new Error('Invalid Claude API response format');
    }

    // Process the complete story response
    const chapters = processCompleteStoryResponse(storyText, gameData);
    
    if (!chapters || chapters.length !== 5) {
      throw new Error('Failed to generate 5 complete chapters');
    }

    // Create complete story object
    const completeStory = createCompleteStory(
      userProfile.userId,
      userProfile,
      gameData.difficulty,
      chapters
    );

    console.log('✅ Complete 5-chapter story generated:', {
      storyId: completeStory.id,
      title: completeStory.title,
      chapters: completeStory.chapters.map(c => ({ 
        chapter: c.chapterNumber, 
        title: c.title, 
        sentences: c.sentences.length 
      }))
    });

    // Return the complete story
    return NextResponse.json(completeStory);

  } catch (error) {
    console.error('❌ Complete story generation error:', error);
    return NextResponse.json(
      { error: `Story generation failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

function generateComplete5ChapterPrompt(userProfile: UserProfile, gameData: GameProgressData): string {
  const difficultyContext = {
    rookie: 'simple vocabulary and short sentences',
    rockstar: 'moderate vocabulary with some professional terms',
    virtuoso: 'advanced vocabulary with complex sentences',
    legend: 'expert-level vocabulary with sophisticated language'
  };

  const difficulty = difficultyContext[gameData.difficulty as keyof typeof difficultyContext] || difficultyContext.rockstar;

  return `You are creating a complete 5-chapter personalized typing story for a BPO professional. This will be their entire typing journey in one cohesive narrative.

USER CONTEXT:
- Name: ${userProfile.name}
- Position: ${userProfile.position || 'Professional'}
- Location: ${userProfile.location || 'Philippines'}
- Work Status: ${userProfile.workStatus || 'professional'}
- Bio: ${userProfile.bio || 'Ambitious professional'}
- Difficulty: ${gameData.difficulty} (use ${difficulty})

STORY STRUCTURE REQUIREMENTS:
Create a complete 5-chapter story with progressive difficulty and narrative flow:

Chapter 1 (Learning): Introduction & Current Challenges (Easy - 5-8 words per sentence)
Chapter 2 (Building): Taking Action & First Steps (Medium-Easy - 6-9 words per sentence)  
Chapter 3 (Growing): Overcoming Obstacles & Learning (Medium - 7-10 words per sentence)
Chapter 4 (Mastering): Major Breakthrough & Success (Medium-Hard - 8-11 words per sentence)
Chapter 5 (Succeeding): Achievement & Future Vision (Hard - 9-12 words per sentence)

NARRATIVE FLOW:
- Each chapter should flow naturally into the next
- Build character development throughout
- Include BPO/career themes: customer service, communication, professional development, teamwork
- Make it personally relevant to ${userProfile.name.split(' ')[0]}'s journey
- Progressive difficulty in vocabulary and sentence complexity

OUTPUT FORMAT - Return as JSON with this EXACT structure:
{
  "chapters": [
    {
      "chapterNumber": 1,
      "title": "Chapter Title Here",
      "theme": "Brief theme description",
      "difficulty": "easy",
      "estimatedDuration": 90,
      "sentences": [
        {
          "id": 1,
          "text": "Complete sentence here.",
          "words": ["Complete", "sentence", "here"],
          "difficulty": "easy",
          "category": "narrative"
        }
      ]
    }
  ]
}

CRITICAL REQUIREMENTS:
1. EXACTLY 5 chapters with progressive difficulty
2. Each chapter should have 5-7 sentences
3. Each sentence must have the right word count for its chapter difficulty level
4. Words array must exactly match the sentence text (split by spaces, punctuation removed)
5. Use vocabulary appropriate for ${gameData.difficulty} difficulty
6. Create a compelling, continuous story about ${userProfile.name.split(' ')[0]}'s professional growth
7. Include BPO terms naturally throughout the story
8. Make each chapter end with anticipation for the next

Generate the complete 5-chapter typing story now:`;
}

function processCompleteStoryResponse(storyText: string, gameData: GameProgressData): StoryChapter[] {
  try {
    // Try to extract JSON from the response
    const jsonMatch = storyText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const storyData = JSON.parse(jsonMatch[0]);
      
      // Validate the structure
      if (storyData.chapters && Array.isArray(storyData.chapters) && storyData.chapters.length === 5) {
        return storyData.chapters.map((chapter: any) => ({
          chapterNumber: chapter.chapterNumber || 1,
          title: chapter.title || `Chapter ${chapter.chapterNumber}`,
          theme: chapter.theme || 'Career Growth',
          difficulty: chapter.difficulty || gameData.difficulty,
          estimatedDuration: chapter.estimatedDuration || 120,
          sentences: chapter.sentences?.map((sentence: any, index: number) => ({
            id: sentence.id || index + 1,
            text: sentence.text || '',
            words: sentence.words || sentence.text.split(' ').map((word: string) => 
              word.replace(/[.,!?;:]/g, '')
            ),
            difficulty: sentence.difficulty || 'medium',
            category: sentence.category || 'narrative'
          })) || []
        }));
      }
    }
    
    // Fallback: create story from plain text
    return createFallbackCompleteStory(storyText, gameData);
    
  } catch (error) {
    console.error('❌ Error processing complete story response:', error);
    return createFallbackCompleteStory(storyText, gameData);
  }
}

function createFallbackCompleteStory(storyText: string, gameData: GameProgressData): StoryChapter[] {
  console.log('⚠️ Using fallback complete story generation');
  
  // Create 5 fallback chapters
  const chapters: StoryChapter[] = [];
  
  for (let i = 1; i <= 5; i++) {
    chapters.push({
      chapterNumber: i,
      title: `Chapter ${i}: Professional Journey`,
      theme: 'Career Development',
      difficulty: gameData.difficulty,
      estimatedDuration: 120,
      sentences: [
        {
          id: 1,
          text: `Chapter ${i} begins with new challenges and opportunities ahead.`,
          words: ['Chapter', i.toString(), 'begins', 'with', 'new', 'challenges', 'and', 'opportunities', 'ahead'],
          difficulty: 'medium',
          category: 'narrative'
        },
        {
          id: 2,
          text: 'Professional growth requires dedication and continuous learning every day.',
          words: ['Professional', 'growth', 'requires', 'dedication', 'and', 'continuous', 'learning', 'every', 'day'],
          difficulty: 'medium',
          category: 'professional'
        }
      ]
    });
  }
  
  return chapters;
}
