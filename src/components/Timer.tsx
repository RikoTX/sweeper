import React, { useEffect, useState } from "react";
import "./Timer.css";

type TimerProps = {
  start: boolean;
};

export default function Timer({ start }: TimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!start) return; 

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [start]);

  const display = String(seconds).padStart(3, "0");

  return (
    <div className="timer">
      {display.split("").map((digit, i) => (
        <div key={i} className="digit">{digit}</div>
      ))}
    </div>
  );
}
