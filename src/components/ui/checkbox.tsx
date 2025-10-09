"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxProps {
  id?: string
  name?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
  disabled?: boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, name, checked = false, onCheckedChange, className, disabled, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked)
    }

    return (
      <div className="relative">
        <input
          ref={ref}
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 bg-white transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            checked && "bg-teal-500 border-teal-500 text-white",
            className
          )}
          onClick={() => onCheckedChange?.(!checked)}
        >
          {checked && (
            <Check className="h-3 w-3 text-white" />
          )}
        </div>
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
