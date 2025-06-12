
import { supabase } from '@/integrations/supabase/client';

export interface MotivationalQuote {
  id: string;
  quote: string;
  author: string | null;
  category: string | null;
}

export const getRandomMotivationalQuote = async (category?: string): Promise<MotivationalQuote | null> => {
  let query = supabase
    .from('motivational_quotes')
    .select('*');

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    console.error('Error fetching quotes:', error);
    return null;
  }

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
};

export const celebrateTaskCompletion = async (): Promise<MotivationalQuote | null> => {
  return getRandomMotivationalQuote('completion');
};
