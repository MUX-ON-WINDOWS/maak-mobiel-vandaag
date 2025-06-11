import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/contexts/ProjectContext';
import { eventOperations } from '@/integrations/supabase/database';
import type { Database } from '@/integrations/supabase/types';

type Event = Database['public']['Tables']['events']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];

interface CalendarItem {
  id: string;
  type: 'event' | 'task';
  title: string;
  description: string | null;
  start_time: string;
  end_time?: string;
  location?: string | null;
  attendees?: number;
  color: string;
  completed?: boolean;
  priority?: string;
}

const Calendar = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { tasks } = useProjects();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    attendees: '1',
    color: 'blue'
  });

  const currentMonth = currentDate.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
  const weekDays = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

  useEffect(() => {
    loadEvents();
  }, [currentDate, selectedDate]);

  useEffect(() => {
    combineEventsAndTasks();
  }, [events, tasks, selectedDate]);

  const combineEventsAndTasks = () => {
    const selectedDateObj = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      selectedDate
    );
    
    selectedDateObj.setHours(0, 0, 0, 0);

    const combinedItems: CalendarItem[] = [
      ...events.map(event => ({
        id: event.id,
        type: 'event' as const,
        title: event.title,
        description: event.description,
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location,
        attendees: event.attendees,
        color: event.color
      })),
      ...tasks
        .filter(task => {
          if (!task.due_date) return false;
          const taskDate = new Date(task.due_date);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === selectedDateObj.getTime();
        })
        .map(task => ({
          id: task.id,
          type: 'task' as const,
          title: task.title,
          description: task.description,
          start_time: task.due_date,
          color: getTaskColor(task.priority),
          completed: task.completed,
          priority: task.priority
        }))
    ].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

    setCalendarItems(combinedItems);
  };

  const getTaskColor = (priority: string | null) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'blue';
    }
  };

  const loadEvents = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const selectedDateObj = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        selectedDate
      );
      
      const eventsData = await eventOperations.getByDate(selectedDateObj);
      setEvents(eventsData);
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het laden van de events",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = async (day: number) => {
    setSelectedDate(day);
  };

  const handleItemClick = (item: CalendarItem) => {
    if (item.type === 'task') {
      toast({
        title: "Taak geopend",
        description: `${item.title} details worden geladen...`,
      });
    } else {
      toast({
        title: "Event geopend",
        description: `${item.title} details worden geladen...`,
      });
    }
  };

  const handleAddEvent = async () => {
    if (!user) return;
    
    if (!newEvent.title.trim()) {
      toast({
        title: "Fout",
        description: "Voer een event titel in",
        variant: "destructive"
      });
      return;
    }

    try {
      const startTime = new Date(currentDate);
      startTime.setDate(selectedDate);
      const [startHours, startMinutes] = newEvent.start_time.split(':');
      startTime.setHours(parseInt(startHours), parseInt(startMinutes));

      const endTime = new Date(currentDate);
      endTime.setDate(selectedDate);
      const [endHours, endMinutes] = newEvent.end_time.split(':');
      endTime.setHours(parseInt(endHours), parseInt(endMinutes));

      await eventOperations.create({
        user_id: user.id,
        title: newEvent.title,
        description: newEvent.description,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        location: newEvent.location || null,
        attendees: parseInt(newEvent.attendees),
        color: newEvent.color
      });

      setNewEvent({ title: '', description: '', start_time: '', end_time: '', location: '', attendees: '1', color: 'blue' });
      setShowAddEvent(false);
      
      toast({
        title: "Event toegevoegd",
        description: `"${newEvent.title}" is toegevoegd aan je agenda`,
      });

      loadEvents();
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het toevoegen van het event",
        variant: "destructive"
      });
    }
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
    setSelectedDate(1);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
    setSelectedDate(1);
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = currentDayDate.getDate() === today.getDate() && 
                     currentDayDate.getMonth() === today.getMonth() && 
                     currentDayDate.getFullYear() === today.getFullYear();
      const isSelected = day === selectedDate;
      
      // Set time to start of day for accurate date comparison
      currentDayDate.setHours(0, 0, 0, 0);

      // Check if there are any tasks for this day
      const hasTasks = tasks.some(task => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === currentDayDate.getTime();
      });
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors relative ${
            isToday 
              ? 'bg-blue-600 text-white font-bold' 
              : isSelected
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-900 hover:bg-gray-100'
          }`}
        >
          {day}
          <div className="absolute bottom-1 flex gap-1">
            {isSelected && events.length > 0 && (
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
            )}
            {hasTasks && (
              <div className="w-1 h-1 bg-red-500 rounded-full"></div>
            )}
          </div>
        </button>
      );
    }

    return days;
  };

  if (loading) {
    return (
      <div className="p-4 pb-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">PM</span>
          </div>
          <p className="text-gray-600">Agenda laden...</p>
        </div>
      </div>
    );
  }

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
            {renderCalendarDays()}
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
                value={newEvent.start_time}
                onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="time"
                value={newEvent.end_time}
                onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Locatie"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Aantal deelnemers"
                value={newEvent.attendees}
                onChange={(e) => setNewEvent({ ...newEvent, attendees: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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

      <div className="space-y-6">
        {/* Events Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Events voor {selectedDate} {currentMonth.split(' ')[0]}
          </h3>
          <div className="space-y-3">
            {calendarItems
              .filter(item => item.type === 'event')
              .map((item) => (
                <div 
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleItemClick(item)}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="text-center min-w-[80px]">
                    <div className="text-sm font-semibold text-gray-900">
                      {new Date(item.start_time).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {item.end_time && (
                      <>
                        <div className="text-xs text-gray-400">-</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {new Date(item.end_time).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </>
                    )}
                  </div>
                  <div className={`w-1 h-12 rounded-full bg-${item.color}-500`}></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {item.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          <span>{item.location}</span>
                        </div>
                      )}
                      {item.attendees && (
                        <div className="flex items-center gap-1">
                          <Users size={12} />
                          <span>{item.attendees} deelnemers</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            {calendarItems.filter(item => item.type === 'event').length === 0 && (
              <div className="text-center py-8 bg-white rounded-lg border border-gray-100">
                <Clock size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Geen events voor deze dag</p>
              </div>
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Deadlines voor {selectedDate} {currentMonth.split(' ')[0]}
          </h3>
          <div className="space-y-3">
            {calendarItems
              .filter(item => item.type === 'task')
              .map((item) => (
                <div 
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleItemClick(item)}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      Deadline
                    </div>
                  </div>
                  <div className={`w-1 h-12 rounded-full bg-${item.color}-500`}></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.completed 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.completed ? 'Voltooid' : 'Open'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    {item.priority && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <CheckCircle size={12} />
                        <span className="capitalize">{item.priority} prioriteit</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {calendarItems.filter(item => item.type === 'task').length === 0 && (
              <div className="text-center py-8 bg-white rounded-lg border border-gray-100">
                <CheckCircle size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Geen deadlines voor deze dag</p>
              </div>
            )}
          </div>
        </div>
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
