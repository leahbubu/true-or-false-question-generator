import React from 'react';
import { InputType } from '../types';

interface InputSelectorProps {
  selectedType: InputType;
  onTypeChange: (type: InputType) => void;
}

const InputSelector: React.FC<InputSelectorProps> = ({ selectedType, onTypeChange }) => {
  const inputTypes: { type: InputType; label: string; icon: string; description: string }[] = [
    {
      type: 'text',
      label: 'Text',
      icon: '📝',
      description: 'Paste your text content'
    },
    {
      type: 'url',
      label: 'URL',
      icon: '🌐',
      description: 'Extract from web page'
    },
    {
      type: 'pdf',
      label: 'PDF',
      icon: '📄',
      description: 'Upload a PDF file'
    },
    {
      type: 'youtube',
      label: 'YouTube',
      icon: '🎥',
      description: 'Use video transcript'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {inputTypes.map(({ type, label, icon, description }) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedType === type
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-primary-300'
          }`}
        >
          <div className="text-3xl mb-2">{icon}</div>
          <div className="font-semibold text-gray-900">{label}</div>
          <div className="text-xs text-gray-500 mt-1">{description}</div>
        </button>
      ))}
    </div>
  );
};

export default InputSelector;
