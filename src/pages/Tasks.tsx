import React, { useState } from 'react';
import { Plus, Filter, Search, Calendar, Clock, Brain, Sparkles } from 'lucide-react';
import TaskItem from '../components/TaskItem';
import EnhancedTaskForm from '../components/EnhancedTaskForm';
import TaskCelebration from '../components/TaskCelebration';
import AIInsightsPanel from '../components/AIInsightsPanel';
import { useToast } from '@/hooks/use-toast';
import { useProjects } from '@/contexts/ProjectContext';
import { useAuth } from '@/contexts/AuthContext';
import { calculateTaskAge } from '@/services/aiTaskAnalysis';
import type { Database } from '@/integrations/supabase/types';

type Task = Database['public']['Tables']['tasks']['Row'];

const Tasks = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedTask, setCelebratedTask] = useState('');
  const [showAIInsights, setShowAIInsights] = useState(false);

  const toggleTask = async (task: Task) => {
    try {
      const newCompletedState = !task.completed;
      await updateTask(task.id, { completed: newCompletedState });
      
      if (newCompletedState) {
        setCelebratedTask(task.title);
        setShowCelebration(true);
      }
      
      toast({
        title: newCompletedState ? "Taak voltooid" : "Taak heropend",
        description: `"${task.title}" is ${newCompletedState ? 'voltooid' : 'heropend'}`,
      });
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het bijwerken van de taak",
        variant: "destructive"
      });
    }
  };

  const handleAddTask = async (taskData: any) => {
    if (!user) return;
    
    try {
      await createTask({
        user_id: user.id,
        project_id: null,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        due_date: taskData.due_date || null,
        effort_estimate: taskData.effort_estimate,
        estimated_hours: taskData.estimated_hours ? parseInt(taskData.estimated_hours) : null,
        is_recurring: taskData.is_recurring,
        recurrence_pattern: taskData.recurrence_pattern || null,
        completed: false
      });

      setShowAddForm(false);
      
      toast({
        title: "Taak toegevoegd",
        description: `"${taskData.title}" is toegevoegd aan je takenlijst`,
      });
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het toevoegen van de taak",
        variant: "destructive"
      });
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesFilter;
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  if (loading) {
    return (
      <div className="p-4 pb-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">PM</span>
          </div>
          <p className="text-gray-600">Taken laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pb-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Er is een fout opgetreden bij het laden van de taken</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 bg-gray-50 min-h-screen">
      {/* Progress Overview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900">Mijn Taken</h2>
          <button
            onClick={() => setShowAIInsights(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors flex items-center gap-1"
          >
            <Brain size={16} />
            <span className="text-sm">AI Insights</span>
          </button>
        </div>
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
                {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
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
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors flex items-center gap-1"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Enhanced Add Task Form */}
      {showAddForm && (
        <div className="mb-4">
          <EnhancedTaskForm
            onSubmit={handleAddTask}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div>
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            title={task.title}
            description={task.description || ''}
            completed={task.completed}
            priority={task.priority}
            dueDate={task.due_date || 'Geen deadline'}
            onToggle={() => toggleTask(task)}
            effortEstimate={task.effort_estimate}
            estimatedHours={task.estimated_hours}
            taskAge={calculateTaskAge(task.created_at)}
            aiPriorityScore={task.ai_priority_score}
          />
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-8">
            <Clock size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Geen taken gevonden</p>
          </div>
        )}
      </div>

      {/* Task Celebration Modal */}
      <TaskCelebration
        taskTitle={celebratedTask}
        isVisible={showCelebration}
        onClose={() => setShowCelebration(false)}
      />

      {/* AI Insights Panel */}
      <AIInsightsPanel
        tasks={tasks}
        isOpen={showAIInsights}
        onClose={() => setShowAIInsights(false)}
      />
    </div>
  );
};

export default Tasks;
