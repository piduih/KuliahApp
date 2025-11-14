
import React, { useState, useMemo } from 'react';
import { Lecture } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, BookIcon, UserIcon, LocationIcon, ClockIcon, EditIcon, DeleteIcon, RepeatIcon, ShareIcon } from './icons';

interface CalendarViewProps {
  lectures: Lecture[];
  onEdit: (lecture: Lecture) => void;
  onDelete: (lecture: Lecture) => void;
  onShare: (lecture: Lecture) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ lectures, onEdit, onDelete, onShare }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const lecturesByDate = useMemo(() => {
    const map = new Map<string, Lecture[]>();
    lectures.forEach(lecture => {
      const dateKey = lecture.date;
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(lecture);
    });
    return map;
  }, [lectures]);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = endOfMonth.getDate();
  const startDayOfWeek = startOfMonth.getDay(); // 0 = Sunday, 1 = Monday, ...

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = clickedDate.toISOString().split('T')[0];
    if (lecturesByDate.has(dateKey)) {
      setSelectedDate(clickedDate);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  }

  const renderDays = () => {
    const days = [];
    // Padding for days before the start of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`pad-start-${i}`} className="border-r border-b border-gray-200"></div>);
    }

    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = date.toISOString().split('T')[0];
      const hasLectures = lecturesByDate.has(dateKey);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div 
            key={day} 
            className={`p-2 border-r border-b border-gray-200 relative transition-colors ${hasLectures ? 'cursor-pointer hover:bg-teal-50' : ''}`}
            onClick={() => handleDayClick(day)}
        >
          <div className={`flex items-center justify-center rounded-full w-8 h-8 mx-auto ${isToday ? 'bg-primary text-white' : ''}`}>
            {day}
          </div>
          {hasLectures && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-secondary rounded-full"></div>
          )}
        </div>
      );
    }
    
    // Calculate padding for the end to make a full grid
    const totalCells = days.length;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let i = 0; i < remainingCells; i++) {
        days.push(<div key={`pad-end-${i}`} className="border-r border-b border-gray-200"></div>);
    }


    return days;
  };

  const selectedLectures = selectedDate ? lecturesByDate.get(selectedDate.toISOString().split('T')[0]) || [] : [];

  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-200 transition-colors"><ChevronLeftIcon /></button>
          <h3 className="text-xl font-bold text-gray-800">
            {currentDate.toLocaleString('ms-MY', { month: 'long', year: 'numeric' })}
          </h3>
          <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200 transition-colors"><ChevronRightIcon /></button>
        </div>
        <div className="grid grid-cols-7 text-center font-semibold text-gray-600 border-t border-l border-r border-gray-200">
          {['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'].map(day => (
            <div key={day} className="py-2 border-b border-gray-200">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-center text-gray-800 border-l border-gray-200">
          {renderDays()}
        </div>
      </div>
      
      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-primary">
                  Kuliah pada {selectedDate.toLocaleDateString('ms-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={closeModal} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"><CloseIcon /></button>
              </div>
              <div className="space-y-4">
                {selectedLectures.sort((a,b) => a.time.localeCompare(b.time)).map(lecture => (
                   <div key={lecture.id} className="p-4 border rounded-lg hover:border-primary transition-colors">
                     <div className="flex justify-between items-start">
                        <div className="flex items-center flex-1 pr-4">
                            {lecture.speakerImage ? (
                                <img src={lecture.speakerImage} alt={lecture.speaker} className="w-12 h-12 rounded-full object-cover mr-4 border border-primary" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4 text-gray-400 flex-shrink-0">
                                   <svg className="w-6 h-6" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="7" r="4" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="flex items-center text-sm font-semibold text-primary uppercase tracking-wide">
                                    <BookIcon />
                                    {lecture.topic}
                                </p>
                                <h4 className="block mt-1 text-md font-bold text-black">{lecture.speaker}</h4>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => onShare(lecture)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-full transition-colors duration-200">
                                <ShareIcon />
                            </button>
                            <button onClick={() => { closeModal(); onEdit(lecture); }} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200">
                                <EditIcon />
                            </button>
                            <button onClick={() => onDelete(lecture)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200">
                                <DeleteIcon />
                            </button>
                        </div>
                    </div>
                     <div className="mt-3 space-y-2 text-gray-600 text-sm pl-16">
                       <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lecture.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center hover:text-primary hover:underline transition-colors"
                          aria-label={`Dapatkan arah ke ${lecture.location}`}
                       >
                          <LocationIcon />{lecture.location}
                       </a>
                       <div className="flex items-center justify-between">
                            <p className="flex items-center"><ClockIcon />{new Date('1970-01-01T' + lecture.time).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                            {lecture.parentId && (
                                <span title="Kuliah Berulang">
                                    <RepeatIcon />
                                </span>
                            )}
                        </div>
                     </div>
                   </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarView;
