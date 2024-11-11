import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface UserSettings {
  name: string;
  gender: string;
  birthDate: Date;
  lifeExpectancy: number;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: UserSettings) => void;
  initialSettings: UserSettings;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, initialSettings }) => {
  const [name, setName] = useState(initialSettings.name);
  const [gender, setGender] = useState(initialSettings.gender);
  const [lifeExpectancy, setLifeExpectancy] = useState(String(initialSettings.lifeExpectancy));
  
  const [year, setYear] = useState(initialSettings.birthDate.getFullYear().toString());
  const [month, setMonth] = useState((initialSettings.birthDate.getMonth() + 1).toString().padStart(2, '0'));
  const [day, setDay] = useState(initialSettings.birthDate.getDate().toString().padStart(2, '0'));

  useEffect(() => {
    if (isOpen) {
      setName(initialSettings.name);
      setGender(initialSettings.gender);
      setLifeExpectancy(String(initialSettings.lifeExpectancy));
      setYear(initialSettings.birthDate.getFullYear().toString());
      setMonth((initialSettings.birthDate.getMonth() + 1).toString().padStart(2, '0'));
      setDay(initialSettings.birthDate.getDate().toString().padStart(2, '0'));
    }
  }, [isOpen, initialSettings]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const birthDate = new Date(`${year}-${month}-${day}`);
    onSave({
      name,
      gender,
      birthDate,
      lifeExpectancy: parseInt(lifeExpectancy, 10)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black border border-gray-800 rounded-xl p-6 w-full max-w-md relative text-gray-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-white">Personalize Your Journey</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-gray-700 text-white"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Birth Date
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="YYYY"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="p-2 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-gray-700 text-white"
                required
              />
              <input
                type="text"
                placeholder="MM"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="p-2 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-gray-700 text-white"
                required
              />
              <input
                type="text"
                placeholder="DD"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="p-2 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-gray-700 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Life Expectancy (years)
            </label>
            <input
              type="number"
              value={lifeExpectancy}
              onChange={(e) => setLifeExpectancy(e.target.value)}
              min="1"
              max="150"
              className="w-full p-2 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-gray-700 text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Begin Your Journey
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;