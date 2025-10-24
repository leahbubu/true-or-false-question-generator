import React, { useState } from 'react';
import InputSelector from './components/InputSelector';
import TextInput from './components/TextInput';
import UrlInput from './components/UrlInput';
import PdfInput from './components/PdfInput';
import YoutubeInput from './components/YoutubeInput';
import QuizDisplay from './components/QuizDisplay';
import { api } from './services/api';
import { InputType, Question, Difficulty } from './types';

function App() {
  const [inputType, setInputType] = useState<InputType>('text');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (
    generateFn: () => Promise<void>
  ) => {
    setLoading(true);
    setError(null);
    try {
      await generateFn();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Error generating questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextGenerate = async (content: string, numberOfQuestions: number, difficulty: Difficulty) => {
    await handleGenerate(async () => {
      const response = await api.generateFromText(content, numberOfQuestions, difficulty);
      setQuestions(response.questions);
    });
  };

  const handleUrlGenerate = async (url: string, numberOfQuestions: number, difficulty: Difficulty) => {
    await handleGenerate(async () => {
      const response = await api.generateFromUrl(url, numberOfQuestions, difficulty);
      setQuestions(response.questions);
    });
  };

  const handlePdfGenerate = async (file: File, numberOfQuestions: number, difficulty: Difficulty) => {
    await handleGenerate(async () => {
      const response = await api.generateFromPdf(file, numberOfQuestions, difficulty);
      setQuestions(response.questions);
    });
  };

  const handleYoutubeGenerate = async (url: string, numberOfQuestions: number, difficulty: Difficulty) => {
    await handleGenerate(async () => {
      const response = await api.generateFromYoutube(url, numberOfQuestions, difficulty);
      setQuestions(response.questions);
    });
  };

  const handleReset = () => {
    setQuestions([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            True/False Question Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate AI-powered quizzes from text, URLs, PDFs, and YouTube videos
          </p>
        </div>

        {questions.length === 0 ? (
          <div className="card">
            {/* Input Type Selector */}
            <InputSelector selectedType={inputType} onTypeChange={setInputType} />

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-semibold">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Input Forms */}
            {inputType === 'text' && (
              <TextInput onGenerate={handleTextGenerate} loading={loading} />
            )}
            {inputType === 'url' && (
              <UrlInput onGenerate={handleUrlGenerate} loading={loading} />
            )}
            {inputType === 'pdf' && (
              <PdfInput onGenerate={handlePdfGenerate} loading={loading} />
            )}
            {inputType === 'youtube' && (
              <YoutubeInput onGenerate={handleYoutubeGenerate} loading={loading} />
            )}

            {/* Features */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Features:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <p className="font-medium text-gray-900">AI-Powered</p>
                    <p className="text-sm text-gray-600">
                      Uses advanced AI to generate meaningful questions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="font-medium text-gray-900">Customizable</p>
                    <p className="text-sm text-gray-600">
                      Choose difficulty and number of questions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="font-medium text-gray-900">Instant Feedback</p>
                    <p className="text-sm text-gray-600">
                      Get explanations for each answer
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💾</span>
                  <div>
                    <p className="font-medium text-gray-900">Export</p>
                    <p className="text-sm text-gray-600">
                      Download questions as JSON
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <QuizDisplay questions={questions} onReset={handleReset} />
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by Claude AI | Built for Education</p>
        </div>
      </div>
    </div>
  );
}

export default App;
