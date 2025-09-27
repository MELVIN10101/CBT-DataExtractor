export interface ProcessResult {
  question_image: string;
  answer_image: string;
  result: {
    extracted_questions: Array<{
      question: string;
      options: string[];
      question_number: number;
    }>;
    extracted_answers: Array<{
      question_number: number;
      selected_answer: string;
      confidence_score: number;
    }>;
    comparison: {
      total_questions: number;
      matched_answers: number;
      accuracy_percentage: number;
    };
  };
  timestamp: string;
}

export interface UploadedImage {
  file: File;
  preview: string;
}