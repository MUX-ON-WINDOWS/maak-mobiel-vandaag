
import React, { useState } from 'react';
import { Settings, Bell, HelpCircle, LogOut, ChevronRight, User, Shield, Palette, Edit, Camera, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@company.com',
    phone: '+31 6 1234 5678',
    role: 'Product Manager',
    department: 'Digital Innovation'
  });

  const menuItems = [
    {
      icon: User,
      label: 'Persoonlijke Gegevens',
      description: 'Beheer je accountinformatie',
      action: () => setEditMode(true)
    },
    {
      icon: Bell,
      label: 'Notificaties',
      description: 'Stel je voorkeuren in',
      action: () => toast({ title: "Notificaties", description: "Notificatie instellingen worden geladen..." })
    },
    {
      icon: Shield,
      label: 'Privacy & Beveiliging',
      description: 'Beveiligingsinstellingen',
      action: () => toast({ title: "Beveiliging", description: "Privacy instellingen worden geladen..." })
    },
    {
      icon: Palette,
      label: 'Thema',
      description: 'Pas je interface aan',
      action: () => toast({ title: "Thema", description: "Thema opties worden geladen..." })
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Krijg hulp en feedback',
      action: () => toast({ title: "Support", description: "Support centrum wordt geopend..." })
    }
  ];

  const handleSaveProfile = () => {
    setEditMode(false);
    toast({
      title: "Profiel bijgewerkt",
      description: "Je profiel gegevens zijn succesvol opgeslagen",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Uitloggen",
      description: "Je wordt uitgelogd...",
    });
  };

  const handleAvatarClick = () => {
    toast({
      title: "Profielfoto",
      description: "Foto upload functie wordt geladen...",
    });
  };

  return (
    <div className="p-4 pb-20 bg-gray-50 min-h-screen">
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div 
            onClick={handleAvatarClick}
            className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="text-2xl font-bold text-white">AJ</span>
          </div>
          <button 
            onClick={handleAvatarClick}
            className="absolute bottom-3 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Camera size={14} className="text-gray-600" />
          </button>
        </div>
        
        {editMode ? (
          <div className="space-y-3 max-w-xs mx-auto">
            <input
              type="text"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              className="w-full text-center text-xl font-bold border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={userInfo.role}
              onChange={(e) => setUserInfo({ ...userInfo, role: e.target.value })}
              className="w-full text-center text-gray-600 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              className="w-full text-center text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveProfile}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Opslaan
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors"
              >
                Annuleren
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{userInfo.name}</h2>
              <button 
                onClick={() => setEditMode(true)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <Edit size={16} className="text-gray-400" />
              </button>
            </div>
            <p className="text-gray-600">{userInfo.role}</p>
            <p className="text-sm text-gray-500">{userInfo.email}</p>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Contact Informatie</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gray-400" />
              <span className="text-gray-600">{userInfo.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-gray-400" />
              <span className="text-gray-600">{userInfo.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <User size={16} className="text-gray-400" />
              <span className="text-gray-600">{userInfo.department}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <button 
              onClick={() => toast({ title: "Projecten", description: "Bekijk al je projecten..." })}
              className="hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="text-xl font-bold text-gray-900">12</div>
              <div className="text-xs text-gray-600">Projecten</div>
            </button>
            <button 
              onClick={() => toast({ title: "Taken", description: "Bekijk voltooide taken..." })}
              className="hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="text-xl font-bold text-gray-900">89</div>
              <div className="text-xs text-gray-600">Taken Voltooid</div>
            </button>
            <button 
              onClick={() => toast({ title: "Efficiency", description: "Bekijk productiviteit details..." })}
              className="hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="text-xl font-bold text-gray-900">94%</div>
              <div className="text-xs text-gray-600">Efficiency</div>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.action}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button 
          onClick={() => toast({ title: "Backup", description: "Data backup wordt gestart..." })}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <Shield size={24} className="mx-auto text-blue-600 mb-2" />
            <div className="font-medium text-gray-900 text-sm">Backup Data</div>
          </div>
        </button>
        <button 
          onClick={() => toast({ title: "Export", description: "Data export wordt voorbereid..." })}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <Settings size={24} className="mx-auto text-green-600 mb-2" />
            <div className="font-medium text-gray-900 text-sm">Export Data</div>
          </div>
        </button>
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="w-full bg-red-50 hover:bg-red-100 text-red-600 rounded-xl p-4 flex items-center justify-center gap-2 font-medium transition-colors"
      >
        <LogOut size={20} />
        Uitloggen
      </button>
    </div>
  );
};

export default Profile;
