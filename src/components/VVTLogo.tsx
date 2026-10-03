import React from 'react';

interface VVTLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
  variant?: 'emblem-only' | 'horizontal' | 'vertical';
}

export const VVTLogo: React.FC<VVTLogoProps> = ({
  size = 56,
  className = '',
  showText = false,
  textColor = 'text-slate-900',
  subtextColor = 'text-slate-600',
  variant = 'horizontal',
}) => {
  const [imgError, setImgError] = React.useState(false);

  // Official Vishwa Vinayak Trust seal matching the institutional crest
  const emblem = !imgError ? (
    <img
      src="https://demoeasy.easysoftwares.org/assets/img/vvt.png"
      alt="Vishwa Vinayak Trust Official Logo"
      onError={() => setImgError(true)}
      className="shrink-0 object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
      style={{ width: typeof size === 'number' ? `${size}px` : size, height: typeof size === 'number' ? `${size}px` : size }}
    />
  ) : (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-sm transition-transform duration-300 hover:scale-105"
      role="img"
      aria-label="Vishwa Vinayak Trust Official Seal"
    >
      <defs>
        {/* Curved path for white text in the outer red scalloped rosette */}
        <path id="vvtOuterTextArc" d="M 85,275 A 146,146 0 1,1 315,275" fill="none" />
        <filter id="vvtShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* 1. Outer 24-point Scalloped Rosette Crest in Official Crimson Maroon (#B81D2D) */}
      <path
        d="M 200.00,32.00 C 211.54,4.34 239.50,8.02 243.48,37.72 C 261.79,13.99 287.84,24.78 284.00,54.51 C 307.82,36.32 330.19,53.49 318.79,81.21 C 346.51,69.81 363.68,92.18 345.49,116.00 C 375.22,112.16 386.01,138.21 362.28,156.52 C 391.98,160.50 395.66,188.46 368.00,200.00 C 395.66,211.54 391.98,239.50 362.28,243.48 C 386.01,261.79 375.22,287.84 345.49,284.00 C 363.68,307.82 346.51,330.19 318.79,318.79 C 330.19,346.51 307.82,363.68 284.00,345.49 C 287.84,375.22 261.79,386.01 243.48,362.28 C 239.50,391.98 211.54,395.66 200.00,368.00 C 188.46,395.66 160.50,391.98 156.52,362.28 C 138.21,386.01 112.16,375.22 116.00,345.49 C 92.18,363.68 69.81,346.51 81.21,318.79 C 53.49,330.19 36.32,307.82 54.51,284.00 C 24.78,287.84 13.99,261.79 37.72,243.48 C 8.02,239.50 4.34,211.54 32.00,200.00 C 4.34,188.46 8.02,160.50 37.72,156.52 C 13.99,138.21 24.78,112.16 54.51,116.00 C 36.32,92.18 53.49,69.81 81.21,81.21 C 69.81,53.49 92.18,36.32 116.00,54.51 C 112.16,24.78 138.21,13.99 156.52,37.72 C 160.50,8.02 188.46,4.34 200.00,32.00 Z"
        fill="#B81D2D"
        stroke="#961522"
        strokeWidth="2.5"
        filter="url(#vvtShadow)"
      />

      {/* 2. Curved White Trust Title in Outer Red Crest */}
      <text
        fill="#FFFFFF"
        fontSize="20.5"
        fontWeight="800"
        letterSpacing="2.2"
        fontFamily="'Cinzel', 'Times New Roman', Georgia, serif"
      >
        <textPath href="#vvtOuterTextArc" startOffset="50%" textAnchor="middle">
          VISHWA VINAYAK TRUST, KHIREITANGIRI
        </textPath>
      </text>

      {/* 3. Bottom Cream 5-Pointed Star in Red Border */}
      <polygon
        points="200.0,328.5 203.3,337.4 212.8,337.8 205.4,343.8 207.9,352.9 200.0,347.7 192.1,352.9 194.6,343.8 187.2,337.8 196.7,337.4"
        fill="#FFEFA6"
        stroke="#E2B743"
        strokeWidth="1.2"
      />

      {/* 4. Inner Circle: White Border Ring & Warm Cream Fill (#FFFBE6) */}
      <circle cx="200" cy="200" r="121" fill="none" stroke="#FFFFFF" strokeWidth="4.5" />
      <circle cx="200" cy="200" r="117.5" fill="#FFFBE6" stroke="#B81D2D" strokeWidth="2.5" />

      {/* 5. Divine Lord Ganesha Line Art Emblem in Crimson */}
      <g stroke="#8E131E" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Mukut / Crown */}
        <path d="M 191,95 L 200,81 L 209,95 Z" fill="#8E131E" strokeWidth="1.5" />
        <circle cx="200" cy="77" r="2.2" fill="#E2B743" stroke="#8E131E" strokeWidth="1" />
        <path d="M 188,96 L 212,96" strokeWidth="2" />
        <path d="M 190,100 L 210,100" strokeWidth="2" />

        {/* Ears */}
        <path d="M 187,102 C 172,102 165,114 172,126 C 178,136 186,134 189,127" strokeWidth="2.8" />
        <path d="M 213,102 C 228,102 235,114 228,126 C 222,136 214,134 211,127" strokeWidth="2.8" />

        {/* Forehead & Sacred Tilak */}
        <path d="M 193,103 Q 200,106 207,103" strokeWidth="2.2" />
        <path d="M 200,99 L 200,111" stroke="#B81D2D" strokeWidth="2.2" />
        <path d="M 197,107 Q 200,112 203,107" stroke="#E2B743" strokeWidth="1.8" />
        <circle cx="200" cy="104" r="1.4" fill="#B81D2D" />

        {/* Trunk curling gracefully to the left holding Modak */}
        <path d="M 197,114 C 196,124 191,135 183,138 C 174,142 173,130 180,126 C 184,124 188,128 186,131" strokeWidth="2.8" />

        {/* Holy Modak sweet */}
        <circle cx="178" cy="132" r="3.2" fill="#E2B743" stroke="#8E131E" strokeWidth="1.2" />

        {/* Right Blessing Hand (Abhaya Mudra) & Tusk */}
        <path d="M 215,123 C 221,120 224,125 220,131" strokeWidth="2.4" />
        <path d="M 205,120 L 210,123" strokeWidth="2.4" />

        {/* Body & Seated Base */}
        <path d="M 178,143 C 185,148 215,148 222,143" strokeWidth="2.4" />
        <path d="M 183,148 C 192,154 208,154 217,148" strokeWidth="2.2" />
      </g>

      {/* 6. Bold Crimson Acronym "VVT" */}
      <text
        x="200"
        y="198"
        fill="#B81D2D"
        fontSize="52"
        fontWeight="900"
        fontFamily="'Cinzel', 'Times New Roman', Georgia, serif"
        textAnchor="middle"
        letterSpacing="4"
      >
        VVT
      </text>

      {/* 7. Horizontal Banner: Parallel Lines with KHIREITANGIRI */}
      <line x1="116" y1="214" x2="284" y2="214" stroke="#8E131E" strokeWidth="2.2" />
      <text
        x="200"
        y="230"
        fill="#8E131E"
        fontSize="14.5"
        fontWeight="800"
        fontFamily="'Cinzel', 'Times New Roman', Georgia, serif"
        textAnchor="middle"
        letterSpacing="2"
      >
        KHIREITANGIRI
      </text>
      <line x1="116" y1="236" x2="284" y2="236" stroke="#8E131E" strokeWidth="2.2" />

      {/* 8. Five Crimson Stars Arched Below Banner */}
      <g fill="#B81D2D">
        {/* Star 1 (Left outer) */}
        <polygon points="163.0,249.5 164.6,253.8 169.2,254.0 165.6,256.8 166.8,261.3 163.0,258.7 159.2,261.3 160.4,256.8 156.8,254.0 161.4,253.8" />
        {/* Star 2 (Left inner) */}
        <polygon points="181.0,252.5 183.1,258.1 189.1,258.4 184.4,262.1 186.0,267.9 181.0,264.6 176.0,267.9 177.6,262.1 172.9,258.4 178.9,258.1" />
        {/* Star 3 (Center largest) */}
        <polygon points="200.0,253.0 202.7,260.3 210.5,260.6 204.4,265.4 206.5,272.9 200.0,268.6 193.5,272.9 195.6,265.4 189.5,260.6 197.3,260.3" />
        {/* Star 4 (Right inner) */}
        <polygon points="219.0,252.5 221.1,258.1 227.1,258.4 222.4,262.1 224.0,267.9 219.0,264.6 214.0,267.9 215.6,262.1 210.9,258.4 216.9,258.1" />
        {/* Star 5 (Right outer) */}
        <polygon points="237.0,249.5 238.6,253.8 243.2,254.0 239.6,256.8 240.8,261.3 237.0,258.7 233.2,261.3 234.4,256.8 230.8,254.0 235.4,253.8" />
      </g>
    </svg>
  );

  if (variant === 'emblem-only' || !showText) {
    return <div className={`inline-flex items-center shrink-0 ${className}`}>{emblem}</div>;
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {emblem}
        <div className="mt-3">
          <span className={`block font-heading text-lg font-bold tracking-tight ${textColor}`}>
            VISHWA VINAYAK TRUST
          </span>
          <span className="block text-xs font-semibold uppercase tracking-widest text-amber-600">
            Group of Institutions
          </span>
          <span className={`block text-[11px] ${subtextColor}`}>
            Khireitangiri, Kendujhar, Odisha
          </span>
        </div>
      </div>
    );
  }

  // Horizontal variant (with text)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {emblem}
      <div className="leading-tight">
        <span className={`block font-heading text-base md:text-lg font-extrabold tracking-tight ${textColor}`}>
          VISHWA VINAYAK TRUST
        </span>
        <span className="block text-[11px] md:text-xs font-bold uppercase tracking-wider text-amber-700">
          Group of Institutions
        </span>
        <span className={`block text-[10px] md:text-[11px] font-medium ${subtextColor}`}>
          Khireitangiri, Kendujhar, Odisha • Pin-758046
        </span>
      </div>
    </div>
  );
};
