import type { CategoryId } from "@config/algorithms";
import {
    DEFAULT_ALGORITHM_ID,
    getAlgorithmById,
    MAZE_GENERATORS,
} from "@config/algorithms";
import { END_TILE, MAX_COLS, MAX_ROWS, START_TILE } from "@constants";
import { applyTheme, getStoredTheme, type Theme } from "@lib/theme";
import type {
    DpStep,
    DpTableState,
    DpVisualState,
    GraphSnapshot,
    GraphStep,
    GraphVisualState,
    HeuristicType,
    MazeStep,
    PathfindingStep,
    SortingStep,
    TreeSnapshot,
    TreeStep,
    TreeVisualState,
} from "@libs/algorithms/types";
import {
    applyDpStepAtIndex,
    applyGraphStepAtIndex,
    applyPathfindingStepAtIndex,
    applySortingStepAtIndex,
    applyTreeStepAtIndex,
    playDpSteps,
    playGraphSteps,
    playMazeSteps,
    playPathfindingSteps,
    playSortingSteps,
    playTreeSteps,
} from "@libs/visualization/player";
import {
    createEmptyDpVisual,
    createEmptyGraphVisual,
    createEmptyTreeVisual,
    loadDpPreset,
    loadGraphPreset,
    loadTreePreset,
} from "@libs/visualization/presets";
import type { GridType, TileType } from "@types";
import { createGrid } from "@utils/grid";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

const STUB_NOTICE = "Coming soon...";

export type WorkspaceStatus = "idle" | "running" | "paused" | "complete";

export type MazePreset = "simple" | "recursive-division" | "random-walls";

const createInitialSortingArray = (size = 32) =>
    Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);

const loadCategoryPreset = (
    algorithmId: string,
    category: CategoryId,
): {
    treeState?: TreeSnapshot;
    graphState?: GraphSnapshot;
    dpState?: DpTableState;
    dpInitialTable?: DpTableState;
} => {
    if (category === "trees") {
        const tree = loadTreePreset(algorithmId);
        return { treeState: tree };
    }
    if (category === "graphs") {
        return { graphState: loadGraphPreset(algorithmId) };
    }
    if (category === "dp") {
        const dp = loadDpPreset(algorithmId);
        return {
            dpState: dp,
            dpInitialTable: {
                ...dp,
                cells: dp.cells.map((row) => [...row]),
            },
        };
    }
    return {};
};

const clearGridVisualization = (grid: GridType) => {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const tile = grid[row][col];
            if (!tile.isStart && !tile.isEnd) {
                tile.isPath = false;
                tile.isTraversed = false;
                tile.isFrontier = false;
            }
        }
    }
};

const HAS_VISITED_KEY = "algowiz-has-visited";

