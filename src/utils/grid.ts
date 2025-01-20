import { MAX_COLS, MAX_ROWS } from "@constants";
import { GridType, TileType } from "@types";

export const createRow = (row: number, start: TileType, end: TileType) => {
    const currRow: TileType[] = [];
    for (let col = 0; col < MAX_COLS; col++) {
        currRow.push({
            row,
            col,
            isEnd: row === end.row && col === end.col,
            isStart: row === start.row && col === start.col,
            isWall: false,
            distance: Infinity,
        });
    }
    return currRow;
};

export const createGrid = (start: TileType, end: TileType) => {
    const grid: GridType = [];
    for (let row = 0; row < MAX_ROWS; row++) {
        grid.push(createRow(row, start, end));
    }
    return grid;
};
