import React, { useEffect, useState } from 'react';
import './loadingscreen.css';
import doneSound from '../../Assets/loading.wav';

const LoadingScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [canPlaySound, setCanPlaySound] = useState(false);

  useEffect(() => {
    const audio = new Audio(doneSound);

    const allowSound = () => {
      setCanPlaySound(true);
      window.removeEventListener('click', allowSound);
      window.removeEventListener('keydown', allowSound);
    };

    // Wait for user interaction
    window.addEventListener('click', allowSound);
    window.addEventListener('keydown', allowSound);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 1;
        clearInterval(interval);
        setTimeout(() => {
          if (canPlaySound) audio.play();
          if (typeof onFinish === 'function') onFinish();
        }, 500);
        return 100;
      });
    }, 30);

    return () => {
      clearInterval(interval);
      window.removeEventListener('click', allowSound);
      window.removeEventListener('keydown', allowSound);
    };
  }, [onFinish, canPlaySound]);

  const totalBoxes = 30;
  const filledBoxes = Math.round((progress / 100) * totalBoxes);

  return (
    <div className="loading-screen">
      <div className="scanlines" />
      <div className="loading-text">
        INITIALIZING ROADMAP ...
        <span className="loading-percent">{progress}%</span>
      </div>
      <div className="loading-bar">
        {Array.from({ length: totalBoxes }).map((_, i) => (
          <div
            className={`loading-box ${i < filledBoxes ? 'filled' : ''}`}
            key={i}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
