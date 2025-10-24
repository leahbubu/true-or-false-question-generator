import Anthropic from '@anthropic-ai/sdk';
import { Question } from '../types';

export class QuestionGenerator {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({
      apiKey: apiKey
    });
  }

  /**
   * Generate true/false questions from content using Claude AI
   */
  async generateQuestions(
    content: string,
    numberOfQuestions: number = 5,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ): Promise<Question[]> {
    const prompt = this.buildPrompt(content, numberOfQuestions, difficulty);

    try {
      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      // Extract text from response
      const responseText = message.content
        .filter(block => block.type === 'text')
        .map(block => (block as Anthropic.TextBlock).text)
        .join('');

      // Parse JSON response
      const questions = this.parseQuestionsFromResponse(responseText);

      if (questions.length === 0) {
        throw new Error('No valid questions generated');
      }

      return questions;
    } catch (error) {
      console.error('Error generating questions:', error);
      throw new Error('Failed to generate questions. Please check your API key and try again.');
    }
  }

  /**
   * Build the prompt for Claude
   */
  private buildPrompt(
    content: string,
    numberOfQuestions: number,
    difficulty: string
  ): string {
    return `You are an expert educator creating high-quality true/false quiz questions.

Based on the following content, generate ${numberOfQuestions} true/false questions at a ${difficulty} difficulty level.

CONTENT:
${content.substring(0, 8000)} ${content.length > 8000 ? '...(truncated)' : ''}

REQUIREMENTS:
1. Create exactly ${numberOfQuestions} true/false questions
2. Difficulty level: ${difficulty}
   - Easy: Basic recall and comprehension
   - Medium: Application and analysis
   - Hard: Critical thinking and inference
3. Mix of true and false answers (roughly 50/50)
4. Each question should:
   - Be clear and unambiguous
   - Test important concepts from the content
   - Have a definitive true or false answer
   - Include a detailed explanation

OUTPUT FORMAT:
Return ONLY a valid JSON array with this exact structure (no additional text):
[
  {
    "question": "The question text here",
    "answer": true,
    "explanation": "Detailed explanation of why this is true/false"
  }
]

Generate the questions now:`;
  }

  /**
   * Parse questions from Claude's response
   */
  private parseQuestionsFromResponse(responseText: string): Question[] {
    try {
      // Extract JSON from response (handle cases where Claude adds text before/after JSON)
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const parsedQuestions = JSON.parse(jsonMatch[0]);

      if (!Array.isArray(parsedQuestions)) {
        throw new Error('Response is not an array');
      }

      // Validate and format questions
      return parsedQuestions.map((q, index) => ({
        id: `q_${Date.now()}_${index}`,
        question: q.question || '',
        answer: Boolean(q.answer),
        explanation: q.explanation || ''
      })).filter(q => q.question && q.explanation);
    } catch (error) {
      console.error('Error parsing questions:', error);
      console.error('Response text:', responseText);
      throw new Error('Failed to parse questions from AI response');
    }
  }
}
