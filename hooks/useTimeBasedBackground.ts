
import { useState, useEffect } from 'react';

export const useTimeBasedBackground = (): string => {
  const [backgroundClass, setBackgroundClass] = useState('');

  useEffect(() => {
    const getBackgroundStyle = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        // Morning (5am - 11am)
        return 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-700 text-gray-200';
      } else if (hour >= 12 && hour < 18) {
        // Afternoon (12pm - 5pm)
        return 'bg-gradient-to-br from-slate-900 via-gray-900 to-black text-gray-300';
      } else if (hour >= 18 && hour < 22) {
        // Evening (6pm - 9pm)
        return 'bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-gray-200';
      } else {
        // Night (10pm - 4am)
        return 'bg-black text-gray-300';
      }
    };
    
    setBackgroundClass(getBackgroundStyle());
  }, []);

  return backgroundClass;
};
