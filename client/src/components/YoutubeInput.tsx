import React, { useState } from 'react';
import { Difficulty } from '../types';

interface YoutubeInputProps {
  onGenerate: (url: string, numberOfQuestions: number, difficulty: Difficulty) => void;
  loading: boolean;
}

const YoutubeInput: React.FC<YoutubeInputProps> = ({ onGenerate, loading }) => {
  const [url, setUrl] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onGenerate(url, numberOfQuestions, difficulty);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          YouTube Video URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input-field"
          placeholder="https://www.youtube.com/watch?v=..."
          required
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Note: Only videos with available transcripts can be processed
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Questions
          </label>
          <input
            type="number"
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
            min="1"
            max="20"
            className="input-field"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="input-field"
            disabled={loading}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn-primary w-full" disabled={loading || !url.trim()}>
        {loading ? 'Fetching Transcript...' : 'Generate Questions'}
      </button>
    </form>
  );
};

export default YoutubeInput;
