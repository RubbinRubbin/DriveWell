import OpenAI from 'openai';

/**
 * OpenAI Client Service
 * Wrapper for OpenAI API calls with error handling and retry logic
 */
export class OpenAIClientService {
  private client: OpenAI;
  private model: string;
  private maxTokens: number;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    this.client = new OpenAI({
      apiKey: apiKey
    });

    this.model = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
    this.maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || '2000');
  }

  /**
   * Send a chat completion request to OpenAI
   */
  async chat(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || this.maxTokens
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      return content;
    } catch (error: any) {
      console.error('OpenAI API Error:', error);

      // Handle specific OpenAI errors
      if (error.status === 429) {
        throw new Error('OpenAI rate limit exceeded. Please try again later.');
      } else if (error.status === 401) {
        throw new Error('Invalid OpenAI API key');
      } else if (error.status === 500) {
        throw new Error('OpenAI service error. Please try again later.');
      }

      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  /**
   * Test the OpenAI connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.chat([
        { role: 'user', content: 'Hello' }
      ]);
      return true;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }
}
