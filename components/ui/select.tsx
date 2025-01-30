import React from 'react';

// Correct way to import ReactNode with 'import type'
import type { ReactNode } from 'react';

// Type for Select props
interface SelectProps {
  children: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  [key: string]: any; // For any other props you might pass
}

export const Select = ({ children, value, onValueChange, ...props }: SelectProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      {...props}
    >
      {children}
    </select>
  );
};

// Type for SelectTrigger props
interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export const SelectTrigger = ({ children, className = '', ...props }: SelectTriggerProps) => {
  return (
    <div className={`select-trigger ${className}`} {...props}>
      {children}
    </div>
  );
};

// Type for SelectValue props
interface SelectValueProps {
  children: ReactNode;
}

export const SelectValue = ({ children }: SelectValueProps) => {
  return <span className="select-value">{children}</span>;
};

// Type for SelectContent props
interface SelectContentProps {
  children: ReactNode;
}

export const SelectContent = ({ children }: SelectContentProps) => {
  return <div className="select-content">{children}</div>;
};

// Type for SelectItem props
interface SelectItemProps {
  value: string;
  children: ReactNode;
  [key: string]: any;
}

export const SelectItem = ({ value, children, ...props }: SelectItemProps) => {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
};
