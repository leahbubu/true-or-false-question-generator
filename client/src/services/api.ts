import axios from 'axios';
import { GenerateQuestionsResponse, Difficulty } from '../types';

const API_BASE_URL = '/api';

export const api = {
  async generateFromText(
    content: string,
    numberOfQuestions: number,
    difficulty: Difficulty
  ): Promise<GenerateQuestionsResponse> {
    const response = await axios.post(`${API_BASE_URL}/generate/text`, {
      content,
      numberOfQuestions,
      difficulty
    });
    return response.data;
  },

  async generateFromUrl(
    url: string,
    numberOfQuestions: number,
    difficulty: Difficulty
  ): Promise<GenerateQuestionsResponse> {
    const response = await axios.post(`${API_BASE_URL}/generate/url`, {
      url,
      numberOfQuestions,
      difficulty
    });
    return response.data;
  },

  async generateFromPdf(
    file: File,
    numberOfQuestions: number,
    difficulty: Difficulty
  ): Promise<GenerateQuestionsResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('numberOfQuestions', numberOfQuestions.toString());
    formData.append('difficulty', difficulty);

    const response = await axios.post(`${API_BASE_URL}/generate/pdf`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async generateFromYoutube(
    url: string,
    numberOfQuestions: number,
    difficulty: Difficulty
  ): Promise<GenerateQuestionsResponse> {
    const response = await axios.post(`${API_BASE_URL}/generate/youtube`, {
      url,
      numberOfQuestions,
      difficulty
    });
    return response.data;
  }
};
