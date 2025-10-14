// Story Generation and Management System for Typing Hero

export interface UserStoryProfile {
    userId: string
    name: string
    position?: string
    skills?: string[]
    experience?: string[]
    careerGoals?: string[]
    currentEmployer?: string
    workStatus?: string
    location?: string
    industry?: string
  }
  
  export interface GameProgressData {
    currentChapter: number
    difficulty: 'rookie' | 'rockstar' | 'virtuoso' | 'legend'
    currentWPM: number
    accuracy: number
    completedStories: number
    totalWordsTyped: number
    averageSessionTime: number
    strongWordTypes: string[]
    weakWordTypes: string[]
    previousChapterContent?: string // Add previous chapter context
  }
  
  export interface StoryChapter {
    id: string
    chapterNumber: number
    title: string
    sentences: StorySentence[]
    difficulty: string
    theme: string
    personalizedElements: string[]
    nextChapterPreview: string
    estimatedDuration: number
  }
  
  export interface StorySentence {
    id: number
    text: string
    words: string[]
    difficulty: number
    timing: number[]
    theme: string
    wordCategories: string[]
  }
  
  export interface StoryWord {
    text: string
    index: number
    sentenceId: number
    timing: number
    category: string
    difficulty: number
    isSequential: true
    nextWord?: string
  }
  
  export class PersonalizedStoryGenerator {
    private static instance: PersonalizedStoryGenerator
    private currentStories: Map<string, StoryChapter> = new Map()
    private userProgress: Map<string, GameProgressData> = new Map()
  
    static getInstance(): PersonalizedStoryGenerator {
      if (!PersonalizedStoryGenerator.instance) {
        PersonalizedStoryGenerator.instance = new PersonalizedStoryGenerator()
      }
      return PersonalizedStoryGenerator.instance
    }
  
    /**
     * Generate complete 5-chapter story (NEW METHOD)
     */
    async generateCompleteStory(
      userProfile: UserStoryProfile, 
      gameProgress: GameProgressData
    ): Promise<any> {
      try {
        console.log('🎬 Generating complete 5-chapter story for:', userProfile.name)
  
        const response = await fetch('/api/games/typing-hero/generate-complete-story', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userProfile.userId,
            userProfile,
            gameData: gameProgress
          })
        })
  
        console.log('📡 Complete story API Response status:', response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Complete story API Error:', errorText)
          throw new Error(`Complete story generation failed: ${response.status} - ${errorText}`)
        }
  
        const completeStory = await response.json()
        console.log('✅ Complete 5-chapter story generated:', {
          id: completeStory.id,
          title: completeStory.title,
          chapters: completeStory.chapters.length
        })
        
        return completeStory
  
      } catch (error) {
        console.error('❌ Complete story generation error:', error)
        throw error
      }
    }
  
    /**
     * Load user's active story (NEW METHOD)
     */
    async loadUserActiveStory(userId: string): Promise<any> {
      try {
        console.log('📖 Loading user active story for:', userId)
  
        const response = await fetch('/api/games/typing-hero/load-user-story', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId })
        })
  
        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Load story API Error:', errorText)
          throw new Error(`Load story failed: ${response.status} - ${errorText}`)
        }
  
        const result = await response.json()
        console.log('📖 Load story result:', { hasStory: result.hasStory })
        
        return result
  
      } catch (error) {
        console.error('❌ Load story error:', error)
        throw error
      }
    }
  
    /**
     * Generate a new story chapter for a user (LEGACY METHOD - will be deprecated)
     */
    async generateStoryChapter(
      userProfile: UserStoryProfile, 
      gameProgress: GameProgressData,
      preferences?: {
        theme?: 'career' | 'entrepreneurship' | 'technical' | 'leadership'
        complexity?: 'adaptive' | 'challenge' | 'comfort'
      }
    ): Promise<StoryChapter> {
      try {
        console.log('🎬 Generating story for:', userProfile.name)
  
        console.log('🎬 Calling story generation API...')
        const response = await fetch('/api/games/typing-hero/generate-story', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userProfile.userId,
            userProfile,
            gameData: gameProgress,
            preferences
          })
        })
  
        console.log('📡 API Response status:', response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ API Error:', errorText)
          throw new Error(`Story generation failed: ${response.status} - ${errorText}`)
        }
  
        const result = await response.json()
        console.log('✅ Story generated successfully:', result)
        
        // The API returns the story data directly, not wrapped in a success object
        if (result.error) {
          throw new Error(`Story generation failed: ${result.error}`)
        }
        
        // Convert API response format to our internal format
        const storyChapter = this.convertApiResponseToStoryChapter(result, userProfile, gameProgress)
        
        // Cache the story
        this.currentStories.set(userProfile.userId, storyChapter)
        
        console.log('✅ Story generated successfully:', storyChapter.title)
        return storyChapter
  
      } catch (error) {
        console.error('❌ Story generation error:', error)
        return this.getFallbackStory(userProfile, gameProgress)
      }
    }
  
    /**
     * Get the next word in sequence for the typing game
     */
    getNextSequentialWord(
      userId: string, 
      currentWordIndex: number
    ): StoryWord | null {
      const story = this.currentStories.get(userId)
      if (!story) return null
  
      // Find the sentence and word index
      let globalWordIndex = 0
      for (const sentence of story.sentences) {
        if (globalWordIndex + sentence.words.length > currentWordIndex) {
          const localWordIndex = currentWordIndex - globalWordIndex
          const word = sentence.words[localWordIndex]
          // Just return the current word - we don't need to predict the next word here
  
          return {
            text: word,
            difficulty: sentence.difficulty,
            theme: sentence.theme,
            wordCategories: this.categorizeWord(word)
          }
        }
        globalWordIndex += sentence.words.length
      }
  
      return null
    }
  
    /**
     * Check if a sentence is completed
     */
    isSentenceComplete(userId: string, wordIndex: number): {
      isComplete: boolean
      sentence?: StorySentence
      completedText?: string
    } {
      const story = this.currentStories.get(userId)
      if (!story) return { isComplete: false }
  
      let globalWordIndex = 0
      for (const sentence of story.sentences) {
        const sentenceEndIndex = globalWordIndex + sentence.words.length - 1
        
        if (wordIndex === sentenceEndIndex) {
          return {
            isComplete: true,
            sentence,
            completedText: sentence.text
          }
        }
        
        globalWordIndex += sentence.words.length
      }
  
      return { isComplete: false }
    }
  
    /**
     * Check if a chapter is completed
     */
    isChapterComplete(userId: string, wordIndex: number): {
      isComplete: boolean
      chapter?: StoryChapter
      nextChapterPreview?: string
    } {
      const story = this.currentStories.get(userId)
      if (!story) return { isComplete: false }
  
      const totalWords = story.sentences.reduce((sum, s) => sum + s.words.length, 0)
      
      if (wordIndex >= totalWords - 1) {
        return {
          isComplete: true,
          chapter: story,
          nextChapterPreview: story.nextChapterPreview
        }
      }
  
      return { isComplete: false }
    }
  
    /**
     * Get completed sentences for display
     */
    getCompletedSentences(userId: string, currentWordIndex: number): string[] {
      const story = this.currentStories.get(userId)
      if (!story) return []
  
      const completed: string[] = []
      let globalWordIndex = 0
  
      for (const sentence of story.sentences) {
        const sentenceEndIndex = globalWordIndex + sentence.words.length
        
        if (currentWordIndex >= sentenceEndIndex) {
          completed.push(sentence.text)
        } else {
          break
        }
        
        globalWordIndex += sentence.words.length
      }
  
      return completed
    }
  
    /**
     * Get current sentence progress
     */
    getCurrentSentenceProgress(userId: string, currentWordIndex: number): {
      completedWords: string[]
      nextWord: string
      remainingWords: string[]
      sentenceText: string
    } {
      const story = this.currentStories.get(userId)
      if (!story) return { completedWords: [], nextWord: '', remainingWords: [], sentenceText: '' }
  
      let globalWordIndex = 0
      for (const sentence of story.sentences) {
        const sentenceStartIndex = globalWordIndex
        const sentenceEndIndex = globalWordIndex + sentence.words.length
  
        if (currentWordIndex >= sentenceStartIndex && currentWordIndex < sentenceEndIndex) {
          const localIndex = currentWordIndex - sentenceStartIndex
          
          return {
            completedWords: sentence.words.slice(0, localIndex),
            nextWord: sentence.words[localIndex] || '',
            remainingWords: sentence.words.slice(localIndex + 1),
            sentenceText: sentence.text
          }
        }
        
        globalWordIndex += sentence.words.length
      }
  
      return { completedWords: [], nextWord: '', remainingWords: [], sentenceText: '' }
    }
  
    /**
     * Update user progress for better story generation
     */
    updateUserProgress(userId: string, progressData: Partial<GameProgressData>): void {
      const current = this.userProgress.get(userId) || {
        currentChapter: 1,
        difficulty: 'rockstar',
        currentWPM: 0,
        accuracy: 0,
        completedStories: 0,
        totalWordsTyped: 0,
        averageSessionTime: 0,
        strongWordTypes: [],
        weakWordTypes: []
      }
  
      this.userProgress.set(userId, { ...current, ...progressData })
    }
  
    /**
     * Convert API response to internal StoryChapter format
     */
    private convertApiResponseToStoryChapter(apiResponse: any, userProfile: UserStoryProfile, gameProgress: GameProgressData): StoryChapter {
      return {
        id: `${userProfile.userId}-chapter-${apiResponse.chapterNumber}`,
        chapterNumber: apiResponse.chapterNumber,
        title: apiResponse.title,
        sentences: apiResponse.sentences.map((sentence: any) => ({
          id: sentence.id,
          text: sentence.text,
          words: sentence.words.map((word: any) => word.word), // Extract just the word strings
          difficulty: this.mapDifficultyToNumber(sentence.difficulty),
          timing: sentence.words.map(() => 1000), // Default timing
          theme: apiResponse.theme,
          wordCategories: sentence.words.map((word: any) => word.category)
        })),
        difficulty: apiResponse.difficulty,
        theme: apiResponse.theme,
        personalizedElements: [userProfile.name, userProfile.position || 'professional'],
        nextChapterPreview: `Chapter ${apiResponse.chapterNumber + 1} will continue your journey...`,
        estimatedDuration: apiResponse.estimatedDuration || 120
      };
    }
  
    /**
     * Map difficulty string to number
     */
    private mapDifficultyToNumber(difficulty: string): number {
      switch (difficulty) {
        case 'easy': return 1;
        case 'medium': return 2;
        case 'hard': return 3;
        default: return 2;
      }
    }
  
    private processGeneratedStory(
      rawStory: any, 
      userProfile: UserStoryProfile, 
      gameProgress: GameProgressData
    ): StoryChapter {
      return {
        id: `${userProfile.userId}-chapter-${gameProgress.currentChapter}`,
        chapterNumber: gameProgress.currentChapter,
        title: rawStory.chapterTitle,
        sentences: rawStory.sentences.map((s: any) => ({
          ...s,
          wordCategories: s.words.map((word: string) => this.categorizeWord(word))
        })),
        difficulty: gameProgress.difficulty,
        theme: rawStory.sentences[0]?.theme || 'career',
        personalizedElements: rawStory.personalizedElements || [],
        nextChapterPreview: rawStory.nextChapterPreview,
        estimatedDuration: rawStory.estimatedDuration || 120
      }
    }
  
    private categorizeWord(word: string): string {
      const categories = {
        technical: ['API', 'database', 'algorithm', 'framework', 'deployment', 'optimization'],
        business: ['revenue', 'strategy', 'market', 'customer', 'growth', 'profit'],
        leadership: ['team', 'manage', 'lead', 'coordinate', 'delegate', 'inspire'],
        career: ['professional', 'skill', 'experience', 'development', 'advancement'],
        personal: ['achieve', 'goal', 'success', 'challenge', 'opportunity', 'vision']
      }
  
      const lowerWord = word.toLowerCase()
      for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => lowerWord.includes(keyword))) {
          return category
        }
      }
      return 'general'
    }
  
    private getFallbackStory(userProfile: UserStoryProfile, gameProgress: GameProgressData): StoryChapter {
      const userName = userProfile.name || 'the professional'
      
      return {
        id: `${userProfile.userId}-fallback-${gameProgress.currentChapter}`,
        chapterNumber: gameProgress.currentChapter,
        title: `Chapter ${gameProgress.currentChapter}: Professional Journey`,
        sentences: [
          {
            id: 1,
            text: `${userName} begins an exciting professional journey with determination and focus`,
            words: [userName, 'begins', 'an', 'exciting', 'professional', 'journey', 'with', 'determination', 'and', 'focus'],
            difficulty: 5,
            timing: Array(10).fill(1500),
            theme: 'career',
            wordCategories: ['personal', 'general', 'general', 'general', 'career', 'career', 'general', 'personal', 'general', 'personal']
          },
          {
            id: 2,
            text: 'Every challenge becomes an opportunity to grow and develop new skills',
            words: ['Every', 'challenge', 'becomes', 'an', 'opportunity', 'to', 'grow', 'and', 'develop', 'new', 'skills'],
            difficulty: 6,
            timing: Array(11).fill(1400),
            theme: 'career',
            wordCategories: ['general', 'personal', 'general', 'general', 'personal', 'general', 'personal', 'general', 'career', 'general', 'career']
          }
        ],
        difficulty: gameProgress.difficulty,
        theme: 'career',
        personalizedElements: ['professional growth', 'skill development'],
        nextChapterPreview: 'Continue building your success story...',
        estimatedDuration: 30000
      }
    }
  }
  
  // Export singleton instance
  export const storyGenerator = PersonalizedStoryGenerator.getInstance()
  