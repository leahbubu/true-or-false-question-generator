import { Router, Request, Response } from 'express';
import multer from 'multer';
import { ContentExtractor } from '../services/contentExtractor';
import { QuestionGenerator } from '../services/questionGenerator';
import { GenerateQuestionsRequest, GenerateQuestionsResponse } from '../types';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize services
const contentExtractor = new ContentExtractor();

/**
 * Generate questions from plain text
 */
router.post('/text', async (req: Request, res: Response) => {
  try {
    const { content, numberOfQuestions = 5, difficulty = 'medium' } = req.body as GenerateQuestionsRequest;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const questionGenerator = new QuestionGenerator(apiKey);
    const questions = await questionGenerator.generateQuestions(
      content,
      numberOfQuestions,
      difficulty
    );

    const response: GenerateQuestionsResponse = {
      questions,
      sourceType: 'text'
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating questions from text:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

/**
 * Generate questions from URL
 */
router.post('/url', async (req: Request, res: Response) => {
  try {
    const { url, numberOfQuestions = 5, difficulty = 'medium' } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Extract content from URL
    const extraction = await contentExtractor.extractFromUrl(url);
    if (extraction.error || !extraction.content) {
      return res.status(400).json({ error: extraction.error || 'Failed to extract content from URL' });
    }

    // Generate questions
    const questionGenerator = new QuestionGenerator(apiKey);
    const questions = await questionGenerator.generateQuestions(
      extraction.content,
      numberOfQuestions,
      difficulty
    );

    const response: GenerateQuestionsResponse = {
      questions,
      sourceType: 'url'
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating questions from URL:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

/**
 * Generate questions from PDF
 */
router.post('/pdf', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    const numberOfQuestions = parseInt(req.body.numberOfQuestions) || 5;
    const difficulty = req.body.difficulty || 'medium';

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Extract content from PDF
    const extraction = await contentExtractor.extractFromPdf(req.file.buffer);
    if (extraction.error || !extraction.content) {
      return res.status(400).json({ error: extraction.error || 'Failed to extract content from PDF' });
    }

    // Generate questions
    const questionGenerator = new QuestionGenerator(apiKey);
    const questions = await questionGenerator.generateQuestions(
      extraction.content,
      numberOfQuestions,
      difficulty
    );

    const response: GenerateQuestionsResponse = {
      questions,
      sourceType: 'pdf'
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating questions from PDF:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

/**
 * Generate questions from YouTube video
 */
router.post('/youtube', async (req: Request, res: Response) => {
  try {
    const { url, numberOfQuestions = 5, difficulty = 'medium' } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Extract transcript from YouTube
    const extraction = await contentExtractor.extractFromYoutube(url);
    if (extraction.error || !extraction.content) {
      return res.status(400).json({ error: extraction.error || 'Failed to extract YouTube transcript' });
    }

    // Generate questions
    const questionGenerator = new QuestionGenerator(apiKey);
    const questions = await questionGenerator.generateQuestions(
      extraction.content,
      numberOfQuestions,
      difficulty
    );

    const response: GenerateQuestionsResponse = {
      questions,
      sourceType: 'youtube'
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating questions from YouTube:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

export default router;
