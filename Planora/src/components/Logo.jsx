import React from 'react';
import '../styles/components/Logo.css';

const Logo = ({ size = 'medium' }) => {
  return (
    <div className={`logo logo-${size}`}>
      <div className="logo-icon">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Plane */}
          <g className="plane">
            <path d="M75 25 L45 35 L30 30 L28 32 L35 40 L25 43 L20 40 L18 41 L20 48 L26 50 L75 32 Z" />
          </g>
          
          {/* Hotel/Building */}
          <g className="hotel">
            <rect x="15" y="55" width="30" height="35" rx="2" />
            <rect x="20" y="60" width="5" height="6" className="window" />
            <rect x="30" y="60" width="5" height="6" className="window" />
            <rect x="20" y="70" width="5" height="6" className="window" />
            <rect x="30" y="70" width="5" height="6" className="window" />
            <rect x="20" y="80" width="5" height="6" className="window" />
            <rect x="30" y="80" width="5" height="6" className="window" />
          </g>
          
          {/* Map Pin */}
          <g className="pin">
            <path d="M70 50 C70 45 65 40 60 40 C55 40 50 45 50 50 C50 57 60 70 60 70 C60 70 70 57 70 50 Z" />
            <circle cx="60" cy="50" r="4" className="pin-center" />
          </g>
        </svg>
      </div>
      <div className="logo-text">
        <span className="logo-title">Planora</span>
      </div>
    </div>
  );
};

export default Logo;
