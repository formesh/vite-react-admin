import React from 'react';

interface AppIconProps {
  size?: number;
  className?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ size = 32, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 背景圆形 */}
      <circle cx="32" cy="32" r="30" fill="url(#gradient)" stroke="url(#borderGradient)" strokeWidth="2"/>
      
      {/* 主要图标 - 仪表盘风格 */}
      <g transform="translate(16, 16)">
        {/* 外圈 */}
        <circle cx="16" cy="16" r="14" fill="none" stroke="white" strokeWidth="2" opacity="0.3"/>
        
        {/* 数据条 */}
        <rect x="8" y="20" width="3" height="8" rx="1.5" fill="white" opacity="0.8"/>
        <rect x="13" y="16" width="3" height="12" rx="1.5" fill="white"/>
        <rect x="18" y="18" width="3" height="10" rx="1.5" fill="white" opacity="0.9"/>
        <rect x="23" y="14" width="3" height="14" rx="1.5" fill="white" opacity="0.7"/>
        
        {/* 中心点 */}
        <circle cx="16" cy="16" r="2" fill="white"/>
        
        {/* 装饰性元素 */}
        <path d="M16 6 L18 10 L16 8 L14 10 Z" fill="white" opacity="0.6"/>
        <circle cx="26" cy="10" r="1.5" fill="white" opacity="0.5"/>
        <circle cx="6" cy="22" r="1" fill="white" opacity="0.4"/>
      </g>
      
      {/* 渐变定义 */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#1c1c1e', stopOpacity: 1}} />
          <stop offset="50%" style={{stopColor: '#2c2c2e', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#3a3a3c', stopOpacity: 1}} />
        </linearGradient>
        <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#48484a', stopOpacity: 0.8}} />
          <stop offset="100%" style={{stopColor: '#636366', stopOpacity: 0.6}} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default AppIcon;