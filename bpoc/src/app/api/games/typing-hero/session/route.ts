import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  
  console.log('🎮 Typing Hero Session API called');
  console.log('👤 User ID from headers:', userId);
  
  if (!userId) {
    console.log('❌ No user ID found in headers');
    return NextResponse.json({ error: 'Unauthorized - User not authenticated' }, { status: 401 })
  }

  try {
    const body = await request.json()
    console.log('📊 Session data received:', {
      score: body.score,
      wpm: body.wpm,
      accuracy: body.overall_accuracy,
      hasAiAnalysis: !!body.ai_analysis,
      wordsCorrect: body.words_correct?.length || 0,
      wordsIncorrect: body.words_incorrect?.length || 0,
      wordsCorrectSample: body.words_correct?.slice(0, 2) || [],
      wordsIncorrectSample: body.words_incorrect?.slice(0, 2) || []
    });
    const {
      // Core metrics (exactly as requested)
      score,
      wpm,
      longest_streak,
      correct_words,
      wrong_words,
      elapsed_time,
      overall_accuracy,
      
      // AI analysis as single JSONB
      ai_analysis,
      
      // NEW: Word-level tracking data
      words_correct,
      words_incorrect,
      
      // Generated story
      generated_story,
      
      // Optional metadata
      difficulty_level = 'rockstar',
      session_status = 'completed'
    } = body || {}

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Validate required fields
      if (typeof score !== 'number' || typeof wpm !== 'number' || typeof longest_streak !== 'number' ||
          typeof correct_words !== 'number' || typeof wrong_words !== 'number' || 
          typeof elapsed_time !== 'number' || typeof overall_accuracy !== 'number') {
        throw new Error('Missing required numeric fields')
      }

      // Validate word arrays
      let validatedWordsCorrect = words_correct;
      let validatedWordsIncorrect = words_incorrect;
      
      if (validatedWordsCorrect && !Array.isArray(validatedWordsCorrect)) {
        console.warn('words_correct is not an array, converting to empty array');
        validatedWordsCorrect = [];
      }
      if (validatedWordsIncorrect && !Array.isArray(validatedWordsIncorrect)) {
        console.warn('words_incorrect is not an array, converting to empty array');
        validatedWordsIncorrect = [];
      }

      const insertSql = `
        INSERT INTO typing_hero_sessions (
          user_id, score, wpm, longest_streak, correct_words, wrong_words, 
          elapsed_time, overall_accuracy, ai_analysis, words_correct, words_incorrect,
          difficulty_level, session_status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, '{}'::jsonb), 
          COALESCE($10, '[]'::jsonb), COALESCE($11, '[]'::jsonb), $12, $13
        )
        RETURNING id
      `
      
      const insertParams = [
        userId,
        Math.round(score),
        Math.round(wpm),
        Math.round(longest_streak),
        Math.round(correct_words),
        Math.round(wrong_words),
        Math.round(elapsed_time),
        Math.round(overall_accuracy * 100) / 100, // Round to 2 decimal places
        ai_analysis ? JSON.stringify(ai_analysis) : '{}',
        validatedWordsCorrect ? JSON.stringify(validatedWordsCorrect) : '[]',
        validatedWordsIncorrect ? JSON.stringify(validatedWordsIncorrect) : '[]',
        difficulty_level,
        session_status
      ]

      const result = await client.query(insertSql, insertParams)
      const sessionId = result.rows[0].id

      // Update user stats (following BPOC DISC pattern)
      const upsertStatsSql = `
        WITH latest AS (
          SELECT * FROM typing_hero_sessions
          WHERE user_id = $1
          ORDER BY created_at DESC
          LIMIT 1
        ),
        agg AS (
          SELECT 
            COUNT(*)::int AS total_sessions,
            COUNT(*) FILTER (WHERE session_status = 'completed')::int AS completed_sessions,
            MAX(created_at) AS last_played_at,
            MAX(score) AS best_score,
            MAX(wpm) AS best_wpm,
            MAX(overall_accuracy) AS best_accuracy,
            MAX(longest_streak) AS best_streak,
            AVG(wpm) AS avg_wpm,
            AVG(overall_accuracy) AS avg_accuracy,
            SUM(elapsed_time) AS total_play_time,
            -- NEW: Word-level aggregation
            SUM(jsonb_array_length(COALESCE(words_correct, '[]'::jsonb))) AS total_words_correct,
            SUM(jsonb_array_length(COALESCE(words_incorrect, '[]'::jsonb))) AS total_words_incorrect
          FROM typing_hero_sessions
          WHERE user_id = $1
        )
        INSERT INTO typing_hero_stats (
          user_id, total_sessions, completed_sessions, last_played_at,
          best_score, best_wpm, best_accuracy, best_streak,
          latest_score, latest_wpm, latest_accuracy, latest_difficulty,
          avg_wpm, avg_accuracy, total_play_time, ai_analysis,
          total_words_correct, total_words_incorrect, generated_story,
          created_at, updated_at
        )
        SELECT 
          $1, agg.total_sessions, agg.completed_sessions, agg.last_played_at,
          agg.best_score, agg.best_wpm, agg.best_accuracy, agg.best_streak,
          latest.score, latest.wpm, latest.overall_accuracy, latest.difficulty_level,
          agg.avg_wpm, agg.avg_accuracy, agg.total_play_time,
          COALESCE($2::jsonb, NULL), 
          agg.total_words_correct, agg.total_words_incorrect,
          $3,
          NOW(), NOW()
        FROM agg, latest
        ON CONFLICT (user_id) DO UPDATE SET
          total_sessions = EXCLUDED.total_sessions,
          completed_sessions = EXCLUDED.completed_sessions,
          last_played_at = EXCLUDED.last_played_at,
          best_score = EXCLUDED.best_score,
          best_wpm = EXCLUDED.best_wpm,
          best_accuracy = EXCLUDED.best_accuracy,
          best_streak = EXCLUDED.best_streak,
          latest_score = EXCLUDED.latest_score,
          latest_wpm = EXCLUDED.latest_wpm,
          latest_accuracy = EXCLUDED.latest_accuracy,
          latest_difficulty = EXCLUDED.latest_difficulty,
          avg_wpm = EXCLUDED.avg_wpm,
          avg_accuracy = EXCLUDED.avg_accuracy,
          total_play_time = EXCLUDED.total_play_time,
          ai_analysis = COALESCE(EXCLUDED.ai_analysis, typing_hero_stats.ai_analysis),
          total_words_correct = EXCLUDED.total_words_correct,
          total_words_incorrect = EXCLUDED.total_words_incorrect,
          generated_story = EXCLUDED.generated_story,
          updated_at = NOW()
      `

      await client.query(upsertStatsSql, [userId, ai_analysis ? JSON.stringify(ai_analysis) : null, generated_story || null])

      // Compute most common correct/incorrect words and update stats
      const commonWordsSql = `
        WITH cw AS (
          SELECT LOWER(elem->>'word') AS word, COUNT(*) AS cnt
          FROM typing_hero_sessions t
          CROSS JOIN LATERAL jsonb_array_elements(COALESCE(t.words_correct, '[]'::jsonb)) AS elem
          WHERE t.user_id = $1
          GROUP BY LOWER(elem->>'word')
          ORDER BY cnt DESC
          LIMIT 10
        ),
        iw AS (
          SELECT LOWER(elem->>'word') AS word, COUNT(*) AS cnt
          FROM typing_hero_sessions t
          CROSS JOIN LATERAL jsonb_array_elements(COALESCE(t.words_incorrect, '[]'::jsonb)) AS elem
          WHERE t.user_id = $1
          GROUP BY LOWER(elem->>'word')
          ORDER BY cnt DESC
          LIMIT 10
        )
        SELECT 
          COALESCE((SELECT jsonb_agg(jsonb_build_object('word', word, 'count', cnt)) FROM cw), '[]'::jsonb) AS most_common_correct_words,
          COALESCE((SELECT jsonb_agg(jsonb_build_object('word', word, 'count', cnt)) FROM iw), '[]'::jsonb) AS most_common_incorrect_words
      `

      try {
        const common = await client.query(commonWordsSql, [userId])
        const mostCommonCorrect = common.rows[0]?.most_common_correct_words || []
        const mostCommonIncorrect = common.rows[0]?.most_common_incorrect_words || []

        // Best-effort update (columns must exist per ALTER script)
        await client.query(
          `UPDATE typing_hero_stats 
             SET most_common_correct_words = $2::jsonb,
                 most_common_incorrect_words = $3::jsonb,
                 updated_at = NOW()
           WHERE user_id = $1`,
          [userId, JSON.stringify(mostCommonCorrect), JSON.stringify(mostCommonIncorrect)]
        )
      } catch (aggErr) {
        console.warn('Skipping common words aggregation update (columns may not exist):', (aggErr as any).message)
      }

      // Fetch stats snapshot to return to client
      let statsSnapshot: any = null
      try {
        const statsRes = await client.query(
          `SELECT total_sessions, completed_sessions, best_score, best_wpm, best_accuracy,
                  total_words_correct, total_words_incorrect,
                  COALESCE(most_common_correct_words, '[]'::jsonb) AS most_common_correct_words,
                  COALESCE(most_common_incorrect_words, '[]'::jsonb) AS most_common_incorrect_words
             FROM typing_hero_stats
            WHERE user_id = $1`,
          [userId]
        )
        statsSnapshot = statsRes.rows[0] || null
      } catch (snapErr) {
        console.warn('Could not load stats snapshot:', (snapErr as any).message)
      }

      await client.query('COMMIT')
      
      console.log(`✅ Typing Hero session saved successfully for user ${userId}:`, {
        sessionId,
        score: Math.round(score),
        wpm: Math.round(wpm),
        accuracy: Math.round(overall_accuracy * 100) / 100,
        hasAiAnalysis: !!ai_analysis,
        wordsCorrect: words_correct?.length || 0,
        wordsIncorrect: words_incorrect?.length || 0,
        wordsCorrectSample: words_correct?.slice(0, 2) || [],
        wordsIncorrectSample: words_incorrect?.slice(0, 2) || []
      });
      
      return NextResponse.json({ 
        success: true, 
        sessionId,
        message: 'Session saved successfully',
        userId: userId,
        stats: statsSnapshot
      })
    } catch (e) {
      await client.query('ROLLBACK')
      console.error('Failed to save typing hero session', e)
      console.error('Error details:', {
        message: (e as Error).message,
        stack: (e as Error).stack,
        receivedData: {
          score, wpm, longest_streak, correct_words, wrong_words,
          elapsed_time, overall_accuracy, difficulty_level, session_status,
          wordsCorrectCount: words_correct?.length || 0,
          wordsIncorrectCount: words_incorrect?.length || 0
        }
      })
      return NextResponse.json({ error: 'Failed to save session' }, { status: 500 })
    } finally {
      client.release()
    }
  } catch (e) {
    console.error('Session save error:', e)
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}


