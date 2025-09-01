import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  remainingTime: number;
  className?: string;
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  remainingTime,
  className = "",
  onComplete,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(remainingTime);

  useEffect(() => {
    setSecondsLeft(remainingTime); 
  }, [remainingTime]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup
  }, [secondsLeft, onComplete]);

  const formatTime = (seconds: number): { minutes: string; seconds: string } => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      minutes: minutes.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  };

  const { minutes, seconds } = formatTime(secondsLeft);

  const digitVariants = {
    initial: { y: -8, opacity: 0, scale: 0.95 },
    animate: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.33, 0, 0.67, 1] } },
    exit: { y: 8, opacity: 0, scale: 0.95, transition: { duration: 0.45, ease: [0.33, 0, 0.67, 1] } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center text-sm font-semibold text-blue-600  ${className}`}
    >
    
      <motion.span
        key={`minutes-${minutes}`}
        variants={digitVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="inline-block"
      >
        {minutes}
      </motion.span>
      <span className="mx-0.5">:</span>
      <motion.span
        key={`seconds-${seconds}`}
        variants={digitVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="inline-block"
      >
        {seconds}
      </motion.span>
    </motion.div>
  );
};

export default CountdownTimer;