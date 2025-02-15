import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
});

export interface GenerationOptions {
  maxTokens?: number;
  temperature?: number;
  model?: string;
  cacheKey?: string;
}

const DEFAULT_OPTIONS: GenerationOptions = {
  maxTokens: 2000,
  temperature: 0.7,
  model: 'claude-3-opus-20240229'
};

export interface GenerationResult {
  content: string;
  error?: string;
  cached?: boolean;
}

// Simple in-memory cache for development
const responseCache = new Map<string, string>();

export async function generateWithClaude(
  prompt: string,
  options: GenerationOptions = {}
): Promise<GenerationResult> {
  try {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    const { cacheKey } = mergedOptions;

    // Check cache if cacheKey provided
    if (cacheKey && responseCache.has(cacheKey)) {
      return {
        content: responseCache.get(cacheKey) || '',
        cached: true
      };
    }

    // Call Claude API
    const response = await anthropic.messages.create({
      model: mergedOptions.model,
      max_tokens: mergedOptions.maxTokens,
      temperature: mergedOptions.temperature,
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

    return {
      content: generatedContent,
      cached: false
    };
  } catch (error) {
    console.error('Error generating with Claude:', error);
    return {
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Clear specific cache entry
export function clearCacheEntry(key: string): void {
  responseCache.delete(key);
}

// Clear entire cache
export function clearCache(): void {
  responseCache.clear();
}

// Get cache size
export function getCacheSize(): number {
  return responseCache.size;
}