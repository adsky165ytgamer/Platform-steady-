import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

const baseProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.5',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const AndroidIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    {/* Android Head */}
    <path
      vectorEffect="non-scaling-stroke"
      d="M5 10c0-3.87 3.13-7 7-7s7 3.13 7 7H5z"
    />
    {/* Left Antenna */}
    <line
      vectorEffect="non-scaling-stroke"
      x1="7.5"
      y1="3.5"
      x2="5.5"
      y2="1"
    />
    {/* Right Antenna */}
    <line
      vectorEffect="non-scaling-stroke"
      x1="16.5"
      y1="3.5"
      x2="18.5"
      y2="1"
    />
    {/* Left Eye */}
    <circle
      cx="9"
      cy="7"
      r="0.75"
      fill="currentColor"
      stroke="none"
    />
    {/* Right Eye */}
    <circle
      cx="15"
      cy="7"
      r="0.75"
      fill="currentColor"
      stroke="none"
    />
    {/* Torso & Legs */}
    <rect
      vectorEffect="non-scaling-stroke"
      x="5"
      y="11.5"
      width="14"
      height="8.5"
      rx="1.5"
    />
    {/* Left Arm */}
    <line
      vectorEffect="non-scaling-stroke"
      x1="2.5"
      y1="12"
      x2="2.5"
      y2="18"
    />
    {/* Right Arm */}
    <line
      vectorEffect="non-scaling-stroke"
      x1="21.5"
      y1="12"
      x2="21.5"
      y2="18"
    />
    {/* Left Leg */}
    <line
      vectorEffect="non-scaling-stroke"
      x1="8.5"
      y1="20"
      x2="8.5"
      y2="23"
    />
    {/* Right Leg */}
    <line
      vectorEffect="non-scaling-stroke"
      x1="15.5"
      y1="20"
      x2="15.5"
      y2="23"
    />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <polyline vectorEffect="non-scaling-stroke" points="9 18 15 12 9 6" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <polyline vectorEffect="non-scaling-stroke" points="6 9 12 15 18 9" />
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <line vectorEffect="non-scaling-stroke" x1="5" y1="12" x2="19" y2="12" />
    <polyline vectorEffect="non-scaling-stroke" points="12 5 19 12 12 19" />
  </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <line vectorEffect="non-scaling-stroke" x1="19" y1="12" x2="5" y2="12" />
    <polyline vectorEffect="non-scaling-stroke" points="12 19 5 12 12 5" />
  </svg>
);

export const ArrowDownIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <line vectorEffect="non-scaling-stroke" x1="12" y1="5" x2="12" y2="19" />
    <polyline vectorEffect="non-scaling-stroke" points="19 12 12 19 5 12" />
  </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <path vectorEffect="non-scaling-stroke" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline vectorEffect="non-scaling-stroke" points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const LayersIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <polygon vectorEffect="non-scaling-stroke" points="12 2 2 7 12 12 22 7 12 2" />
    <polyline vectorEffect="non-scaling-stroke" points="2 17 12 22 22 17" />
    <polyline vectorEffect="non-scaling-stroke" points="2 12 12 17 22 12" />
  </svg>
);

export const SmartphoneIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <rect vectorEffect="non-scaling-stroke" x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line vectorEffect="non-scaling-stroke" x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" />
  </svg>
);

export const CpuIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <rect vectorEffect="non-scaling-stroke" x="4" y="4" width="16" height="16" rx="2" />
    <rect vectorEffect="non-scaling-stroke" x="9" y="9" width="6" height="6" />
    <line vectorEffect="non-scaling-stroke" x1="9" y1="1" x2="9" y2="4" />
    <line vectorEffect="non-scaling-stroke" x1="15" y1="1" x2="15" y2="4" />
    <line vectorEffect="non-scaling-stroke" x1="9" y1="20" x2="9" y2="23" />
    <line vectorEffect="non-scaling-stroke" x1="15" y1="20" x2="15" y2="23" />
    <line vectorEffect="non-scaling-stroke" x1="20" y1="9" x2="23" y2="9" />
    <line vectorEffect="non-scaling-stroke" x1="20" y1="15" x2="23" y2="15" />
    <line vectorEffect="non-scaling-stroke" x1="1" y1="9" x2="4" y2="9" />
    <line vectorEffect="non-scaling-stroke" x1="1" y1="15" x2="4" y2="15" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <circle vectorEffect="non-scaling-stroke" cx="12" cy="12" r="10" />
    <polyline vectorEffect="non-scaling-stroke" points="16 9 10 15 8 13" />
  </svg>
);

