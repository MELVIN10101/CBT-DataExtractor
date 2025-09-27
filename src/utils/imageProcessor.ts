import { createWorker } from 'tesseract.js';
import { ProcessResult } from '../types';

interface ExtractedText {
  text: string;
  confidence: number;
}

interface ParsedQuestion {
  question: string;
  options: string[];
  question_number: number;
}

interface ParsedAnswer {
  question_number: number;
  selected_answer: string;
  confidence_score: number;
}

const extractTextFromImage = async (file: File, onProgress?: (progress: number) => void): Promise<ExtractedText> => {
  const worker = await createWorker('eng');
  
  const { data: { text, confidence } } = await worker.recognize(file, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    }
  });
  
  await worker.terminate();
  
  return { text, confidence: confidence / 100 };
};

const parseQuestions = (text: string): ParsedQuestion[] => {
  const questions: ParsedQuestion[] = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let currentQuestion: ParsedQuestion | null = null;
  let questionNumber = 1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if line starts with a question number pattern (1., 2., Q1, etc.)
    const questionMatch = line.match(/^(\d+\.|Q\d+\.?|Question\s*\d+\.?)\s*(.+)/i);
    
    if (questionMatch) {
      // Save previous question if exists
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      
      // Start new question
      currentQuestion = {
        question: questionMatch[2].trim(),
        options: [],
        question_number: questionNumber++
      };
    } else if (currentQuestion) {
      // Check if line looks like an option (A., B., C., D., etc.)
      const optionMatch = line.match(/^([A-D]\.?)\s*(.+)/i);
      if (optionMatch) {
        currentQuestion.options.push(optionMatch[2].trim());
      } else if (line.length > 10 && !line.match(/^\d+$/) && !line.match(/^[A-D]\.?$/)) {
        // If it's a substantial line and not just a number or single letter, treat as part of question
        currentQuestion.question += ' ' + line;
      }
    }
  }
  
  // Add the last question
  if (currentQuestion) {
    questions.push(currentQuestion);
  }
  
  return questions;
};

const parseAnswers = (text: string): ParsedAnswer[] => {
  const answers: ParsedAnswer[] = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  for (const line of lines) {
    // Look for various answer patterns
    const patterns = [
      /(?:Question\s*)?(\d+)[:\.\s]+([A-D])/i,  // "1. A", "Q1: B", "Answer 1: C"
      /(\d+)\s*-\s*([A-D])/i,                   // "1 - A"
      /(\d+)\s*:\s*([A-D])/i,                   // "1: A"
      /Answer\s*(\d+)\s*:\s*([A-D])/i,          // "Answer 1: A"
      /Q(\d+)\s*:\s*([A-D])/i                   // "Q1: A"
    ];
    
    for (const pattern of patterns) {
      const answerMatch = line.match(pattern);
      if (answerMatch) {
        const questionNumber = parseInt(answerMatch[1]);
        const selectedAnswer = answerMatch[2].toUpperCase();
        
        // Avoid duplicates
        if (!answers.find(a => a.question_number === questionNumber)) {
          answers.push({
            question_number: questionNumber,
            selected_answer: selectedAnswer,
            confidence_score: 0.9 // Default confidence for OCR-extracted answers
          });
        }
        break;
      }
    }
  }
  
  return answers;
};

export const processImages = async (
  questionImage: File, 
  answerImage: File, 
  onProgress?: (progress: number, stage: string) => void
): Promise<ProcessResult> => {
  try {
    onProgress?.(10, 'Initializing OCR...');
    
    // Extract text from both images sequentially to show progress
    onProgress?.(20, 'Processing question image...');
    const questionText = await extractTextFromImage(questionImage, (progress) => {
      onProgress?.(20 + Math.round(progress * 0.3), 'Processing question image...');
    });
    
    onProgress?.(50, 'Processing answer image...');
    const answerText = await extractTextFromImage(answerImage, (progress) => {
      onProgress?.(50 + Math.round(progress * 0.3), 'Processing answer image...');
    });
    
    onProgress?.(80, 'Parsing questions and answers...');
    
    // Parse questions and answers
    const extractedQuestions = parseQuestions(questionText.text);
    const extractedAnswers = parseAnswers(answerText.text);
    
    onProgress?.(90, 'Calculating results...');
    
    // Calculate comparison metrics
    const totalQuestions = extractedQuestions.length;
    const matchedAnswers = extractedAnswers.length;
    const accuracyPercentage = totalQuestions > 0 ? (matchedAnswers / totalQuestions) * 100 : 0;
    
    const result: ProcessResult = {
      question_image: questionImage.name,
      answer_image: answerImage.name,
      result: {
        extracted_questions: extractedQuestions,
        extracted_answers: extractedAnswers,
        comparison: {
          total_questions: totalQuestions,
          matched_answers: matchedAnswers,
          accuracy_percentage: Math.round(accuracyPercentage * 100) / 100
        }
      },
      timestamp: new Date().toISOString()
    };

    onProgress?.(100, 'Complete!');
    return result;
  } catch (error) {
    console.error('Error processing images:', error);
    throw new Error('Failed to process images. Please ensure the images are clear and contain readable text.');
  }
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