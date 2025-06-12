
import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { analyzeTasksWithAI, AIAnalysisResult, getTaskPriorityColor } from '@/services/aiTaskAnalysis';

interface AIInsightsPanelProps {
  tasks: any[];
  isOpen: boolean;
  onClose: () => void;
}

const AIInsightsPanel = ({ tasks, isOpen, onClose }: AIInsightsPanelProps) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && tasks.length > 0) {
      performAnalysis();
    }
  }, [isOpen, tasks]);

  const performAnalysis = async () => {
    setLoading(true);
    try {
      const result = await analyzeTasksWithAI(tasks);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brain className="text-purple-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">AI Task Insights</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing your tasks...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Overall Insights */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <TrendingUp size={18} />
                  Overall Assessment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-purple-700 mb-1">Workload Capacity</p>
                    <p className={`font-medium ${
                      analysis.overallInsights.workloadCapacity === 'overloaded' ? 'text-red-600' :
                      analysis.overallInsights.workloadCapacity === 'balanced' ? 'text-green-600' :
                      'text-blue-600'
                    }`}>
                      {analysis.overallInsights.workloadCapacity}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-700 mb-1">Urgent Tasks</p>
                    <p className="font-medium text-purple-900">
                      {analysis.overallInsights.upcomingDeadlines.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-green-800 text-center italic">
                  "{analysis.motivationalMessage}"
                </p>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {analysis.overallInsights.recommendations.map((rec, index) => (
                    <li key={index} className="text-blue-800 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Task Analysis */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock size={18} />
                  Individual Task Analysis
                </h3>
                <div className="space-y-3">
                  {analysis.taskAnalysis.map((taskAnalysis) => {
                    const task = tasks.find(t => t.id === taskAnalysis.taskId);
                    if (!task) return null;

                    return (
                      <div key={taskAnalysis.taskId} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${getTaskPriorityColor(taskAnalysis.priorityScore)}`}>
                            Priority: {taskAnalysis.priorityScore}/100
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><span className="font-medium">Deadline Risk:</span> 
                            <span className={`ml-1 ${
                              taskAnalysis.insights.deadlineRisk === 'high' ? 'text-red-600' :
                              taskAnalysis.insights.deadlineRisk === 'medium' ? 'text-orange-600' :
                              'text-green-600'
                            }`}>
                              {taskAnalysis.insights.deadlineRisk}
                            </span>
                          </p>
                          <p><span className="font-medium">Estimated Time:</span> {taskAnalysis.insights.estimatedTimeToComplete}</p>
                          <p><span className="font-medium">Assessment:</span> {taskAnalysis.insights.workloadAssessment}</p>
                        </div>
                        {taskAnalysis.insights.suggestions.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm font-medium text-gray-700 mb-1">Suggestions:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {taskAnalysis.insights.suggestions.map((suggestion, idx) => (
                                <li key={idx} className="flex items-start gap-1">
                                  <span className="text-gray-400">•</span>
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No analysis available</p>
              <button
                onClick={performAnalysis}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Analyze Tasks
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPanel;
