import React, { useState, useEffect } from "react";
import { Timer } from "lucide-react";

interface SessionTimerProps {
  startTime: Date;
}

export function SessionTimer({ startTime }: SessionTimerProps) {
  const [elapsedTime, setElapsedTime] = useState("00:00:00");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsedTime(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    // Update immediately and then every second
    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="flex items-center space-x-2 text-gray-600 dark:text-white">
      <Timer className="h-5 w-5" />
      <span className="font-mono text-lg">{elapsedTime}</span>
    </div>
  );
}