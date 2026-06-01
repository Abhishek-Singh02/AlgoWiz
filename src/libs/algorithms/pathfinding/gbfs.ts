import type { PathfindingFn } from "../types";

export const gbfs: PathfindingFn = async (_input) => {
    return { steps: [], found: false, stats: { comparisons: 0, nodes: 0 } };
};
