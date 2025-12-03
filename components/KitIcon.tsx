import React from 'react';
import { KitStyle } from '../types';

interface KitIconProps {
  style: KitStyle;
  size?: number;
  className?: string;
  showShorts?: boolean;
  number?: number;
}

const KitIcon: React.FC<KitIconProps> = ({ style, size = 40, className = "", showShorts = false, number }) => {
  const { primaryColor, secondaryColor, pattern, shortsColor, numberColor } = style;

  // Patterns
  const renderPattern = () => {
    switch (pattern) {
      case 'stripes':
        return (
          <g>
            <rect x="25" y="0" width="10" height="70" fill={secondaryColor} />
            <rect x="45" y="0" width="10" height="70" fill={secondaryColor} />
            <rect x="65" y="0" width="10" height="70" fill={secondaryColor} />
          </g>
        );
      case 'hoops':
        return (
          <g>
            <rect x="0" y="20" width="100" height="10" fill={secondaryColor} />
            <rect x="0" y="40" width="100" height="10" fill={secondaryColor} />
            <rect x="0" y="60" width="100" height="10" fill={secondaryColor} />
          </g>
        );
      case 'sash':
        return (
          <polygon points="0,0 30,0 100,70 70,70" fill={secondaryColor} opacity="0.8" />
        );
      case 'half':
        return (
          <rect x="50" y="0" width="50" height="70" fill={secondaryColor} />
        );
      case 'solid':
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`} style={{ width: size, height: showShorts ? size * 1.4 : size }}>
      <svg viewBox="0 0 100 80" className="w-full drop-shadow-sm" style={{ height: size }}>
         {/* Base Jersey Shape */}
         <path 
          d="M20,10 L30,0 L70,0 L80,10 L95,25 L85,35 L80,30 L80,75 L20,75 L20,30 L15,35 L5,25 Z" 
          fill={primaryColor} 
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="1"
        />
        
        {/* Clip path wrapper for pattern to stay inside jersey */}
        <mask id={`jerseyMask-${primaryColor}-${pattern}`}>
             <path d="M20,10 L30,0 L70,0 L80,10 L95,25 L85,35 L80,30 L80,75 L20,75 L20,30 L15,35 L5,25 Z" fill="white" />
        </mask>

        <g mask={`url(#jerseyMask-${primaryColor}-${pattern})`}>
            {renderPattern()}
        </g>

        {/* Collar/Trim */}
        <path d="M30,0 L70,0 L70,5 C70,15 30,15 30,5 Z" fill="rgba(0,0,0,0.2)" />
        
        {/* Number */}
        {number !== undefined && (
          <text
            x="50"
            y="45"
            textAnchor="middle"
            fill={numberColor || '#000'}
            fontSize="35"
            fontFamily="sans-serif"
            fontWeight="bold"
            style={{ dominantBaseline: 'middle' }}
          >
            {number}
          </text>
        )}
      </svg>

      {showShorts && (
        <svg viewBox="0 0 100 60" className="w-full -mt-1 drop-shadow-sm" style={{ height: size * 0.5 }}>
           <path 
            d="M20,0 L80,0 L90,40 L90,50 L55,50 L50,20 L45,50 L10,50 L10,40 Z" 
            fill={shortsColor} 
             stroke="rgba(0,0,0,0.1)"
            strokeWidth="1"
          />
        </svg>
      )}
    </div>
  );
};

export default KitIcon;