export type WorkspaceState = {
    category: CategoryId;
    algorithmId: string;
    grid: GridType;
    startTile: TileType;
    endTile: TileType;
    sortingArray: number[];
    sortingInitialArray: number[];
    sortingHighlight: { indices: number[]; type: "compare" | "swap" | null };
    sortingSortedIndices: number[];
    sortingArraySize: number;
    treeState: TreeSnapshot;
    treeVisual: TreeVisualState;
    treeSteps: TreeStep[];
    treeConfig: { insertValue: number; showNullChildren: boolean };
    graphState: GraphSnapshot;
    graphVisual: GraphVisualState;
    graphSteps: GraphStep[];
    graphConfig: { directed: boolean; showWeights: boolean };
    dpState: DpTableState;
    dpInitialTable: DpTableState;
    dpVisual: DpVisualState;
    dpSteps: DpStep[];
    status: WorkspaceStatus;
    speed: number;
    stepIndex: number;
    pathfindingSteps: PathfindingStep[];
    sortingSteps: SortingStep[];
    mazeSteps: MazeStep[];
    metrics: {
        ops: number;
        comparisons: number;
        nodes: number;
        elapsedMs: number;
    };
    runStartTime: number | null;
    pathfindingConfig: {
        heuristic: HeuristicType;
        allowDiagonals: boolean;
        bidirectional: boolean;
        showGValues: boolean;
        showFValues: boolean;
    };
    mazePreset: MazePreset;
    cursor: { row: number; col: number } | null;
    commandPaletteOpen: boolean;
    stubMessage: string | null;
    ui: {
        leftCollapsed: boolean;
        rightCollapsed: boolean;
        theme: Theme;
        hasVisited: boolean;
        expandedGroups: Record<string, boolean>;
        learningTab: "overview" | "complexity" | "pseudocode" | "notes";
        mobileLeftOpen: boolean;
        mobileRightOpen: boolean;
    };
    _abortPlayback: boolean;
    actions: {
        selectAlgorithm: (id: string) => void;
        setCategory: (category: CategoryId) => void;
        setSpeed: (speed: number) => void;
        setMazePreset: (preset: MazePreset) => void;
        setHeuristic: (h: HeuristicType) => void;
        setPathfindingConfig: (
            key: keyof WorkspaceState["pathfindingConfig"],
            value: boolean | HeuristicType,
        ) => void;
        setCursor: (cursor: { row: number; col: number } | null) => void;
        toggleWallTile: (row: number, col: number) => void;
        setTile: (
            row: number,
            col: number,
            updater: (tile: TileType) => void,
        ) => void;
        resetGrid: () => void;
        setSortingArraySize: (size: number) => void;
        setTreeInsertValue: (value: number) => void;
        setTreeShowNullChildren: (show: boolean) => void;
        setGraphConfig: (
            key: keyof WorkspaceState["graphConfig"],
            value: boolean,
        ) => void;
        reloadCategoryPreset: () => void;
        generateMaze: () => Promise<void>;
        visualise: () => Promise<void>;
        play: () => Promise<void>;
        pause: () => void;
        stepForward: () => void;
        stepBackward: () => void;
        scrubToStep: (index: number) => void;
        skipToStart: () => void;
        skipToEnd: () => void;
        toggleLeftCollapsed: () => void;
        toggleRightCollapsed: () => void;
        expandSidePanels: () => void;
        toggleTheme: () => void;
        setCommandPaletteOpen: (open: boolean) => void;
        setLearningTab: (tab: WorkspaceState["ui"]["learningTab"]) => void;
        toggleGroupExpanded: (groupId: string) => void;
        setMobileLeftOpen: (open: boolean) => void;
        setMobileRightOpen: (open: boolean) => void;
        markVisited: () => void;
        clearStubMessage: () => void;
        getPlayerCallbacks: () => import("@libs/visualization/player").PlayerCallbacks;
    };
};

const getHasVisited = () => {
    try {
        return localStorage.getItem(HAS_VISITED_KEY) === "true";
    } catch {
        return false;
    }
};

