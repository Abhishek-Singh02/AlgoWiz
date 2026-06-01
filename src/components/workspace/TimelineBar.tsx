import { useWorkspace, useWorkspaceActions } from "@stores";
import { FC, useCallback, useMemo, useRef } from "react";

const formatTime = (ms: number) => {
    const s = ms / 1000;
    const m = Math.floor(s / 60);
    const sec = (s % 60).toFixed(1);
    return `${m}:${sec.padStart(4, "0")}`;
};

export const TimelineBar: FC = () => {
    const stepIndex = useWorkspace(({ stepIndex }) => stepIndex);
    const pathfindingSteps = useWorkspace(
        ({ pathfindingSteps }) => pathfindingSteps,
    );
    const sortingSteps = useWorkspace(({ sortingSteps }) => sortingSteps);
    const treeSteps = useWorkspace(({ treeSteps }) => treeSteps);
    const graphSteps = useWorkspace(({ graphSteps }) => graphSteps);
    const dpSteps = useWorkspace(({ dpSteps }) => dpSteps);
    const category = useWorkspace(({ category }) => category);
    const metrics = useWorkspace(({ metrics }) => metrics);
    const speed = useWorkspace(({ speed }) => speed);
    const status = useWorkspace(({ status }) => status);
    const runStartTime = useWorkspace(({ runStartTime }) => runStartTime);
    const { scrubToStep } = useWorkspaceActions();
    const trackRef = useRef<HTMLDivElement>(null);

    const totalSteps = useMemo(() => {
        switch (category) {
            case "pathfinding":
                return pathfindingSteps.length;
            case "sorting":
                return sortingSteps.length;
            case "trees":
                return treeSteps.length;
            case "graphs":
                return graphSteps.length;
            case "dp":
                return dpSteps.length;
            default:
                return 0;
        }
    }, [
        category,
        pathfindingSteps.length,
        sortingSteps.length,
        treeSteps.length,
        graphSteps.length,
        dpSteps.length,
    ]);

    const maxIndex = Math.max(0, totalSteps - 1);
    const progress = maxIndex > 0 ? (stepIndex / maxIndex) * 100 : 0;

    const elapsed =
        runStartTime && status !== "idle"
            ? Date.now() - runStartTime
            : metrics.elapsedMs;

    const showNodes =
        category === "pathfinding" || category === "graphs";

    const onScrub = useCallback(
        (clientX: number) => {
            const track = trackRef.current;
            if (!track || totalSteps === 0) return;
            const rect = track.getBoundingClientRect();
            const ratio = Math.max(
                0,
                Math.min(1, (clientX - rect.left) / rect.width),
            );
            const index = Math.round(ratio * maxIndex);
            scrubToStep(index);
        },
        [maxIndex, scrubToStep, totalSteps],
    );

    return (
        <footer className="h-20 shrink-0 border-t border-border bg-elevated px-4 flex flex-col justify-center gap-2">
            <div className="flex items-center gap-4">
                <div
                    ref={trackRef}
                    className="flex-1 h-1.5 rounded-full bg-overlay cursor-pointer relative group"
                    onMouseDown={(e) => onScrub(e.clientX)}
                    onMouseMove={(e) => {
                        if (e.buttons === 1) onScrub(e.clientX);
                    }}
                    role="slider"
                    aria-valuenow={stepIndex}
                    aria-valuemin={0}
                    aria-valuemax={maxIndex}
                >
                    <div
                        className="h-full rounded-full bg-emerald pointer-events-none"
                        style={{
                            width: `${progress}%`,
                            transition: "none",
                        }}
                    />
                    <div
                        className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-emerald border-2 border-base shadow pointer-events-none"
                        style={{ left: `calc(${progress}% - 6px)` }}
                    />
                </div>
                <span className="font-mono text-[11px] text-text-secondary shrink-0">
                    step {stepIndex} / {maxIndex}
                </span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wide">
                <div className="flex gap-6 text-text-tertiary">
                    <span>
                        OPS{" "}
                        <span className="text-text-primary">
                            {metrics.ops.toLocaleString()}
                        </span>
                    </span>
                    <span>
                        COMPARISONS{" "}
                        <span className="text-text-primary">
                            {metrics.comparisons.toLocaleString()}
                        </span>
                    </span>
                    {showNodes ? (
                        <span>
                            NODES{" "}
                            <span className="text-text-primary">
                                {metrics.nodes.toLocaleString()}
                            </span>
                        </span>
                    ) : (
                        <span className="hidden md:inline opacity-0">NODES</span>
                    )}
                    <span className="hidden md:inline">
                        TIME{" "}
                        <span className="text-text-primary">
                            {metrics.elapsedMs}ms
                        </span>
                    </span>
                </div>
                <div className="flex items-center gap-4 text-text-tertiary">
                    <span>{formatTime(elapsed)}</span>
                    <span className="text-emerald">{speed}×</span>
                    <span className="capitalize">{status}</span>
                </div>
            </div>
        </footer>
    );
};
