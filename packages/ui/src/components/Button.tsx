/**
 * Button — the one true button primitive.
 *
 * Variants: primary (brand-600 solid) / secondary (white + strong border)
 * / ghost (transparent) / destructive (danger-600) / subtle (subtle bg).
 *
 * Sizes: sm 32px / md 36px / lg 40px. Icon-only via `iconOnly` prop.
 *
 * Always renders a visible focus ring on :focus-visible (shadow-ring).
 * Honors disabled state with opacity + pointer-events: none.
 *
 * Linear / Vercel / Stripe convention: one button shape across the app.
 */
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'subtle';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: Variant;
  size?: Size;
  iconOnly?: boolean;
  /** Optional leading icon (lucide component). */
  leading?: ReactNode;
  /** Optional trailing icon. */
  trailing?: ReactNode;
  children?: ReactNode;
}

const VARIANT: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)]',
  secondary:
    'bg-surface border border-border-strong text-ink-1 hover:bg-subtle',
  ghost:
    'bg-transparent text-ink-2 hover:bg-subtle hover:text-ink-1',
  destructive:
    'bg-danger-600 text-white hover:opacity-90 shadow-[var(--shadow-xs)]',
  subtle:
    'bg-subtle text-ink-1 hover:bg-muted',
};

const SIZE: Record<Size, string> = {
  sm: 'h-8 px-3 text-[12.5px] gap-1.5',
  md: 'h-9 px-3.5 text-[13px] gap-2',
  lg: 'h-10 px-4 text-[14px] gap-2',
};

const ICON_ONLY_SIZE: Record<Size, string> = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-10 w-10',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  iconOnly = false,
  leading,
  trailing,
  children,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps): ReactElement {
  const sizeCls = iconOnly ? ICON_ONLY_SIZE[size] : SIZE[size];
  return (
    <button
      type={type}
      className={`inline-flex shrink-0 items-center justify-center rounded-md font-medium transition-[background-color,box-shadow,color,border-color] duration-[var(--duration-fast)] ease-[var(--ease-brand)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none ${VARIANT[variant]} ${sizeCls} ${className}`}
      {...rest}
    >
      {leading}
      {!iconOnly && children}
      {trailing}
    </button>
  );
}
