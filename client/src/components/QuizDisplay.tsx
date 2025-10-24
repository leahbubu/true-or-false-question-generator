import React, { useState } from 'react';
import { Question } from '../types';

interface QuizDisplayProps {
  questions: Question[];
  onReset: () => void;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ questions, onReset }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(boolean | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const hasAnswered = userAnswers[currentQuestionIndex] !== null;

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.answer) {
        correct++;
      }
    });
    return correct;
  };

  const exportQuestions = () => {
    const data = questions.map((q, i) => ({
      question: q.question,
      correctAnswer: q.answer ? 'True' : 'False',
      yourAnswer: userAnswers[i] === null ? 'Not answered' : (userAnswers[i] ? 'True' : 'False'),
      explanation: q.explanation
    }));

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz-questions.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="card">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          <div className="text-6xl font-bold text-primary-600 my-4">
            {percentage}%
          </div>
          <p className="text-xl text-gray-600">
            You scored {score} out of {questions.length}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {questions.map((q, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === q.answer;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-lg border-2 ${
                  isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-2xl">
                    {isCorrect ? '✅' : '❌'}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">
                      {index + 1}. {q.question}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Correct Answer:</strong> {q.answer ? 'True' : 'False'}
                      {userAnswer !== null && (
                        <> | <strong>Your Answer:</strong> {userAnswer ? 'True' : 'False'}</>
                      )}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4">
          <button onClick={exportQuestions} className="btn-secondary flex-1">
            Export Questions
          </button>
          <button onClick={onReset} className="btn-primary flex-1">
            Generate New Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <button onClick={exportQuestions} className="text-sm text-primary-600 hover:underline">
            Export All
          </button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <p className="text-xl font-medium text-gray-900 mb-6">
          {currentQuestion.question}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => handleAnswer(true)}
            className={`p-6 rounded-lg border-2 font-semibold text-lg transition-all ${
              userAnswers[currentQuestionIndex] === true
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:border-primary-300'
            }`}
            disabled={hasAnswered && userAnswers[currentQuestionIndex] !== true}
          >
            ✓ True
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className={`p-6 rounded-lg border-2 font-semibold text-lg transition-all ${
              userAnswers[currentQuestionIndex] === false
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:border-primary-300'
            }`}
            disabled={hasAnswered && userAnswers[currentQuestionIndex] !== false}
          >
            ✗ False
          </button>
        </div>

        {hasAnswered && (
          <div
            className={`p-4 rounded-lg ${
              userAnswers[currentQuestionIndex] === currentQuestion.answer
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <p className="font-semibold mb-2">
              {userAnswers[currentQuestionIndex] === currentQuestion.answer
                ? '✅ Correct!'
                : '❌ Incorrect'}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Explanation:</strong> {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="btn-secondary flex-1"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!hasAnswered}
          className="btn-primary flex-1"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestionIndex(index)}
            className={`w-8 h-8 rounded-full text-sm font-semibold ${
              index === currentQuestionIndex
                ? 'bg-primary-600 text-white'
                : userAnswers[index] !== null
                ? 'bg-green-200 text-green-800'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizDisplay;
