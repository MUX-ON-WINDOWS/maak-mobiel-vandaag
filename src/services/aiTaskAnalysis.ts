
import { supabase } from '@/integrations/supabase/client';

export interface TaskAnalysis {
  taskId: string;
  priorityScore: number;
  insights: {
    deadlineRisk: 'low' | 'medium' | 'high';
    workloadAssessment: string;
    suggestions: string[];
    estimatedTimeToComplete: string;
  };
}

export interface AIAnalysisResult {
  taskAnalysis: TaskAnalysis[];
  overallInsights: {
    workloadCapacity: 'underloaded' | 'balanced' | 'overloaded';
    upcomingDeadlines: string[];
    recommendations: string[];
  };
  motivationalMessage: string;
}

export const analyzeTasksWithAI = async (tasks: any[]): Promise<AIAnalysisResult> => {
  const { data, error } = await supabase.functions.invoke('ai-task-analysis', {
    body: { tasks }
  });

  if (error) {
    console.error('AI analysis error:', error);
    throw error;
  }

  return data;
};

export const calculateTaskAge = (createdAt: string): number => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getTaskPriorityColor = (priorityScore: number): string => {
  if (priorityScore >= 80) return 'text-red-600 bg-red-50';
  if (priorityScore >= 60) return 'text-orange-600 bg-orange-50';
  if (priorityScore >= 40) return 'text-yellow-600 bg-yellow-50';
  return 'text-green-600 bg-green-50';
};
