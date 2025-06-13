import { supabase } from './client';
import type { Database } from './types';

type Task = Database['public']['Tables']['tasks']['Row'];

export async function analyzeTasksWithAI(tasks: Task[]) {
  try {
    const { data, error } = await supabase.functions.invoke('ai-task-analysis', {
      body: { tasks },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('AI analysis error:', error);
    throw error;
  }
} 