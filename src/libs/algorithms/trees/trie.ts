import type { TreeFn } from "../types";

export const trie: TreeFn = async (_input) => {
    return { steps: [], stats: { comparisons: 0 } };
};
