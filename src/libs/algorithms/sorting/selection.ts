import { sortingHelper } from "@components/sorting/helper";
import type { SortingFn } from "../types";

export const selectionSort: SortingFn = async (input) => {
    const arr = [...input.array];
    const { steps, compare, swap, markSorted } = sortingHelper();
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let min = i;

        for (let j = i + 1; j < n; j++) {
            compare([min, j]);
            if (arr[min] > arr[j]) {
                min = j;
            }
        }

        if (min !== i) {
            [arr[i], arr[min]] = [arr[min], arr[i]];
            swap([i, min]);
        }

        markSorted(i);
    }

    if (n > 0) markSorted(n - 1);

    const comparisons = steps.filter((s) => s.kind === "compare").length;
    return { steps, stats: { comparisons } };
};
