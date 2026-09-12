import React from 'react';

const DevelopmentArt = () => (
  <svg viewBox="0 0 480 380" className="hero-art-svg">
    <circle cx="380" cy="80" r="70" fill="rgba(255,255,255,0.08)" />
    <circle cx="60" cy="300" r="50" fill="rgba(255,255,255,0.08)" />
    <g filter="url(#soft-shadow)">
      <rect x="60" y="60" width="320" height="220" rx="16" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" />
      <circle cx="88" cy="88" r="6" fill="rgba(255,255,255,0.6)" />
      <circle cx="108" cy="88" r="6" fill="rgba(255,255,255,0.45)" />
      <circle cx="128" cy="88" r="6" fill="rgba(255,255,255,0.3)" />
      <line x1="60" y1="106" x2="380" y2="106" stroke="rgba(255,255,255,0.25)" />
      <polyline points="180,150 150,180 180,210" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <polyline points="260,150 290,180 260,210" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <line x1="235" y1="145" x2="215" y2="215" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" opacity="0.7" />
      <rect x="80" y="235" width="130" height="14" rx="7" fill="rgba(255,255,255,0.3)" />
      <rect x="80" y="257" width="90" height="14" rx="7" fill="rgba(255,255,255,0.2)" />
    </g>
    <g filter="url(#soft-shadow)">
      <rect x="290" y="230" width="120" height="90" rx="18" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" />
      <rect x="330" y="248" width="40" height="58" rx="8" fill="none" stroke="#ffffff" strokeWidth="4" />
      <line x1="345" y1="292" x2="355" y2="292" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
    </g>
    <defs>
      <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.15" />
      </filter>
    </defs>
  </svg>
);

const GrowthArt = () => (
  <svg viewBox="0 0 480 380" className="hero-art-svg">
    <circle cx="90" cy="70" r="60" fill="rgba(255,255,255,0.08)" />
    <circle cx="400" cy="300" r="55" fill="rgba(255,255,255,0.08)" />
    <g filter="url(#soft-shadow-2)">
      <rect x="60" y="60" width="320" height="220" rx="16" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" />
      <rect x="95" y="200" width="30" height="55" rx="4" fill="rgba(255,255,255,0.5)" />
      <rect x="140" y="175" width="30" height="80" rx="4" fill="rgba(255,255,255,0.65)" />
      <rect x="185" y="150" width="30" height="105" rx="4" fill="rgba(255,255,255,0.8)" />
      <rect x="230" y="120" width="30" height="135" rx="4" fill="#ffffff" />
      <polyline points="100,190 155,165 200,135 245,100 320,90" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <polygon points="320,90 305,95 315,105" fill="#ffffff" opacity="0.9" />
    </g>
    <g filter="url(#soft-shadow-2)">
      <circle cx="345" cy="235" r="52" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" />
      <circle cx="345" cy="235" r="26" fill="none" stroke="#ffffff" strokeWidth="4" />
      <circle cx="345" cy="235" r="14" fill="none" stroke="#ffffff" strokeWidth="4" />
      <circle cx="345" cy="235" r="4" fill="#ffffff" />
    </g>
    <defs>
      <filter id="soft-shadow-2" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.15" />
      </filter>
    </defs>
  </svg>
);

const AiDataArt = () => (
  <svg viewBox="0 0 480 380" className="hero-art-svg">
    <circle cx="400" cy="90" r="65" fill="rgba(255,255,255,0.08)" />
    <circle cx="70" cy="290" r="50" fill="rgba(255,255,255,0.08)" />
    <g filter="url(#soft-shadow-3)">
      <rect x="60" y="60" width="320" height="220" rx="16" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" />
      <g stroke="rgba(255,255,255,0.6)" strokeWidth="2">
        <line x1="120" y1="120" x2="200" y2="100" />
        <line x1="200" y1="100" x2="280" y2="140" />
        <line x1="200" y1="100" x2="150" y2="190" />
        <line x1="280" y1="140" x2="320" y2="210" />
        <line x1="280" y1="140" x2="150" y2="190" />
        <line x1="150" y1="190" x2="230" y2="230" />
        <line x1="320" y1="210" x2="230" y2="230" />
      </g>
      <circle cx="120" cy="120" r="9" fill="#ffffff" />
      <circle cx="200" cy="100" r="11" fill="#ffffff" />
      <circle cx="280" cy="140" r="9" fill="#ffffff" opacity="0.85" />
      <circle cx="150" cy="190" r="9" fill="#ffffff" opacity="0.85" />
      <circle cx="320" cy="210" r="11" fill="#ffffff" />
      <circle cx="230" cy="230" r="9" fill="#ffffff" opacity="0.85" />
    </g>
    <g filter="url(#soft-shadow-3)">
      <rect x="270" y="225" width="130" height="95" rx="18" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" />
      <rect x="295" y="285" width="14" height="20" rx="3" fill="#ffffff" opacity="0.6" />
      <rect x="317" y="270" width="14" height="35" rx="3" fill="#ffffff" opacity="0.8" />
      <rect x="339" y="255" width="14" height="50" rx="3" fill="#ffffff" />
      <rect x="361" y="265" width="14" height="40" rx="3" fill="#ffffff" opacity="0.85" />
    </g>
    <defs>
      <filter id="soft-shadow-3" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.15" />
      </filter>
    </defs>
  </svg>
);

