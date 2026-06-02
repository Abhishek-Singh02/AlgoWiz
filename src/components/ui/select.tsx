import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@components/ui/popover";
import { cn } from "@utils";
import { Check, ChevronDown } from "lucide-react";
import { FC, useState } from "react";

export type SelectOption = {
    value: string;
    label: string;
};

export type SelectProps = {
    value: string;
    options: SelectOption[];
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
};

export const Select: FC<SelectProps> = ({
    value,
    options,
    onValueChange,
    disabled,
    className,
    placeholder = "Select…",
}) => {
    const [open, setOpen] = useState(false);
    const selected = options.find((o) => o.value === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className={cn(
                        "inline-flex h-8 min-w-[9rem] items-center justify-between gap-2 rounded-md border border-border bg-elevated px-3",
                        "text-[12px] font-medium text-text-primary shadow-surface",
                        "transition-colors hover:border-border-strong hover:bg-overlay",
                        "focus:outline-none focus:ring-2 focus:ring-emerald/30 focus:border-emerald/50",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "data-[state=open]:border-emerald/50 data-[state=open]:ring-2 data-[state=open]:ring-emerald/20",
                        className,
                    )}
                >
                    <span className="truncate">
                        {selected?.label ?? placeholder}
                    </span>
                    <ChevronDown
                        className={cn(
                            "h-3.5 w-3.5 shrink-0 text-text-tertiary transition-transform",
                            open && "rotate-180",
                        )}
                    />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)]">
                {options.map((opt) => {
                    const isSelected = opt.value === value;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onValueChange?.(opt.value);
                                setOpen(false);
                            }}
                            className={cn(
                                "flex w-full items-center justify-between gap-2 rounded-md px-1.5 py-1 text-left text-[12px] transition-colors",
                                isSelected
                                    ? "bg-emerald-dim text-emerald font-medium"
                                    : "text-text-secondary hover:bg-overlay hover:text-text-primary",
                            )}
                        >
                            <span>{opt.label}</span>
                            {isSelected && (
                                <Check className="size-3 shrink-0" />
                            )}
                        </button>
                    );
                })}
            </PopoverContent>
        </Popover>
    );
};
