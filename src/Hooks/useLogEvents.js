// useLogEvents.js
import { useEffect, useRef } from 'react';

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
  const logoElRef = useRef(null);          // track which element we attached to
  const logoResetTimer = useRef(null);     // track the triple-click reset timer
  const logoAttachPoll = useRef(null);     // poller for late ref availability

  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR guard

    const resetIdle = () => {
      lastActivity.current = Date.now();
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        addLog('User inactive for 60s...');
      }, 60_000);
    };

    const normalizeKey = (k) => {
      // keep non-printable keys (e.g., ArrowUp) as-is; normalize single chars
      return k && k.length === 1 ? k.toLowerCase() : k;
    };

    const handleClick = (e) => {
      addLog(`User clicked at (${e.clientX}, ${e.clientY})`);
      resetIdle();
    };

    const handlePointerMove = () => {
      // light-weight idle heartbeat on movement
      resetIdle();
    };

    const handleScroll = () => {
      resetIdle();
    };

    const handleVisibility = () => {
      if (!document.hidden) resetIdle();
    };

    const handleKey = (e) => {
      const key = normalizeKey(e.key);
      addLog(`Key pressed: ${key}`);
      resetIdle();

      keys.current.push(key);
      if (keys.current.length > KONAMI_CODE.length) {
        keys.current.shift();
      }
      if (keys.current.join(',') === KONAMI_CODE.join(',')) {
        addLog('Secret link unlocked 🕹️ https://boulderbugle.com/top-secret-link-f7zgtbY4');  // dont look!
        keys.current = []; // reset after unlock
      }
    };

    const handleContextMenu = () => {
      addLog('Curious user. Right-click detected.');
      resetIdle();
    };

    const handleLogoClick = () => {
      clickCount.current += 1;
      addLog('beep boop'); // dont look!


      if (clickCount.current === 100) {
        addLog('Secret panel accessed (coming soon...)'); // dont look!
        clickCount.current = 0;
      }

      // reset counter after 1 second (clear previous if any)
      clearTimeout(logoResetTimer.current);
      logoResetTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 1000);
    };

    // Attach global listeners
    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKey);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    resetIdle();

    // Attach to logo when available (refs don't re-render on .current updates)
    const tryAttachLogo = () => {
      const el = logoRef?.current;
      if (el && el !== logoElRef.current) {
        // cleanup old if any
        if (logoElRef.current) {
          logoElRef.current.removeEventListener('click', handleLogoClick);
        }
        logoElRef.current = el;
        logoElRef.current.addEventListener('click', handleLogoClick);
        return true;
      }
      return false;
    };

    // attempt immediately, then poll briefly if not yet available
    if (!tryAttachLogo()) {
      logoAttachPoll.current = setInterval(() => {
        if (tryAttachLogo()) {
          clearInterval(logoAttachPoll.current);
          logoAttachPoll.current = null;
        }
      }, 150);
    }

    // Cleanup
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibility);

      clearTimeout(idleTimer.current);
      clearTimeout(logoResetTimer.current);
      if (logoAttachPoll.current) clearInterval(logoAttachPoll.current);

      if (logoElRef.current) {
        logoElRef.current.removeEventListener('click', handleLogoClick);
        logoElRef.current = null;
      }
    };
  }, [addLog, logoRef]);
}
