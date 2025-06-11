
import React from 'react';
import { Settings, Bell, HelpCircle, LogOut, ChevronRight, User, Shield, Palette } from 'lucide-react';

const Profile = () => {
  const menuItems = [
    {
      icon: User,
      label: 'Persoonlijke Gegevens',
      description: 'Beheer je accountinformatie'
    },
    {
      icon: Bell,
      label: 'Notificaties',
      description: 'Stel je voorkeuren in'
    },
    {
      icon: Shield,
      label: 'Privacy & Beveiliging',
      description: 'Beveiligingsinstellingen'
    },
    {
      icon: Palette,
      label: 'Thema',
      description: 'Pas je interface aan'
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Krijg hulp en feedback'
    }
  ];

  return (
    <div className="p-4 pb-20 bg-gray-50 min-h-screen">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">AJ</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Alex Johnson</h2>
        <p className="text-gray-600">Product Manager</p>
        <p className="text-sm text-gray-500">alex.johnson@company.com</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-gray-900">12</div>
              <div className="text-xs text-gray-600">Projecten</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">89</div>
              <div className="text-xs text-gray-600">Taken Voltooid</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">94%</div>
              <div className="text-xs text-gray-600">Efficiency</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                index < menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon size={20} className="text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">{item.label}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          );
        })}
      </div>

      <button className="w-full bg-red-50 hover:bg-red-100 text-red-600 rounded-xl p-4 flex items-center justify-center gap-2 font-medium transition-colors">
        <LogOut size={20} />
        Uitloggen
      </button>
    </div>
  );
};

export default Profile;
