import { Upload, X } from 'lucide-react';
import { UploadedImage } from '../types';

interface ImageUploadProps {
  title: string;
  image: UploadedImage | null;
  onImageUpload: (image: UploadedImage) => void;
  onImageRemove: () => void;
  darkMode: boolean;
}

export default function ImageUpload({ 
  title, 
  image, 
  onImageUpload, 
  onImageRemove, 
  darkMode 
}: ImageUploadProps) {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const preview = URL.createObjectURL(file);
      onImageUpload({ file, preview });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const preview = URL.createObjectURL(file);
      onImageUpload({ file, preview });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-col space-y-4">
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {title}
      </h3>
      
      {!image ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200 hover:border-blue-500 hover:bg-opacity-50
            ${darkMode 
              ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' 
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }
          `}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className={`mx-auto h-12 w-12 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Click to upload or drag and drop
          </p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      ) : (
        <div className="relative">
          <img
            src={image.preview}
            alt={title}
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
          <button
            onClick={onImageRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}