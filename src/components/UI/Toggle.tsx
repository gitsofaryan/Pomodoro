import { motion } from 'framer-motion';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <label className={`flex items-center justify-between cursor-pointer ${disabled ? 'opacity-50' : ''}`}>
      {label && <span style={{ color: '#888' }}>{label}</span>}
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        className="relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer"
        style={{
          background: checked ? '#00d26a' : '#222',
        }}
        disabled={disabled}
      >
        <motion.div
          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </label>
  );
}
