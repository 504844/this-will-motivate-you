import React from 'react';
import { Trash2, Package } from 'lucide-react';

interface TimeCapsule {
  id: string;
  weekIndex: number;
  email: string;
  message: string;
  createdAt: string;
  deliveryDate: string;
}

interface TimeCapsuleListProps {
  timeCapsules: TimeCapsule[];
  getFutureDate: (weekIndex: number) => Date;
  onDelete: (id: string) => void;
}

interface GroupedCapsules {
  timeframe: string;
  count: number;
  ids: string[];
}

const TimeCapsuleList: React.FC<TimeCapsuleListProps> = ({ 
  timeCapsules, 
  getFutureDate,
  onDelete
}) => {
  const groupCapsulesByTimeframe = (): GroupedCapsules[] => {
    const now = new Date();
    const groups: { [key: string]: GroupedCapsules } = {};

    timeCapsules.forEach(capsule => {
      const deliveryDate = new Date(capsule.deliveryDate);
      const timeLeft = deliveryDate.getTime() - now.getTime();
      const weeksLeft = Math.floor(timeLeft / (7 * 24 * 60 * 60 * 1000));
      const yearsLeft = Math.floor(weeksLeft / 52);

      let timeframe: string;
      if (weeksLeft < 1) {
        timeframe = 'this week';
      } else if (yearsLeft < 1) {
        timeframe = `in ${weeksLeft} ${weeksLeft === 1 ? 'week' : 'weeks'}`;
      } else {
        timeframe = `in ${yearsLeft} ${yearsLeft === 1 ? 'year' : 'years'}`;
      }

      if (!groups[timeframe]) {
        groups[timeframe] = {
          timeframe,
          count: 0,
          ids: []
        };
      }
      groups[timeframe].count++;
      groups[timeframe].ids.push(capsule.id);
    });

    return Object.values(groups).sort((a, b) => {
      // Sort by time: "this week" first, then by weeks, then by years
      if (a.timeframe === 'this week') return -1;
      if (b.timeframe === 'this week') return 1;
      
      const aWeeks = a.timeframe.match(/in (\d+) weeks?/);
      const bWeeks = b.timeframe.match(/in (\d+) weeks?/);
      const aYears = a.timeframe.match(/in (\d+) years?/);
      const bYears = b.timeframe.match(/in (\d+) years?/);

      if (aWeeks && bWeeks) {
        return parseInt(aWeeks[1]) - parseInt(bWeeks[1]);
      }
      if (aWeeks) return -1;
      if (bWeeks) return 1;
      if (aYears && bYears) {
        return parseInt(aYears[1]) - parseInt(bYears[1]);
      }
      return 0;
    });
  };

  const groupedCapsules = groupCapsulesByTimeframe();

  const handleDeleteGroup = (ids: string[]) => {
    if (confirm(`Are you sure you want to delete ${ids.length > 1 ? 'these time capsules' : 'this time capsule'}?`)) {
      ids.forEach(id => onDelete(id));
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {groupedCapsules.map(({ timeframe, count, ids }) => (
        <div
          key={timeframe}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-black rounded-full text-sm text-gray-300 hover:text-white border-2 border-white hover:border-white transition-colors group"
        >
          <Package className="w-3.5 h-3.5 text-indigo-500" />
          <span>
            {count > 1 ? `${count} capsules ${timeframe}` : `1 capsule ${timeframe}`}
          </span>
          <button
            onClick={() => handleDeleteGroup(ids)}
            className="text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 -mr-1"
            title={`Delete ${count > 1 ? 'capsules' : 'capsule'}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default TimeCapsuleList;