import { sortingHelper } from "@components/sorting/helper";
import type { SortingFn } from "../types";

export const mergeSort: SortingFn = async (input) => {
    const arr = [...input.array];
    const { steps, compare, swap, markSorted } = sortingHelper();
    const n = arr.length;

    const merge = (lo: number, mid: number, hi: number) => {
        const temp: number[] = [];
        let i = lo;
        let j = mid + 1;

        while (i <= mid && j <= hi) {
            compare([i, j]);
            if (arr[i] <= arr[j]) {
                temp.push(arr[i++]);
            } else {
                temp.push(arr[j++]);
            }
        }

        while (i <= mid) temp.push(arr[i++]);
        while (j <= hi) temp.push(arr[j++]);

        for (let k = 0; k < temp.length; k++) {
            const pos = lo + k;
            const target = temp[k];
            if (arr[pos] === target) continue;

            let swapIdx = pos + 1;
            while (swapIdx <= hi && arr[swapIdx] !== target) swapIdx++;

            if (swapIdx <= hi) {
                [arr[pos], arr[swapIdx]] = [arr[swapIdx], arr[pos]];
                swap([pos, swapIdx]);
            }
        }
    };

    const sort = (lo: number, hi: number) => {
        if (lo >= hi) return;
        const mid = Math.floor((lo + hi) / 2);
        sort(lo, mid);
        sort(mid + 1, hi);
        merge(lo, mid, hi);
    };

    if (n > 0) sort(0, n - 1);

    for (let i = 0; i < n; i++) markSorted(i);

    const comparisons = steps.filter((s) => s.kind === "compare").length;
    return { steps, stats: { comparisons } };
};
