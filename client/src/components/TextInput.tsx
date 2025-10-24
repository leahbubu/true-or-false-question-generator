import React, { useState } from 'react';
import { Difficulty } from '../types';

interface TextInputProps {
  onGenerate: (content: string, numberOfQuestions: number, difficulty: Difficulty) => void;
  loading: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ onGenerate, loading }) => {
  const [text, setText] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onGenerate(text, numberOfQuestions, difficulty);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter your text content
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input-field min-h-[200px]"
          placeholder="Paste your text here..."
          required
          disabled={loading}
        />
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

      <button type="submit" className="btn-primary w-full" disabled={loading || !text.trim()}>
        {loading ? 'Generating Questions...' : 'Generate Questions'}
      </button>
    </form>
  );
};

export default TextInput;
