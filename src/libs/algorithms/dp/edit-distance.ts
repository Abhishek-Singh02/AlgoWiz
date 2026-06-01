import type { DpFn } from "../types";

export const editDistance: DpFn = async (_input) => {
    return { steps: [], stats: { comparisons: 0 } };
};
