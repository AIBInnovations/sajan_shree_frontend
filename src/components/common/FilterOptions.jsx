// components/common/FilterOptions.jsx
import React from 'react';
import { Filter } from 'lucide-react';

const FilterOptions = ({ options, selected, onChange, label = 'Filter' }) => {
  return (
    <div className="relative">
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-8 py-2 border border-input rounded-md leading-5 bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Filter className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
};

export default FilterOptions;