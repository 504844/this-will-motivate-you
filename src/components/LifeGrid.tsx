import React, { useState } from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface LifeGridProps {
  birthDate: Date;
  lifeExpectancy: number;
}

const WEEKS_IN_YEAR = 52;
const WEEKS_PER_ROW = 4;
const YEARS_PER_ROW = 13;

const LifeGrid: React.FC<LifeGridProps> = ({ birthDate, lifeExpectancy }) => {
  const [showYears, setShowYears] = useState(() => {
    const saved = localStorage.getItem('showYears');
    return saved ? JSON.parse(saved) : false;
  });

  const now = new Date();
  const totalWeeks = lifeExpectancy * WEEKS_IN_YEAR;

  const getCurrentWeekIndex = () => {
    const weeksSinceBirth = Math.floor(
      (now.getTime() - birthDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    return weeksSinceBirth;
  };

  const currentWeekIndex = getCurrentWeekIndex();
  
  const isBirthdayWeek = (weekTimestamp: number): boolean => {
    const weekStart = new Date(weekTimestamp);
    const weekEnd = new Date(weekTimestamp + 6 * 24 * 60 * 60 * 1000);
    const birthday = new Date(
      weekStart.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );
    
    weekStart.setHours(0, 0, 0, 0);
    weekEnd.setHours(23, 59, 59, 999);
    birthday.setHours(12, 0, 0, 0);
    
    return birthday >= weekStart && birthday <= weekEnd;
  };

  const getWeekStatus = (weekIndex: number) => {
    const weekTimestamp = birthDate.getTime() + weekIndex * 7 * 24 * 60 * 60 * 1000;
    const isCurrentWeek = weekTimestamp <= now.getTime() && 
      weekTimestamp + 7 * 24 * 60 * 60 * 1000 > now.getTime();
    
    if (weekIndex === totalWeeks - 1) return 'death';
    if (isCurrentWeek) return 'current';
    if (isBirthdayWeek(weekTimestamp)) return 'birthday';
    if (weekTimestamp < now.getTime()) return 'lived';
    return 'future';
  };

  const yearRows = [];
  for (let i = 0; i < lifeExpectancy; i += YEARS_PER_ROW) {
    yearRows.push(Array.from({ length: Math.min(YEARS_PER_ROW, lifeExpectancy - i) }, (_, j) => {
      const yearIndex = i + j;
      const weeks = Array.from({ length: WEEKS_IN_YEAR }, (_, weekIndex) => {
        const absoluteWeekIndex = yearIndex * WEEKS_IN_YEAR + weekIndex;
        return {
          status: getWeekStatus(absoluteWeekIndex),
          weekIndex: absoluteWeekIndex
        };
      });

      const weekRows = [];
      for (let k = 0; k < weeks.length; k += WEEKS_PER_ROW) {
        weekRows.push(weeks.slice(k, k + WEEKS_PER_ROW));
      }
      return { yearIndex, weekRows };
    }));
  }

  return (
    <div className="space-y-8 max-w-[95vw] mx-auto p-4">
      <div className="sticky top-0 bg-black z-10 py-4">
        <div className="flex justify-center items-center space-x-2 md:space-x-4 text-[10px] sm:text-xs md:text-sm text-gray-400">
          <span className="flex items-center whitespace-nowrap">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gray-400 mr-1 md:mr-2"></div>
            Lived
          </span>
          <span className="flex items-center whitespace-nowrap">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#ff00bf] mr-1 md:mr-2"></div>
            Birthday
          </span>
          <span className="flex items-center whitespace-nowrap">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 mr-1 md:mr-2 animate-pulse-emerald"></div>
            Current
          </span>
          <span className="flex items-center whitespace-nowrap">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gray-700 mr-1 md:mr-2"></div>
            Future
          </span>
          <span className="flex items-center whitespace-nowrap">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 mr-1 md:mr-2 animate-pulse-rose"></div>
            Death
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-8">
        <p className="text-[10px] sm:text-xs md:text-sm text-gray-400">
          Each block of bubbles below represents one year of your life
        </p>
        <button
          onClick={() => setShowYears(!showYears)}
          className="hidden md:flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
        >
          {showYears ? (
            <ToggleRight className="w-6 h-6" />
          ) : (
            <ToggleLeft className="w-6 h-6" />
          )}
          <span className="text-sm">Show years</span>
        </button>
      </div>

      {yearRows.map((yearRow, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-13 gap-1 md:gap-6">
          {yearRow.map(({ yearIndex, weekRows }) => (
            <div key={yearIndex} className="space-y-1">
              {showYears && (
                <div className="hidden md:block text-gray-500 text-xs text-center">
                  Year {yearIndex}
                </div>
              )}
              <div className="grid grid-cols-4 gap-[0.5px] md:gap-1">
                {weekRows.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    {row.map(({ status, weekIndex }) => {
                      const baseClass = status === 'lived' ? 'bg-gray-400' :
                                      status === 'current' ? 'animate-pulse-emerald' :
                                      status === 'death' ? 'animate-pulse-rose' :
                                      status === 'birthday' ? 'bg-[#ff00bf]' :
                                      'bg-gray-700';

                      return (
                        <div
                          key={weekIndex}
                          className={`w-[3px] h-[3px] md:w-2 md:h-2 rounded-full ${baseClass}`}
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LifeGrid;