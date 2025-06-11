
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Calendar = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '',
    location: '',
    attendees: ''
  });

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
  
  const [events, setEvents] = useState([
    {
      id: 1,
      time: '09:00',
      title: 'Team Standup',
      description: 'Dagelijkse team meeting',
      location: 'Vergaderruimte A',
      attendees: 5,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      time: '11:30',
      title: 'Client Meeting',
      description: 'Project update presentatie',
      location: 'Online - Zoom',
      attendees: 3,
      color: 'bg-green-500'
    },
    {
      id: 3,
      time: '14:00',
      title: 'Design Review',
      description: 'UI/UX feedback sessie',
      location: 'Design Studio',
      attendees: 4,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      time: '16:30',
      title: 'Code Review',
      description: 'Weekly code review met team',
      location: 'Dev Room',
      attendees: 6,
      color: 'bg-orange-500'
    }
  ]);

  const weekDays = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
  const today = currentDate.getDate();

  const handleDateClick = (day: number) => {
    setSelectedDate(day);
    toast({
      title: "Datum geselecteerd",
      description: `${day} ${currentMonth.split(' ')[0]} geselecteerd`,
    });
  };

  const handleEventClick = (event: any) => {
    toast({
      title: "Event geopend",
      description: `${event.title} details worden geladen...`,
    });
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) {
      toast({
        title: "Fout",
        description: "Voer een event titel in",
        variant: "destructive"
      });
      return;
    }

    const event = {
      id: Math.max(...events.map(e => e.id)) + 1,
      title: newEvent.title,
      description: newEvent.description,
      time: newEvent.time || '00:00',
      location: newEvent.location || 'Locatie TBD',
      attendees: parseInt(newEvent.attendees) || 1,
      color: 'bg-blue-500'
    };

    setEvents([...events, event]);
    setNewEvent({ title: '', description: '', time: '', location: '', attendees: '' });
    setShowAddEvent(false);
    
    toast({
      title: "Event toegevoegd",
      description: `"${event.title}" is toegevoegd aan je agenda`,
    });
  };

  const handlePrevMonth = () => {
    toast({
      title: "Vorige maand",
      description: "Navigeren naar vorige maand...",
    });
  };

  const handleNextMonth = () => {
    toast({
      title: "Volgende maand",
      description: "Navigeren naar volgende maand...",
    });
  };

  return (
    <div className="p-4 pb-20 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 capitalize">{currentMonth}</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button 
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 6; // Start from previous month
              const isToday = day === today;
              const isSelected = day === selectedDate;
              const isCurrentMonth = day > 0 && day <= 31;
              
              return (
                <button
                  key={i}
                  onClick={() => isCurrentMonth && handleDateClick(day)}
                  className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                    isToday 
                      ? 'bg-blue-600 text-white font-bold' 
                      : isSelected && isCurrentMonth
                        ? 'bg-blue-100 text-blue-600 font-semibold'
                        : isCurrentMonth
                          ? 'text-gray-900 hover:bg-gray-100'
                          : 'text-gray-300'
                  }`}
                  disabled={!isCurrentMonth}
                >
                  {isCurrentMonth ? day : ''}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Agenda voor {selectedDate} {currentMonth.split(' ')[0]}
        </h3>
        <button 
          onClick={() => setShowAddEvent(!showAddEvent)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Add Event Form */}
      {showAddEvent && (
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">Nieuw Event</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Event titel..."
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Beschrijving..."
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Locatie"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="number"
              placeholder="Aantal deelnemers"
              value={newEvent.attendees}
              onChange={(e) => setNewEvent({ ...newEvent, attendees: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddEvent}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Toevoegen
              </button>
              <button
                onClick={() => setShowAddEvent(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {events.map((event, index) => (
          <div 
            key={index} 
            onClick={() => handleEventClick(event)}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900">{event.time}</div>
            </div>
            <div className={`w-1 h-12 rounded-full ${event.color}`}></div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  <span>{event.attendees} deelnemers</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {events.length === 0 && (
          <div className="text-center py-8">
            <Clock size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Geen events voor deze dag</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button 
          onClick={() => toast({ title: "Agenda Sync", description: "Synchroniseren met externe agenda's..." })}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <Clock size={24} className="mx-auto text-blue-600 mb-2" />
            <div className="font-medium text-gray-900">Sync Agenda</div>
          </div>
        </button>
        <button 
          onClick={() => toast({ title: "Agenda Export", description: "Exporteren naar kalender app..." })}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <MapPin size={24} className="mx-auto text-green-600 mb-2" />
            <div className="font-medium text-gray-900">Exporteer</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Calendar;
