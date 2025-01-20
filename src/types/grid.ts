export type TileType = {
    row: number;
    col: number;
    isStart: boolean;
    isEnd: boolean;
    isPath?: boolean;
    isTraversed?: boolean;
    isWall: boolean;
    distance: number;
    parent?: TileType;
};
export type GridType = TileType[][];
