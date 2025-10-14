import fs from 'fs';
import path from 'path';

// Complete 5-chapter story structure
export interface CompleteStory {
  id: string;
  userId: string;
  title: string;
  difficulty: 'rookie' | 'rockstar' | 'virtuoso' | 'legend';
  chapters: StoryChapter[];
  createdAt: string;
  isActive: boolean;
}

export interface StoryChapter {
  chapterNumber: number;
  title: string;
  theme: string;
  sentences: StorySentence[];
  difficulty: string;
  estimatedDuration: number;
}

export interface StorySentence {
  id: number;
  text: string;
  words: string[];
  difficulty: string;
  category: string;
}

// JSON storage paths
const STORIES_DIR = path.join(process.cwd(), 'data', 'user-stories');
const ACTIVE_STORIES_FILE = path.join(STORIES_DIR, 'active-stories.json');

// Ensure directories exist
function ensureDirectoriesExist() {
  if (!fs.existsSync(STORIES_DIR)) {
    fs.mkdirSync(STORIES_DIR, { recursive: true });
  }
}

// Load active stories index
function loadActiveStories(): Record<string, string> {
  ensureDirectoriesExist();
  
  if (!fs.existsSync(ACTIVE_STORIES_FILE)) {
    return {};
  }
  
  try {
    const data = fs.readFileSync(ACTIVE_STORIES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading active stories:', error);
    return {};
  }
}

// Save active stories index
function saveActiveStories(activeStories: Record<string, string>) {
  ensureDirectoriesExist();
  
  try {
    fs.writeFileSync(ACTIVE_STORIES_FILE, JSON.stringify(activeStories, null, 2));
  } catch (error) {
    console.error('Error saving active stories:', error);
  }
}

// Generate unique story ID
function generateStoryId(userId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `story_${userId.substring(0, 8)}_${timestamp}_${random}`;
}

// Save complete story to JSON file
export function saveCompleteStory(story: CompleteStory): boolean {
  try {
    ensureDirectoriesExist();
    
    // Save story to individual file
    const storyFile = path.join(STORIES_DIR, `${story.id}.json`);
    fs.writeFileSync(storyFile, JSON.stringify(story, null, 2));
    
    // Update active stories index
    const activeStories = loadActiveStories();
    
    // Deactivate previous story for this user if exists
    const previousStoryId = activeStories[story.userId];
    if (previousStoryId) {
      deactivateStory(previousStoryId);
    }
    
    // Set new story as active
    activeStories[story.userId] = story.id;
    saveActiveStories(activeStories);
    
    console.log('✅ Story saved successfully:', story.id);
    return true;
  } catch (error) {
    console.error('❌ Error saving story:', error);
    return false;
  }
}

// Load user's active story
export function loadUserActiveStory(userId: string): CompleteStory | null {
  try {
    const activeStories = loadActiveStories();
    const storyId = activeStories[userId];
    
    if (!storyId) {
      console.log('No active story found for user:', userId);
      return null;
    }
    
    return loadStoryById(storyId);
  } catch (error) {
    console.error('❌ Error loading user active story:', error);
    return null;
  }
}

// Load story by ID
export function loadStoryById(storyId: string): CompleteStory | null {
  try {
    const storyFile = path.join(STORIES_DIR, `${storyId}.json`);
    
    if (!fs.existsSync(storyFile)) {
      console.log('Story file not found:', storyId);
      return null;
    }
    
    const data = fs.readFileSync(storyFile, 'utf8');
    const story = JSON.parse(data) as CompleteStory;
    
    console.log('✅ Story loaded successfully:', storyId);
    return story;
  } catch (error) {
    console.error('❌ Error loading story:', error);
    return null;
  }
}

// Deactivate a story
export function deactivateStory(storyId: string): boolean {
  try {
    const story = loadStoryById(storyId);
    if (!story) return false;
    
    story.isActive = false;
    
    const storyFile = path.join(STORIES_DIR, `${storyId}.json`);
    fs.writeFileSync(storyFile, JSON.stringify(story, null, 2));
    
    console.log('✅ Story deactivated:', storyId);
    return true;
  } catch (error) {
    console.error('❌ Error deactivating story:', error);
    return false;
  }
}

// Create new complete story
export function createCompleteStory(
  userId: string,
  userProfile: any,
  difficulty: string,
  chapters: StoryChapter[]
): CompleteStory {
  const storyId = generateStoryId(userId);
  
  return {
    id: storyId,
    userId,
    title: chapters[0]?.title || 'Your Typing Journey',
    difficulty: difficulty as any,
    chapters,
    createdAt: new Date().toISOString(),
    isActive: true
  };
}

// Get user's story history (for future use)
export function getUserStoryHistory(userId: string): CompleteStory[] {
  try {
    ensureDirectoriesExist();
    
    const stories: CompleteStory[] = [];
    const files = fs.readdirSync(STORIES_DIR);
    
    for (const file of files) {
      if (file.endsWith('.json') && file !== 'active-stories.json') {
        const story = loadStoryById(file.replace('.json', ''));
        if (story && story.userId === userId) {
          stories.push(story);
        }
      }
    }
    
    // Sort by creation date (newest first)
    return stories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('❌ Error getting user story history:', error);
    return [];
  }
}
