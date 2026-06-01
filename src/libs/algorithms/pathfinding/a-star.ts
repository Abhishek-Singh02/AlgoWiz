import type { PathfindingFn } from "../types";

export const aStar: PathfindingFn = async (_input) => {
    // TODO: Implement A* — return steps as you explore the grid
    return { steps: [], found: false, stats: { comparisons: 0, nodes: 0 } };
};
