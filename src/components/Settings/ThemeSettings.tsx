import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useSettings } from '../../contexts';
import { ThemeColor, THEME_COLORS } from '../../types';

const themes: { id: ThemeColor; name: string }[] = [
  { id: 'red', name: 'Ruby' },
  { id: 'blue', name: 'Ocean' },
  { id: 'purple', name: 'Lavender' },
  { id: 'green', name: 'Mint' },
  { id: 'orange', name: 'Sunset' },
];

export function ThemeSettings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/50">Choose your accent color</p>
      <div className="flex gap-3">
        {themes.map(theme => {
          const color = THEME_COLORS[theme.id];
          const isSelected = settings.theme === theme.id;

          return (
            <motion.button
              key={theme.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateSettings({ theme: theme.id })}
              className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{
                backgroundColor: color.primary,
                boxShadow: isSelected ? `0 0 20px ${color.glow}` : 'none',
              }}
              title={theme.name}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.3 }}
                >
                  <Check size={18} className="text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
