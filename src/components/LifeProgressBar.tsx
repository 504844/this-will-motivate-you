import React from 'react';
import { Baby, Skull } from 'lucide-react';

interface LifeProgressBarProps {
  birthDate: Date;
  lifeExpectancy: number;
}

const LifeProgressBar: React.FC<LifeProgressBarProps> = ({ birthDate, lifeExpectancy }) => {
  const calculateLifePercentage = () => {
    const now = new Date();
    const totalLife = lifeExpectancy * 365.25 * 24 * 60 * 60 * 1000; // Life expectancy in milliseconds
    const livedLife = now.getTime() - birthDate.getTime();
    const percentage = (livedLife / totalLife) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  const percentage = calculateLifePercentage();

  return (
    <div className="min-h-12 md:min-h-13 lg:min-h-12 xl:min-h-14 relative flex items-center w-full gap-[0.5em] py-[0.5em] px-[0.75em] text-base lg:text-lg xl:text-xl rounded-full border-[2px] md:border-[3px] lg:border-[4px] border-gray-700 dark:border-gray-300 overflow-hidden">
      <div 
        className="absolute top-0 bottom-0 left-0 z-10 flex items-center justify-end h-full font-bold rounded-l-full bg-gray-700 dark:bg-gray-300 pr-[0.75em]" 
        style={{ width: `${percentage}%` }}
      >
        <div className="text-gray-100 dark:text-gray-900 text-[0.9em]">
          {percentage.toFixed(1)}%
        </div>
      </div>
      
      <div className="flex items-center gap-[0.5em] z-20 font-bold mix-blend-difference text-gray-100">
        <span>
          <Baby className="w-[1.3em] h-[1.3em]" />
        </span>
        <span className="hidden md:block">Birth</span>
      </div>
      
      <div className="flex items-center gap-[0.5em] z-20 ml-auto font-bold mix-blend-difference text-gray-100">
        <div className="hidden md:block">Death</div>
        <span>
          <Skull className="w-[1.2em] h-[1.2em]" />
        </span>
      </div>
    </div>
  );
};

export default LifeProgressBar;