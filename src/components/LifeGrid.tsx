import React from 'react';

interface LifeGridProps {
  birthDate: Date;
  lifeExpectancy: number;
}

const WEEKS_IN_YEAR = 52;
const WEEKS_PER_ROW = 4;
const YEARS_PER_ROW = 13;

const LifeGrid: React.FC<LifeGridProps> = ({ birthDate, lifeExpectancy }) => {
  const now = new Date();
  const totalWeeks = lifeExpectancy * WEEKS_IN_YEAR;
  
  const getWeekStatus = (weekIndex: number) => {
    const weekTimestamp = birthDate.getTime() + weekIndex * 7 * 24 * 60 * 60 * 1000;
    const isCurrentWeek = weekTimestamp <= now.getTime() && 
      weekTimestamp + 7 * 24 * 60 * 60 * 1000 > now.getTime();
    
    if (weekIndex === totalWeeks - 1) return 'death';
    if (isCurrentWeek) return 'current';
    if (weekTimestamp < now.getTime()) return 'lived';
    return 'future';
  };

  const yearRows = [];
  for (let i = 0; i < lifeExpectancy; i += YEARS_PER_ROW) {
    yearRows.push(Array.from({ length: Math.min(YEARS_PER_ROW, lifeExpectancy - i) }, (_, j) => {
      const yearIndex = i + j;
      const weeks = Array.from({ length: WEEKS_IN_YEAR }, (_, weekIndex) => {
        const absoluteWeekIndex = yearIndex * WEEKS_IN_YEAR + weekIndex;
        return getWeekStatus(absoluteWeekIndex);
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
      {yearRows.map((yearRow, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-13 gap-6">
          {yearRow.map(({ yearIndex, weekRows }) => (
            <div key={yearIndex} className="grid grid-cols-4 gap-1">
              {weekRows.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  {row.map((status, weekIndex) => (
                    <div
                      key={weekIndex}
                      className={`w-2 h-2 rounded-full ${
                        status === 'lived' ? 'bg-gray-400' :
                        status === 'current' ? 'animate-pulse-emerald' :
                        status === 'death' ? 'animate-pulse-rose' :
                        'bg-gray-700'
                      }`}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LifeGrid;