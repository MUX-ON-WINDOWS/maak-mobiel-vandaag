
import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MobileHeaderProps {
  title: string;
  onMenuClick: () => void;
}

const MobileHeader = ({ title, onMenuClick }: MobileHeaderProps) => {
  const { toast } = useToast();

  const handleSearchClick = () => {
    toast({
      title: "Zoekfunctie",
      description: "Zoeken wordt geopend...",
    });
  };

  const handleNotificationClick = () => {
    toast({
      title: "Notificaties",
      description: "Je hebt 3 nieuwe notificaties",
    });
  };

  return (
    <header className="sticky top-0 bg-white shadow-sm border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={handleSearchClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Search size={20} className="text-gray-600" />
        </button>
        <button 
          onClick={handleNotificationClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
        >
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default MobileHeader;
