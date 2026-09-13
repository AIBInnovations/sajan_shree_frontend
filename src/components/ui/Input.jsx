import React from 'react';

const Input = React.forwardRef(({ className = '', ...rest }, ref) => (
  <input
    ref={ref}
    className={`h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:bg-muted disabled:opacity-50 ${className}`}
    {...rest}
  />
));

Input.displayName = 'Input';

export default Input;
