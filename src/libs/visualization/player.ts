import type {
    DpStep,
    DpTableState,
    DpVisualState,
    GraphStep,
    GraphVisualState,
    MazeStep,
    PathfindingStep,
    SortingStep,
    TreeSnapshot,
    TreeStep,
    TreeVisualState,
} from "@libs/algorithms/types";
import type { GridType, TileType } from "@types";
import { sleep } from "@utils/helpers";

export type PlayerCallbacks = {
    setTile: (
        row: number,
        col: number,
        updater: (tile: TileType) => void,
    ) => void;
    setSortingArray: (array: number[]) => void;
    setSortingHighlight: (indices: number[], type: "compare" | "swap" | null) => void;
    clearSortingSorted?: () => void;
    markSortingSorted?: (index: number) => void;
    setTreeVisual?: (visual: TreeVisualState) => void;
    setTreeSnapshot?: (tree: TreeSnapshot) => void;
    setGraphVisual?: (visual: GraphVisualState) => void;
    setGraphLabels?: (labels: Record<string, string>) => void;
    setDpTable?: (table: DpTableState) => void;
    setDpVisual?: (visual: DpVisualState) => void;
    onStep?: (index: number) => void;
};

const clearVisualizationState = (
    grid: GridType,
    setTile: PlayerCallbacks["setTile"],
) => {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            setTile(row, col, (tile) => {
                if (!tile.isStart && !tile.isEnd) {
                    tile.isPath = false;
                    tile.isTraversed = false;
                    tile.isFrontier = false;
                }
            });
        }
    }
};

const applyPathfindingStep = (
    step: PathfindingStep,
    setTile: PlayerCallbacks["setTile"],
) => {
    const { row, col } = step.tile;
    setTile(row, col, (tile) => {
        if (tile.isStart || tile.isEnd || tile.isWall) return;
        if (step.kind === "visit") {
            tile.isTraversed = true;
            tile.isFrontier = false;
        } else if (step.kind === "frontier") {
            tile.isFrontier = true;
        } else if (step.kind === "path") {
            tile.isPath = true;
            tile.isTraversed = false;
            tile.isFrontier = false;
        }
    });
};

export const applyPathfindingStepAtIndex = (
    steps: PathfindingStep[],
    index: number,
    grid: GridType,
    callbacks: PlayerCallbacks,
) => {
    clearVisualizationState(grid, callbacks.setTile);
    for (let i = 0; i <= index && i < steps.length; i++) {
        applyPathfindingStep(steps[i], callbacks.setTile);
    }
    callbacks.onStep?.(index);
};

export const playPathfindingSteps = async (
    steps: PathfindingStep[],
    speed: number,
    _grid: GridType,
    callbacks: PlayerCallbacks,
    startIndex = 0,
    shouldContinue?: () => boolean,
) => {
    const delay = Math.max(5, 200 / speed);
    for (let i = startIndex; i < steps.length; i++) {
        if (shouldContinue && !shouldContinue()) break;
        applyPathfindingStep(steps[i], callbacks.setTile);
        callbacks.onStep?.(i);
        await sleep(delay);
    }
};

const emptyTreeVisual = (): TreeVisualState => ({
    visited: [],
    highlighted: [],
    compared: null,
    found: null,
    inserted: null,
});

const applyTreeStep = (step: TreeStep, visual: TreeVisualState): TreeVisualState => {
    const next = { ...visual, highlighted: [...visual.highlighted] };
    switch (step.kind) {
        case "visit":
            if (!next.visited.includes(step.nodeId)) {
                next.visited = [...next.visited, step.nodeId];
            }
            next.highlighted = [step.nodeId];
            break;
        case "highlight":
            next.highlighted = step.nodeIds;
            break;
        case "compare":
            next.compared = step.nodeIds;
            next.highlighted = step.nodeIds;
            break;
        case "insert":
            next.inserted = step.nodeId;
            next.highlighted = [step.nodeId];
            break;
        case "delete":
            next.highlighted = [step.nodeId];
            break;
        case "rotate":
            next.highlighted = step.nodeIds;
            break;
        case "found":
            next.found = step.nodeId;
            next.highlighted = [step.nodeId];
            break;
    }
    return next;
};

export const applyTreeStepAtIndex = (
    steps: TreeStep[],
    index: number,
    callbacks: PlayerCallbacks,
) => {
    let visual = emptyTreeVisual();
    for (let i = 0; i <= index && i < steps.length; i++) {
        visual = applyTreeStep(steps[i], visual);
    }
    callbacks.setTreeVisual?.(visual);
    callbacks.onStep?.(index);
};

