
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileHeader from '../components/MobileHeader';
import BottomNavigation from '../components/BottomNavigation';
import Dashboard from './Dashboard';
import Tasks from './Tasks';
import Calendar from './Calendar';
import Profile from './Profile';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">PM</span>
          </div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'tasks': return 'Taken';
      case 'calendar': return 'Agenda';
      case 'profile': return 'Profiel';
      default: return 'Dashboard';
    }
  };

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'tasks': return <Tasks />;
      case 'calendar': return <Calendar />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative">
      <MobileHeader 
        title={getPageTitle()} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      <main className="flex-1 overflow-y-auto">
        {renderCurrentPage()}
      </main>
      
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setSidebarOpen(false)}
        >
          <div 
            className="bg-white w-80 h-full shadow-xl animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-lg font-bold text-white">PM</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Project Manager</h3>
                  <p className="text-sm text-gray-600">v2.1.0</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900">Mijn Werkruimte</div>
                  <div className="text-sm text-gray-600">Persoonlijke projecten</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900">Team Projecten</div>
                  <div className="text-sm text-gray-600">Gedeelde werkruimte</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900">Rapporten</div>
                  <div className="text-sm text-gray-600">Analytics & insights</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900">Instellingen</div>
                  <div className="text-sm text-gray-600">App configuratie</div>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
