import { Tile } from "@components";
import { MAX_COLS, MAX_ROWS } from "@constants";
import { binaryTreeMaze } from "@libs/algorithms";
import { usePathfinder, usePathfinderActions } from "@stores";
import { GridType, TileType } from "@types";
import { sleep } from "@utils";
import { FC, useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";

export type PathfinderPageProps = {};

export const PathfinderPage: FC<PathfinderPageProps> = () => {
    const speed = usePathfinder(({ speed }) => speed);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const grid = usePathfinder(
        ({ grid }) => grid,
        (a, b) => a.length === b.length,
    );
    const { toggleWallTile, setTile } = usePathfinderActions();
    const onMouseEnter = useCallback(
        (tile: TileType) => {
            if (isMouseDown) {
                toggleWallTile(tile.row, tile.col);
            }
        },
        [toggleWallTile, isMouseDown],
    );
    const onClick = useCallback(
        (tile: TileType) => {
            toggleWallTile(tile.row, tile.col);
        },
        [toggleWallTile],
    );
    const createMaze = useCallback(async () => {
        let maze: GridType = [];
        maze = binaryTreeMaze(grid);
        if (maze.length) {
            for (let row = 0; row < MAX_ROWS; row++) {
                for (let col = 0; col < MAX_COLS; col++) {
                    setTile(row, col, (tile) => {
                        tile.isWall = maze[row][col].isWall;
                    });
                    await sleep(speed * 50);
                }
            }
        }
    }, [grid, speed, setTile]);
    const visualise = useCallback(() => {}, [grid, speed, setTile]);
    return (
        <>
            <div className="flex gap-4 absolute right-8 top-20">
                <button onClick={createMaze}>create maze</button>
                <button onClick={visualise}>visualise</button>
            </div>
            <div
                className={twMerge(
                    "flex items-center flex-col justify-center border-sky-300 mt-10",
                )}
            >
                {grid.map((gridRow, rowIndex) => (
                    <div key={rowIndex} className="flex">
                        {gridRow.map((tile, tileIndex) => {
                            return (
                                <Tile
                                    row={tile.row}
                                    col={tile.col}
                                    key={tileIndex}
                                    onMouseDown={() => setIsMouseDown(true)}
                                    onMouseUp={() => setIsMouseDown(false)}
                                    onMouseEnter={() => {
                                        onMouseEnter(tile);
                                    }}
                                    onClick={() => onClick(tile)}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </>
    );
};
