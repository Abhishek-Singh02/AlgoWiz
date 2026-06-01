import type { SortingFn } from "../types";

export const bubbleSort: SortingFn = async (_input) => {
    return { steps: [], stats: { comparisons: 0 } };
};
