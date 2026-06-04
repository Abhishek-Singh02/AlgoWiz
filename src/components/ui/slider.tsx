import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@utils";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";

export const Slider = forwardRef<
    ElementRef<typeof SliderPrimitive.Root>,
    ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex w-full touch-none select-none items-center py-1",
            className,
        )}
        {...props}
    >
        <SliderPrimitive.Track
            className={cn(
                "relative h-1.5 w-full grow overflow-hidden rounded-full bg-overlay",
            )}
        >
            <SliderPrimitive.Range
                className={cn(
                    "absolute h-full rounded-full bg-emerald",
                    "transition-[width] duration-75 ease-out",
                )}
            />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
            className={cn(
                "block h-4 w-4 shrink-0 cursor-grab rounded-full border-2 border-emerald/40 bg-emerald",
                "shadow-[0_1px_3px_rgba(0,0,0,0.35)] ring-offset-base",
                "transition-[transform,box-shadow,border-color] duration-100 ease-out",
                "hover:scale-110 hover:border-emerald/60 hover:shadow-[0_0_14px_var(--emerald-glow)]",
                "active:scale-105 active:cursor-grabbing",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald/45 focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
            )}
        />
    </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;
