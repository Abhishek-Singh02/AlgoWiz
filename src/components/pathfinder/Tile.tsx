import { MAX_ROWS } from "@constants";
import { usePathfinder } from "@stores";
import { cn } from "@utils";
import { FC, HTMLProps } from "react";

export type TileProps = {
    row: number;
    col: number;
} & HTMLProps<HTMLDivElement>;

export const Tile: FC<TileProps> = ({ row, col, ...props }) => {
    const tile = usePathfinder(({ grid }) => grid[row][col]);
    const { isStart, isEnd, isWall, isPath, isTraversed } = tile;

    return (
        <div
            {...props}
            className={cn([
                "lg:w-8 md:w-6 w-4 aspect-square border-t border-r border-neutral-600",
                isStart && "bg-green-500",
                isEnd && "bg-red-600",
                isWall && "animate-wall",
                isPath && "bg-green-600",
                isTraversed && "bg-cyan-500",
                row === MAX_ROWS - 1 && col === 0 && "border-l",
                row === MAX_ROWS - 1 && "border-b",
                col === 0 && "border-l",
            ])}
        />
    );
};
