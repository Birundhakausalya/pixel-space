export function generateCertificateSVG(name: string, stats: { learn: number; games: number; practice: number; }) {
  const date = new Date().toLocaleDateString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#fff9f9"/>
  <rect x="40" y="40" width="1120" height="720" rx="24" fill="none" stroke="url(#g)" stroke-width="8"/>
  <text x="50%" y="140" font-size="48" font-family="Segoe UI, Roboto, Arial" text-anchor="middle" fill="#111827">Certificate of Achievement</text>
  <text x="50%" y="210" font-size="24" font-family="Segoe UI, Roboto, Arial" text-anchor="middle" fill="#6b7280">awarded to</text>
  <text x="50%" y="280" font-size="56" font-family="Segoe UI, Roboto, Arial" text-anchor="middle" fill="#111827">${name}</text>
  <text x="50%" y="340" font-size="20" font-family="Segoe UI, Roboto, Arial" text-anchor="middle" fill="#6b7280">for outstanding progress in SentiLearn</text>
  <g transform="translate(200,380)">
    <rect width="800" height="2" fill="#e5e7eb"/>
  </g>
  <g transform="translate(200,420)">
    <rect width="800" height="120" rx="16" fill="#f3f4f6"/>
    <text x="400" y="50" font-size="20" text-anchor="middle" font-family="Segoe UI, Roboto, Arial" fill="#374151">Progress Summary</text>
    <text x="200" y="90" font-size="18" text-anchor="middle" font-family="Segoe UI, Roboto, Arial" fill="#111827">Learning: ${stats.learn}%</text>
    <text x="400" y="90" font-size="18" text-anchor="middle" font-family="Segoe UI, Roboto, Arial" fill="#111827">Games: ${stats.games}%</text>
    <text x="600" y="90" font-size="18" text-anchor="middle" font-family="Segoe UI, Roboto, Arial" fill="#111827">Practice: ${stats.practice}%</text>
  </g>
  <g transform="translate(200,580)">
    <text x="0" y="0" font-size="18" font-family="Segoe UI, Roboto, Arial" fill="#6b7280">Date: ${date}</text>
    <text x="800" y="0" font-size="18" font-family="Segoe UI, Roboto, Arial" text-anchor="end" fill="#6b7280">Signature:</text>
  </g>
  <g transform="translate(760,610)">
    <path d="M0,20 C30,-10 60,40 100,10 C120,-5 150,35 190,15" fill="none" stroke="#7c3aed" stroke-width="3" stroke-linecap="round"/>
    <text x="200" y="20" font-size="20" font-family="Segoe UI, Roboto, Arial" font-style="italic" fill="#7c3aed">SentiLearn</text>
  </g>
</svg>`;
}

export function downloadCertificate(name: string, stats: { learn: number; games: number; practice: number; }) {
  const svg = generateCertificateSVG(name, stats);
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `SentiLearn-Certificate-${name.replace(/\s+/g, "_")}.svg`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
