import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Check OpenAI API key
    const openAIKey = process.env.OPENAI_API_KEY;
    if (!openAIKey) {
      console.error('OpenAI API key not configured');
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    // Convert File to Blob for OpenAI
    const audioBlob = new Blob([audioFile], { type: audioFile.type });
    
    // Create form data for OpenAI Whisper
    const openAIFormData = new FormData();
    openAIFormData.append('file', audioBlob, 'recording.webm');
    openAIFormData.append('model', 'whisper-1');
    
    console.log('Sending audio to OpenAI Whisper...');
    console.log('Audio file size:', audioBlob.size, 'bytes');
    console.log('Audio file type:', audioFile.type);
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`
      },
      body: openAIFormData
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI Whisper error:', response.status, error);
      return NextResponse.json({ 
        error: `Transcription failed: ${response.status} - ${error}` 
      }, { status: 500 });
    }

    const result = await response.json();
    console.log('Whisper transcription successful:', result.text);
    
    return NextResponse.json({ 
      transcript: result.text,
      success: true
    });

  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json({ 
      error: 'Transcription failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
