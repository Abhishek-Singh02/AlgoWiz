import { cn } from "@utils";
import { FC } from "react";

const items = [
    { label: "visited", className: "border-sky/40 bg-sky-dim" },
    { label: "active", className: "border-amber/45 bg-amber-dim" },
    { label: "mst", className: "border-emerald/40 bg-emerald-dim" },
    { label: "relaxed", className: "border-violet/35 bg-violet-dim" },
] as const;

export const GraphLegend: FC = () => (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-2.5 border-t border-border shrink-0 bg-base/50">
        {items.map(({ label, className }) => (
            <div key={label} className="flex items-center gap-1.5">
                <span
                    className={cn("h-3.5 w-3.5 rounded-full border", className)}
                />
                <span className="text-[11px] font-mono text-text-tertiary uppercase tracking-wide">
                    {label}
                </span>
            </div>
        ))}
    </div>
);
