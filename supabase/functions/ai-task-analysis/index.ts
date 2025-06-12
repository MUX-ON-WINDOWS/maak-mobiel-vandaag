
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { tasks, userProfile } = await req.json()
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are an AI task management assistant. Analyze the provided tasks and return insights in JSON format with the following structure:
            {
              "taskAnalysis": [
                {
                  "taskId": "task-uuid",
                  "priorityScore": 1-100,
                  "insights": {
                    "deadlineRisk": "low|medium|high",
                    "workloadAssessment": "string",
                    "suggestions": ["array of suggestions"],
                    "estimatedTimeToComplete": "string"
                  }
                }
              ],
              "overallInsights": {
                "workloadCapacity": "underloaded|balanced|overloaded",
                "upcomingDeadlines": ["array of urgent tasks"],
                "recommendations": ["array of recommendations"]
              },
              "motivationalMessage": "encouraging message based on progress"
            }`
          },
          {
            role: 'user',
            content: `Analyze these tasks: ${JSON.stringify(tasks)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    const data = await response.json()
    const aiInsights = JSON.parse(data.choices[0].message.content)

    return new Response(
      JSON.stringify(aiInsights),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error in AI task analysis:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
