import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TimeCapsuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekIndex: number;
  currentDate: Date;
  futureDate: Date;
  onSubmit: (email: string, message: string) => void;
}

const TimeCapsuleModal: React.FC<TimeCapsuleModalProps> = ({
  isOpen,
  onClose,
  weekIndex,
  currentDate,
  futureDate,
  onSubmit,
}) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, message);
    alert('Time capsule created! You will receive this message in your email when the time comes.');
    onClose();
  };

  const yearsFromNow = Math.floor(
    (futureDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
  );

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getTimeDescription = () => {
    if (yearsFromNow === 0) {
      const monthsFromNow = Math.floor(
        (futureDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
      );
      if (monthsFromNow === 0) {
        return 'later this month';
      }
      return monthsFromNow === 1 ? 'next month' : `in ${monthsFromNow} months`;
    }
    return yearsFromNow === 1 ? 'next year' : `in ${yearsFromNow} years`;
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-black border border-gray-800 rounded-2xl md:max-w-md w-full md:w-full shadow-2xl">
        <div className="p-6 md:p-8">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold mb-2 text-white">Create Time Capsule</h2>
          <p className="text-gray-400 text-sm mb-6">
            Write a message to yourself {getTimeDescription()}. 
            It will be delivered on {formatDate(futureDate)}.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Your Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full p-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-gray-700 text-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Message to Your Future Self
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Dear future me..."
                rows={6}
                className="w-full p-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-gray-700 text-white resize-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
            >
              Send to the Future
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TimeCapsuleModal;