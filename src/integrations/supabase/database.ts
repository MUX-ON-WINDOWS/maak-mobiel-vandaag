import { supabase } from './client';
import type { Database } from './types';

type Project = Database['public']['Tables']['projects']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];
type Activity = Database['public']['Tables']['activities']['Row'];
type Event = Database['public']['Tables']['events']['Row'];

// Project operations
export const projectOperations = {
  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Task operations
export const taskOperations = {
  async create(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getByProjectId(projectId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Activity operations
export const activityOperations = {
  async create(activity: Omit<Activity, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('activities')
      .insert(activity)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getRecent(limit = 10) {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
};

export const eventOperations = {
  async create(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Event>) {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select()
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getByDate(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('events')
      .select()
      .gte('start_time', startOfDay.toISOString())
      .lte('start_time', endOfDay.toISOString())
      .order('start_time', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getByMonth(year: number, month: number) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    const { data, error } = await supabase
      .from('events')
      .select()
      .gte('start_time', startOfMonth.toISOString())
      .lte('start_time', endOfMonth.toISOString())
      .order('start_time', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};

// Add new operations for motivational quotes and task dependencies
export const motivationalQuoteOperations = {
  async getRandom(category?: string) {
    let query = supabase.from('motivational_quotes').select('*');
    
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    if (!data || data.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  }
};

export const taskDependencyOperations = {
  async create(taskId: string, dependsOnTaskId: string) {
    const { data, error } = await supabase
      .from('task_dependencies')
      .insert({ task_id: taskId, depends_on_task_id: dependsOnTaskId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getByTaskId(taskId: string) {
    const { data, error } = await supabase
      .from('task_dependencies')
      .select(`
        *,
        depends_on_task:tasks!task_dependencies_depends_on_task_id_fkey(*)
      `)
      .eq('task_id', taskId);
    
    if (error) throw error;
    return data;
  },

  async delete(taskId: string, dependsOnTaskId: string) {
    const { error } = await supabase
      .from('task_dependencies')
      .delete()
      .eq('task_id', taskId)
      .eq('depends_on_task_id', dependsOnTaskId);
    
    if (error) throw error;
  }
};
