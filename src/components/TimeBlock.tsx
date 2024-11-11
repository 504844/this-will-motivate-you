import React from 'react';
import { Clock } from 'lucide-react';
import BubbleDigit from './BubbleDigit';

interface TimeBlockProps {
  value: number;
  label: string;
  icon?: React.ElementType;
}

const TimeBlock: React.FC<TimeBlockProps> = ({ value, label, icon: Icon = Clock }) => {
  const digits = value.toString().padStart(2, '0').split('');
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
      <Icon className="w-6 h-6 text-indigo-600" />
      <div className="flex gap-2">
        {digits.map((digit, index) => (
          <BubbleDigit key={index} digit={digit} />
        ))}
      </div>
      <span className="text-gray-600 font-medium mt-2">{label}</span>
    </div>
  );
};

export default TimeBlock;