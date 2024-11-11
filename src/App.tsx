import React, { useState, useEffect } from 'react';
import { Hourglass } from 'lucide-react';
import LifeGrid from './components/LifeGrid';
import SettingsModal from './components/SettingsModal';
import LifeProgressBar from './components/LifeProgressBar';

interface UserSettings {
  name: string;
  gender: string;
  birthDate: Date;
  lifeExpectancy: number;
}

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Martin',
  gender: 'male',
  birthDate: new Date('1993-12-04'),
  lifeExpectancy: 80
};

const loadSettings = (): UserSettings => {
  const saved = localStorage.getItem('userSettings');
  if (saved) {
    const parsed = JSON.parse(saved);
    return {
      ...parsed,
      birthDate: new Date(parsed.birthDate)
    };
  }
  return DEFAULT_SETTINGS;
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  const calculateWeeksLeft = (birthDate: Date, lifeExpectancy: number) => {
    const now = new Date();
    const totalWeeks = lifeExpectancy * 52;
    const weeksLived = Math.floor((now.getTime() - birthDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return Math.max(0, totalWeeks - weeksLived);
  };

  const weeksLeft = calculateWeeksLeft(settings.birthDate, settings.lifeExpectancy);

  return (
    <div className="min-h-screen bg-black py-12 px-4 text-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Your journey in weeks</h1>
          <p className="text-xl text-white mb-6">
            {settings.name}, you have {weeksLeft.toLocaleString()} weeks left. Make them count 🫡{' '}
            <button
              onClick={() => setIsModalOpen(true)}
              className="font-bold text-yellow-400 opacity-100 dark:text-yellow-300 hover:opacity-70"
            >
              (Not {settings.name}?)
            </button>
          </p>
          <div className="max-w-3xl mx-auto">
            <LifeProgressBar
              birthDate={settings.birthDate}
              lifeExpectancy={settings.lifeExpectancy}
            />
          </div>
        </div>

        <SettingsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={setSettings}
          initialSettings={settings}
        />

        <div className="mt-8">
          <LifeGrid
            birthDate={settings.birthDate}
            lifeExpectancy={settings.lifeExpectancy}
          />
        </div>
      </div>
    </div>
  );
};

export default App;