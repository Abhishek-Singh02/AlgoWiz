import { cn } from "@utils";
import { FC } from "react";

const items = [
    { label: "start", className: "bg-emerald" },
    { label: "end", className: "bg-rose" },
    { label: "wall", className: "bg-overlay border border-border" },
    { label: "visited", className: "bg-sky/60" },
    { label: "path", className: "bg-emerald/80" },
    { label: "frontier", className: "bg-violet/60" },
] as const;

export const Legend: FC = () => (
    <div className="flex flex-wrap items-center justify-center gap-4 px-4 py-2 border-t border-border shrink-0">
        {items.map(({ label, className }) => (
            <div key={label} className="flex items-center gap-1.5">
                <span className={cn("h-3 w-3 rounded-sm", className)} />
                <span className="text-[11px] font-mono text-text-tertiary uppercase">
                    {label}
                </span>
            </div>
        ))}
    </div>
);
