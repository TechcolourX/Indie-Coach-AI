
import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 16H8V20H4V16Z"
      fill="currentColor"
    />
    <path
      d="M10 12H14V24H10V12Z"
      fill="currentColor"
    />
    <path
      d="M16 8H20V28H16V8Z"
      fill="currentColor"
    />
    <path
      d="M22 14H26V22H22V14Z"
      fill="currentColor"
    />
  </svg>
);