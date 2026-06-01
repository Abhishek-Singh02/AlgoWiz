import { Button, Select, Slider, StatusBadge } from "@components/ui";
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
import { FC } from "react";

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
    const sortingArraySize = useWorkspace(({ sortingArraySize }) => sortingArraySize);
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

    return (
        <div className="shrink-0 flex flex-wrap items-center gap-2 px-3 py-2 border-b border-border bg-elevated/80">
            {category === "pathfinding" && (
                <Button
                    variant="generate"
                    size="sm"
                    onClick={() => void generateMaze()}
                    disabled={isRunning}
                >
                    <Zap className="h-3.5 w-3.5" />
                    Generate
                </Button>
            )}
            {(category === "trees" ||
                category === "graphs" ||
                category === "dp") && (
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
            )}
            <Button variant="reset" size="sm"onClick={() => resetGrid()} disabled={isRunning}>
                <RotateCcw className="h-3.5 w-3.5" />
            </Button>
            <div className="flex items-center gap-0.5 border-l border-border pl-2">
                <Button variant="icon" size="sm" onClick={() => skipToStart()} disabled={isRunning}>
                    <SkipBack className="h-3.5 w-3.5" />
                </Button>
                <Button variant="icon" size="sm" onClick={() => stepBackward()} disabled={isRunning}>
                    <StepBack className="h-3.5 w-3.5" />
                </Button>
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
                <Button variant="icon" size="sm" onClick={() => stepForward()} disabled={isRunning}>
                    <StepForward className="h-3.5 w-3.5" />
                </Button>
                <Button variant="icon" size="sm" onClick={() => skipToEnd()} disabled={isRunning}>
                    <SkipForward className="h-3.5 w-3.5" />
                </Button>
            </div>
            <div className="flex items-center gap-2 border-l border-border pl-2">
                <span className="text-[11px] text-text-tertiary uppercase">speed</span>
                <Slider
                    value={[speed]}
                    onValueChange={([v]) => setSpeed(v)}
                    min={0.5}
                    max={8}
                    step={0.5}
                />
                <span className="font-mono text-[11px] text-emerald w-6">{speed}×</span>
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
                <StatusBadge status={status} />
            </div>
        </div>
    );
};
