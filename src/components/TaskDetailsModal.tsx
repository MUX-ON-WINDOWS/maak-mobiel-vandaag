import React from 'react';
import { X, Clock, CheckCircle, Calendar, User, Tag, AlertCircle } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TaskDetailsModalProps {
  task: Task;
  isVisible: boolean;
  onClose: () => void;
}

const TaskDetailsModal = ({ task, isVisible, onClose }: TaskDetailsModalProps) => {
  if (!isVisible) return null;

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-orange-600 bg-orange-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (completed: boolean) => {
    return completed ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h3>
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.completed)}`}>
              {task.completed ? 'Voltooid' : 'Open'}
            </span>
            {task.priority && (
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority} prioriteit
              </span>
            )}
          </div>
        </div>

        {task.description && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Beschrijving</h4>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">{task.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className="text-gray-400" />
            <span>Deadline: {new Date(task.due_date).toLocaleDateString('nl-NL', { 
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</span>
          </div>
          {task.estimated_hours && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} className="text-gray-400" />
              <span>Geschatte tijd: {task.estimated_hours} uur</span>
            </div>
          )}
          {task.project_id && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Tag size={16} className="text-gray-400" />
              <span>Project ID: {task.project_id}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Sluiten
          </button>
          {!task.completed && (
            <button
              onClick={() => {
                // Handle task completion
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              Markeer als voltooid
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal; 