
import React, { useState, useEffect } from 'react';
import { Lecture, RecurrenceRule } from '../types';
import LocationPickerModal from './LocationPickerModal';
import { BookIcon, UserIcon, LocationIcon, CalendarIcon, ClockIcon, PlusIcon, TrashIcon, BellIcon, MapPinIcon } from './icons';

interface LectureFormProps {
  onSubmit: (lecture: Omit<Lecture, 'id'>, recurrence: RecurrenceRule | null) => void;
  onUpdate: (lecture: Lecture) => void;
  lectureToEdit: Lecture | null;
  onCancelEdit: () => void;
  notificationPermission: NotificationPermission;
}

const LectureForm: React.FC<LectureFormProps> = ({ onSubmit, onUpdate, lectureToEdit, onCancelEdit, notificationPermission }) => {
  const [topic, setTopic] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [speakerImage, setSpeakerImage] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reminder, setReminder] = useState<string>('none');

  // Recurrence state
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('weekly');
  const [endDate, setEndDate] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditing = lectureToEdit !== null;

  useEffect(() => {
    if (isEditing && lectureToEdit) {
      setTopic(lectureToEdit.topic);
      setSpeaker(lectureToEdit.speaker);
      setSpeakerImage(lectureToEdit.speakerImage || null);
      setLocation(lectureToEdit.location);
      setCoordinates(lectureToEdit.latitude && lectureToEdit.longitude ? { lat: lectureToEdit.latitude, lng: lectureToEdit.longitude } : null);
      setDate(lectureToEdit.date);
      setTime(lectureToEdit.time);
      setReminder(lectureToEdit.reminder ? String(lectureToEdit.reminder) : 'none');
      setIsRecurring(false); // Disable recurrence editing for now
      setErrors({});
    } else {
      resetForm();
    }
  }, [lectureToEdit, isEditing]);

  const resetForm = () => {
    setTopic('');
    setSpeaker('');
    setSpeakerImage(null);
    setLocation('');
    setCoordinates(null);
    setDate('');
    setTime('');
    setReminder('none');
    setIsRecurring(false);
    setFrequency('weekly');
    setEndDate('');
    setErrors({});
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSpeakerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearError = (field: string) => {
    if (errors[field]) {
        setErrors(prev => {
            const newErrors = {...prev};
            delete newErrors[field];
            return newErrors;
        });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!topic.trim()) newErrors.topic = 'Tajuk tidak boleh kosong.';
    if (!speaker.trim()) newErrors.speaker = 'Penceramah tidak boleh kosong.';
    if (!location.trim()) newErrors.location = 'Lokasi tidak boleh kosong.';
    
    if (!date) {
        newErrors.date = 'Tarikh mula tidak boleh kosong.';
    } else if (!isEditing && new Date(date) < today) {
        newErrors.date = 'Tarikh mula tidak boleh pada masa lalu.';
    }

    if (!time) newErrors.time = 'Masa tidak boleh kosong.';

    if (isRecurring) {
        if (!endDate) {
            newErrors.endDate = 'Tarikh tamat tidak boleh kosong.';
        } else if (date && new Date(endDate) <= new Date(date)) {
            newErrors.endDate = 'Tarikh tamat mesti selepas tarikh mula.';
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const reminderValue = reminder === 'none' ? null : parseInt(reminder, 10);
    const lecturePayload = {
        topic, 
        speaker, 
        speakerImage, 
        location, 
        latitude: coordinates?.lat,
        longitude: coordinates?.lng,
        date, 
        time, 
        reminder: reminderValue
    };

    if (isEditing && lectureToEdit) {
        onUpdate({ 
            ...lecturePayload,
            id: lectureToEdit.id, 
            parentId: lectureToEdit.parentId,
        });
    } else {
        const recurrenceRule = isRecurring ? { frequency, endDate } : null;
        onSubmit(lecturePayload, recurrenceRule);
    }
    
    resetForm();
  };
  
  return (
    <>
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-primary mb-4">{isEditing ? 'Kemaskini Kuliah' : 'Tambah Kuliah Baru'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4 border border-dashed">
                <label htmlFor="speakerImage" className="cursor-pointer text-center">
                    {speakerImage ? (
                        <img src={speakerImage} alt="Speaker" className="w-24 h-24 rounded-full object-cover mx-auto mb-2"/>
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-2 text-gray-400">
                           <UserIcon />
                        </div>
                    )}
                     <span className="text-sm font-semibold text-primary hover:underline">
                        {speakerImage ? 'Tukar Gambar' : 'Muat Naik Gambar'}
                    </span>
                </label>
                <input id="speakerImage" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                {speakerImage && (
                    <button type="button" onClick={() => setSpeakerImage(null)} className="mt-2 text-xs text-red-600 hover:text-red-800 flex items-center">
                        <TrashIcon /> <span className="ml-1">Padam</span>
                    </button>
                )}
            </div>
            <div className="md:col-span-2 space-y-4">
                 <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Tajuk Kuliah</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <BookIcon />
                    </div>
                    <input id="topic" type="text" value={topic} onChange={e => { setTopic(e.target.value); clearError('topic'); }} placeholder="Contoh: Tadabbur Surah Al-Fatihah" className={`w-full pl-10 pr-3 py-2 bg-gray-50 border rounded-md shadow-sm focus:ring-primary focus:border-primary focus:bg-white transition-colors text-gray-900 placeholder-gray-500 ${errors.topic ? 'border-red-500' : 'border-gray-300'}`} />
                  </div>
                  {errors.topic && <p className="mt-1 text-sm text-red-600">{errors.topic}</p>}
                </div>
                <div>
                  <label htmlFor="speaker" className="block text-sm font-medium text-gray-700 mb-1">Penceramah</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserIcon />
                    </div>
                    <input id="speaker" type="text" value={speaker} onChange={e => { setSpeaker(e.target.value); clearError('speaker'); }} placeholder="Contoh: Ustaz Abdullah" className={`w-full pl-10 pr-3 py-2 bg-gray-50 border rounded-md shadow-sm focus:ring-primary focus:border-primary focus:bg-white transition-colors text-gray-900 placeholder-gray-500 ${errors.speaker ? 'border-red-500' : 'border-gray-300'}`} />
                  </div>
                  {errors.speaker && <p className="mt-1 text-sm text-red-600">{errors.speaker}</p>}
                </div>
            </div>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Lokasi (Masjid/Surau)</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LocationIcon />
            </div>
            <input 
              id="location"
              type="text" 
              value={location}
              onChange={e => { setLocation(e.target.value); clearError('location'); }} 
              placeholder="Contoh: Masjid Al-Hidayah, Sentul" 
              className={`w-full pl-10 pr-3 py-2 bg-gray-50 border rounded-md shadow-sm focus:ring-primary focus:border-primary focus:bg-white transition-colors text-gray-900 placeholder-gray-500 ${errors.location ? 'border-red-500' : 'border-gray-300'}`} />
          </div>
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Peta (Pilihan)</label>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 p-3 bg-gray-50 border rounded-lg">
            <button type="button" onClick={() => setIsPickerOpen(true)} className="flex items-center justify-center px-4 py-2 bg-secondary text-white font-semibold rounded-lg shadow-sm hover:bg-secondary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors w-full sm:w-auto">
                <MapPinIcon />
                <span>Pilih Lokasi di Peta</span>
            </button>
            <div className="mt-2 sm:mt-0 text-sm text-gray-600">
                {coordinates ? (
                    <p className="text-green-700 font-medium">
                        Lokasi dipilih: {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
                    </p>
                ) : (
                    <p>Tiada lokasi peta dipilih.</p>
                )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Tarikh Mula</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <CalendarIcon />
                </div>
                <input id="date" type="date" value={date} onChange={e => { setDate(e.target.value); clearError('date'); }} className={`w-full pl-10 pr-3 py-2 bg-gray-50 border rounded-md shadow-sm focus:ring-primary focus:border-primary focus:bg-white transition-colors text-gray-900 ${errors.date ? 'border-red-500' : 'border-gray-300'}`} />
              </div>
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Masa</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <ClockIcon />
                </div>
                <input id="time" type="time" value={time} onChange={e => { setTime(e.target.value); clearError('time'); }} className={`w-full pl-10 pr-3 py-2 bg-gray-50 border rounded-md shadow-sm focus:ring-primary focus:border-primary focus:bg-white transition-colors text-gray-900 ${errors.time ? 'border-red-500' : 'border-gray-300'}`} />
              </div>
              {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
            </div>
        </div>
        
        {/* Reminder Section */}
        <div>
            <label htmlFor="reminder" className="block text-sm font-medium text-gray-700 mb-1">Peringatan Notifikasi</label>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <BellIcon />
                </div>
                <select 
                    id="reminder" 
                    value={reminder}
                    onChange={e => setReminder(e.target.value)}
                    disabled={notificationPermission !== 'granted'}
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary focus:bg-white transition-colors text-gray-900 disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                    <option value="none">Tiada Peringatan</option>
                    <option value="15">15 Minit Sebelum</option>
                    <option value="60">1 Jam Sebelum</option>
                    <option value="1440">1 Hari Sebelum</option>
                </select>
            </div>
            {notificationPermission !== 'granted' && (
                <p className="mt-1 text-xs text-gray-500">Sila aktifkan notifikasi untuk menggunakan ciri ini.</p>
            )}
        </div>


        {/* Recurrence Section */}
        {!isEditing && (
            <div className="pt-4 border-t">
                <div className="flex items-center">
                    <input
                        id="isRecurring"
                        type="checkbox"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="isRecurring" className="ml-2 block text-sm font-medium text-gray-800">
                        Jadikan Kuliah Berulang
                    </label>
                </div>

                {isRecurring && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pl-6 animate-fade-in">
                        <div>
                            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">Kekerapan</label>
                            <select
                                id="frequency"
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value as 'weekly' | 'monthly')}
                                className="w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-gray-900"
                            >
                                <option value="weekly">Setiap Minggu</option>
                                <option value="monthly">Setiap Bulan</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Berulang Sehingga</label>
                            <input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={e => { setEndDate(e.target.value); clearError('endDate'); }}
                                min={date}
                                className={`w-full py-2 px-3 bg-gray-50 border rounded-md shadow-sm focus:ring-primary focus:border-primary text-gray-900 ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                        </div>
                    </div>
                )}
            </div>
        )}

        <div className="flex items-center justify-end space-x-3 pt-2">
            {isEditing && (
              <button type="button" onClick={onCancelEdit} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                Batal
              </button>
            )}
            <button type="submit" className="flex items-center px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
              {isEditing ? 'Kemaskini' : <><PlusIcon /><span>Tambah Kuliah</span></>}
            </button>
        </div>
      </form>
    </div>
    <LocationPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        initialPosition={coordinates}
        onLocationSelect={(newCoords) => {
            setCoordinates(newCoords);
            setIsPickerOpen(false);
        }}
    />
    </>
  );
};

export default LectureForm;
