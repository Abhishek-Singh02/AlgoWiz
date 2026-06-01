import type { GraphFn } from "../types";

export const unionFind: GraphFn = async (_input) => {
    return { steps: [], stats: { comparisons: 0, nodes: 0 } };
};
