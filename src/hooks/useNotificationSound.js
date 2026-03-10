import { useCallback, useRef } from 'react';

/**
 * Hook to play notification sounds
 */
export const useNotificationSound = () => {
  const audioContextRef = useRef(null);

  const playSound = useCallback(() => {
    try {
      // Use Web Audio API for generating sound without external files
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      
      // Create oscillator for notification tone
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Play a pleasant two-tone notification sound
      const now = ctx.currentTime;
      
      // First tone (higher pitch)
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, now); // D5
      oscillator.frequency.setValueAtTime(880, now + 0.1); // A5
      
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      oscillator.start(now);
      oscillator.stop(now + 0.5);

      // Second tone (for emphasis)
      const oscillator2 = ctx.createOscillator();
      const gainNode2 = ctx.createGain();

      oscillator2.connect(gainNode2);
      gainNode2.connect(ctx.destination);

      oscillator2.type = 'sine';
      oscillator2.frequency.setValueAtTime(880, now + 0.15); // A5
      oscillator2.frequency.setValueAtTime(1174.66, now + 0.25); // D6
      
      gainNode2.gain.setValueAtTime(0.2, now + 0.15);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      oscillator2.start(now + 0.15);
      oscillator2.stop(now + 0.6);
    } catch (error) {
      console.error('[SOUND] Failed to play notification sound:', error);
    }
  }, []);

  return { playSound };
};
