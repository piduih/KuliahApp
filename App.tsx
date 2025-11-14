
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Lecture, RecurrenceRule } from './types';
import LectureForm from './components/LectureForm';
import LectureCard from './components/LectureCard';
import CalendarView from './components/CalendarView';
import MapView from './components/MapView';
import ConfirmationModal, { DeletionScope } from './components/ConfirmationModal';
import useLocalStorage from './hooks/useLocalStorage';
import { SearchIcon, ListIcon, CalendarViewIcon, BellIcon, DownloadIcon, PdfIcon, UploadIcon, JsonIcon, MapIcon } from './components/icons';

const getFutureDate = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
};

const SAMPLE_LECTURES: Lecture[] = [
    {
        id: 'sample-1',
        topic: 'Fiqh Wanita: Isu-isu Kontemporari',
        speaker: 'Ustazah Asma\' Harun',
        speakerImage: null,
        location: 'Masjid Wilayah Persekutuan, Kuala Lumpur',
        latitude: 3.1706,
        longitude: 101.6743,
        date: getFutureDate(3),
        time: '10:00',
    },
    {
        id: 'sample-2',
        topic: 'Tafsir Surah Al-Kahfi',
        speaker: 'Dr. Maza',
        speakerImage: null,
        location: 'Masjid Tuanku Mizan Zainal Abidin, Putrajaya',
        latitude: 2.9209,
        longitude: 101.6841,
        date: getFutureDate(5),
        time: '20:45',
    },
    {
        id: 'sample-3',
        topic: 'Seni Keibubapaan Mengikut Sunnah',
        speaker: 'Dr. Danial Zainal Abidin',
        speakerImage: null,
        location: 'Surau An-Nur, Bangi Seksyen 4',
        date: getFutureDate(7),
        time: '19:30',
        reminder: 60, // Sample with 1 hour reminder
    }
];

type FilterStatus = 'all' | 'upcoming' | 'past';
type ViewMode = 'list' | 'calendar' | 'map';

