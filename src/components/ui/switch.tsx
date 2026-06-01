import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@utils";
import { FC } from "react";

export type SwitchProps = {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label?: string;
    id?: string;
};

export const Switch: FC<SwitchProps> = ({
    checked,
    onCheckedChange,
    label,
    id,
}) => (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
        {label && (
            <span className="text-[13px] text-text-secondary">{label}</span>
        )}
        <SwitchPrimitive.Root
            id={id}
            checked={checked}
            onCheckedChange={onCheckedChange}
            className={cn(
                "relative h-5 w-9 rounded-full transition-colors",
                checked ? "bg-emerald" : "bg-overlay border border-border",
            )}
        >
            <SwitchPrimitive.Thumb
                className={cn(
                    "block h-4 w-4 rounded-full bg-text-primary transition-transform",
                    checked ? "translate-x-4" : "translate-x-0.5",
                )}
            />
        </SwitchPrimitive.Root>
    </label>
);