export const CircleIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <circle vectorEffect="non-scaling-stroke" cx="12" cy="12" r="10" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <circle vectorEffect="non-scaling-stroke" cx="11" cy="11" r="8" />
    <line vectorEffect="non-scaling-stroke" x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const BookOpenIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <path vectorEffect="non-scaling-stroke" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path vectorEffect="non-scaling-stroke" d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export const MenuIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <line vectorEffect="non-scaling-stroke" x1="3" y1="12" x2="21" y2="12" />
    <line vectorEffect="non-scaling-stroke" x1="3" y1="6" x2="21" y2="6" />
    <line vectorEffect="non-scaling-stroke" x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <line vectorEffect="non-scaling-stroke" x1="18" y1="6" x2="6" y2="18" />
    <line vectorEffect="non-scaling-stroke" x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <circle vectorEffect="non-scaling-stroke" cx="12" cy="12" r="10" />
    <line vectorEffect="non-scaling-stroke" x1="12" y1="16" x2="12" y2="12" />
    <line vectorEffect="non-scaling-stroke" x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2" />
  </svg>
);

export const CompassIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <circle vectorEffect="non-scaling-stroke" cx="12" cy="12" r="10" />
    <polygon vectorEffect="non-scaling-stroke" points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <polyline vectorEffect="non-scaling-stroke" points="20 6 9 17 4 12" />
  </svg>
);

export const GoogleIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <path vectorEffect="non-scaling-stroke" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle vectorEffect="non-scaling-stroke" cx="12" cy="7" r="4" />
  </svg>
);

export const LogOutIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <path vectorEffect="non-scaling-stroke" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline vectorEffect="non-scaling-stroke" points="16 17 21 12 16 7" />
    <line vectorEffect="non-scaling-stroke" x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const ActivityIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <polyline vectorEffect="non-scaling-stroke" points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);


export const ShieldIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <path vectorEffect="non-scaling-stroke" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const TerminalIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <polyline vectorEffect="non-scaling-stroke" points="4 17 10 11 4 5" />
    <line vectorEffect="non-scaling-stroke" x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

export const FolderIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <path vectorEffect="non-scaling-stroke" d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

export const FileIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <path vectorEffect="non-scaling-stroke" d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <polyline vectorEffect="non-scaling-stroke" points="13 2 13 9 20 9" />
  </svg>
);

export const RefreshIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <polyline vectorEffect="non-scaling-stroke" points="23 4 23 10 17 10" />
    <polyline vectorEffect="non-scaling-stroke" points="1 20 1 14 7 14" />
    <path vectorEffect="non-scaling-stroke" d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

export const AlertTriangleIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <path vectorEffect="non-scaling-stroke" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line vectorEffect="non-scaling-stroke" x1="12" y1="9" x2="12" y2="13" />
    <line vectorEffect="non-scaling-stroke" x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" />
  </svg>
);

export const PlayIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <polygon vectorEffect="non-scaling-stroke" points="5 3 19 12 5 21 5 3" />
  </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <path vectorEffect="non-scaling-stroke" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline vectorEffect="non-scaling-stroke" points="7 10 12 15 17 10" />
    <line vectorEffect="non-scaling-stroke" x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const PackageIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <line vectorEffect="non-scaling-stroke" x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path vectorEffect="non-scaling-stroke" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline vectorEffect="non-scaling-stroke" points="3.27 6.96 12 12.01 20.73 6.96" />
    <line vectorEffect="non-scaling-stroke" x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

export const RadioIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <circle vectorEffect="non-scaling-stroke" cx="12" cy="12" r="2" />
    <path vectorEffect="non-scaling-stroke" d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
  </svg>
);

export const CodeIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <polyline vectorEffect="non-scaling-stroke" points="16 18 22 12 16 6" />
    <polyline vectorEffect="non-scaling-stroke" points="8 6 2 12 8 18" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <polyline vectorEffect="non-scaling-stroke" points="3 6 5 6 21 6" />
    <path vectorEffect="non-scaling-stroke" d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const PauseIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <rect vectorEffect="non-scaling-stroke" x="6" y="4" width="4" height="16" />
    <rect vectorEffect="non-scaling-stroke" x="14" y="4" width="4" height="16" />
  </svg>
);

export const CopyIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <rect vectorEffect="non-scaling-stroke" x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path vectorEffect="non-scaling-stroke" d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const DatabaseIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg {...baseProps} className={className} {...props}>
    <ellipse vectorEffect="non-scaling-stroke" cx="12" cy="5" rx="9" ry="3" />
    <path vectorEffect="non-scaling-stroke" d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path vectorEffect="non-scaling-stroke" d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);




