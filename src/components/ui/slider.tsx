import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@utils";
import { FC } from "react";

export type SliderProps = {
    value: number[];
    onValueChange: (value: number[]) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
};

export const Slider: FC<SliderProps> = ({
    value,
    onValueChange,
    min = 0.5,
    max = 8,
    step = 0.5,
    className,
}) => (
    <SliderPrimitive.Root
        className={cn(
            "relative flex h-4 w-24 touch-none select-none items-center",
            className,
        )}
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
    >
        <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-overlay">
            <SliderPrimitive.Range className="absolute h-full bg-emerald" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border border-emerald/50 bg-emerald shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald/50" />
    </SliderPrimitive.Root>
);
