import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    console.log('📖 Loading story from database for user:', userId);

    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT generated_story FROM typing_hero_stats WHERE user_id = $1',
        [userId]
      );

      if (result.rows.length === 0 || !result.rows[0].generated_story) {
        console.log('📖 No story found in database for user:', userId);
        return NextResponse.json(
          { story: null, hasStory: false },
          { status: 200 }
        );
      }

      const story = JSON.parse(result.rows[0].generated_story);
      
      console.log('✅ Story loaded from database:', {
        storyId: story.id,
        title: story.title,
        chapters: story.chapters.length,
        createdAt: story.createdAt
      });

      return NextResponse.json({
        story,
        hasStory: true
      });
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('❌ Error loading user story:', error);
    return NextResponse.json(
      { error: `Failed to load story: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    console.log('📖 Loading story from database for user (POST):', userId);

    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT generated_story FROM typing_hero_stats WHERE user_id = $1',
        [userId]
      );

      if (result.rows.length === 0 || !result.rows[0].generated_story) {
        console.log('📖 No story found in database for user:', userId);
        return NextResponse.json(
          { story: null, hasStory: false },
          { status: 200 }
        );
      }

      const story = JSON.parse(result.rows[0].generated_story);
      
      console.log('✅ Story loaded from database:', {
        storyId: story.id,
        title: story.title,
        chapters: story.chapters.length,
        createdAt: story.createdAt
      });

      return NextResponse.json({
        story,
        hasStory: true
      });
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('❌ Error loading user story:', error);
    return NextResponse.json(
      { error: `Failed to load story: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
