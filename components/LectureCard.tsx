
import React from 'react';
import { Lecture } from '../types';
import { CalendarIcon, ClockIcon, UserIcon, LocationIcon, EditIcon, DeleteIcon, BookIcon, RepeatIcon, ShareIcon } from './icons';

interface LectureCardProps {
  lecture: Lecture;
  onEdit: (lecture: Lecture) => void;
  onDelete: (lecture: Lecture) => void;
  onShare: (lecture: Lecture) => void;
}

const LectureCard: React.FC<LectureCardProps> = ({ lecture, onEdit, onDelete, onShare }) => {
  const formattedDate = new Date(lecture.date + 'T00:00:00').toLocaleDateString('ms-MY', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date('1970-01-01T' + lecture.time).toLocaleTimeString('ms-MY', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl border border-gray-100 flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center flex-1 pr-4">
                {lecture.speakerImage ? (
                    <img src={lecture.speakerImage} alt={lecture.speaker} className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-primary" />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4 text-gray-400">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="7" r="4" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>
                    </div>
                )}
                <div className="flex-1">
                    <p className="flex items-center text-sm font-semibold text-primary uppercase tracking-wide">
                        <BookIcon />
                        {lecture.topic}
                    </p>
                    <h3 className="block mt-1 text-lg leading-tight font-bold text-black">{lecture.speaker}</h3>
                </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button onClick={() => onShare(lecture)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-full transition-colors duration-200" aria-label="Kongsi Kuliah">
                <ShareIcon />
              </button>
              <button onClick={() => onEdit(lecture)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200" aria-label="Edit Kuliah">
                <EditIcon />
              </button>
              <button onClick={() => onDelete(lecture)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200" aria-label="Padam Kuliah">
                <DeleteIcon />
              </button>
            </div>
        </div>

        <div className="space-y-3 text-gray-600">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lecture.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-primary hover:underline transition-colors"
            aria-label={`Dapatkan arah ke ${lecture.location}`}
          >
            <LocationIcon />
            {lecture.location}
          </a>
          <p className="flex items-center">
            <CalendarIcon />
            {formattedDate}
          </p>
          <div className="flex items-center justify-between">
            <p className="flex items-center">
                <ClockIcon />
                {formattedTime}
            </p>
            {lecture.parentId && (
                <span title="Kuliah Berulang">
                    <RepeatIcon />
                </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureCard;
