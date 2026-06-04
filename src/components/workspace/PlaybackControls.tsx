import { Button, Select, Slider, StatusBadge, Tooltip } from "@components/ui";
import { useWorkspace, useWorkspaceActions } from "@stores";
import type { MazePreset } from "@stores/workspace";
import {
    Pause,
    Play,
    RotateCcw,
    SkipBack,
    SkipForward,
    StepBack,
    StepForward,
    Zap,
} from "lucide-react";
import { FC, type ReactElement } from "react";

const TooltipAction = ({
    content,
    children,
}: {
    content: string;
    children: ReactElement;
}) => (
    <Tooltip content={content}>
        <span className="inline-flex">{children}</span>
    </Tooltip>
);

const MAZE_OPTIONS: { id: MazePreset; label: string }[] = [
    { id: "simple", label: "simple maze" },
    { id: "recursive-division", label: "recursive division" },
    { id: "random-walls", label: "random walls" },
];

const ARRAY_SIZE_OPTIONS = [
    { value: "16", label: "n=16" },
    { value: "24", label: "n=24" },
    { value: "32", label: "n=32" },
];

export const PlaybackControls: FC = () => {
    const status = useWorkspace(({ status }) => status);
    const speed = useWorkspace(({ speed }) => speed);
    const mazePreset = useWorkspace(({ mazePreset }) => mazePreset);
    const category = useWorkspace(({ category }) => category);
    const sortingArraySize = useWorkspace(
        ({ sortingArraySize }) => sortingArraySize,
    );
    const {
        generateMaze,
        resetGrid,
        reloadCategoryPreset,
        play,
        pause,
        stepForward,
        stepBackward,
        skipToStart,
        skipToEnd,
        setSpeed,
        setMazePreset,
        setSortingArraySize,
        visualise,
    } = useWorkspaceActions();

    const isRunning = status === "running";
    const isPaused = status === "paused";
    const playTooltip = isRunning ? "Pause" : isPaused ? "Resume" : "Visualise";

    return (
        <div className="shrink-0 flex flex-wrap items-center gap-2 px-3 py-2 border-b border-border bg-elevated/80">
            {category === "pathfinding" && (
                <TooltipAction content="Generate maze">
                    <Button
                        variant="generate"
                        size="sm"
                        onClick={() => void generateMaze()}
                        disabled={isRunning}
                    >
                        <Zap className="h-3.5 w-3.5" />
                        Generate
                    </Button>
                </TooltipAction>
            )}
            {(category === "trees" ||
                category === "graphs" ||
                category === "dp") && (
                <TooltipAction content="Reload preset data">
                    <Button
                        variant="reset"
                        size="sm"
                        className="w-fit px-2"
                        onClick={() => reloadCategoryPreset()}
                        disabled={isRunning}
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset preset
                    </Button>
                </TooltipAction>
            )}
            <TooltipAction content="Reset visualization">
                <Button
                    variant="reset"
                    size="sm"
                    onClick={() => resetGrid()}
                    disabled={isRunning}
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                </Button>
            </TooltipAction>
            <div className="flex items-center gap-0.5 border-l border-border pl-2">
                <TooltipAction content="Go to start">
                    <Button
                        variant="icon"
                        size="sm"
                        onClick={() => skipToStart()}
                        disabled={isRunning}
                    >
                        <SkipBack className="h-3.5 w-3.5" />
                    </Button>
                </TooltipAction>
                <TooltipAction content="Step backward">
                    <Button
                        variant="icon"
                        size="sm"
                        onClick={() => stepBackward()}
                        disabled={isRunning}
                    >
                        <StepBack className="h-3.5 w-3.5" />
                    </Button>
                </TooltipAction>
                <TooltipAction content={playTooltip}>
                    <Button
                        variant="icon"
                        size="sm"
                        onClick={() => {
                            if (isRunning) pause();
                            else if (isPaused) void play();
                            else void visualise();
                        }}
                    >
                        {isRunning ? (
                            <Pause className="h-3.5 w-3.5" />
                        ) : (
                            <Play className="h-3.5 w-3.5" />
                        )}
                    </Button>
                </TooltipAction>
                <TooltipAction content="Step forward">
                    <Button
                        variant="icon"
                        size="sm"
                        onClick={() => stepForward()}
                        disabled={isRunning}
                    >
                        <StepForward className="h-3.5 w-3.5" />
                    </Button>
                </TooltipAction>
                <TooltipAction content="Go to end">
                    <Button
                        variant="icon"
                        size="sm"
                        onClick={() => skipToEnd()}
                        disabled={isRunning}
                    >
                        <SkipForward className="h-3.5 w-3.5" />
                    </Button>
                </TooltipAction>
            </div>
            <div className="flex items-center gap-2.5 border-l border-border pl-2">
                <Tooltip content="Playback speed">
                    <span className="cursor-default text-[11px] uppercase text-text-tertiary">
                        speed
                    </span>
                </Tooltip>
                <Slider
                    className="w-[7.5rem] sm:w-32"
                    value={[speed]}
                    onValueChange={([v]) => setSpeed(v)}
                    min={0.5}
                    max={8}
                    step={0.5}
                    aria-label="Playback speed"
                />
                <span className="w-7 shrink-0 font-mono text-[11px] tabular-nums text-emerald">
                    {speed}×
                </span>
            </div>
            {category === "pathfinding" && (
                <Select
                    value={mazePreset}
                    onValueChange={(v) => setMazePreset(v as MazePreset)}
                    disabled={isRunning}
                    options={MAZE_OPTIONS.map((o) => ({
                        value: o.id,
                        label: o.label,
                    }))}
                />
            )}
            {category === "sorting" && (
                <Select
                    value={String(sortingArraySize)}
                    onValueChange={(v) => setSortingArraySize(Number(v))}
                    disabled={isRunning}
                    options={ARRAY_SIZE_OPTIONS}
                />
            )}
            <div className="ml-auto flex items-center gap-2">
                <TooltipAction content="Run visualization">
                    <Button
                        variant="visualise"
                        onClick={() => void visualise()}
                        disabled={isRunning}
                        className="hidden sm:inline-flex"
                        size="sm"
                    >
                        <Play className="h-3.5 w-3.5" />
                        Visualise
                    </Button>
                </TooltipAction>
                <StatusBadge status={status} />
            </div>
        </div>
    );
};
