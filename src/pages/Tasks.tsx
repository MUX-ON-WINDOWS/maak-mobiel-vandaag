
import React, { useState } from 'react';
import { Plus, Filter, Search, Calendar, Clock } from 'lucide-react';
import TaskItem from '../components/TaskItem';
import { useToast } from '@/hooks/use-toast';

const Tasks = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: ''
  });

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
    
    const task = tasks.find(t => t.id === id);
    toast({
      title: task?.completed ? "Taak heropend" : "Taak voltooid",
      description: `"${task?.title}" is ${task?.completed ? 'heropend' : 'voltooid'}`,
    });
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Fout",
        description: "Voer een taak titel in",
        variant: "destructive"
      });
      return;
    }

    const task = {
      id: Math.max(...tasks.map(t => t.id)) + 1,
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      dueDate: newTask.dueDate || 'Geen deadline'
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    setShowAddForm(false);
    
    toast({
      title: "Taak toegevoegd",
      description: `"${task.title}" is toegevoegd aan je takenlijst`,
    });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesFilter;
  });

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

      {/* Search and Filter */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Zoek taken..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Alle prioriteiten</option>
            <option value="high">Hoge prioriteit</option>
            <option value="medium">Gemiddelde prioriteit</option>
            <option value="low">Lage prioriteit</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Alle Taken ({filteredTasks.length})
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => toast({ title: "Filter", description: "Filter opties worden geladen..." })}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Filter size={20} className="text-gray-600" />
          </button>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors flex items-center gap-1"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">Nieuwe Taak</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Taak titel..."
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Beschrijving..."
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'high' | 'medium' | 'low' })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Lage prioriteit</option>
                <option value="medium">Gemiddelde prioriteit</option>
                <option value="high">Hoge prioriteit</option>
              </select>
              <input
                type="text"
                placeholder="Deadline"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddTask}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Toevoegen
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        {filteredTasks.map((task) => (
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
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-8">
            <Clock size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Geen taken gevonden</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
