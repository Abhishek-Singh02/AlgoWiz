import { sortingHelper } from "@components/sorting/helper";
import type { SortingFn } from "../types";

export const insertionSort: SortingFn = async (input) => {
    const arr = [...input.array];
    const { steps, compare, swap, markSorted } = sortingHelper();
    const n = arr.length;

    for (let i = 0; i < n; i++) {
        let j = i;

        while (j > 0) {
            compare([j - 1, j]);
            if (arr[j - 1] > arr[j]) {
                [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
                swap([j - 1, j]);
                j--;
            } else {
                break;
            }
        }

        markSorted(i);
    }

    const comparisons = steps.filter((s) => s.kind === "compare").length;
    return { steps, stats: { comparisons } };
};