const App: React.FC = () => {
  const [lectures, setLectures] = useLocalStorage<Lecture[]>('lectures', SAMPLE_LECTURES);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('upcoming');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState<Lecture | null>(null);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const scheduledNotifications = useRef(new Map<string, number>());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effect to schedule notifications based on lectures array
  useEffect(() => {
    // Clear all previously scheduled notifications
    scheduledNotifications.current.forEach(timeoutId => clearTimeout(timeoutId));
    scheduledNotifications.current.clear();

    if (notificationPermission === 'granted') {
      lectures.forEach(lecture => {
        if (lecture.reminder) {
          const lectureDateTime = new Date(`${lecture.date}T${lecture.time}`).getTime();
          const reminderTime = lectureDateTime - lecture.reminder * 60 * 1000;
          const now = Date.now();
          
          if (reminderTime > now) {
            const timeoutId = window.setTimeout(() => {
              new Notification('Peringatan Kuliah', {
                body: `${lecture.topic}\noleh ${lecture.speaker}\nakan bermula sebentar lagi di ${lecture.location}.`,
                icon: '/manifest-icon-192.png', // Placeholder icon
              });
              scheduledNotifications.current.delete(lecture.id);
            }, reminderTime - now);
            scheduledNotifications.current.set(lecture.id, timeoutId);
          }
        }
      });
    }

    // Cleanup on unmount
    return () => {
      scheduledNotifications.current.forEach(timeoutId => clearTimeout(timeoutId));
    };
  }, [lectures, notificationPermission]);

  const requestNotificationPermission = () => {
    if (!('Notification' in window)) {
      alert('Pelayar ini tidak menyokong notifikasi desktop.');
      return;
    }
    Notification.requestPermission().then(permission => {
      setNotificationPermission(permission);
    });
  };

  const addLecture = (lectureData: Omit<Lecture, 'id'>, recurrence: RecurrenceRule | null) => {
    if (!recurrence) {
        // Single lecture
        const newLecture: Lecture = {
          id: new Date().toISOString(),
          ...lectureData,
        };
        setLectures(prevLectures => [newLecture, ...prevLectures]);
    } else {
        // Recurring lectures
        const newLectures: Lecture[] = [];
        const parentId = new Date().toISOString();
        let currentDate = new Date(lectureData.date + 'T00:00:00');
        const finalDate = new Date(recurrence.endDate + 'T00:00:00');

        while (currentDate <= finalDate) {
            newLectures.push({
                ...lectureData,
                id: `${parentId}-${currentDate.getTime()}`,
                date: currentDate.toISOString().split('T')[0],
                parentId: parentId,
            });

            if (recurrence.frequency === 'weekly') {
                currentDate.setDate(currentDate.getDate() + 7);
            } else { // monthly
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        }
        setLectures(prev => [...newLectures, ...prev]);
    }
  };

  const updateLecture = (updatedLecture: Lecture) => {
    setLectures(lectures.map(lec => (lec.id === updatedLecture.id ? updatedLecture : lec)));
    setEditingLecture(null);
  };

  const deleteLecture = (lecture: Lecture) => {
    setLectureToDelete(lecture);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = (scope: DeletionScope) => {
    if (!lectureToDelete) return;

    let lecturesToKeep: Lecture[];

    if (scope === 'single' || !lectureToDelete.parentId) {
        lecturesToKeep = lectures.filter(l => l.id !== lectureToDelete.id);
    } else if (scope === 'all') {
        lecturesToKeep = lectures.filter(l => l.parentId !== lectureToDelete.parentId);
    } else { // scope === 'future'
        const lectureDate = new Date(`${lectureToDelete.date}T${lectureToDelete.time}`);
        lecturesToKeep = lectures.filter(l => {
            if (l.parentId !== lectureToDelete.parentId) {
                return true; // Keep lectures from other series
            }
            const currentLectureDate = new Date(`${l.date}T${l.time}`);
            return currentLectureDate < lectureDate; // Keep only past lectures from this series
        });
    }
    
    setLectures(lecturesToKeep);

    if (editingLecture && editingLecture.id === lectureToDelete.id) {
        setEditingLecture(null);
    }
    setIsDeleteModalOpen(false);
    setLectureToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setLectureToDelete(null);
  };

  const handleEdit = (lecture: Lecture) => {
    setEditingLecture(lecture);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setEditingLecture(null);
  }

  const handleShare = async (lecture: Lecture) => {
    const formattedDate = new Date(lecture.date + 'T00:00:00').toLocaleDateString('ms-MY', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    const formattedTime = new Date('1970-01-01T' + lecture.time).toLocaleTimeString('ms-MY', {
        hour: '2-digit', minute: '2-digit', hour12: true
    });

    const shareData = {
        title: 'Jom Hadir Kuliah!',
        text: `*Jom Hadir Kuliah!*\n\n*Tajuk:* ${lecture.topic}\n*Penceramah:* ${lecture.speaker}\n*Lokasi:* ${lecture.location}\n*Tarikh:* ${formattedDate}\n*Masa:* ${formattedTime}`,
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err: any) {
            if (err.name !== 'AbortError') {
              console.error('Error sharing:', err);
            }
        }
    } else {
        alert('Fungsi kongsi tidak disokong pada pelayar ini.');
    }
  };

  const handleExportCSV = () => {
    if (filteredAndSortedLectures.length === 0) {
        alert("Tiada data untuk dieksport.");
        return;
    }

    const headers = ["Tajuk", "Penceramah", "Lokasi", "Tarikh", "Masa", "Latitud", "Longitud"];
    const csvRows = [headers.join(',')];

    filteredAndSortedLectures.forEach(l => {
        const row = [
            `"${l.topic.replace(/"/g, '""')}"`,
            `"${l.speaker.replace(/"/g, '""')}"`,
            `"${l.location.replace(/"/g, '""')}"`,
            l.date,
            l.time,
            l.latitude || '',
            l.longitude || '',
        ];
        csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'senarai_kuliah.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };
  
  const handleExportPDF = () => {
    if (filteredAndSortedLectures.length === 0) {
        alert("Tiada data untuk dieksport.");
        return;
    }

    // @ts-ignore
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Senarai Kuliah Masjid & Surau", 14, 22);
    
    const tableColumn = ["Tajuk", "Penceramah", "Lokasi", "Tarikh", "Masa"];
    const tableRows: string[][] = [];

    filteredAndSortedLectures.forEach(lecture => {
        const lectureData = [
            lecture.topic,
            lecture.speaker,
            lecture.location,
            new Date(lecture.date + 'T00:00:00').toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric'}),
            new Date('1970-01-01T' + lecture.time).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', hour12: true })
        ];
        tableRows.push(lectureData);
    });

    // @ts-ignore
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] }, // #4F46E5 (primary color)
    });
    
    doc.save("senarai_kuliah.pdf");
  };
  
  const handleExportJSON = () => {
    if (filteredAndSortedLectures.length === 0) {
        alert("Tiada data untuk dieksport.");
        return;
    }

    const jsonString = JSON.stringify(filteredAndSortedLectures, null, 2); // Pretty print
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'senarai_kuliah.json');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') throw new Error("Gagal membaca fail.");
            
            const importedLectures: Lecture[] = JSON.parse(text);

            if (!Array.isArray(importedLectures) || (importedLectures.length > 0 && !importedLectures[0].id)) {
                 throw new Error("Format fail JSON tidak sah.");
            }

            const existingIds = new Set(lectures.map(l => l.id));
            const newLectures: Lecture[] = [];
            let skippedCount = 0;

            importedLectures.forEach(importedLecture => {
                if (existingIds.has(importedLecture.id)) {
                    skippedCount++;
                } else {
                    newLectures.push(importedLecture);
                    existingIds.add(importedLecture.id);
                }
            });

            if (newLectures.length > 0) {
                setLectures(prevLectures => [...prevLectures, ...newLectures]);
            }

            alert(`${newLectures.length} kuliah baru berjaya diimport.\n${skippedCount} kuliah dilangkau kerana telah wujud.`);

        } catch (error: any) {
            alert(`Ralat mengimport fail: ${error.message}`);
        } finally {
            if (event.target) event.target.value = ''; // Reset input
        }
    };
    reader.onerror = () => {
        alert('Gagal membaca fail.');
        if (event.target) event.target.value = '';
    };
    reader.readAsText(file);
  };


  const filteredAndSortedLectures = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const filtered = [...lectures]
      .filter(lecture => {
        const lectureDate = new Date(lecture.date + 'T00:00:00');
        if (filterStatus === 'upcoming') return lectureDate >= today;
        if (filterStatus === 'past') return lectureDate < today;
        return true;
      })
      .filter(lecture => {
        if (!searchTerm.trim()) return true;
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
          lecture.topic.toLowerCase().includes(lowercasedTerm) ||
          lecture.speaker.toLowerCase().includes(lowercasedTerm) ||
          lecture.location.toLowerCase().includes(lowercasedTerm)
        );
      });
      
      return filtered.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        const aIsPast = dateA < now;
        const bIsPast = dateB < now;

        if (aIsPast && !bIsPast) return 1;
        if (!aIsPast && bIsPast) return -1;
        if (aIsPast && bIsPast) return dateB.getTime() - dateA.getTime();
        return dateA.getTime() - dateB.getTime();
    });

  }, [lectures, searchTerm, filterStatus]);


  return (
    <div className="min-h-screen bg-base-100 font-sans">
      <header className="bg-primary shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-3xl font-bold text-white text-center">
                Rekod Kuliah Masjid & Surau
            </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LectureForm 
            onSubmit={addLecture}
            onUpdate={updateLecture}
            lectureToEdit={editingLecture}
            onCancelEdit={handleCancelEdit}
            notificationPermission={notificationPermission}
        />

        <div className="border-t border-base-300 pt-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Senarai Kuliah</h2>
                    <div className="flex items-center bg-gray-200 rounded-lg p-1">
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-300'}`} title="Paparan Senarai">
                            <ListIcon />
                        </button>
                        <button onClick={() => setViewMode('calendar')} className={`p-2 rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-300'}`} title="Paparan Kalendar">
                            <CalendarViewIcon />
                        </button>
                         <button onClick={() => setViewMode('map')} className={`p-2 rounded-md transition-colors ${viewMode === 'map' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-300'}`} title="Paparan Peta">
                            <MapIcon />
                        </button>
                    </div>
                </div>
                <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-64">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari tajuk, penceramah..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary transition-colors text-gray-900 placeholder-gray-500"
                        />
                    </div>
                    <div className="flex items-center bg-gray-200 rounded-lg p-1">
                        <button
                            onClick={() => setFilterStatus('upcoming')}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${filterStatus === 'upcoming' ? 'bg-primary text-white shadow' : 'text-gray-700 hover:bg-gray-300'}`}
                        >
                            Akan Datang
                        </button>
                        <button
                            onClick={() => setFilterStatus('past')}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${filterStatus === 'past' ? 'bg-primary text-white shadow' : 'text-gray-700 hover:bg-gray-300'}`}
                        >
                            Sudah Lepas
                        </button>
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${filterStatus === 'all' ? 'bg-primary text-white shadow' : 'text-gray-700 hover:bg-gray-300'}`}
                        >
                            Semua
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-end items-center mb-4 p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm font-medium text-gray-700 mr-auto">Alat & Tindakan:</p>
                {notificationPermission !== 'granted' ? (
                    <button onClick={requestNotificationPermission} className="flex items-center px-3 py-2 text-sm bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors">
                        <BellIcon /> <span>Aktifkan Notifikasi</span>
                    </button>
                ) : (
                    <p className="flex items-center px-3 py-2 text-sm bg-green-100 text-green-800 font-semibold rounded-lg">
                        <BellIcon /> <span>Notifikasi Aktif</span>
                    </p>
                )}
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center px-3 py-2 text-sm bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                    <UploadIcon /> <span>Import JSON</span>
                </button>
                <button onClick={handleExportJSON} className="flex items-center px-3 py-2 text-sm bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 transition-colors">
                    <JsonIcon /> <span>Eksport JSON</span>
                </button>
                <button onClick={handleExportCSV} className="flex items-center px-3 py-2 text-sm bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <DownloadIcon /> <span>Eksport CSV</span>
                </button>
                 <button onClick={handleExportPDF} className="flex items-center px-3 py-2 text-sm bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                    <PdfIcon /> <span>Eksport PDF</span>
                </button>
            </div>


            {viewMode === 'list' && (
                <>
                {filteredAndSortedLectures.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedLectures.map(lecture => (
                        <LectureCard
                        key={lecture.id}
                        lecture={lecture}
                        onEdit={handleEdit}
                        onDelete={deleteLecture}
                        onShare={handleShare}
                        />
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md border border-gray-200">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">Tiada Kuliah Ditemui</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm ? 'Cuba kata kunci lain atau tukar tapisan anda.' : 'Tiada kuliah yang sepadan dengan tapisan ini.'}
                        </p>
                    </div>
                )}
                </>
            )}

            {viewMode === 'calendar' && (
                <CalendarView 
                    lectures={filteredAndSortedLectures}
                    onEdit={handleEdit}
                    onDelete={deleteLecture}
                    onShare={handleShare}
                />
            )}

            {viewMode === 'map' && (
                <MapView 
                    lectures={filteredAndSortedLectures.filter(l => l.latitude && l.longitude)}
                />
            )}
        </div>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".json"
            className="hidden"
        />
      </main>
      
      <footer className="text-center py-4 mt-8 text-gray-500 text-sm">
        <p>Dibina dengan ❤️ untuk komuniti.</p>
      </footer>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={lectureToDelete?.parentId ? "Padam Kuliah Berulang" : "Padam Rekod Kuliah"}
        message={lectureToDelete?.parentId ? "Pilih skop pemadaman untuk siri kuliah ini." : "Adakah anda pasti mahu padam rekod kuliah ini? Tindakan ini tidak boleh diubah."}
        isRecurring={!!lectureToDelete?.parentId}
    />
    </div>
  );
};

export default App;