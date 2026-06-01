import type { DpFn } from "../types";

export const matrixChain: DpFn = async (_input) => {
    return { steps: [], stats: { comparisons: 0 } };
};