export const playTreeSteps = async (
    steps: TreeStep[],
    speed: number,
    callbacks: PlayerCallbacks,
    startIndex = 0,
    shouldContinue?: () => boolean,
) => {
    const delay = Math.max(5, 200 / speed);
    let visual = emptyTreeVisual();
    for (let i = 0; i < startIndex && i < steps.length; i++) {
        visual = applyTreeStep(steps[i], visual);
    }
    callbacks.setTreeVisual?.(visual);

    for (let i = startIndex; i < steps.length; i++) {
        if (shouldContinue && !shouldContinue()) break;
        visual = applyTreeStep(steps[i], visual);
        callbacks.setTreeVisual?.(visual);
        callbacks.onStep?.(i);
        await sleep(delay);
    }
};

const emptyGraphVisual = (): GraphVisualState => ({
    visited: [],
    highlightedNodes: [],
    highlightedEdges: [],
    mstEdges: [],
    relaxedEdges: [],
    labels: {},
});

const applyGraphStep = (
    step: GraphStep,
    visual: GraphVisualState,
): GraphVisualState => {
    const next: GraphVisualState = {
        ...visual,
        visited: [...visual.visited],
        highlightedNodes: [...visual.highlightedNodes],
        highlightedEdges: [...visual.highlightedEdges],
        mstEdges: [...visual.mstEdges],
        relaxedEdges: [...visual.relaxedEdges],
        labels: { ...visual.labels },
    };
    switch (step.kind) {
        case "visit":
            if (!next.visited.includes(step.nodeId)) {
                next.visited.push(step.nodeId);
            }
            next.highlightedNodes = [step.nodeId];
            break;
        case "highlightNode":
            next.highlightedNodes = step.nodeIds;
            break;
        case "highlightEdge":
            next.highlightedEdges = step.edgeIds;
            break;
        case "addMstEdge":
            if (!next.mstEdges.includes(step.edgeId)) {
                next.mstEdges.push(step.edgeId);
            }
            next.highlightedEdges = [step.edgeId];
            break;
        case "relax":
            if (!next.relaxedEdges.includes(step.edgeId)) {
                next.relaxedEdges.push(step.edgeId);
            }
            next.highlightedEdges = [step.edgeId];
            break;
        case "union":
            next.highlightedNodes = step.nodeIds;
            break;
        case "updateLabel":
            next.labels[step.nodeId] = step.label;
            next.highlightedNodes = [step.nodeId];
            break;
    }
    return next;
};

export const applyGraphStepAtIndex = (
    steps: GraphStep[],
    index: number,
    callbacks: PlayerCallbacks,
) => {
    let visual = emptyGraphVisual();
    for (let i = 0; i <= index && i < steps.length; i++) {
        visual = applyGraphStep(steps[i], visual);
    }
    callbacks.setGraphVisual?.(visual);
    if (Object.keys(visual.labels).length > 0) {
        callbacks.setGraphLabels?.(visual.labels);
    }
    callbacks.onStep?.(index);
};

export const playGraphSteps = async (
    steps: GraphStep[],
    speed: number,
    callbacks: PlayerCallbacks,
    startIndex = 0,
    shouldContinue?: () => boolean,
) => {
    const delay = Math.max(5, 200 / speed);
    let visual = emptyGraphVisual();
    for (let i = 0; i < startIndex && i < steps.length; i++) {
        visual = applyGraphStep(steps[i], visual);
    }
    callbacks.setGraphVisual?.(visual);

    for (let i = startIndex; i < steps.length; i++) {
        if (shouldContinue && !shouldContinue()) break;
        visual = applyGraphStep(steps[i], visual);
        callbacks.setGraphVisual?.(visual);
        if (Object.keys(visual.labels).length > 0) {
            callbacks.setGraphLabels?.(visual.labels);
        }
        callbacks.onStep?.(i);
        await sleep(delay);
    }
};

const emptyDpVisual = (): DpVisualState => ({
    highlights: [],
    compare: null,
    solutionPath: [],
});

const applyDpStep = (
    step: DpStep,
    table: DpTableState,
    visual: DpVisualState,
): { table: DpTableState; visual: DpVisualState } => {
    const nextTable: DpTableState = {
        ...table,
        cells: table.cells.map((row) => [...row]),
    };
    const nextVisual = { ...visual, highlights: [...visual.highlights] };

    switch (step.kind) {
        case "setCell":
            nextTable.cells[step.row][step.col] = step.value;
            nextVisual.highlights = [{ row: step.row, col: step.col }];
            break;
        case "highlight":
            nextVisual.highlights = step.cells;
            break;
        case "compare":
            nextVisual.compare = step.cells;
            nextVisual.highlights = step.cells;
            break;
        case "clearHighlights":
            nextVisual.highlights = [];
            nextVisual.compare = null;
            break;
        case "solutionPath":
            nextVisual.solutionPath = step.cells;
            nextVisual.highlights = step.cells;
            break;
    }
    return { table: nextTable, visual: nextVisual };
};

