import { MAX_COLS, MAX_ROWS } from "@constants";
import { GridType } from "@types";

export const binaryTreeMaze = (grid: GridType): GridType => {
    const newGridWithWalls = grid.map((row) =>
        row.map((tile) => ({
            ...tile,
            isWall: !tile.isStart && !tile.isEnd ? true : false,
        })),
    );

    for (let row = 0; row < MAX_ROWS; row++) {
        for (let col = 0; col < MAX_COLS; col++) {
            const isLastRow = row === MAX_ROWS - 1;
            const isLastCol = col === MAX_COLS - 1;

            if (isLastRow && isLastCol) continue;

            if (isLastRow) {
                newGridWithWalls[row][col + 1].isWall = false;
            } else if (isLastCol) {
                newGridWithWalls[row + 1][col].isWall = false;
            } else {
                const carveRight = Math.random() < 0.5;
                if (carveRight) {
                    newGridWithWalls[row][col + 1].isWall = false;
                } else {
                    newGridWithWalls[row + 1][col].isWall = false;
                }
            }
        }
    }

    return newGridWithWalls;
};
