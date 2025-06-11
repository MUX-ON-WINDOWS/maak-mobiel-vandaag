import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { projectOperations, taskOperations, activityOperations } from '@/integrations/supabase/database';
import type { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['projects']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];
type Activity = Database['public']['Tables']['activities']['Row'];

interface ProjectContextType {
  projects: Project[];
  tasks: Task[];
  activities: Activity[];
  loading: boolean;
  error: Error | null;
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [projectsData, tasksData, activitiesData] = await Promise.all([
        projectOperations.getAll(),
        taskOperations.getAll(),
        activityOperations.getRecent()
      ]);
      
      setProjects(projectsData);
      setTasks(tasksData);
      setActivities(activitiesData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newProject = await projectOperations.create(project);
      setProjects(prev => [newProject, ...prev]);
      
      // Log activity
      await activityOperations.create({
        user_id: user!.id,
        action: 'create_project',
        description: `Created project "${project.title}"`
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create project'));
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const updatedProject = await projectOperations.update(id, updates);
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      
      // Log activity
      await activityOperations.create({
        user_id: user!.id,
        action: 'update_project',
        description: `Updated project "${updates.title || 'Untitled'}"`
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update project'));
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectOperations.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      
      // Log activity
      await activityOperations.create({
        user_id: user!.id,
        action: 'delete_project',
        description: 'Deleted a project'
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete project'));
      throw err;
    }
  };

  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTask = await taskOperations.create(task);
      setTasks(prev => [newTask, ...prev]);
      
      // Log activity
      await activityOperations.create({
        user_id: user!.id,
        action: 'create_task',
        description: `Created task "${task.title}"`
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create task'));
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await taskOperations.update(id, updates);
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      
      // Log activity
      await activityOperations.create({
        user_id: user!.id,
        action: 'update_task',
        description: `Updated task "${updates.title || 'Untitled'}"`
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update task'));
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskOperations.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      
      // Log activity
      await activityOperations.create({
        user_id: user!.id,
        action: 'delete_task',
        description: 'Deleted a task'
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete task'));
      throw err;
    }
  };

  const value = {
    projects,
    tasks,
    activities,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    createTask,
    updateTask,
    deleteTask,
    refreshData: loadData
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}; 