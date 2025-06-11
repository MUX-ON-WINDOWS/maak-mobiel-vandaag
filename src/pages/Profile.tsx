import React, { useState, useEffect } from 'react';
import { Settings, Bell, HelpCircle, LogOut, ChevronRight, User, Shield, Palette, Edit, Camera, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [userProfile, setUserProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'Product Manager',
    department: 'Digital Innovation'
  });

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setUserProfile({
          full_name: data.full_name || '',
          email: data.email || user.email || '',
          phone: data.phone || '+31 6 1234 5678',
          role: data.role || 'Product Manager',
          department: data.department || 'Digital Innovation'
        });
      } else {
        // Use user data as fallback
        setUserProfile(prev => ({
          ...prev,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || ''
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const updateUserProfile = async (updates: Partial<typeof userProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Fout bij opslaan",
          description: "Er ging iets mis bij het opslaan van je profiel",
          variant: "destructive"
        });
        return;
      }

      setUserProfile(prev => ({ ...prev, ...updates }));
      toast({
        title: "Profiel bijgewerkt",
        description: "Je profiel gegevens zijn succesvol opgeslagen",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Fout bij opslaan",
        description: "Er ging iets mis bij het opslaan van je profiel",
        variant: "destructive"
      });
    }
  };

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

  const handleSaveProfile = async () => {
    await updateUserProfile(userProfile);
    setEditMode(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Uitgelogd",
        description: "Je bent succesvol uitgelogd",
      });
    } catch (error) {
      toast({
        title: "Fout bij uitloggen",
        description: "Er ging iets mis",
        variant: "destructive"
      });
    }
  };

  const handleAvatarClick = () => {
    toast({
      title: "Profielfoto",
      description: "Foto upload functie wordt geladen...",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-4 pb-20 bg-gray-50 min-h-screen">
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div 
            onClick={handleAvatarClick}
            className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="text-2xl font-bold text-white">
              {getInitials(userProfile.full_name || 'User')}
            </span>
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
              value={userProfile.full_name}
              onChange={(e) => setUserProfile(prev => ({ ...prev, full_name: e.target.value }))}
              className="w-full text-center text-xl font-bold border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Volledige naam"
            />
            <input
              type="text"
              value={userProfile.role}
              onChange={(e) => setUserProfile(prev => ({ ...prev, role: e.target.value }))}
              className="w-full text-center text-gray-600 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Functie"
            />
            <input
              type="text"
              value={userProfile.phone}
              onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full text-center text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Telefoonnummer"
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
              <h2 className="text-xl font-bold text-gray-900">{userProfile.full_name || 'Gebruiker'}</h2>
              <button 
                onClick={() => setEditMode(true)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <Edit size={16} className="text-gray-400" />
              </button>
            </div>
            <p className="text-gray-600">{userProfile.role}</p>
            <p className="text-sm text-gray-500">{userProfile.email}</p>
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
              <span className="text-gray-600">{userProfile.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-gray-400" />
              <span className="text-gray-600">{userProfile.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <User size={16} className="text-gray-400" />
              <span className="text-gray-600">{userProfile.department}</span>
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
