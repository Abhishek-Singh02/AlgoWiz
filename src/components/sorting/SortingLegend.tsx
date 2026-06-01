import { cn } from "@utils";
import { FC } from "react";

const items = [
    {
        label: "unsorted",
        className:
            "border border-emerald/25 bg-gradient-to-t from-emerald-dim to-emerald opacity-60",
    },
    {
        label: "compare",
        className:
            "border border-amber/45 bg-gradient-to-t from-amber-dim to-amber",
    },
    {
        label: "swap",
        className: "border border-rose/45 bg-gradient-to-t from-rose-dim to-rose",
    },
    {
        label: "sorted",
        className:
            "border border-violet/35 bg-gradient-to-t from-violet-dim to-violet",
    },
] as const;

export const SortingLegend: FC = () => (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-2.5 border-t border-border shrink-0 bg-base/50">
        {items.map(({ label, className }) => (
            <div key={label} className="flex items-center gap-1.5">
                <span className={cn("h-3.5 w-2 rounded-sm", className)} />
                <span className="text-[11px] font-mono text-text-tertiary uppercase tracking-wide">
                    {label}
                </span>
            </div>
        ))}
    </div>
);
