import type { GraphFn } from "../types";

export const kruskalsMst: GraphFn = async (_input) => {
    return { steps: [], stats: { comparisons: 0, nodes: 0 } };
};
