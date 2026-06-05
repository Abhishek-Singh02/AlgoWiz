import { SortingStep } from "@libs/algorithms";

export const sortingHelper = () => {
    const steps: SortingStep[] = [];
    return {
        steps,
        compare(indices: [number, number]) {
            steps.push({ kind: "compare", indices });
        },
        swap(indices: [number, number]) {
            steps.push({ kind: "swap", indices });
        },
        markSorted(index: number) {
            steps.push({ kind: "markSorted", index });
        },
    };
};
