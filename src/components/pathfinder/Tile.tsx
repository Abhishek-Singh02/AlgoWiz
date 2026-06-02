import { MAX_ROWS } from "@constants";
import { useWorkspace } from "@stores";
import { cn } from "@utils";
import { FC, HTMLProps } from "react";

export type TileProps = {
    row: number;
    col: number;
} & HTMLProps<HTMLDivElement>;

export const Tile: FC<TileProps> = ({ row, col, ...props }) => {
    const tile = useWorkspace(({ grid }) => grid[row][col]);
    const { isStart, isEnd, isWall, isPath, isTraversed, isFrontier } = tile;

    return (
        <div
            {...props}
            className={cn(
                "lg:w-7 md:w-6 w-4 aspect-square border-t border-r border-white/[0.06]",
                isStart && "bg-emerald z-10",
                isEnd && "bg-rose z-10",
                isWall && "bg-overlay animate-wall",
                !isStart &&
                    !isEnd &&
                    !isWall &&
                    isFrontier &&
                    "bg-violet/60 animate-traversed",
                !isStart &&
                    !isEnd &&
                    !isWall &&
                    isTraversed &&
                    !isFrontier &&
                    "bg-sky/50 animate-traversed",
                !isStart &&
                    !isEnd &&
                    !isWall &&
                    isPath &&
                    "bg-emerald/80 animate-path",
                !isStart &&
                    !isEnd &&
                    !isWall &&
                    !isPath &&
                    !isTraversed &&
                    !isFrontier &&
                    "bg-subtle/50",
                row === MAX_ROWS - 1 &&
                    col === 0 &&
                    "border-l border-white/[0.06]",
                row === MAX_ROWS - 1 && "border-b border-white/[0.06]",
                col === 0 && "border-l border-white/[0.06]",
            )}
        />
    );
};
