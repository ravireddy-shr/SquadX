import { type FC } from 'react';

interface FilterSliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  unit?: string;
}

export const FilterSlider: FC<FilterSliderProps> = ({
  label,
  min,
  max,
  value,
  onChange,
  step = 0.1,
  unit = '',
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <span className="text-sm font-semibold text-blue-400">
          {value.toFixed(1)}
          {unit}
        </span>
      </div>
      <div className="relative h-2 bg-gray-700/50 rounded-full">
        <div
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
        <div
          className="absolute top-1/2 w-6 h-6 bg-white rounded-full shadow-[0_0_0_4px_rgba(37,99,235,0.5)] pointer-events-none transition-all"
          style={{
            left: `${percentage}%`,
            transform: 'translate(-50%,-50%)',
          }}
        />
      </div>
    </div>
  );
};
