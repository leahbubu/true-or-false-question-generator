import axios from 'axios';
import * as cheerio from 'cheerio';
import pdf from 'pdf-parse';
import { YoutubeTranscript } from 'youtube-transcript';
import { ContentExtractionResult } from '../types';

export class ContentExtractor {
  /**
   * Extract content from a URL
   */
  async extractFromUrl(url: string): Promise<ContentExtractionResult> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);

      // Remove script and style elements
      $('script, style, nav, footer, header').remove();

      // Extract title
      const title = $('title').text() || $('h1').first().text() || 'Web Content';

      // Extract main content
      let content = '';

      // Try to find main content area
      const mainContent = $('article, main, .content, .post, .article').first();
      if (mainContent.length) {
        content = mainContent.text();
      } else {
        // Fallback to body text
        content = $('body').text();
      }

      // Clean up whitespace
      content = content
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim();

      if (!content) {
        throw new Error('No content found at URL');
      }

      return { content, title };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: '',
        error: `Failed to extract content from URL: ${message}`
      };
    }
  }

  /**
   * Extract content from PDF buffer
   */
  async extractFromPdf(buffer: Buffer): Promise<ContentExtractionResult> {
    try {
      const data = await pdf(buffer);

      if (!data.text) {
        throw new Error('No text content found in PDF');
      }

      return {
        content: data.text.trim(),
        title: data.info?.Title || 'PDF Document'
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: '',
        error: `Failed to extract content from PDF: ${message}`
      };
    }
  }

  /**
   * Extract transcript from YouTube video
   */
  async extractFromYoutube(url: string): Promise<ContentExtractionResult> {
    try {
      // Extract video ID from URL
      const videoId = this.extractYoutubeVideoId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      // Fetch transcript
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);

      if (!transcript || transcript.length === 0) {
        throw new Error('No transcript available for this video');
      }

      // Combine transcript text
      const content = transcript.map(item => item.text).join(' ');

      return {
        content: content.trim(),
        title: `YouTube Video (${videoId})`
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: '',
        error: `Failed to extract YouTube transcript: ${message}`
      };
    }
  }

  /**
   * Extract YouTube video ID from URL
   */
  private extractYoutubeVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Extract content from plain text
   */
  extractFromText(text: string): ContentExtractionResult {
    if (!text || text.trim().length === 0) {
      return {
        content: '',
        error: 'No text content provided'
      };
    }

    return {
      content: text.trim(),
      title: 'Text Input'
    };
  }
}
