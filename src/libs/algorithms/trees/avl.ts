import type { TreeFn } from "../types";

export const avlTree: TreeFn = async (_input) => {
    return { steps: [], stats: { comparisons: 0 } };
};
