import React from 'react';

const Select = React.forwardRef(({ className = '', children, ...rest }, ref) => (
  <select
    ref={ref}
    className={`h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
    {...rest}
  >
    {children}
  </select>
));

Select.displayName = 'Select';

export default Select;
