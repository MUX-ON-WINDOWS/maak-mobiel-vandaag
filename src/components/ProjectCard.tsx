
import React from 'react';
import { Calendar, Users, MoreVertical } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  teamSize: number;
  color: string;
}

const ProjectCard = ({ title, description, progress, dueDate, teamSize, color }: ProjectCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
          <MoreVertical size={16} className="text-gray-400" />
        </button>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Voortgang</span>
          <span className="text-xs font-medium text-gray-700">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{dueDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={12} />
          <span>{teamSize} leden</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