export const useWorkspace = createWithEqualityFn<WorkspaceState>()(
    subscribeWithSelector(
        devtools(
            immer((set, get) => ({
                category: "pathfinding",
                algorithmId: DEFAULT_ALGORITHM_ID,
                grid: createGrid(START_TILE, END_TILE),
                startTile: START_TILE,
                endTile: END_TILE,
                sortingArray: createInitialSortingArray(),
                sortingInitialArray: createInitialSortingArray(),
                sortingHighlight: { indices: [], type: null },
                sortingSortedIndices: [],
                sortingArraySize: 32,
                treeState: loadTreePreset("bst-insert"),
                treeVisual: createEmptyTreeVisual(),
                treeSteps: [],
                treeConfig: { insertValue: 25, showNullChildren: false },
                graphState: loadGraphPreset("topological"),
                graphVisual: createEmptyGraphVisual(),
                graphSteps: [],
                graphConfig: { directed: true, showWeights: true },
                dpState: loadDpPreset("fibonacci"),
                dpInitialTable: (() => {
                    const dp = loadDpPreset("fibonacci");
                    return { ...dp, cells: dp.cells.map((row) => [...row]) };
                })(),
                dpVisual: createEmptyDpVisual(),
                dpSteps: [],
                status: "idle",
                speed: 4,
                stepIndex: 0,
                pathfindingSteps: [],
                sortingSteps: [],
                mazeSteps: [],
                metrics: { ops: 0, comparisons: 0, nodes: 0, elapsedMs: 0 },
                runStartTime: null,
                pathfindingConfig: {
                    heuristic: "manhattan",
                    allowDiagonals: true,
                    bidirectional: false,
                    showGValues: false,
                    showFValues: true,
                },
                mazePreset: "simple",
                cursor: null,
                commandPaletteOpen: false,
                stubMessage: null,
                ui: {
                    leftCollapsed: false,
                    rightCollapsed: false,
                    theme: getStoredTheme(),
                    hasVisited: getHasVisited(),
                    expandedGroups: {
                        pathfinding: true,
                        sorting: false,
                        trees: false,
                        graphs: false,
                        dp: false,
                    },
                    learningTab: "overview",
                    mobileLeftOpen: false,
                    mobileRightOpen: false,
                },
                _abortPlayback: false,
                actions: {
                    getPlayerCallbacks: () => {
                        const state = get();
                        return {
                            setTile: state.actions.setTile,
                            setSortingArray: (array) =>
                                set((draft) => {
                                    draft.sortingArray = array;
                                }),
                            setSortingHighlight: (indices, type) =>
                                set((draft) => {
                                    draft.sortingHighlight = { indices, type };
                                }),
                            clearSortingSorted: () =>
                                set((draft) => {
                                    draft.sortingSortedIndices = [];
                                }),
                            markSortingSorted: (index) =>
                                set((draft) => {
                                    if (
                                        !draft.sortingSortedIndices.includes(
                                            index,
                                        )
                                    ) {
                                        draft.sortingSortedIndices.push(index);
                                    }
                                }),
                            setTreeVisual: (visual) =>
                                set((draft) => {
                                    draft.treeVisual = visual;
                                }),
                            setTreeSnapshot: (tree) =>
                                set((draft) => {
                                    draft.treeState = tree;
                                }),
                            setGraphVisual: (visual) =>
                                set((draft) => {
                                    draft.graphVisual = visual;
                                }),
                            setGraphLabels: (labels) =>
                                set((draft) => {
                                    draft.graphState.nodes =
                                        draft.graphState.nodes.map((n) => ({
                                            ...n,
                                            label: labels[n.id] ?? n.label,
                                        }));
                                }),
                            setDpTable: (table) =>
                                set((draft) => {
                                    draft.dpState = table;
                                }),
                            setDpVisual: (visual) =>
                                set((draft) => {
                                    draft.dpVisual = visual;
                                }),
                            onStep: (index) =>
                                set((draft) => {
                                    draft.stepIndex = index;
                                    draft.metrics.ops = index + 1;
                                }),
                        };
                    },

                    selectAlgorithm: (id) => {
                        const algo = getAlgorithmById(id);
                        if (!algo) return;
                        const preset = loadCategoryPreset(id, algo.category);
                        set((draft) => {
                            draft.algorithmId = id;
                            draft.category = algo.category;
                            draft.status = "idle";
                            draft.stepIndex = 0;
                            draft.pathfindingSteps = [];
                            draft.sortingSteps = [];
                            draft.treeSteps = [];
                            draft.graphSteps = [];
                            draft.dpSteps = [];
                            draft.sortingSortedIndices = [];
                            draft.sortingHighlight = {
                                indices: [],
                                type: null,
                            };
                            draft.treeVisual = createEmptyTreeVisual();
                            draft.graphVisual = createEmptyGraphVisual();
                            draft.dpVisual = createEmptyDpVisual();
                            draft.stubMessage = null;
                            clearGridVisualization(draft.grid);
                            if (preset.treeState)
                                draft.treeState = preset.treeState;
                            if (preset.graphState) {
                                draft.graphState = preset.graphState;
                                draft.graphConfig.directed =
                                    preset.graphState.directed ?? true;
                            }
                            if (preset.dpState) {
                                draft.dpState = preset.dpState;
                                draft.dpInitialTable =
                                    preset.dpInitialTable ?? preset.dpState;
                            }
                        });
                    },

                    setCategory: (category) => {
                        set((draft) => {
                            draft.category = category;
                        });
                    },

                    setSpeed: (speed) => {
                        set((draft) => {
                            draft.speed = speed;
                        });
                    },

                    setMazePreset: (preset) => {
                        set((draft) => {
                            draft.mazePreset = preset;
                        });
                    },

                    setHeuristic: (h) => {
                        set((draft) => {
                            draft.pathfindingConfig.heuristic = h;
                        });
                    },

                    setPathfindingConfig: (key, value) => {
                        set((draft) => {
                            (
                                draft.pathfindingConfig as Record<
                                    string,
                                    unknown
                                >
                            )[key] = value;
                        });
                    },

                    setCursor: (cursor) => {
                        set((draft) => {
                            draft.cursor = cursor;
                        });
                    },

                    toggleWallTile: (row, col) => {
                        set((draft) => {
                            if (draft.status !== "idle") return;
                            const tile = draft.grid[row][col];
                            if (!tile.isStart && !tile.isEnd) {
                                tile.isWall = !tile.isWall;
                            }
                        });
                    },

                    setTile: (row, col, updater) => {
                        set((draft) => {
                            const tile = draft.grid[row]?.[col];
                            if (tile) updater(tile);
                        });
                    },

                    resetGrid: () => {
                        const { algorithmId, category } = get();
                        const preset = loadCategoryPreset(
                            algorithmId,
                            category,
                        );
                        set((draft) => {
                            draft.status = "idle";
                            draft.stepIndex = 0;
                            draft.pathfindingSteps = [];
                            draft.sortingSteps = [];
                            draft.treeSteps = [];
                            draft.graphSteps = [];
                            draft.dpSteps = [];
                            draft.metrics = {
                                ops: 0,
                                comparisons: 0,
                                nodes: 0,
                                elapsedMs: 0,
                            };
                            draft.stubMessage = null;
                            draft._abortPlayback = true;
                            draft.treeVisual = createEmptyTreeVisual();
                            draft.graphVisual = createEmptyGraphVisual();
                            draft.dpVisual = createEmptyDpVisual();

                            if (category === "pathfinding") {
                                draft.grid = createGrid(
                                    draft.startTile,
                                    draft.endTile,
                                );
                            } else if (category === "sorting") {
                                draft.sortingArray = createInitialSortingArray(
                                    draft.sortingArraySize,
                                );
                                draft.sortingHighlight = {
                                    indices: [],
                                    type: null,
                                };
                                draft.sortingSortedIndices = [];
                            } else if (preset.treeState) {
                                draft.treeState = preset.treeState;
                            } else if (preset.graphState) {
                                draft.graphState = preset.graphState;
                            } else if (preset.dpState) {
                                draft.dpState = preset.dpState;
                                draft.dpInitialTable =
                                    preset.dpInitialTable ?? preset.dpState;
                            }
                        });
                    },

                    reloadCategoryPreset: () => {
                        get().actions.resetGrid();
                    },

                    setSortingArraySize: (size) => {
                        set((draft) => {
                            draft.sortingArraySize = size;
                            draft.sortingArray =
                                createInitialSortingArray(size);
                            draft.sortingHighlight = {
                                indices: [],
                                type: null,
                            };
                            draft.sortingSortedIndices = [];
                            draft.sortingSteps = [];
                            draft.stepIndex = 0;
                        });
                    },

                    setTreeInsertValue: (value) => {
                        set((draft) => {
                            draft.treeConfig.insertValue = value;
                        });
                    },

                    setTreeShowNullChildren: (show) => {
                        set((draft) => {
                            draft.treeConfig.showNullChildren = show;
                        });
                    },

                    setGraphConfig: (key, value) => {
                        set((draft) => {
                            draft.graphConfig[key] = value;
                            if (key === "directed") {
                                draft.graphState.directed = value;
                            }
                        });
                    },

                    generateMaze: async () => {
                        const state = get();
                        if (state.status === "running") return;
                        const mazeGen = MAZE_GENERATORS[state.mazePreset];
                        if (!mazeGen) return;

                        set((draft) => {
                            draft.status = "running";
                            draft._abortPlayback = false;
                            draft.stubMessage = null;
                            for (let row = 0; row < MAX_ROWS; row++) {
                                for (let col = 0; col < MAX_COLS; col++) {
                                    const tile = draft.grid[row][col];
                                    if (!tile.isStart && !tile.isEnd) {
                                        tile.isWall = false;
                                        tile.isPath = false;
                                        tile.isTraversed = false;
                                        tile.isFrontier = false;
                                    }
                                }
                            }
                        });

                        const { grid, startTile, endTile } = get();
                        const result = await mazeGen.run({
                            grid,
                            start: startTile,
                            end: endTile,
                        });

                        if (result.steps.length > 0) {
                            await playMazeSteps(
                                result.steps,
                                () => get().speed,
                                get().actions.getPlayerCallbacks(),
                                () => !get()._abortPlayback,
                            );
                        } else if (result.grid) {
                            set((draft) => {
                                draft.grid = result.grid;
                            });
                            set((draft) => {
                                draft.stubMessage = STUB_NOTICE;
                            });
                        }

                        set((draft) => {
                            draft.status = "idle";
                        });
                    },

                    visualise: async () => {
                        await get().actions.play();
                    },

                    play: async () => {
                        const state = get();
                        const algo = getAlgorithmById(state.algorithmId);
                        if (!algo) return;

                        set((draft) => {
                            draft._abortPlayback = false;
                            draft.status = "running";
                            draft.runStartTime = Date.now();
                            draft.stubMessage = null;
                        });

                        if (algo.category === "pathfinding") {
                            const {
                                grid,
                                startTile,
                                endTile,
                                pathfindingConfig,
                            } = get();
                            set((draft) => {
                                clearGridVisualization(draft.grid);
                            });
                            const output = await algo.run({
                                grid,
                                start: startTile,
                                end: endTile,
                                heuristic: pathfindingConfig.heuristic,
                                allowDiagonals:
                                    pathfindingConfig.allowDiagonals,
                                bidirectional: pathfindingConfig.bidirectional,
                            });

                            set((draft) => {
                                draft.pathfindingSteps = output.steps;
                                draft.metrics.comparisons =
                                    output.stats.comparisons;
                                draft.metrics.nodes = output.stats.nodes;
                            });

                            if (output.steps.length === 0) {
                                set((draft) => {
                                    draft.status = "complete";
                                    draft.stubMessage = STUB_NOTICE;
                                });
                                return;
                            }

                            await playPathfindingSteps(
                                output.steps,
                                () => get().speed,
                                get().grid,
                                get().actions.getPlayerCallbacks(),
                                get().stepIndex,
                                () =>
                                    !get()._abortPlayback &&
                                    get().status !== "paused",
                            );
                        } else if (algo.category === "sorting") {
                            set((draft) => {
                                draft.sortingHighlight = {
                                    indices: [],
                                    type: null,
                                };
                                draft.sortingSortedIndices = [];
                            });
                            const { sortingArray } = get();
                            const output = await algo.run({
                                array: sortingArray,
                            });

                            set((draft) => {
                                draft.sortingInitialArray = [...sortingArray];
                                draft.sortingSteps = output.steps;
                                draft.metrics.comparisons =
                                    output.stats.comparisons;
                            });

                            if (output.steps.length === 0) {
                                set((draft) => {
                                    draft.status = "complete";
                                    draft.stubMessage = STUB_NOTICE;
                                });
                                return;
                            }

                            await playSortingSteps(
                                output.steps,
                                () => get().speed,
                                get().sortingInitialArray,
                                get().actions.getPlayerCallbacks(),
                                get().stepIndex,
                                () =>
                                    !get()._abortPlayback &&
                                    get().status !== "paused",
                            );
                        } else if (algo.category === "trees") {
                            set((draft) => {
                                draft.treeVisual = createEmptyTreeVisual();
                            });
                            const { treeState, treeConfig } = get();
                            const output = await algo.run({
                                tree: treeState,
                                insertValue: treeConfig.insertValue,
                                showNullChildren: treeConfig.showNullChildren,
                            });
                            if (output.tree) {
                                set((draft) => {
                                    draft.treeState = output.tree!;
                                });
                            }
                            set((draft) => {
                                draft.treeSteps = output.steps;
                                draft.metrics.comparisons =
                                    output.stats.comparisons;
                            });
                            if (output.steps.length === 0) {
                                set((draft) => {
                                    draft.status = "complete";
                                    draft.stubMessage = STUB_NOTICE;
                                });
                                return;
                            }
                            await playTreeSteps(
                                output.steps,
                                () => get().speed,
                                get().actions.getPlayerCallbacks(),
                                get().stepIndex,
                                () =>
                                    !get()._abortPlayback &&
                                    get().status !== "paused",
                            );
                        } else if (algo.category === "graphs") {
                            set((draft) => {
                                draft.graphVisual = createEmptyGraphVisual();
                            });
                            const { graphState, graphConfig } = get();
                            const output = await algo.run({
                                graph: graphState,
                                directed: graphConfig.directed,
                                showWeights: graphConfig.showWeights,
                            });
                            set((draft) => {
                                draft.graphSteps = output.steps;
                                draft.metrics.comparisons =
                                    output.stats.comparisons;
                                draft.metrics.nodes = output.stats.nodes;
                            });
                            if (output.steps.length === 0) {
                                set((draft) => {
                                    draft.status = "complete";
                                    draft.stubMessage = STUB_NOTICE;
                                });
                                return;
                            }
                            await playGraphSteps(
                                output.steps,
                                () => get().speed,
                                get().actions.getPlayerCallbacks(),
                                get().stepIndex,
                                () =>
                                    !get()._abortPlayback &&
                                    get().status !== "paused",
                            );
                        } else if (algo.category === "dp") {
                            const { dpInitialTable } = get();
                            const tableInput = {
                                ...dpInitialTable,
                                cells: dpInitialTable.cells.map((row) => [
                                    ...row,
                                ]),
                            };
                            set((draft) => {
                                draft.dpState = tableInput;
                                draft.dpVisual = createEmptyDpVisual();
                            });
                            const output = await algo.run({
                                table: tableInput,
                            });
                            set((draft) => {
                                draft.dpSteps = output.steps;
                                draft.metrics.comparisons =
                                    output.stats.comparisons;
                            });
                            if (output.steps.length === 0) {
                                set((draft) => {
                                    draft.status = "complete";
                                    draft.stubMessage = STUB_NOTICE;
                                });
                                return;
                            }
                            await playDpSteps(
                                output.steps,
                                () => get().speed,
                                get().dpInitialTable,
                                get().actions.getPlayerCallbacks(),
                                get().stepIndex,
                                () =>
                                    !get()._abortPlayback &&
                                    get().status !== "paused",
                            );
                        }

                        set((draft) => {
                            draft.status = "complete";
                            draft.metrics.elapsedMs = draft.runStartTime
                                ? Date.now() - draft.runStartTime
                                : 0;
                        });
                    },

                    pause: () => {
                        set((draft) => {
                            if (draft.status === "running") {
                                draft.status = "paused";
                                draft._abortPlayback = true;
                            }
                        });
                    },

                    stepForward: () => {
                        const state = get();
                        const cbs = state.actions.getPlayerCallbacks();
                        if (state.category === "pathfinding") {
                            if (state.pathfindingSteps.length === 0) return;
                            const next = Math.min(
                                state.stepIndex + 1,
                                state.pathfindingSteps.length - 1,
                            );
                            applyPathfindingStepAtIndex(
                                state.pathfindingSteps,
                                next,
                                state.grid,
                                cbs,
                            );
                            set((draft) => {
                                draft.stepIndex = next;
                            });
                        } else if (state.category === "sorting") {
                            if (state.sortingSteps.length === 0) return;
                            const next = Math.min(
                                state.stepIndex + 1,
                                state.sortingSteps.length - 1,
                            );
                            applySortingStepAtIndex(
                                state.sortingSteps,
                                next,
                                state.sortingInitialArray,
                                cbs,
                            );
                            set((draft) => {
                                draft.stepIndex = next;
                            });
                        } else if (state.category === "trees") {
                            if (state.treeSteps.length === 0) return;
                            const next = Math.min(
                                state.stepIndex + 1,
                                state.treeSteps.length - 1,
                            );
                            applyTreeStepAtIndex(state.treeSteps, next, cbs);
                            set((draft) => {
                                draft.stepIndex = next;
                            });
                        } else if (state.category === "graphs") {
                            if (state.graphSteps.length === 0) return;
                            const next = Math.min(
                                state.stepIndex + 1,
                                state.graphSteps.length - 1,
                            );
                            applyGraphStepAtIndex(state.graphSteps, next, cbs);
                            set((draft) => {
                                draft.stepIndex = next;
                            });
                        } else if (state.category === "dp") {
                            if (state.dpSteps.length === 0) return;
                            const next = Math.min(
                                state.stepIndex + 1,
                                state.dpSteps.length - 1,
                            );
                            applyDpStepAtIndex(
                                state.dpSteps,
                                next,
                                state.dpInitialTable,
                                cbs,
                            );
                            set((draft) => {
                                draft.stepIndex = next;
                            });
                        }
                    },

                    stepBackward: () => {
                        const state = get();
                        const cbs = state.actions.getPlayerCallbacks();
                        const prev = Math.max(state.stepIndex - 1, 0);
                        if (state.category === "pathfinding") {
                            if (state.pathfindingSteps.length === 0) return;
                            applyPathfindingStepAtIndex(
                                state.pathfindingSteps,
                                prev,
                                state.grid,
                                cbs,
                            );
                        } else if (state.category === "sorting") {
                            if (state.sortingSteps.length === 0) return;
                            applySortingStepAtIndex(
                                state.sortingSteps,
                                prev,
                                state.sortingInitialArray,
                                cbs,
                            );
                        } else if (state.category === "trees") {
                            if (state.treeSteps.length === 0) return;
                            applyTreeStepAtIndex(state.treeSteps, prev, cbs);
                        } else if (state.category === "graphs") {
                            if (state.graphSteps.length === 0) return;
                            applyGraphStepAtIndex(state.graphSteps, prev, cbs);
                        } else if (state.category === "dp") {
                            if (state.dpSteps.length === 0) return;
                            applyDpStepAtIndex(
                                state.dpSteps,
                                prev,
                                state.dpInitialTable,
                                cbs,
                            );
                        } else return;
                        set((draft) => {
                            draft.stepIndex = prev;
                        });
                    },

                    scrubToStep: (index) => {
                        const state = get();
                        const cbs = state.actions.getPlayerCallbacks();
                        if (state.category === "pathfinding") {
                            applyPathfindingStepAtIndex(
                                state.pathfindingSteps,
                                index,
                                state.grid,
                                cbs,
                            );
                        } else if (state.category === "sorting") {
                            applySortingStepAtIndex(
                                state.sortingSteps,
                                index,
                                state.sortingInitialArray,
                                cbs,
                            );
                        } else if (state.category === "trees") {
                            applyTreeStepAtIndex(state.treeSteps, index, cbs);
                        } else if (state.category === "graphs") {
                            applyGraphStepAtIndex(state.graphSteps, index, cbs);
                        } else if (state.category === "dp") {
                            applyDpStepAtIndex(
                                state.dpSteps,
                                index,
                                state.dpInitialTable,
                                cbs,
                            );
                        } else return;
                        set((draft) => {
                            draft.stepIndex = index;
                        });
                    },

                    skipToStart: () => {
                        get().actions.scrubToStep(0);
                    },

                    skipToEnd: () => {
                        const state = get();
                        const max =
                            state.category === "pathfinding"
                                ? state.pathfindingSteps.length - 1
                                : state.category === "sorting"
                                  ? state.sortingSteps.length - 1
                                  : state.category === "trees"
                                    ? state.treeSteps.length - 1
                                    : state.category === "graphs"
                                      ? state.graphSteps.length - 1
                                      : state.dpSteps.length - 1;
                        if (max >= 0) get().actions.scrubToStep(max);
                    },

                    toggleLeftCollapsed: () => {
                        set((draft) => {
                            draft.ui.leftCollapsed = !draft.ui.leftCollapsed;
                        });
                    },

                    toggleRightCollapsed: () => {
                        set((draft) => {
                            draft.ui.rightCollapsed = !draft.ui.rightCollapsed;
                        });
                    },

                    expandSidePanels: () => {
                        set((draft) => {
                            draft.ui.leftCollapsed = false;
                            draft.ui.rightCollapsed = false;
                        });
                    },

                    toggleTheme: () => {
                        const next: Theme =
                            get().ui.theme === "dark" ? "light" : "dark";
                        set((draft) => {
                            draft.ui.theme = next;
                        });
                        applyTheme(next);
                    },

                    setCommandPaletteOpen: (open) => {
                        set((draft) => {
                            draft.commandPaletteOpen = open;
                        });
                    },

                    setLearningTab: (tab) => {
                        set((draft) => {
                            draft.ui.learningTab = tab;
                        });
                    },

                    toggleGroupExpanded: (groupId) => {
                        set((draft) => {
                            for (const groupIdKey in draft.ui.expandedGroups) {
                                if (groupIdKey === groupId) continue;
                                draft.ui.expandedGroups[groupIdKey] = false;
                            }
                            draft.ui.expandedGroups[groupId] =
                                !draft.ui.expandedGroups[groupId];
                        });
                    },

                    setMobileLeftOpen: (open) => {
                        set((draft) => {
                            draft.ui.mobileLeftOpen = open;
                        });
                    },

                    setMobileRightOpen: (open) => {
                        set((draft) => {
                            draft.ui.mobileRightOpen = open;
                        });
                    },

                    markVisited: () => {
                        try {
                            localStorage.setItem(HAS_VISITED_KEY, "true");
                        } catch {
                            void 0;
                        }
                        set((draft) => {
                            draft.ui.hasVisited = true;
                        });
                    },

                    clearStubMessage: () => {
                        set((draft) => {
                            draft.stubMessage = null;
                        });
                    },
                },
            })),
            { name: "workspace" },
        ),
    ),
    shallow,
);

export const useWorkspaceActions = () => useWorkspace((s) => s.actions);
