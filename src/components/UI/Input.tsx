import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium" style={{ color: '#888' }}>{label}</label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-xl text-white transition-all focus:outline-none ${className}`}
          style={{
            background: '#111',
            border: '1px solid #222',
          }}
          {...props}
        />
        {error && <p className="text-sm" style={{ color: '#ff4444' }}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
