import React from 'react';
import { Calendar } from 'lucide-react';

interface DateInputProps {
  year: string;
  month: string;
  day: string;
  onYearChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onDayChange: (value: string) => void;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DateInput: React.FC<DateInputProps> = ({
  year, month, day, onYearChange, onMonthChange, onDayChange
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <Calendar className="w-6 h-6 text-indigo-600 hidden sm:block" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <select
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
          required
        >
          <option value="">Month</option>
          {months.map((m, index) => (
            <option key={m} value={String(index + 1).padStart(2, '0')}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={day}
          onChange={(e) => onDayChange(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
          required
        >
          <option value="">Day</option>
          {days.map(d => (
            <option key={d} value={String(d).padStart(2, '0')}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
          required
        >
          <option value="">Year</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DateInput;