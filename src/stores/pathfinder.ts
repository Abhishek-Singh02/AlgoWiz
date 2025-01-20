import { END_TILE, START_TILE } from "@constants";
import {
    GridType,
    SpeedType,
    MazeType,
    PathfindingAlgorithmType,
    TileType,
} from "@types";
import { createGrid } from "@utils";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

export type Status = "idle" | "in_progress" | "complete";
type PathfinderStoreType = {
    startTile: TileType;
    endTile: TileType;
    algorithm: PathfindingAlgorithmType;
    maze: MazeType;
    grid: GridType;
    status: Status;
    speed: SpeedType;
    actions: {
        setAlgorith(algo: PathfindingAlgorithmType): void;
        setMaze(maze: MazeType): void;
        setGrid(grid: GridType): void;
        setStatus(status: Status): void;
        setStartTile(tile: TileType): void;
        setEndTile(tile: TileType): void;
        setSpeed(speed: SpeedType): void;
        toggleWallTile(row: number, col: number): void;
        setTile(
            row: number,
            col: number,
            updater: (tile: TileType) => void,
        ): void;
    };
};

export const usePathfinder = createWithEqualityFn<PathfinderStoreType>()(
    subscribeWithSelector(
        devtools(
            immer((set) => {
                return {
                    algorithm: "DIJKSTRA",
                    maze: "NONE",
                    speed: 0.25,
                    grid: createGrid(START_TILE, END_TILE),
                    status: "idle",
                    startTile: START_TILE,
                    endTile: END_TILE,
                    actions: {
                        setAlgorith(algorithm) {
                            set((draft) => {
                                draft.algorithm = algorithm;
                            });
                        },
                        setMaze(maze) {
                            set((draft) => {
                                draft.maze = maze;
                            });
                        },
                        setGrid(grid) {
                            set((draft) => {
                                draft.grid = grid;
                            });
                        },
                        setStatus(status) {
                            set((draft) => {
                                draft.status = status;
                            });
                        },
                        setStartTile(tile) {
                            set((draft) => {
                                draft.startTile = tile;
                            });
                        },
                        setEndTile(tile) {
                            set((draft) => {
                                draft.endTile = tile;
                            });
                        },
                        setSpeed(speed) {
                            set((draft) => {
                                draft.speed = speed;
                            });
                        },
                        toggleWallTile(row, col) {
                            set((draft) => {
                                if (draft.status === "idle") {
                                    const tile = draft.grid[row][col];
                                    if (!tile.isStart && !tile.isEnd) {
                                        draft.grid[row][col].isWall =
                                            !tile.isWall;
                                    }
                                }
                            });
                        },
                        setTile(row, col, updater) {
                            set((draft) => {
                                if (draft.status === "idle") {
                                    const tile = draft.grid[row][col];
                                    if (tile) {
                                        updater(tile);
                                    }
                                }
                            });
                        },
                    },
                };
            }),
            { name: "pathfinder" },
        ),
    ),
    shallow,
);

export const usePathfinderActions = () =>
    usePathfinder(({ actions }) => actions);
