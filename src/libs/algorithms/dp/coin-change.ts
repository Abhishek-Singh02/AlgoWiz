import type { DpFn } from "../types";

export const coinChange: DpFn = async (_input) => {
    return { steps: [], stats: { comparisons: 0 } };
};
