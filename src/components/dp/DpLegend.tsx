import { cn } from "@utils";
import { FC } from "react";

const items = [
    { label: "fill", className: "border-violet/40 bg-violet-dim" },
    { label: "compare", className: "border-amber/45 bg-amber-dim" },
    { label: "solution", className: "border-emerald/40 bg-emerald-dim" },
] as const;

export const DpLegend: FC = () => (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-2.5 border-t border-border shrink-0 bg-base/50">
        {items.map(({ label, className }) => (
            <div key={label} className="flex items-center gap-1.5">
                <span
                    className={cn("h-3.5 w-8 rounded-sm border", className)}
                />
                <span className="text-[11px] font-mono text-text-tertiary uppercase tracking-wide">
                    {label}
                </span>
            </div>
        ))}
    </div>
);
