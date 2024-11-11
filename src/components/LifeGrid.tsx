import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    localStorage.setItem('showYears', JSON.stringify(showYears));
  }, [showYears]);

  const now = new Date();
  const totalWeeks = lifeExpectancy * WEEKS_IN_YEAR;
  
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

  const getWeekDate = (weekIndex: number): { start: Date; end: Date } => {
    const weekTimestamp = birthDate.getTime() + weekIndex * 7 * 24 * 60 * 60 * 1000;
    const weekStart = new Date(weekTimestamp);
    const weekEnd = new Date(weekTimestamp + 6 * 24 * 60 * 60 * 1000);
    
    weekStart.setHours(0, 0, 0, 0);
    weekEnd.setHours(23, 59, 59, 999);
    
    return { start: weekStart, end: weekEnd };
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
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
      <div className="mb-6 space-y-4 sticky top-0 bg-black/80 backdrop-blur-sm pt-4 pb-6 z-10">
        <div className="flex justify-center space-x-4 text-gray-400 flex-wrap gap-y-2">
          <span className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
            Lived Weeks
          </span>
          <span className="flex items-center">
            <div className="w-2 h-2 rounded-full birthday-gradient mr-2"></div>
            Birthday Weeks
          </span>
          <span className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse-emerald"></div>
            Current Week
          </span>
          <span className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-gray-700 mr-2"></div>
            Future Weeks
          </span>
          <span className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse-rose"></div>
            Life Expectancy
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm">
            Each block of bubbles below represents one year of your life
          </p>
          <button
            onClick={() => setShowYears(!showYears)}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            {showYears ? (
              <ToggleRight className="w-6 h-6" />
            ) : (
              <ToggleLeft className="w-6 h-6" />
            )}
            <span className="text-sm">Show years</span>
          </button>
        </div>
      </div>

      {yearRows.map((yearRow, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-13 gap-6">
          {yearRow.map(({ yearIndex, weekRows }) => (
            <div key={yearIndex} className="space-y-2">
              {showYears && (
                <div className="text-gray-500 text-xs text-center">
                  Year {yearIndex}
                </div>
              )}
              <div className="grid grid-cols-4 gap-1">
                {weekRows.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    {row.map(({ status, weekIndex }) => {
                      const { start, end } = getWeekDate(weekIndex);
                      const tooltipText = `Year ${Math.floor(weekIndex / WEEKS_IN_YEAR)}, Week ${(weekIndex % WEEKS_IN_YEAR) + 1}
${formatDate(start)} to ${formatDate(end)}`;

                      const baseClass = status === 'lived' ? 'bg-gray-400' :
                                      status === 'current' ? 'animate-pulse-emerald' :
                                      status === 'death' ? 'animate-pulse-rose' :
                                      status === 'birthday' ? 'birthday-gradient' :
                                      'bg-gray-700';

                      return (
                        <div
                          key={weekIndex}
                          title={tooltipText}
                          className={`w-2 h-2 rounded-full ${baseClass}`}
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