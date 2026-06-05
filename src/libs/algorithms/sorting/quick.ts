import { sortingHelper } from "@components/sorting/helper";
import type { SortingFn } from "../types";

export const quickSort: SortingFn = async (input) => {
    const arr = [...input.array];
    const { steps, compare, swap, markSorted } = sortingHelper();
    const n = arr.length;

    const partition = (lo: number, hi: number): number => {
        const pivotIdx = hi;
        let storeIdx = lo;

        for (let i = lo; i < hi; i++) {
            compare([i, pivotIdx]);
            if (arr[i] < arr[pivotIdx]) {
                if (i !== storeIdx) {
                    [arr[i], arr[storeIdx]] = [arr[storeIdx], arr[i]];
                    swap([i, storeIdx]);
                }
                storeIdx++;
            }
        }

        if (storeIdx !== pivotIdx) {
            [arr[storeIdx], arr[pivotIdx]] = [arr[pivotIdx], arr[storeIdx]];
            swap([storeIdx, pivotIdx]);
        }

        markSorted(storeIdx);
        return storeIdx;
    };

    const sort = (lo: number, hi: number) => {
        if (lo > hi) return;
        if (lo === hi) {
            markSorted(lo);
            return;
        }
        const pivot = partition(lo, hi);
        sort(lo, pivot - 1);
        sort(pivot + 1, hi);
    };

    if (n > 0) sort(0, n - 1);

    const comparisons = steps.filter((s) => s.kind === "compare").length;
    return { steps, stats: { comparisons } };
};
