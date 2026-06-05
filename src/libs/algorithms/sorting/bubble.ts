import { sortingHelper } from "@components/sorting/helper";
import type { SortingFn } from "../types";

export const bubbleSort: SortingFn = async (input) => {
    const arr = [...input.array];
    const { steps, compare, swap, markSorted } = sortingHelper();
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - 1 - i; j++) {
            compare([j, j + 1]);

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swap([j, j + 1]);
            }
        }

        markSorted(n - 1 - i);
    }

    if (n > 0) {
        markSorted(0);
    }

    const comparisons = steps.filter((s) => s.kind === "compare").length;
    return { steps, stats: { comparisons } };
};
