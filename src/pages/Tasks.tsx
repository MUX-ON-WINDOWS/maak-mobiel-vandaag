
import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import TaskItem from '../components/TaskItem';

const Tasks = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Design wireframes voltooien',
      description: 'Creëer wireframes voor de nieuwe landing page',
      completed: false,
      priority: 'high' as const,
      dueDate: 'Vandaag'
    },
    {
      id: 2,
      title: 'API documentatie bijwerken',
      description: 'Update de REST API documentatie met nieuwe endpoints',
      completed: true,
      priority: 'medium' as const,
      dueDate: 'Gisteren'
    },
    {
      id: 3,
      title: 'User testing sessie plannen',
      description: 'Organiseer usability testing met 5 gebruikers',
      completed: false,
      priority: 'medium' as const,
      dueDate: 'Morgen'
    },
    {
      id: 4,
      title: 'Database backup configureren',
      description: 'Automatische dagelijkse backups instellen',
      completed: false,
      priority: 'high' as const,
      dueDate: '12 Dec'
    },
    {
      id: 5,
      title: 'Team meeting voorbereiden',
      description: 'Agenda en presentatie klaarmaken voor weekly standup',
      completed: false,
      priority: 'low' as const,
      dueDate: 'Vrijdag'
    }
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="p-4 pb-20 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Mijn Taken</h2>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Voortgang vandaag</p>
              <p className="text-lg font-semibold text-gray-900">
                {completedCount} van {totalCount} voltooid
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((completedCount / totalCount) * 100)}%
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Alle Taken</h3>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Filter size={20} className="text-gray-600" />
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors flex items-center gap-1">
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            title={task.title}
            description={task.description}
            completed={task.completed}
            priority={task.priority}
            dueDate={task.dueDate}
            onToggle={() => toggleTask(task.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Tasks;
