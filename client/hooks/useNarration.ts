import { useEffect, useRef, useState } from "react";

function extractTextFromVtt(vtt: string) {
  // Strip timestamps and headers, join cue texts
  return vtt
    .split(/\r?\n/)
    .filter((line) => line.trim() && !/WEBVTT/i.test(line) && !/^\d+$/.test(line) && !/-->/.test(line))
    .join(" \n");
}

export function useNarration(videoEl: HTMLVideoElement | null, vtt: string, enabled: boolean) {
  const spokenRef = useRef(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  useEffect(() => {
    if (!videoEl || !supported) return;

    const text = extractTextFromVtt(vtt);

    const onPlay = () => {
      try {
        videoEl.muted = false;
        videoEl.volume = 1;
      } catch {}
      if (!enabled) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.02;
      utter.pitch = 1;
      utter.volume = 1;
      window.speechSynthesis.speak(utter);
      spokenRef.current = true;
    };

    const onPause = () => {
      window.speechSynthesis.cancel();
    };

    const onEnded = () => {
      window.speechSynthesis.cancel();
      spokenRef.current = false;
    };

    videoEl.addEventListener('play', onPlay);
    videoEl.addEventListener('pause', onPause);
    videoEl.addEventListener('ended', onEnded);

    return () => {
      videoEl.removeEventListener('play', onPlay);
      videoEl.removeEventListener('pause', onPause);
      videoEl.removeEventListener('ended', onEnded);
      window.speechSynthesis.cancel();
    };
  }, [videoEl, vtt, enabled, supported]);

  return { supported };
}
