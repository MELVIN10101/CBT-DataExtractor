import { useState, useEffect } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import ResultDisplay from './components/ResultDisplay';
import ThemeToggle from './components/ThemeToggle';
import { processImages, downloadResult } from './utils/imageProcessor';
import { UploadedImage, ProcessResult } from './types';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [questionImage, setQuestionImage] = useState<UploadedImage | null>(null);
  const [answerImage, setAnswerImage] = useState<UploadedImage | null>(null);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize theme based on system preference
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleProcess = async () => {
    if (!questionImage || !answerImage) return;
    
    setIsProcessing(true);
    try {
      const processResult = await processImages(questionImage.file, answerImage.file);
      setResult(processResult);
    } catch (error) {
      console.error('Processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadResult(result);
    }
  };

  const canProcess = questionImage && answerImage && !isProcessing;
  const hasResult = result && !isProcessing;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <FileText className={`h-8 w-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              MCQ Image Processor
            </h1>
          </div>
          <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
        </div>

        {/* Upload Section */}
        <div className={`rounded-xl p-6 mb-8 shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Upload Images
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ImageUpload
              title="MCQ Questions Image"
              image={questionImage}
              onImageUpload={setQuestionImage}
              onImageRemove={() => setQuestionImage(null)}
              darkMode={darkMode}
            />
            
            <ImageUpload
              title="Answer Sheet Image"
              image={answerImage}
              onImageUpload={setAnswerImage}
              onImageRemove={() => setAnswerImage(null)}
              darkMode={darkMode}
            />
          </div>

          {/* Process Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleProcess}
              disabled={!canProcess}
              className={`
                flex items-center space-x-2 px-8 py-3 rounded-lg font-medium
                transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${canProcess
                  ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
                ${darkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}
              `}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Process Images</span>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {hasResult && (
          <div className="space-y-6">
            <ResultDisplay result={result} darkMode={darkMode} />
            
            {/* Download Button */}
            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-lg font-medium
                  transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${darkMode 
                    ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 focus:ring-offset-gray-900'
                    : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 focus:ring-offset-white'
                  }
                `}
              >
                <Download className="h-5 w-5" />
                <span>Download Result</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;