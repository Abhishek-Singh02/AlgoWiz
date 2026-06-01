import { useWorkspace } from "@stores";
import { FC } from "react";

export const CursorReadout: FC = () => {
    const cursor = useWorkspace(({ cursor }) => cursor);
    const grid = useWorkspace(({ grid }) => grid);

    if (!cursor) return null;

    const tile = grid[cursor.row]?.[cursor.col];
    const cellStatus = tile?.isWall
        ? "wall"
        : tile?.isStart
          ? "start"
          : tile?.isEnd
            ? "end"
            : "passable";

    return (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[11px] text-text-tertiary bg-elevated/90 border border-white/10 rounded-md px-2 py-1 pointer-events-none">
            cursor {cursor.row}, {cursor.col} | cell {cellStatus}
        </div>
    );
};
