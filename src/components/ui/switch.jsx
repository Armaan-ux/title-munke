import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({ className, thumbColor, trackColor, ...props }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        `peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none
        focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50
        ${trackColor ? trackColor : "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"}`,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          `block h-4 w-4 rounded-full ring-0 transition-transform
          data-[state=checked]:translate-x-[calc(100%-2px)]
          data-[state=unchecked]:translate-x-0
          ${thumbColor ? thumbColor : "data-[state=unchecked]:bg-foreground data-[state=checked]:bg-primary-foreground"}`
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