const AboutArt = () => (
  <svg viewBox="0 0 480 380" className="hero-art-svg">
    <circle cx="390" cy="85" r="62" fill="rgba(255,255,255,0.08)" />
    <circle cx="65" cy="295" r="48" fill="rgba(255,255,255,0.08)" />
    <g filter="url(#soft-shadow-4)">
      <rect x="60" y="60" width="320" height="220" rx="16" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" />
      <circle cx="88" cy="88" r="6" fill="rgba(255,255,255,0.6)" />
      <circle cx="108" cy="88" r="6" fill="rgba(255,255,255,0.45)" />
      <circle cx="128" cy="88" r="6" fill="rgba(255,255,255,0.3)" />
      <line x1="60" y1="106" x2="380" y2="106" stroke="rgba(255,255,255,0.25)" />
      <circle cx="175" cy="170" r="34" fill="rgba(255,255,255,0.25)" />
      <circle cx="220" cy="170" r="34" fill="rgba(255,255,255,0.4)" />
      <circle cx="265" cy="170" r="34" fill="rgba(255,255,255,0.25)" />
      <rect x="120" y="235" width="180" height="14" rx="7" fill="rgba(255,255,255,0.3)" />
      <rect x="120" y="257" width="120" height="14" rx="7" fill="rgba(255,255,255,0.2)" />
    </g>
    <g filter="url(#soft-shadow-4)">
      <circle cx="345" cy="235" r="52" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" />
      <g transform="translate(329.4 219.4) scale(1.3)">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#ffffff" />
      </g>
    </g>
    <defs>
      <filter id="soft-shadow-4" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.15" />
      </filter>
    </defs>
  </svg>
);

const ServicesArt = () => (
  <svg viewBox="0 0 480 380" className="hero-art-svg">
    <circle cx="395" cy="90" r="58" fill="rgba(255,255,255,0.08)" />
    <circle cx="65" cy="290" r="52" fill="rgba(255,255,255,0.08)" />
    <g filter="url(#soft-shadow-5)">
      <rect x="60" y="60" width="320" height="220" rx="16" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" />
      <rect x="90" y="90" width="110" height="80" rx="12" fill="rgba(255,255,255,0.18)" />
      <polyline points="125,120 112,130 125,140" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="165,120 178,130 165,140" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="220" y="90" width="110" height="80" rx="12" fill="rgba(255,255,255,0.18)" />
      <rect x="240" y="135" width="12" height="25" rx="3" fill="#ffffff" opacity="0.7" />
      <rect x="258" y="120" width="12" height="40" rx="3" fill="#ffffff" opacity="0.85" />
      <rect x="276" y="105" width="12" height="55" rx="3" fill="#ffffff" />
      <rect x="90" y="185" width="110" height="70" rx="12" fill="rgba(255,255,255,0.18)" />
      <circle cx="145" cy="220" r="22" fill="none" stroke="#ffffff" strokeWidth="4" />
      <circle cx="145" cy="220" r="11" fill="none" stroke="#ffffff" strokeWidth="4" />
      <circle cx="145" cy="220" r="3" fill="#ffffff" />
      <rect x="220" y="185" width="110" height="70" rx="12" fill="rgba(255,255,255,0.18)" />
      <circle cx="245" cy="210" r="6" fill="#ffffff" />
      <circle cx="305" cy="205" r="6" fill="#ffffff" opacity="0.85" />
      <circle cx="275" cy="235" r="6" fill="#ffffff" opacity="0.85" />
      <line x1="245" y1="210" x2="305" y2="205" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      <line x1="245" y1="210" x2="275" y2="235" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      <line x1="305" y1="205" x2="275" y2="235" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
    </g>
    <g filter="url(#soft-shadow-5)">
      <circle cx="345" cy="245" r="46" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" />
      <g transform="translate(329.4 229.4) scale(1.3)">
        <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#ffffff" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#ffffff" opacity="0.85" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#ffffff" opacity="0.7" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#ffffff" opacity="0.85" />
      </g>
    </g>
    <defs>
      <filter id="soft-shadow-5" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.15" />
      </filter>
    </defs>
  </svg>
);

