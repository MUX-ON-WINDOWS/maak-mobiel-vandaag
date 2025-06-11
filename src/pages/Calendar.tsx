
import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const Calendar = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
  
  const events = [
    {
      time: '09:00',
      title: 'Team Standup',
      description: 'Dagelijkse team meeting',
      color: 'bg-blue-500'
    },
    {
      time: '11:30',
      title: 'Client Meeting',
      description: 'Project update presentatie',
      color: 'bg-green-500'
    },
    {
      time: '14:00',
      title: 'Design Review',
      description: 'UI/UX feedback sessie',
      color: 'bg-purple-500'
    },
    {
      time: '16:30',
      title: 'Code Review',
      description: 'Weekly code review met team',
      color: 'bg-orange-500'
    }
  ];

  const weekDays = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
  const today = currentDate.getDate();

  return (
    <div className="p-4 pb-20 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 capitalize">{currentMonth}</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
              const isCurrentMonth = day > 0 && day <= 31;
              
              return (
                <button
                  key={i}
                  className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                    isToday 
                      ? 'bg-blue-600 text-white font-bold' 
                      : isCurrentMonth
                        ? 'text-gray-900 hover:bg-gray-100'
                        : 'text-gray-300'
                  }`}
                >
                  {isCurrentMonth ? day : ''}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Vandaag's Agenda</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors">
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {events.map((event, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900">{event.time}</div>
            </div>
            <div className={`w-1 h-12 rounded-full ${event.color}`}></div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
              <p className="text-sm text-gray-600">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
