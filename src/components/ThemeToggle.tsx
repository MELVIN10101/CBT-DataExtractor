import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ darkMode, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        relative inline-flex h-10 w-20 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${darkMode ? 'bg-blue-600 focus:ring-offset-gray-800' : 'bg-gray-200 focus:ring-offset-white'}
      `}
      role="switch"
      aria-checked={darkMode}
    >
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-flex h-9 w-9 transform rounded-full shadow-lg ring-0 
          transition duration-200 ease-in-out items-center justify-center
          ${darkMode ? 'translate-x-9 bg-gray-800' : 'translate-x-0 bg-white'}
        `}
      >
        {darkMode ? (
          <Moon className="h-4 w-4 text-blue-400" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-500" />
        )}
      </span>
    </button>
  );
}