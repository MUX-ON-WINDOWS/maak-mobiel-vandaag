
import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface TaskItemProps {
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  onToggle: () => void;
}

const TaskItem = ({ title, description, completed, priority, dueDate, onToggle }: TaskItemProps) => {
  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700'
  };

  const priorityLabels = {
    high: 'Hoog',
    medium: 'Gemiddeld',
    low: 'Laag'
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-100 p-4 mb-3 transition-all ${completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <button onClick={onToggle} className="pt-1">
          {completed ? (
            <CheckCircle2 size={20} className="text-green-500" />
          ) : (
            <Circle size={20} className="text-gray-400 hover:text-gray-600 transition-colors" />
          )}
        </button>
        
        <div className="flex-1">
          <h4 className={`font-medium mb-1 ${completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {title}
          </h4>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[priority]}`}>
              {priorityLabels[priority]}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={12} />
              <span>{dueDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
