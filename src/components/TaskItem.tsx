
import React from 'react';
import { CheckCircle2, Circle, Clock, Zap, Calendar, Brain } from 'lucide-react';

interface TaskItemProps {
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  onToggle: () => void;
  effortEstimate?: string;
  estimatedHours?: number;
  taskAge?: number;
  aiPriorityScore?: number;
}

const TaskItem = ({ 
  title, 
  description, 
  completed, 
  priority, 
  dueDate, 
  onToggle,
  effortEstimate,
  estimatedHours,
  taskAge,
  aiPriorityScore
}: TaskItemProps) => {
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

  const effortLabels = {
    small: 'Klein',
    medium: 'Gemiddeld', 
    large: 'Groot'
  };

  const getAIPriorityColor = (score?: number) => {
    if (!score) return '';
    if (score >= 80) return 'text-red-600 bg-red-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const isOverdue = dueDate && dueDate !== 'Geen deadline' && new Date(dueDate) < new Date() && !completed;

  return (
    <div className={`bg-white rounded-lg border border-gray-100 p-4 mb-3 transition-all ${completed ? 'opacity-60' : ''} ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
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
          
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[priority]}`}>
              {priorityLabels[priority]}
            </span>
            
            {effortEstimate && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                <Zap size={10} />
                {effortLabels[effortEstimate as keyof typeof effortLabels]}
              </span>
            )}
            
            {estimatedHours && (
              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                {estimatedHours}h
              </span>
            )}

            {aiPriorityScore && (
              <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getAIPriorityColor(aiPriorityScore)}`}>
                <Brain size={10} />
                AI: {aiPriorityScore}
              </span>
            )}
            
            <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
              <Clock size={12} />
              <span>{dueDate}</span>
            </div>

            {taskAge && taskAge > 7 && (
              <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                {taskAge} dagen oud
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
