import { ProcessResult } from '../types';

export const processImages = async (questionImage: File, answerImage: File): Promise<ProcessResult> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock processing results
  const mockQuestions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      question_number: 1
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      question_number: 2
    },
    {
      question: "What is 15 + 27?",
      options: ["41", "42", "43", "44"],
      question_number: 3
    }
  ];

  const mockAnswers = [
    {
      question_number: 1,
      selected_answer: "C",
      confidence_score: 0.95
    },
    {
      question_number: 2,
      selected_answer: "B", 
      confidence_score: 0.87
    },
    {
      question_number: 3,
      selected_answer: "B",
      confidence_score: 0.92
    }
  ];

  const result: ProcessResult = {
    question_image: questionImage.name,
    answer_image: answerImage.name,
    result: {
      extracted_questions: mockQuestions,
      extracted_answers: mockAnswers,
      comparison: {
        total_questions: mockQuestions.length,
        matched_answers: 3,
        accuracy_percentage: 100
      }
    },
    timestamp: new Date().toISOString()
  };

  return result;
};

export const downloadResult = (result: ProcessResult) => {
  const dataStr = JSON.stringify(result, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `mcq-analysis-${new Date().getTime()}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};