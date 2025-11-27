
import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelLeft?: string;
  labelRight?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, labelLeft, labelRight }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      {labelLeft && <span className="mr-3 text-sm font-medium text-slate-900">{labelLeft}</span>}
      <input type="checkbox" checked={checked} onChange={handleChange} className="sr-only peer" />
      <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      {labelRight && <span className="ml-3 text-sm font-medium text-slate-900">{labelRight}</span>}
    </label>
  );
};

export default ToggleSwitch;