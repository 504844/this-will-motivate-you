import React from 'react';

const digitPatterns: { [key: string]: boolean[][] } = {
  '0': [
    [true, true, true],
    [true, false, true],
    [true, true, true]
  ],
  '1': [
    [false, true, false],
    [false, true, false],
    [false, true, false]
  ],
  '2': [
    [true, true, true],
    [false, true, true],
    [true, true, true]
  ],
  '3': [
    [true, true, true],
    [false, true, true],
    [true, true, true]
  ],
  '4': [
    [true, false, true],
    [true, true, true],
    [false, false, true]
  ],
  '5': [
    [true, true, true],
    [true, true, false],
    [true, true, true]
  ],
  '6': [
    [true, true, true],
    [true, true, false],
    [true, true, true]
  ],
  '7': [
    [true, true, true],
    [false, false, true],
    [false, false, true]
  ],
  '8': [
    [true, true, true],
    [true, true, true],
    [true, true, true]
  ],
  '9': [
    [true, true, true],
    [true, true, true],
    [false, true, true]
  ]
};

interface BubbleDigitProps {
  digit: string;
}

const BubbleDigit: React.FC<BubbleDigitProps> = ({ digit }) => {
  const pattern = digitPatterns[digit] || digitPatterns['0'];

  return (
    <div className="grid grid-rows-3 gap-1 p-1">
      {pattern.map((row, i) => (
        <div key={i} className="flex gap-1">
          {row.map((isActive, j) => (
            <div
              key={j}
              className={`w-2 h-2 rounded-full ${
                isActive ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default BubbleDigit;