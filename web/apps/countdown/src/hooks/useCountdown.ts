import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getNextMondayAt10AM(): Date {
  const now = new Date();
  
  // Create a date for the next Monday at 10:00 AM Brasilia time (UTC-3)
  const target = new Date();
  
  // Get current day (0 = Sunday, 1 = Monday, etc.)
  const currentDay = now.getDay();
  
  // Calculate days until next Monday
  let daysUntilMonday = (1 - currentDay + 7) % 7;
  
  // If it's Monday but past 10 AM Brasilia time, go to next Monday
  if (daysUntilMonday === 0) {
    // Check if we're past 9 AM in Brasilia (UTC-3)
    const brasiliaOffset = -3 * 60; // -3 hours in minutes
    const localOffset = now.getTimezoneOffset();
    const brasiliaTime = new Date(now.getTime() + (localOffset + brasiliaOffset) * 60 * 1000);
    
    if (brasiliaTime.getHours() >= 9) {
      daysUntilMonday = 7;
    }
  }
  
  target.setDate(now.getDate() + daysUntilMonday);
  
  // Set to 9:00 AM Brasilia time (12:00 UTC)
  target.setUTCHours(12, 0, 0, 0);
  
  return target;
}

export function useCountdown() {
  const [targetDate] = useState<Date>(getNextMondayAt10AM);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return { timeLeft, isExpired, targetDate };
}
