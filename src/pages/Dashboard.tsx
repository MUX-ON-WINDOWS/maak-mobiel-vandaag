
import React from 'react';
import { BarChart3, CheckCircle, Clock, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import ProjectCard from '../components/ProjectCard';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { toast } = useToast();

  const stats = [
    {
      title: 'Actieve Projecten',
      value: '12',
      icon: BarChart3,
      color: 'bg-blue-500',
      trend: '+2 deze week'
    },
    {
      title: 'Voltooide Taken',
      value: '89',
      icon: CheckCircle,
      color: 'bg-green-500',
      trend: '+12 vandaag'
    },
    {
      title: 'Lopende Taken',
      value: '24',
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      title: 'Team Productiviteit',
      value: '94%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: '+5%'
    }
  ];

  const projects = [
    {
      title: 'Website Redesign',
      description: 'Modernisering van de bedrijfswebsite met nieuwe UX/UI',
      progress: 75,
      dueDate: '15 Dec',
      teamSize: 5,
      color: 'bg-blue-500'
    },
    {
      title: 'Mobile App',
      description: 'Ontwikkeling van native iOS en Android applicatie',
      progress: 45,
      dueDate: '28 Dec',
      teamSize: 8,
      color: 'bg-green-500'
    },
    {
      title: 'Database Migratie',
      description: 'Overgang naar nieuwe database infrastructuur',
      progress: 90,
      dueDate: '10 Dec',
      teamSize: 3,
      color: 'bg-purple-500'
    }
  ];

  const recentActivities = [
    { action: 'Task voltooid', description: 'UI Design voor login pagina', time: '2 min geleden' },
    { action: 'Nieuw project', description: 'E-commerce platform gestart', time: '1 uur geleden' },
    { action: 'Team update', description: 'Sarah heeft zich aangesloten bij Mobile App', time: '3 uur geleden' },
    { action: 'Deadline update', description: 'Website Redesign deadline verschoven', time: '1 dag geleden' }
  ];

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

  return (
    <div className="p-4 pb-20 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Goedemorgen, Alex!</h2>
        <p className="text-gray-600">Hier is je projectoverzicht voor vandaag</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
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

        {projects.map((project, index) => (
          <div key={index} onClick={() => handleProjectClick(project.title)} className="cursor-pointer">
            <ProjectCard {...project} />
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recente Activiteit</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {recentActivities.map((activity, index) => (
            <div key={index} className={`p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${index < recentActivities.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{activity.action}</div>
                <div className="text-sm text-gray-600">{activity.description}</div>
              </div>
              <div className="text-xs text-gray-500">{activity.time}</div>
            </div>
          ))}
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
  );
};

export default Dashboard;