export const applyDpStepAtIndex = (
    steps: DpStep[],
    index: number,
    initialTable: DpTableState,
    callbacks: PlayerCallbacks,
) => {
    let table: DpTableState = {
        ...initialTable,
        cells: initialTable.cells.map((row) => [...row]),
    };
    let visual = emptyDpVisual();
    for (let i = 0; i <= index && i < steps.length; i++) {
        const result = applyDpStep(steps[i], table, visual);
        table = result.table;
        visual = result.visual;
    }
    callbacks.setDpTable?.(table);
    callbacks.setDpVisual?.(visual);
    callbacks.onStep?.(index);
};

export const playDpSteps = async (
    steps: DpStep[],
    speed: number,
    initialTable: DpTableState,
    callbacks: PlayerCallbacks,
    startIndex = 0,
    shouldContinue?: () => boolean,
) => {
    const delay = Math.max(5, 200 / speed);
    let table: DpTableState = {
        ...initialTable,
        cells: initialTable.cells.map((row) => [...row]),
    };
    let visual = emptyDpVisual();

    for (let i = 0; i < startIndex && i < steps.length; i++) {
        const result = applyDpStep(steps[i], table, visual);
        table = result.table;
        visual = result.visual;
    }
    callbacks.setDpTable?.(table);
    callbacks.setDpVisual?.(visual);

    for (let i = startIndex; i < steps.length; i++) {
        if (shouldContinue && !shouldContinue()) break;
        const result = applyDpStep(steps[i], table, visual);
        table = result.table;
        visual = result.visual;
        callbacks.setDpTable?.(table);
        callbacks.setDpVisual?.(visual);
        callbacks.onStep?.(i);
        await sleep(delay);
    }
};

export const applySortingStepAtIndex = (
    steps: SortingStep[],
    index: number,
    initialArray: number[],
    callbacks: PlayerCallbacks,
) => {
    const working = [...initialArray];
    callbacks.clearSortingSorted?.();
    callbacks.setSortingHighlight([], null);

    for (let i = 0; i <= index && i < steps.length; i++) {
        const step = steps[i];
        if (step.kind === "swap") {
            const [a, b] = step.indices;
            [working[a], working[b]] = [working[b], working[a]];
            callbacks.setSortingArray([...working]);
            callbacks.setSortingHighlight(step.indices, "swap");
        } else if (step.kind === "compare") {
            callbacks.setSortingHighlight(step.indices, "compare");
        } else if (step.kind === "markSorted") {
            callbacks.markSortingSorted?.(step.index);
            callbacks.setSortingHighlight([], null);
        }
    }
    callbacks.onStep?.(index);
};

export const playMazeSteps = async (
    steps: MazeStep[],
    speed: number,
    callbacks: PlayerCallbacks,
    shouldContinue?: () => boolean,
) => {
    const delay = Math.max(5, 150 / speed);
    for (const step of steps) {
        if (shouldContinue && !shouldContinue()) break;
        const { row, col } = step.tile;
        callbacks.setTile(row, col, (tile) => {
            if (tile.isStart || tile.isEnd) return;
            tile.isWall = step.kind === "wall";
        });
        await sleep(delay);
    }
};

export const playSortingSteps = async (
    steps: SortingStep[],
    speed: number,
    array: number[],
    callbacks: PlayerCallbacks,
    startIndex = 0,
    shouldContinue?: () => boolean,
) => {
    const delay = Math.max(5, 200 / speed);
    const working = [...array];
    for (let i = 0; i <= startIndex && i < steps.length; i++) {
        const step = steps[i];
        if (step.kind === "swap") {
            const [a, b] = step.indices;
            [working[a], working[b]] = [working[b], working[a]];
        }
    }
    callbacks.setSortingArray(working);
    callbacks.setSortingHighlight([], null);
    callbacks.clearSortingSorted?.();

    for (let i = startIndex; i < steps.length; i++) {
        if (shouldContinue && !shouldContinue()) break;
        const step = steps[i];
        if (step.kind === "compare") {
            callbacks.setSortingHighlight(step.indices, "compare");
        } else if (step.kind === "swap") {
            const [a, b] = step.indices;
            [working[a], working[b]] = [working[b], working[a]];
            callbacks.setSortingArray([...working]);
            callbacks.setSortingHighlight(step.indices, "swap");
        } else if (step.kind === "markSorted") {
            callbacks.markSortingSorted?.(step.index);
            callbacks.setSortingHighlight([], null);
        }
        callbacks.onStep?.(i);
        await sleep(delay);
    }
};

export const resetGridVisualization = (
    grid: GridType,
    setTile: PlayerCallbacks["setTile"],
) => {
    clearVisualizationState(grid, setTile);
};
