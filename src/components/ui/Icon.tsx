export interface IconProps {
  name: 'scan-face' | 'scan' | 'camera' | 'check' | 'check-circle-2' | 'x' | 'alert-circle' | 'refresh-cw' | 'loader-2';
  className?: string;
  width?: number;
  strokeWidth?: number;
}

export function Icon({ name, className, width = 24, strokeWidth = 1.5 }: IconProps) {
  const icons = {
    'scan-face': (
      <path d="M3 7V5a2 2 0 0 1 2-2h2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
    ),
    'scan': (
      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
    ),
    'camera': (
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M14.4 14a3 3 0 1 0-5.8 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
    ),
    'check': (
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
    ),
    'check-circle-2': (
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
    ),
    'x': (
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
    ),
    'alert-circle': (
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
    ),
    'refresh-cw': (
      <path d="M23 4v6h-6 M1 20v-6h6 M20.49 15a9 9 0 1 1-2.12-9.36L23 10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
    ),
    'loader-2': (
      <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
    ),
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={width}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {icons[name]}
    </svg>
  );
}
