import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client on the server
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Simple in-memory cache for development
const responseCache = new Map<string, string>();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { prompt, maxTokens = 2000, temperature = 0.7, model = 'claude-3-opus-20240229', cacheKey } = body;

    // Validate required fields
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check cache if cacheKey provided
    if (cacheKey && responseCache.has(cacheKey)) {
      return NextResponse.json({
        content: responseCache.get(cacheKey),
        cached: true
      });
    }

    // Call Claude API
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: maxTokens,
      temperature: temperature,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const generatedContent = response.content[0].text;

    // Cache the response if cacheKey provided
    if (cacheKey) {
      responseCache.set(cacheKey, generatedContent);
    }

    // Return the response
    return NextResponse.json({
      content: generatedContent,
      cached: false
    });
  } catch (error) {
    console.error('Error in Claude API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

// Add a DELETE endpoint to clear the cache
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (key) {
    // Clear specific cache entry
    responseCache.delete(key);
    return NextResponse.json({ success: true, message: `Cache entry '${key}' cleared` });
  } else {
    // Clear entire cache
    responseCache.clear();
    return NextResponse.json({ success: true, message: 'Entire cache cleared' });
  }
}
