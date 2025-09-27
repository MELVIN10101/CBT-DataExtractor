import { ProcessResult } from '../types';

interface ResultDisplayProps {
  result: ProcessResult;
  darkMode: boolean;
}

export default function ResultDisplay({ result, darkMode }: ResultDisplayProps) {
  return (
    <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Processing Results
      </h3>
      
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {result.result.comparison.total_questions}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Total Questions
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {result.result.comparison.matched_answers}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Correct Answers
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {result.result.comparison.accuracy_percentage}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Accuracy
            </div>
          </div>
        </div>

        {/* Extracted Questions */}
        <div>
          <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Extracted Questions ({result.result.extracted_questions.length})
          </h4>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {result.result.extracted_questions.map((q, idx) => (
              <div key={idx} className={`p-3 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Q{q.question_number}: {q.question}
                </p>
                <div className="mt-2 space-y-1">
                  {q.options.map((option, optIdx) => (
                    <p key={optIdx} className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {String.fromCharCode(65 + optIdx)}. {option}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Answer Comparison */}
        <div>
          <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Answer Analysis
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {result.result.extracted_answers.map((answer, idx) => (
              <div key={idx} className={`flex justify-between items-center p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Q{answer.question_number}: {answer.selected_answer}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  answer.confidence_score >= 0.8 
                    ? darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
                    : darkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {Math.round(answer.confidence_score * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}