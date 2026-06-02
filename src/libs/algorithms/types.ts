import type { GridType, TileType } from "@types";

export type TileRef = { row: number; col: number };

export type PathfindingStep =
    | { kind: "visit"; tile: TileRef }
    | { kind: "frontier"; tile: TileRef }
    | { kind: "path"; tile: TileRef };

export type HeuristicType = "manhattan" | "euclidean" | "chebyshev" | "octile";

export type PathfindingInput = {
    grid: GridType;
    start: TileType;
    end: TileType;
    heuristic?: HeuristicType;
    allowDiagonals?: boolean;
    bidirectional?: boolean;
};

export type PathfindingOutput = {
    steps: PathfindingStep[];
    found: boolean;
    stats: { comparisons: number; nodes: number };
};

export type PathfindingFn = (
    input: PathfindingInput,
) => PathfindingOutput | Promise<PathfindingOutput>;

export type SortingStep =
    | { kind: "compare"; indices: [number, number] }
    | { kind: "swap"; indices: [number, number] }
    | { kind: "markSorted"; index: number };

export type SortingInput = {
    array: number[];
};

export type SortingOutput = {
    steps: SortingStep[];
    stats: { comparisons: number };
};

export type SortingFn = (
    input: SortingInput,
) => SortingOutput | Promise<SortingOutput>;

export type TreeNodeData = {
    id: string;
    value: number | string;
    left?: string | null;
    right?: string | null;
    parentId?: string | null;
    children?: string[];
};

export type TreeSnapshot = {
    nodes: Record<string, TreeNodeData>;
    rootId: string | null;
    variant: "binary" | "heap" | "trie";
};

export type TreeVisualState = {
    visited: string[];
    highlighted: string[];
    compared: [string, string] | null;
    found: string | null;
    inserted: string | null;
};

export type TreeStep =
    | { kind: "visit"; nodeId: string }
    | { kind: "highlight"; nodeIds: string[] }
    | { kind: "compare"; nodeIds: [string, string] }
    | {
          kind: "insert";
          nodeId: string;
          value: number | string;
          parentId?: string;
      }
    | { kind: "delete"; nodeId: string }
    | { kind: "rotate"; nodeIds: string[] }
    | { kind: "found"; nodeId: string };

export type TreeInput = {
    tree: TreeSnapshot;
    insertValue?: number;
    searchValue?: number;
    showNullChildren?: boolean;
};

export type TreeOutput = {
    steps: TreeStep[];
    tree?: TreeSnapshot;
    stats: { comparisons: number };
};

export type TreeFn = (input: TreeInput) => TreeOutput | Promise<TreeOutput>;

export type GraphNodeData = {
    id: string;
    label: string;
    x?: number;
    y?: number;
};

export type GraphEdgeData = {
    id: string;
    source: string;
    target: string;
    weight?: number;
};

export type GraphSnapshot = {
    nodes: GraphNodeData[];
    edges: GraphEdgeData[];
    directed?: boolean;
};

export type GraphVisualState = {
    visited: string[];
    highlightedNodes: string[];
    highlightedEdges: string[];
    mstEdges: string[];
    relaxedEdges: string[];
    labels: Record<string, string>;
};

export type GraphStep =
    | { kind: "visit"; nodeId: string }
    | { kind: "highlightNode"; nodeIds: string[] }
    | { kind: "highlightEdge"; edgeIds: string[] }
    | { kind: "addMstEdge"; edgeId: string }
    | { kind: "relax"; edgeId: string }
    | { kind: "union"; nodeIds: [string, string] }
    | { kind: "updateLabel"; nodeId: string; label: string };

export type GraphInput = {
    graph: GraphSnapshot;
    directed?: boolean;
    showWeights?: boolean;
};

export type GraphOutput = {
    steps: GraphStep[];
    stats: { comparisons: number; nodes: number };
};

export type GraphFn = (input: GraphInput) => GraphOutput | Promise<GraphOutput>;

export type DpTableState = {
    rows: number;
    cols: number;
    cells: (number | null)[][];
    rowLabels?: string[];
    colLabels?: string[];
    meta?: Record<string, string>;
};

export type DpVisualState = {
    highlights: { row: number; col: number }[];
    compare: { row: number; col: number }[] | null;
    solutionPath: { row: number; col: number }[];
};

export type DpStep =
    | { kind: "setCell"; row: number; col: number; value: number | null }
    | { kind: "highlight"; cells: { row: number; col: number }[] }
    | { kind: "compare"; cells: { row: number; col: number }[] }
    | { kind: "clearHighlights" }
    | { kind: "solutionPath"; cells: { row: number; col: number }[] };

export type DpInput = {
    table: DpTableState;
};

export type DpOutput = {
    steps: DpStep[];
    stats: { comparisons: number };
};

export type DpFn = (input: DpInput) => DpOutput | Promise<DpOutput>;

export type MazeStep =
    | { kind: "wall"; tile: TileRef }
    | { kind: "carve"; tile: TileRef };

export type MazeInput = {
    grid: GridType;
    start: TileType;
    end: TileType;
};

export type MazeOutput = {
    steps: MazeStep[];
    grid: GridType;
};

export type MazeFn = (input: MazeInput) => MazeOutput | Promise<MazeOutput>;
