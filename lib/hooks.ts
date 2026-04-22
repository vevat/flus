"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Returns pointer handlers that fire `callback` once on tap,
 * then auto-repeat while the button is held down.
 *
 * Also tracks tap count and returns `showHint` (true after `hintAfter` taps)
 * so the UI can suggest "hold to go faster". The hint auto-dismisses after 3s.
 */
export function useHoldRepeat(
  callback: () => void,
  { initialDelay = 400, repeatDelay = 80, hintAfter = 3 } = {},
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeater = useRef<ReturnType<typeof setInterval> | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cb = useRef(callback);
  cb.current = callback;

  const [tapCount, setTapCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const stop = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (repeater.current) clearInterval(repeater.current);
    timer.current = null;
    repeater.current = null;
  }, []);

  const start = useCallback(() => {
    cb.current();
    setTapCount((c) => {
      const next = c + 1;
      if (next >= hintAfter) {
        setShowHint(true);
        if (hintTimer.current) clearTimeout(hintTimer.current);
        hintTimer.current = setTimeout(() => setShowHint(false), 3000);
      }
      return next;
    });
    timer.current = setTimeout(() => {
      setShowHint(false);
      repeater.current = setInterval(() => cb.current(), repeatDelay);
    }, initialDelay);
  }, [initialDelay, repeatDelay, hintAfter]);

  useEffect(() => {
    return () => {
      stop();
      if (hintTimer.current) clearTimeout(hintTimer.current);
    };
  }, [stop]);

  return {
    handlers: {
      onPointerDown: start,
      onPointerUp: stop,
      onPointerLeave: stop,
    },
    showHint,
    dismissHint: useCallback(() => setShowHint(false), []),
  };
}
