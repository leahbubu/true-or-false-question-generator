import React, { useState } from 'react';
import { Difficulty } from '../types';

interface PdfInputProps {
  onGenerate: (file: File, numberOfQuestions: number, difficulty: Difficulty) => void;
  loading: boolean;
}

const PdfInput: React.FC<PdfInputProps> = ({ onGenerate, loading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onGenerate(file, numberOfQuestions, difficulty);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload PDF File
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload"
            disabled={loading}
          />
          <label htmlFor="pdf-upload" className="cursor-pointer">
            {file ? (
              <div>
                <div className="text-4xl mb-2">📄</div>
                <div className="font-medium text-gray-900">{file.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(2)} KB
                </div>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-2">📤</div>
                <div className="font-medium text-gray-900">Click to upload PDF</div>
                <div className="text-sm text-gray-500 mt-1">or drag and drop</div>
              </div>
            )}
          </label>
        </div>
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

      <button type="submit" className="btn-primary w-full" disabled={loading || !file}>
        {loading ? 'Processing PDF...' : 'Generate Questions'}
      </button>
    </form>
  );
};

export default PdfInput;
