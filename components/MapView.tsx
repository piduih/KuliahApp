// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { Lecture } from '../types';

declare var L: any; // Use 'any' to avoid installing Leaflet types for this simple use case

interface MapViewProps {
  lectures: Lecture[];
}

const MapView: React.FC<MapViewProps> = ({ lectures }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current).setView([4.2105, 101.9758], 7); // Center of Malaysia
      mapInstanceRef.current = map;

      // Add tile layer from CartoDB (Voyager style - similar to Google Maps)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);
    }

    // Add markers
    const map = mapInstanceRef.current;
    if (map) {
        // Clear existing markers
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Add new markers
        const markers = [];
        lectures.forEach(lecture => {
          if (lecture.latitude && lecture.longitude) {
            const marker = L.marker([lecture.latitude, lecture.longitude]);
            
            const formattedTime = new Date('1970-01-01T' + lecture.time).toLocaleTimeString('ms-MY', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            const popupContent = `
              <div class="font-sans">
                <p class="font-bold text-md text-primary">${lecture.topic}</p>
                <p class="text-sm text-gray-800"><strong>Penceramah:</strong> ${lecture.speaker}</p>
                <p class="text-sm text-gray-600"><strong>Lokasi:</strong> ${lecture.location}</p>
                <p class="text-sm text-gray-600"><strong>Masa:</strong> ${formattedTime}</p>
              </div>
            `;
            marker.bindPopup(popupContent);
            marker.addTo(map);
            markers.push(marker);
          }
        });

        // Fit map to bounds if there are markers
        if (markers.length > 0) {
            const group = L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.5));
        }
    }

    // Cleanup on component unmount
    return () => {
        if (mapInstanceRef.current) {
            // mapInstanceRef.current.remove();
            // mapInstanceRef.current = null;
            // Note: Don't remove map on re-render, only on full unmount, 
            // but since App component is stable, this is fine.
        }
    };
  }, [lectures]); 

  if (lectures.length === 0) {
    return (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Tiada Kuliah Boleh Dipaparkan di Peta</h3>
            <p className="mt-1 text-sm text-gray-500">
                Sila tambah maklumat latitud dan longitud pada butiran kuliah untuk melihatnya di sini.
            </p>
        </div>
    );
  }

  return <div ref={mapContainerRef} style={{ height: '600px', width: '100%' }} className="rounded-lg shadow-lg border" />;
};

export default MapView;