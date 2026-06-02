import { useWorkspace } from "@stores";
import { cn } from "@utils";
import { motion } from "framer-motion";
import { FC, useMemo } from "react";

const CHART_HEIGHT = 280;
const GRID_LINES = [0.25, 0.5, 0.75];

const barStyles = {
    default:
        "border-emerald/25 bg-gradient-to-t from-emerald-dim via-emerald/80 to-emerald shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
    sorted: "border-violet/30 bg-gradient-to-t from-violet-dim via-violet/70 to-violet shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]",
    compare:
        "border-amber/50 bg-gradient-to-t from-amber-dim via-amber/80 to-amber shadow-[0_0_20px_var(--amber-dim),inset_0_1px_0_rgba(255,255,255,0.15)]",
    swap: "border-rose/50 bg-gradient-to-t from-rose-dim via-rose/80 to-rose shadow-[0_0_20px_var(--rose-dim),inset_0_1px_0_rgba(255,255,255,0.15)]",
} as const;

export const SortingBars: FC = () => {
    const sortingArray = useWorkspace(({ sortingArray }) => sortingArray);
    const highlight = useWorkspace(({ sortingHighlight }) => sortingHighlight);
    const sortedSet = useWorkspace(
        ({ sortingSortedIndices }) => sortingSortedIndices,
    );
    const max = useMemo(() => Math.max(...sortingArray, 1), [sortingArray]);
    const sorted = useMemo(() => new Set(sortedSet), [sortedSet]);

    return (
        <div className="flex flex-1 w-full min-h-0 flex-col items-center justify-center p-4 md:p-6">
            <div
                className={cn(
                    "flex w-full max-w-4xl flex-col",
                    "rounded-lg border border-border bg-elevated/60 shadow-panel overflow-hidden",
                )}
            >
                <div className="flex items-center justify-between border-b border-border px-4 py-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                        array
                    </span>
                    <span className="font-mono text-[11px] text-text-secondary tabular-nums">
                        n={sortingArray.length}
                        <span className="mx-2 text-text-disabled">·</span>
                        max={max}
                    </span>
                </div>

                <div className="relative flex min-h-[300px] flex-1 items-stretch px-3 py-4 md:px-5 md:py-5">
                    <div
                        className="pointer-events-none absolute inset-x-3 top-4 bottom-4 md:inset-x-5 md:top-5 md:bottom-5"
                        aria-hidden
                    >
                        {GRID_LINES.map((ratio) => (
                            <div
                                key={ratio}
                                className="absolute left-0 right-0 border-t border-dashed border-border/80"
                                style={{ bottom: `${ratio * 100}%` }}
                            />
                        ))}
                    </div>

                    <div className="relative z-[1] flex flex-1 items-end gap-[2px] md:gap-1">
                        {sortingArray.map((value, i) => {
                            const isHighlighted = highlight.indices.includes(i);
                            const isCompare =
                                isHighlighted && highlight.type === "compare";
                            const isSwap =
                                isHighlighted && highlight.type === "swap";
                            const isSorted = sorted.has(i);
                            const barHeight = Math.max(
                                8,
                                Math.round((value / max) * CHART_HEIGHT),
                            );
                            const tone = isSwap
                                ? "swap"
                                : isCompare
                                  ? "compare"
                                  : isSorted
                                    ? "sorted"
                                    : "default";

                            return (
                                <div
                                    key={i}
                                    className="group relative flex h-[280px] min-w-[6px] max-w-[14px] flex-1 flex-col justify-end"
                                >
                                    {isHighlighted && (
                                        <motion.span
                                            key={`${i}-${value}`}
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute -top-5 left-1/2 z-10 -translate-x-1/2 font-mono text-[9px] tabular-nums text-text-primary"
                                        >
                                            {value}
                                        </motion.span>
                                    )}

                                    <div className="flex h-full w-full flex-col justify-end rounded-t-sm bg-subtle/50">
                                        <motion.div
                                            layout
                                            animate={{ height: barHeight }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 520,
                                                damping: 34,
                                                mass: 0.65,
                                            }}
                                            className={cn(
                                                "relative w-full rounded-t-sm border",
                                                barStyles[tone],
                                                isHighlighted &&
                                                    "z-10 scale-[1.04] origin-bottom",
                                                !isHighlighted &&
                                                    !isSorted &&
                                                    "opacity-[0.55]",
                                                isSorted &&
                                                    !isHighlighted &&
                                                    "opacity-90",
                                            )}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="h-px bg-border" aria-hidden />
            </div>
        </div>
    );
};
