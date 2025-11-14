
import React from 'react';

export type DeletionScope = 'single' | 'future' | 'all';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (scope: DeletionScope) => void;
  title: string;
  message: string;
  isRecurring: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, isRecurring }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h3 id="modal-title" className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="mt-2 text-gray-600">{message}</p>
        </div>
        <div className="bg-gray-100 px-6 py-4 flex flex-col sm:flex-row sm:justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 order-last sm:order-first"
          >
            Batal
          </button>
          {isRecurring ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onConfirm('single')}
                className="w-full sm:w-auto px-4 py-2 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-secondary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors"
              >
                Hanya Ini
              </button>
              <button
                onClick={() => onConfirm('future')}
                className="w-full sm:w-auto px-4 py-2 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-secondary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors"
              >
                Ini & Akan Datang
              </button>
              <button
                onClick={() => onConfirm('all')}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Semua Siri
              </button>
            </div>
          ) : (
            <button
              onClick={() => onConfirm('single')}
              className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Padam
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
