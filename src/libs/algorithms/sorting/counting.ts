import type { SortingFn } from "../types";

export const countingSort: SortingFn = async (_input) => {
    return { steps: [], stats: { comparisons: 0 } };
};
