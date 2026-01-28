'use client';

import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { MinusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReusableOTPProps {
  length?: number; // Number of digits
  separatorEvery?: number; // Insert a separator every N digits
  onComplete?: (value: string) => void; // Callback when all digits entered
  className?: string;
  containerClassName?: string;
  slotClassName?: string;
  separatorClassName?: string;
}

export function ReusableOTP({
  length = 6,
  separatorEvery = 0,
  onComplete,
  className,
  containerClassName,
  slotClassName,
  separatorClassName
}: ReusableOTPProps) {
  const [value, setValue] = React.useState('');

  const handleChange = (val: string) => {
    setValue(val);
    if (val.length === length && onComplete) {
      onComplete(val);
    }
  };

  return (
    <OTPInput
      value={value}
      onChange={handleChange}
      containerClassName={cn('flex items-center gap-2 has-disabled:opacity-50', containerClassName)}
      className={cn('disabled:cursor-not-allowed', className)}
    >
      <ReusableOTPGroup length={length} separatorEvery={separatorEvery} slotClassName={slotClassName} separatorClassName={separatorClassName} />
    </OTPInput>
  );
}

interface ReusableOTPGroupProps {
  length: number;
  separatorEvery: number;
  slotClassName?: string;
  separatorClassName?: string;
}

function ReusableOTPGroup({ length, separatorEvery, slotClassName, separatorClassName }: ReusableOTPGroupProps) {
  const context = React.useContext(OTPInputContext);

  return (
    <div data-slot="input-otp-group" className="flex items-center">
      {Array.from({ length }).map((_, idx) => (
        <React.Fragment key={idx}>
          <ReusableOTPSlot index={idx} className={slotClassName} />
          {separatorEvery > 0 && (idx + 1) % separatorEvery === 0 && idx + 1 !== length && (
            <div data-slot="input-otp-separator" role="separator" className={cn('mx-1', separatorClassName)}>
              <MinusIcon />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

interface ReusableOTPSlotProps {
  index: number;
  className?: string;
}

function ReusableOTPSlot({ index, className }: ReusableOTPSlotProps) {
  const context = React.useContext(OTPInputContext);
  const slot = context?.slots[index] ?? {};
  const { char, hasFakeCaret, isActive } = slot;

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        'data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]',
        className
      )}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

