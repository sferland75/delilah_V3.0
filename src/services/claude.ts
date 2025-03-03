// Client-side service for interacting with Claude via API routes

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

export async function generateWithClaude(
  prompt: string,
  options: GenerationOptions = {}
): Promise<GenerationResult> {
  try {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    // Call our API route instead of directly calling Anthropic
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        maxTokens: mergedOptions.maxTokens,
        temperature: mergedOptions.temperature,
        model: mergedOptions.model,
        cacheKey: mergedOptions.cacheKey
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating with Claude:', error);
    return {
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Clear specific cache entry
export async function clearCacheEntry(key: string): Promise<void> {
  try {
    await fetch(`/api/claude?key=${encodeURIComponent(key)}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error clearing cache entry:', error);
  }
}

// Clear entire cache
export async function clearCache(): Promise<void> {
  try {
    await fetch('/api/claude', {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}