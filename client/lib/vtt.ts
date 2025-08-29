export function parseVttEndTime(vtt: string): number {
  // Finds the maximum cue end time in seconds
  let max = 0;
  const lines = vtt.split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s+-->\s+(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);
    if (m) {
      const h = Number(m[5]);
      const m2 = Number(m[6]);
      const s = Number(m[7]);
      const ms = Number(m[8]);
      const secs = h * 3600 + m2 * 60 + s + ms / 1000;
      if (secs > max) max = secs;
    }
  }
  // Also support mm:ss.mmm format
  for (const line of lines) {
    const m = line.match(/(\d{2}):(\d{2})\.(\d{3})\s+-->\s+(\d{2}):(\d{2})\.(\d{3})/);
    if (m) {
      const mm = Number(m[4]);
      const ss = Number(m[5]);
      const ms = Number(m[6]);
      const secs = mm * 60 + ss + ms / 1000;
      if (secs > max) max = secs;
    }
  }
  return max || 0;
}
