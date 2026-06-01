import type { SortingFn } from "../types";

export const radixSort: SortingFn = async (_input) => {
    return { steps: [], stats: { comparisons: 0 } };
};
