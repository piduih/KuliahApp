// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { CloseIcon } from './icons';

declare var L: any;

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (coords: { lat: number, lng: number }) => void;
  initialPosition: { lat: number, lng: number } | null;
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ isOpen, onClose, onLocationSelect, initialPosition }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [selectedCoords, setSelectedCoords] = useState(initialPosition);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (isOpen && mapContainerRef.current && !mapInstanceRef.current) {
        const initializeMap = (center, zoom) => {
            setIsLocating(false);
            const map = L.map(mapContainerRef.current, { zoomControl: false }).setView(center, zoom);
            L.control.zoom({ position: 'bottomright' }).addTo(map);
            mapInstanceRef.current = map;

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }).addTo(map);

            if (initialPosition) {
                markerRef.current = L.marker(initialPosition).addTo(map);
            }

            map.on('click', (e) => {
                const { lat, lng } = e.latlng;
                setSelectedCoords({ lat, lng });
                if (!markerRef.current) {
                    markerRef.current = L.marker(e.latlng).addTo(map);
                } else {
                    markerRef.current.setLatLng(e.latlng);
                }
            });
        };

        const defaultCenter = [3.1390, 101.6869]; // KL
        const defaultZoom = 8;
        
        if (initialPosition) {
            initializeMap([initialPosition.lat, initialPosition.lng], 15);
        } else if (navigator.geolocation) {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    initializeMap([latitude, longitude], 14); // Closer zoom for current location
                },
                (error) => {
                    console.warn(`Geolocation error: ${error.message}`);
                    initializeMap(defaultCenter, defaultZoom); // Fallback on error
                },
                { timeout: 5000 } // Add a timeout
            );
        } else {
            console.warn("Geolocation is not supported by this browser.");
            initializeMap(defaultCenter, defaultZoom); // Fallback if not supported
        }
    }

    // Invalidate map size when modal opens to ensure correct tile rendering
    if (isOpen && mapInstanceRef.current) {
        setTimeout(() => {
            mapInstanceRef.current.invalidateSize();
        }, 100);
    }

  }, [isOpen, initialPosition]);

  const handleConfirm = () => {
    if (selectedCoords) {
      onLocationSelect(selectedCoords);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Pilih Lokasi di Peta</h3>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"><CloseIcon /></button>
        </div>
        <div className="flex-grow relative">
            <div ref={mapContainerRef} style={{ height: '50vh', width: '100%' }} />
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white bg-opacity-80 p-2 rounded-lg shadow-md text-sm text-gray-700 pointer-events-none">
                {isLocating ? 'Mencari lokasi anda...' : 'Klik pada peta untuk meletakkan pin lokasi.'}
            </div>
        </div>
        <div className="bg-gray-100 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedCoords}
            className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Sahkan Lokasi
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;