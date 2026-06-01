import { Tile } from "@components/pathfinder/Tile";
import { MAX_COLS, MAX_ROWS } from "@constants";
import { useWorkspace, useWorkspaceActions } from "@stores";
import { FC, useCallback, useState } from "react";

export const PathfinderGrid: FC = () => {
    const grid = useWorkspace(({ grid }) => grid);
    const status = useWorkspace(({ status }) => status);
    const { toggleWallTile, setCursor } = useWorkspaceActions();
    const [isMouseDown, setIsMouseDown] = useState(false);

    const onMouseEnter = useCallback(
        (row: number, col: number) => {
            setCursor({ row, col });
            if (isMouseDown && status === "idle") {
                toggleWallTile(row, col);
            }
        },
        [isMouseDown, status, toggleWallTile, setCursor],
    );

    return (
        <div className="flex flex-col items-center justify-center p-4 min-h-0 flex-1 overflow-auto">
            <div className="inline-flex flex-col rounded-lg border border-white/[0.06] overflow-hidden shadow-lg">
                {grid.map((gridRow, rowIndex) => (
                    <div key={rowIndex} className="flex">
                        {gridRow.map((tile, colIndex) => (
                            <Tile
                                key={`${rowIndex}-${colIndex}`}
                                row={tile.row}
                                col={tile.col}
                                onMouseDown={() => {
                                    if (status === "idle") {
                                        setIsMouseDown(true);
                                        toggleWallTile(tile.row, tile.col);
                                    }
                                }}
                                onMouseUp={() => setIsMouseDown(false)}
                                onMouseLeave={() => {
                                    if (rowIndex === MAX_ROWS - 1 && colIndex === MAX_COLS - 1) {
                                        setCursor(null);
                                    }
                                }}
                                onMouseEnter={() => onMouseEnter(tile.row, tile.col)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
