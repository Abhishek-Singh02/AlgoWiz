import type { MazeFn } from "../types";

export const randomWallsMaze: MazeFn = async (input) => {
    return { steps: [], grid: input.grid };
};
