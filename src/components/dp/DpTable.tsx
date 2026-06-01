import { useWorkspace } from "@stores";
import { cn } from "@utils";
import { FC, useMemo } from "react";

export const DpTable: FC = () => {
    const dpState = useWorkspace(({ dpState }) => dpState);
    const dpVisual = useWorkspace(({ dpVisual }) => dpVisual);

    const highlightSet = useMemo(() => {
        const set = new Set<string>();
        for (const c of dpVisual.highlights) {
            set.add(`${c.row},${c.col}`);
        }
        for (const c of dpVisual.solutionPath) {
            set.add(`${c.row},${c.col}`);
        }
        return set;
    }, [dpVisual.highlights, dpVisual.solutionPath]);

    const compareSet = useMemo(() => {
        const set = new Set<string>();
        dpVisual.compare?.forEach((c) => set.add(`${c.row},${c.col}`));
        return set;
    }, [dpVisual.compare]);

    return (
        <div className="flex flex-1 min-h-0 w-full flex-col items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-4xl rounded-lg border border-border bg-elevated/60 shadow-panel overflow-hidden">
                <div className="flex items-center justify-between border-b border-border px-4 py-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                        dp table
                    </span>
                    <span className="font-mono text-[11px] text-text-secondary tabular-nums">
                        {dpState.rows}×{dpState.cols}
                    </span>
                </div>
                <div className="overflow-auto max-h-[min(400px,60vh)] p-4">
                    <table className="border-collapse font-mono text-[12px]">
                        <thead>
                            <tr>
                                <th className="p-1.5 text-text-tertiary font-normal" />
                                {Array.from({ length: dpState.cols }, (_, col) => (
                                    <th
                                        key={col}
                                        className="p-1.5 min-w-[40px] text-center text-text-tertiary font-normal"
                                    >
                                        {dpState.colLabels?.[col] ?? col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dpState.cells.map((rowCells, rowIdx) => (
                                <tr key={rowIdx}>
                                    <th className="p-1.5 text-right text-text-tertiary font-normal pr-2">
                                        {dpState.rowLabels?.[rowIdx] ?? rowIdx}
                                    </th>
                                    {rowCells.map((cell, colIdx) => {
                                        const key = `${rowIdx},${colIdx}`;
                                        const isHighlight = highlightSet.has(key);
                                        const isCompare = compareSet.has(key);
                                        const isSolution = dpVisual.solutionPath.some(
                                            (c) =>
                                                c.row === rowIdx && c.col === colIdx,
                                        );
                                        return (
                                            <td key={colIdx} className="p-0.5">
                                                <div
                                                    className={cn(
                                                        "flex h-9 min-w-[40px] items-center justify-center rounded-md border transition-colors",
                                                        isSolution &&
                                                            "border-emerald/50 bg-emerald-dim text-emerald",
                                                        isCompare &&
                                                            !isSolution &&
                                                            "border-amber/50 bg-amber-dim text-amber",
                                                        isHighlight &&
                                                            !isCompare &&
                                                            !isSolution &&
                                                            "border-violet/40 bg-violet-dim",
                                                        !isHighlight &&
                                                            !isCompare &&
                                                            !isSolution &&
                                                            "border-border/80 bg-overlay/60 text-text-primary",
                                                    )}
                                                >
                                                    {cell ?? "·"}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