const ContactArt = () => (
  <svg viewBox="0 0 480 380" className="hero-art-svg">
    <circle cx="395" cy="85" r="60" fill="rgba(255,255,255,0.08)" />
    <circle cx="65" cy="295" r="50" fill="rgba(255,255,255,0.08)" />
    <g filter="url(#soft-shadow-6)">
      <rect x="60" y="60" width="320" height="220" rx="16" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" />
      <circle cx="88" cy="88" r="6" fill="rgba(255,255,255,0.6)" />
      <circle cx="108" cy="88" r="6" fill="rgba(255,255,255,0.45)" />
      <circle cx="128" cy="88" r="6" fill="rgba(255,255,255,0.3)" />
      <line x1="60" y1="106" x2="380" y2="106" stroke="rgba(255,255,255,0.25)" />
      <rect x="130" y="140" width="160" height="105" rx="10" fill="rgba(255,255,255,0.22)" stroke="#ffffff" strokeWidth="3" />
      <polyline points="130,148 210,205 290,148" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="140" y="260" width="130" height="12" rx="6" fill="rgba(255,255,255,0.25)" />
    </g>
    <g filter="url(#soft-shadow-6)">
      <circle cx="345" cy="235" r="52" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" />
      <g transform="translate(329.4 219.4) scale(1.3)">
        <line x1="22" y1="2" x2="11" y2="13" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" fill="#ffffff" />
      </g>
    </g>
    <defs>
      <filter id="soft-shadow-6" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.15" />
      </filter>
    </defs>
  </svg>
);

const CareersArt = () => (
  <svg viewBox="0 0 480 380" className="hero-art-svg">
    <circle cx="90" cy="80" r="55" fill="rgba(255,255,255,0.08)" />
    <circle cx="400" cy="290" r="55" fill="rgba(255,255,255,0.08)" />
    <g filter="url(#soft-shadow-7)">
      <rect x="60" y="60" width="320" height="220" rx="16" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" />
      <rect x="95" y="215" width="40" height="40" rx="4" fill="rgba(255,255,255,0.4)" />
      <rect x="150" y="185" width="40" height="70" rx="4" fill="rgba(255,255,255,0.55)" />
      <rect x="205" y="150" width="40" height="105" rx="4" fill="rgba(255,255,255,0.75)" />
      <rect x="260" y="115" width="40" height="140" rx="4" fill="#ffffff" />
      <polyline points="115,205 170,175 225,140 280,105" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" strokeDasharray="2 8" />
      <circle cx="280" cy="105" r="8" fill="#ffffff" />
    </g>
    <g filter="url(#soft-shadow-7)">
      <circle cx="345" cy="235" r="52" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" />
      <g transform="translate(329.4 219.4) scale(1.3)">
        <line x1="12" y1="19" x2="12" y2="5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <polyline points="5 12 12 5 19 12" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
    <defs>
      <filter id="soft-shadow-7" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.15" />
      </filter>
    </defs>
  </svg>
);

const ILLUSTRATIONS = {
  development: DevelopmentArt,
  growth: GrowthArt,
  'ai-data': AiDataArt,
  about: AboutArt,
  services: ServicesArt,
  contact: ContactArt,
  careers: CareersArt
};

const HeroIllustration = ({ variant }) => {
  const Art = ILLUSTRATIONS[variant] || DevelopmentArt;
  return (
    <div className="hero-art">
      <Art />
    </div>
  );
};

export default HeroIllustration;
