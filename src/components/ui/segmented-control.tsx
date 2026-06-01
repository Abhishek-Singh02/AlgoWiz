import { cn } from "@utils";

export type SegmentedOption<T extends string> = {
    id: T;
    label: string;
};

export type SegmentedControlProps<T extends string> = {
    options: SegmentedOption<T>[];
    value: T;
    onChange: (id: T) => void;
    className?: string;
};

export const SegmentedControl = <T extends string>({
    options,
    value,
    onChange,
    className,
}: SegmentedControlProps<T>) => (
    <div
        className={cn(
            "inline-flex flex-wrap gap-0.5 rounded-lg bg-overlay p-0.5 border border-border",
            className,
        )}
        role="group"
    >
        {options.map((opt) => {
            const active = value === opt.id;
            return (
                <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChange(opt.id)}
                    className={cn(
                        "rounded-md px-2.5 py-1 text-[12px] font-medium transition-all duration-150",
                        active
                            ? "bg-elevated text-emerald shadow-surface border border-emerald/30"
                            : "text-text-secondary hover:text-text-primary border border-transparent",
                    )}
                >
                    {opt.label}
                </button>
            );
        })}
    </div>
);
