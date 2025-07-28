import React, { useEffect, useRef } from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

export default function useLogEvents(addLog, logoRef) {
  const keys = useRef([]);
  const clickCount = useRef(0);
  const idleTimer = useRef(null);
  const lastActivity = useRef(Date.now());

  useEffect(() => {
    const handleClick = (e) => {
      addLog(`User clicked at (${e.clientX}, ${e.clientY})`);
      resetIdle();
    };

    const handleKey = (e) => {
      addLog(`Key pressed: ${e.key}`);
      resetIdle();

      keys.current.push(e.key);
      if (keys.current.length > KONAMI_CODE.length) {
        keys.current.shift();
      }

      if (keys.current.join(',') === KONAMI_CODE.join(',')) {
        addLog('Easter egg unlocked 🕹️');
        keys.current = []; // reset after unlock
      }
    };

    const handleContextMenu = (e) => {
      addLog('Curious user. Right-click detected.');
    };

    const handleLogoClick = () => {
      clickCount.current += 1;

      if (clickCount.current === 3) {
        addLog('Secret dev panel accessed 👨‍💻');
        clickCount.current = 0;
      }

      // reset counter after 1 second
      setTimeout(() => {
        clickCount.current = 0;
      }, 1000);
    };

    const resetIdle = () => {
      lastActivity.current = Date.now();
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        addLog('User inactive for 60s...');
      }, 60000);
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKey);
    window.addEventListener('contextmenu', handleContextMenu);
    resetIdle();

    if (logoRef?.current) {
      logoRef.current.addEventListener('click', handleLogoClick);
    }

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('contextmenu', handleContextMenu);
      clearTimeout(idleTimer.current);
      if (logoRef?.current) {
        logoRef.current.removeEventListener('click', handleLogoClick);
      }
    };
  }, [addLog, logoRef]);
}
