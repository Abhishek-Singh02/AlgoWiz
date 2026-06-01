import type { PathfindingFn } from "../types";

export const bellmanFord: PathfindingFn = async (_input) => {
    return { steps: [], found: false, stats: { comparisons: 0, nodes: 0 } };
};
