/**
 * Input — the one true text input primitive.
 *
 * 40 px tall, 8 px radius, 1 px strong border, white surface. Focus =
 * brand-500 border + 3 px brand-500/20 % ring (via `:focus-visible` →
 * the global `--shadow-ring` token).
 *
 * Supports prefix / suffix slots (currency `$`, search icon), error
 * state (red border + helper text + role="alert"), label + helper text
 * slots. Internal-tool form fields all funnel through here.
 */
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: ReactNode;
  /** Renders the field in error state and surfaces the helperText as the message. */
  error?: boolean;
  /** Slot left of the input (e.g. a `$` for currency, a search icon). */
  leftSlot?: ReactNode;
  /** Slot right of the input. */
  rightSlot?: ReactNode;
  /** Whether the field is required — surfaces a quiet 'Required' label. */
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helperText, error, leftSlot, rightSlot, required, className = '', id, ...rest },
  ref,
) {
  const inputId = id ?? rest.name ?? undefined;
  return (
    <div className="block w-full">
      {label && (
        <div className="mb-1.5 flex items-baseline justify-between">
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium text-ink-1"
          >
            {label}
          </label>
          {required && (
            <span className="text-[11px] text-ink-3">Required</span>
          )}
        </div>
      )}
      <div
        className={`flex h-10 items-center gap-2 rounded-md border bg-surface px-3 transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-brand)] focus-within:outline-none ${
          error
            ? 'border-danger-600 focus-within:shadow-[0_0_0_3px_rgb(220_38_38/0.20)]'
            : 'border-border-strong focus-within:border-brand-500 focus-within:shadow-[var(--shadow-ring)]'
        } ${className}`}
      >
        {leftSlot && <span className="text-ink-3">{leftSlot}</span>}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error || undefined}
          aria-describedby={helperText && inputId ? `${inputId}-help` : undefined}
          className="min-w-0 flex-1 bg-transparent text-[14px] text-ink-1 placeholder:text-ink-3 focus:outline-none"
          {...rest}
        />
        {rightSlot && <span className="text-ink-3">{rightSlot}</span>}
      </div>
      {helperText && (
        <div
          id={inputId ? `${inputId}-help` : undefined}
          role={error ? 'alert' : undefined}
          className={`mt-1 text-[12px] ${error ? 'text-danger-600' : 'text-ink-3'}`}
        >
          {helperText}
        </div>
      )}
    </div>
  );
});
