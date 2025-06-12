
-- Add new columns to tasks table for enhanced functionality (without the problematic computed column)
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS effort_estimate TEXT DEFAULT 'medium' CHECK (effort_estimate IN ('small', 'medium', 'large')),
ADD COLUMN IF NOT EXISTS estimated_hours INTEGER,
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS recurrence_pattern TEXT,
ADD COLUMN IF NOT EXISTS parent_task_id UUID REFERENCES public.tasks(id),
ADD COLUMN IF NOT EXISTS last_ai_analysis TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS ai_priority_score INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS ai_insights JSONB DEFAULT '{}';

-- Add new columns to projects table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS estimated_completion_date DATE,
ADD COLUMN IF NOT EXISTS ai_health_score INTEGER DEFAULT 75;

-- Create task dependencies table
CREATE TABLE IF NOT EXISTS public.task_dependencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  depends_on_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(task_id, depends_on_task_id)
);

-- Create motivational quotes table
CREATE TABLE IF NOT EXISTS public.motivational_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert some default motivational quotes
INSERT INTO public.motivational_quotes (quote, author, category) VALUES
('Great job! Every task completed is a step closer to your goals.', 'Task Master', 'completion'),
('Progress, not perfection. You''re doing amazing!', 'Productivity Pro', 'completion'),
('Another task done! Your future self will thank you.', 'Motivation Bot', 'completion'),
('Consistency is key, and you''re showing up every day!', 'Success Coach', 'completion'),
('Small steps lead to big achievements. Keep going!', 'Goal Guru', 'completion'),
('You''re building momentum with each completed task!', 'Achievement Ace', 'completion');

-- Enable RLS for new tables
ALTER TABLE public.task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motivational_quotes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for task_dependencies
CREATE POLICY "Users can view their task dependencies" 
  ON public.task_dependencies 
  FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_dependencies.task_id AND tasks.user_id = auth.uid()));

CREATE POLICY "Users can create their task dependencies" 
  ON public.task_dependencies 
  FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_dependencies.task_id AND tasks.user_id = auth.uid()));

CREATE POLICY "Users can delete their task dependencies" 
  ON public.task_dependencies 
  FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_dependencies.task_id AND tasks.user_id = auth.uid()));

-- Create RLS policies for motivational_quotes (public read access)
CREATE POLICY "Anyone can view motivational quotes" 
  ON public.motivational_quotes 
  FOR SELECT 
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_ai_priority_score ON public.tasks(ai_priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_effort_estimate ON public.tasks(effort_estimate);
CREATE INDEX IF NOT EXISTS idx_tasks_parent_task_id ON public.tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_task_dependencies_task_id ON public.task_dependencies(task_id);

-- Create a function to calculate task age in days
CREATE OR REPLACE FUNCTION get_task_age_days(task_created_at TIMESTAMP WITH TIME ZONE)
RETURNS INTEGER AS $$
BEGIN
  RETURN EXTRACT(days FROM (now() - task_created_at))::INTEGER;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
