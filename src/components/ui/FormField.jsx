import React from 'react';

const FormField = ({ label, htmlFor, error, children }) => (
  <div className="space-y-2">
    {label && (
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
    )}
    {children}
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
);

export default FormField;
