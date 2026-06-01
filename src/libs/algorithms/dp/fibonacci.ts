import type { DpFn } from "../types";

export const fibonacci: DpFn = async (_input) => {
    return { steps: [], stats: { comparisons: 0 } };
};
