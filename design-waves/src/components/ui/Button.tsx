import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  icon?: ReactNode;
}

export default function Button({ variant = 'primary', icon, children, className = '', ...rest }: Props) {
  const base = 'dw-btn text-sm disabled:opacity-50 disabled:cursor-not-allowed';
  const variants: Record<string, string> = {
    primary: 'dw-btn-primary',
    outline: 'dw-btn-outline',
    ghost: 'bg-transparent hover:bg-white/5',
    danger: 'bg-red-500/90 text-white',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {icon}
      {children}
    </button>
  );
}
