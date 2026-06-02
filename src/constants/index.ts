import { TileType } from "@types";

export const MAX_ROWS = 20;
export const MAX_COLS = 20;

export const START_TILE: TileType = {
    row: 1,
    col: 1,
    isStart: true,
    isWall: false,
    isEnd: false,
    distance: Infinity,
};

export const END_TILE: TileType = {
    row: MAX_ROWS - 2,
    col: MAX_COLS - 2,
    isStart: false,
    isWall: false,
    isEnd: true,
    distance: Infinity,
};
