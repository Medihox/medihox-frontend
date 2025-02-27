'use client';

import * as React from 'react';
import { OTPInput } from 'input-otp';
import { Dot } from 'lucide-react';
// Remove this import as it doesn't have the properties we need
// import type { SlotProps } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';

// Define a custom interface with the properties we need
interface InputOTPSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  char?: string;
  hasFakeCaret?: boolean;
  isActive?: boolean;
}

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn('flex items-center gap-2', className)}
    {...props}
  />
));
InputOTP.displayName = 'InputOTP';

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center gap-2', className)} {...props} />
));
InputOTPGroup.displayName = 'InputOTPGroup';

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  InputOTPSlotProps
>(({ char, hasFakeCaret, isActive, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-sm transition-all',
      isActive && 'ring-2 ring-offset-background ring-ring',
      className
    )}
    {...props}
  >
    {char ? (
      <span>{char}</span>
    ) : (
      <span className="text-muted-foreground">
        <Dot className="h-4 w-4" />
      </span>
    )}
    {hasFakeCaret && (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-caret h-4 w-px bg-foreground" />
      </div>
    )}
  </div>
));
InputOTPSlot.displayName = 'InputOTPSlot';

export { InputOTP, InputOTPGroup, InputOTPSlot };
