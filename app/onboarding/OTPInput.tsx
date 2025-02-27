"use client"

import React, { useCallback, useState } from "react"
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Control } from "react-hook-form"
import { Input } from "@/components/ui/input"

interface OTPInputProps {
  control: Control<any>
  name: string
  label: string
}

export function OTPInputField({ control, name, label }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  
  const handleChange = useCallback((elementIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    
    // Check if only numbers were entered
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      
      // Take only the last character if multiple were pasted
      newOtp[elementIndex] = value.slice(-1);
      setOtp(newOtp);
      
      // Move focus to next input if a digit was entered
      if (value && elementIndex < 5) {
        const nextInput = document.getElementById(`otp-${elementIndex + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  }, [otp]);
  
  const handleKeyDown = useCallback((elementIndex: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    // Move focus to previous input on backspace
    if (event.key === "Backspace" && !otp[elementIndex] && elementIndex > 0) {
      const prevInput = document.getElementById(`otp-${elementIndex - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  }, [otp]);
  
  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text/plain").trim();
    
    // Check if pasted data is a sequence of digits
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.slice(0, 6).split("");
      const newOtp = [...otp];
      
      digits.forEach((digit, index) => {
        if (index < 6) {
          newOtp[index] = digit;
        }
      });
      
      setOtp(newOtp);
      
      // Focus the next empty input or the last one if all filled
      const nextEmptyIndex = newOtp.findIndex(val => !val);
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      const nextInput = document.getElementById(`otp-${focusIndex}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  }, [otp]);
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Update the field value whenever OTP changes
        React.useEffect(() => {
          field.onChange(otp.join(""));
        }, [otp, field]);
        
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="flex items-center justify-between gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Input
                    id={`otp-${index}`}
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[index]}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="h-12 w-12 text-center p-0 text-lg"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
} 