import React from 'react';

const IconLogo = () => (
  <svg id="logo" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 84 96">
    <title>Logo</title>
    <defs>
      <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4f46e5" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    {/* Pointy-top hexagon */}
    <polygon
      stroke="url(#hexGrad)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      points="42,6 76,25 76,70 42,90 8,70 8,25"
    />
    {/* Clean geometric "L" — stem + foot */}
    <rect x="28" y="24" width="8" height="44" rx="2" fill="url(#hexGrad)" />
    <rect x="28" y="60" width="28" height="8" rx="2" fill="url(#hexGrad)" />
  </svg>
);

export default IconLogo;
