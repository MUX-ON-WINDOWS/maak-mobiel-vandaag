
import React from 'react';
import { BarChart3, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import ProjectCard from '../components/ProjectCard';

const Dashboard = () => {
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

  return (
    <div className="p-4 pb-20 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Goedemorgen, Alex!</h2>
        <p className="text-gray-600">Hier is je projectoverzicht voor vandaag</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recente Projecten</h3>
          <button className="text-blue-600 text-sm font-medium">Alles bekijken</button>
        </div>

        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
