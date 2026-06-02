import { Button } from "@components/ui";
import { DEFAULT_ALGORITHM_ID } from "@config/algorithms";
import { useWorkspace, useWorkspaceActions } from "@stores";
import { cn } from "@utils";
import { Circle, Hexagon, Play, Sparkles } from "lucide-react";
import { FC } from "react";

type EmptyStateType =
    | "welcome"
    | "no-algorithm"
    | "empty-canvas"
    | "ready"
    | null;

const useEmptyState = (): EmptyStateType => {
    const algorithmId = useWorkspace(({ algorithmId }) => algorithmId);
    const hasVisited = useWorkspace(({ ui }) => ui.hasVisited);
    const grid = useWorkspace(({ grid }) => grid);
    const category = useWorkspace(({ category }) => category);
    const status = useWorkspace(({ status }) => status);
    const pathfindingSteps = useWorkspace(
        ({ pathfindingSteps }) => pathfindingSteps,
    );
    if (!hasVisited) return "welcome";
    if (!algorithmId) return "no-algorithm";

    if (category === "pathfinding") {
        const hasWalls = grid.some((row) =>
            row.some((t) => t.isWall && !t.isStart && !t.isEnd),
        );
        if (!hasWalls && status === "idle") return "empty-canvas";
        if (hasWalls && status === "idle" && pathfindingSteps.length === 0)
            return "ready";
    }

    return null;
};

export const EmptyStates: FC = () => {
    const state = useEmptyState();
    const { selectAlgorithm, generateMaze, visualise, markVisited } =
        useWorkspaceActions();

    if (!state) return null;

    const cards = {
        welcome: {
            icon: Sparkles,
            title: "Welcome to AlgoWiz",
            description:
                "Your first session. Start with A* Search on a maze for the full experience.",
            cta: "Quick Start Guide",
            primary: true,
            action: () => {
                markVisited();
                selectAlgorithm(DEFAULT_ALGORITHM_ID);
            },
        },
        "no-algorithm": {
            icon: Circle,
            title: "No Algorithm Selected",
            description:
                "Choose an algorithm from the explorer on the left to begin your session.",
            cta: "Browse Algorithms",
            primary: false,
            action: () => selectAlgorithm(DEFAULT_ALGORITHM_ID),
        },
        "empty-canvas": {
            icon: Hexagon,
            title: "Empty Canvas",
            description:
                "Your workspace is blank. Generate a maze or draw walls to set up the environment.",
            cta: "Generate Maze",
            primary: false,
            action: () => void generateMaze(),
        },
        ready: {
            icon: Play,
            title: "Ready to Visualise",
            description:
                "Preset data is loaded. Press Visualise to run the algorithm on the canvas.",
            cta: "Start Visualising",
            primary: true,
            action: () => void visualise(),
        },
    };

    const card = cards[state];
    const Icon = card.icon;

    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-base/80 backdrop-blur-sm">
            <div className="max-w-sm rounded-xl border border-white/10 bg-elevated p-8 text-center shadow-xl">
                <Icon className="mx-auto h-8 w-8 text-text-tertiary mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">
                    {card.title}
                </h3>
                <p className="text-[13px] text-text-secondary mb-6 leading-relaxed">
                    {card.description}
                </p>
                <Button
                    variant={card.primary ? "visualise" : "reset"}
                    onClick={card.action}
                    className={cn("w-full", card.primary && "border-emerald")}
                >
                    {card.cta}
                </Button>
            </div>
        </div>
    );
};
