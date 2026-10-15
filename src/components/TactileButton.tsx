import React, { useState } from 'react';

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRipples((prev) => [...prev, { x, y, id: Date.now() }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => Date.now() - r.id < 600));
    }, 600);

    if (onClick) onClick(e);
  };

  const variantStyles = {
    primary:
      'bg-[#F5F5F5] hover:bg-[#C0C0C0] active:bg-[#B0B0B0] text-[#080808] font-semibold border border-transparent shadow-sm',
    secondary:
      'bg-[#141414] hover:bg-[#1C1C1C] active:bg-[#242424] text-[#F5F5F5] border border-[#2A2A2A] hover:border-[#C0C0C0]',
    ghost:
      'bg-transparent hover:bg-[#141414] active:bg-[#1A1A1A] text-[#C0C0C0] hover:text-[#F5F5F5] border border-transparent',
  };

  const sizeStyles = {
    sm: 'min-h-[32px] py-1 px-3 text-xs',
    md: 'min-h-[44px] py-2 px-4 text-xs sm:text-sm',
    lg: 'min-h-[50px] py-2.5 px-5 text-sm',
  };

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden transition-all duration-200 active:scale-[0.985] cursor-pointer inline-flex items-center justify-center gap-2 select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      {...props}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/20 pointer-events-none animate-ping"
          style={{
            left: r.x - 20,
            top: r.y - 20,
            width: 40,
            height: 40,
          }}
        />
      ))}
    </button>
  );
};
