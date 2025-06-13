import React from 'react';
import { BarChart3, CheckCircle, Clock, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import ProjectCard from '../components/ProjectCard';
import { useToast } from '@/hooks/use-toast';
import { useProjects } from '@/contexts/ProjectContext';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { projects, tasks, activities, loading } = useProjects();

  // Calculate statistics
  const activeProjects = projects.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const productivity = tasks.length > 0 
    ? Math.round((completedTasks / tasks.length) * 100) 
    : 0;

  const stats = [
    {
      title: 'Actieve Projecten',
      value: activeProjects.toString(),
      icon: BarChart3,
      color: 'bg-blue-500',
      trend: `+${projects.filter(p => new Date(p.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length} deze week`
    },
    {
      title: 'Voltooide Taken',
      value: completedTasks.toString(),
      icon: CheckCircle,
      color: 'bg-green-500',
      trend: `+${tasks.filter(t => t.completed && new Date(t.updated_at).getTime() > Date.now() - 24 * 60 * 60 * 1000).length} vandaag`
    },
    {
      title: 'Lopende Taken',
      value: pendingTasks.toString(),
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      title: 'Team Productiviteit',
      value: `${productivity}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: productivity > 0 ? `+${productivity}%` : undefined
    }
  ];

  // Format recent activities
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - activityDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'net geleden';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min geleden`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} uur geleden`;
    return `${Math.floor(diffInSeconds / 86400)} dag geleden`;
  };

  const recentActivities = activities.map(activity => ({
    action: activity.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: activity.description,
    time: formatTimeAgo(activity.created_at)
  }));

  const handleStatClick = (title: string) => {
    toast({
      title: "Statistiek bekeken",
      description: `Je hebt ${title} statistieken geopend`,
    });
  };

  const handleProjectClick = (title: string) => {
    toast({
      title: "Project geopend",
      description: `${title} project details worden geladen...`,
    });
  };

  const handleNewProject = () => {
    toast({
      title: "Nieuw Project",
      description: "Project aanmaak wizard wordt geopend...",
    });
  };

  const handleViewAll = () => {
    toast({
      title: "Alle Projecten",
      description: "Navigeren naar volledig projectoverzicht...",
    });
  };

  if (loading) {
    return (
      <div className="p-4 pb-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">PM</span>
          </div>
          <p className="text-gray-600">Dashboard laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Goedemorgen, {user?.user_metadata?.full_name || 'Gebruiker'}!</h2>
        <p className="text-gray-600">Hier is je projectoverzicht voor vandaag</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} onClick={() => handleStatClick(stat.title)} className="cursor-pointer">
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recente Projecten</h3>
          <div className="flex gap-2">
            <button 
              onClick={handleNewProject}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
            </button>
            <button 
              onClick={handleViewAll}
              className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
            >
              Alles bekijken
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.slice(0, 3).map((project) => (
            <div key={project.id} onClick={() => handleProjectClick(project.title)} className="cursor-pointer">
              <ProjectCard
                title={project.title}
                description={project.description || ''}
                progress={project.progress}
                dueDate={new Date(project.due_date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                teamSize={project.team_size}
                color={`bg-${project.color}-500`}
              />
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500">Nog geen projecten</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recente Activiteit</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {recentActivities.slice(0, 4).map((activity, index) => (
              <div key={index} className={`p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${index < recentActivities.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{activity.action}</div>
                  <div className="text-sm text-gray-600">{activity.description}</div>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            ))}

            {recentActivities.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                Nog geen activiteiten
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <h4 className="font-semibold mb-2">Tip van de dag</h4>
          <p className="text-sm mb-3">Gebruik labels en filters om je taken beter te organiseren en je productiviteit te verhogen.</p>
          <button 
            onClick={() => toast({ title: "Tip gelezen", description: "Meer tips binnenkort beschikbaar!" })}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
          >
            Meer tips <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
