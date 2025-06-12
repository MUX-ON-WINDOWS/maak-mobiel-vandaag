
import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles, X } from 'lucide-react';
import { celebrateTaskCompletion, MotivationalQuote } from '@/services/motivationalQuotes';

interface TaskCelebrationProps {
  taskTitle: string;
  isVisible: boolean;
  onClose: () => void;
}

const TaskCelebration = ({ taskTitle, isVisible, onClose }: TaskCelebrationProps) => {
  const [quote, setQuote] = useState<MotivationalQuote | null>(null);

  useEffect(() => {
    if (isVisible) {
      celebrateTaskCompletion().then(setQuote);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 text-center relative animate-bounce">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <Sparkles className="text-yellow-500 mx-auto mb-2" size={24} />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Geweldig! 🎉
        </h3>
        
        <p className="text-gray-600 mb-4">
          Je hebt "{taskTitle}" voltooid!
        </p>

        {quote && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-blue-800 italic mb-2">"{quote.quote}"</p>
            {quote.author && (
              <p className="text-blue-600 text-sm">- {quote.author}</p>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Doorgaan
        </button>
      </div>
    </div>
  );
};

export default TaskCelebration;
