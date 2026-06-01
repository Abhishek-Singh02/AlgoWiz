import type {
    DpTableState,
    GraphSnapshot,
    TreeSnapshot,
} from "@libs/algorithms/types";

const emptyCells = (rows: number, cols: number) =>
    Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => null as number | null),
    );

export const createBstPreset = (): TreeSnapshot => ({
    variant: "binary",
    rootId: "n4",
    nodes: {
        n4: { id: "n4", value: 40, left: "n2", right: "n6" },
        n2: { id: "n2", value: 20, left: "n1", right: "n3", parentId: "n4" },
        n1: { id: "n1", value: 10, parentId: "n2" },
        n3: { id: "n3", value: 30, parentId: "n2" },
        n6: { id: "n6", value: 60, left: "n5", right: "n7", parentId: "n4" },
        n5: { id: "n5", value: 50, parentId: "n6" },
        n7: { id: "n7", value: 70, parentId: "n6" },
    },
});

export const createAvlPreset = (): TreeSnapshot => ({
    variant: "binary",
    rootId: "n30",
    nodes: {
        n30: { id: "n30", value: 30, left: "n20", right: "n40" },
        n20: { id: "n20", value: 20, left: "n10", parentId: "n30" },
        n10: { id: "n10", value: 10, parentId: "n20" },
        n40: { id: "n40", value: 40, right: "n50", parentId: "n30" },
        n50: { id: "n50", value: 50, parentId: "n40" },
    },
});

export const createHeapPreset = (): TreeSnapshot => ({
    variant: "heap",
    rootId: "h0",
    nodes: {
        h0: { id: "h0", value: 10, left: "h1", right: "h2" },
        h1: { id: "h1", value: 20, left: "h3", right: "h4", parentId: "h0" },
        h2: { id: "h2", value: 15, left: "h5", parentId: "h0" },
        h3: { id: "h3", value: 30, parentId: "h1" },
        h4: { id: "h4", value: 25, parentId: "h1" },
        h5: { id: "h5", value: 40, parentId: "h2" },
    },
});

export const createTriePreset = (): TreeSnapshot => ({
    variant: "trie",
    rootId: "root",
    nodes: {
        root: { id: "root", value: "", children: ["t", "c"] },
        t: { id: "t", value: "t", parentId: "root", children: ["to"] },
        to: { id: "to", value: "o", parentId: "t", children: [] },
        c: { id: "c", value: "c", parentId: "root", children: ["cat"] },
        cat: { id: "cat", value: "at", parentId: "c", children: [] },
    },
});

export const createGraphDAG = (): GraphSnapshot => ({
    directed: true,
    nodes: [
        { id: "A", label: "A", x: 80, y: 40 },
        { id: "B", label: "B", x: 200, y: 40 },
        { id: "C", label: "C", x: 320, y: 40 },
        { id: "D", label: "D", x: 140, y: 140 },
        { id: "E", label: "E", x: 260, y: 140 },
    ],
    edges: [
        { id: "A-B", source: "A", target: "B" },
        { id: "B-C", source: "B", target: "C" },
        { id: "A-D", source: "A", target: "D" },
        { id: "D-E", source: "D", target: "E" },
        { id: "B-E", source: "B", target: "E" },
        { id: "E-C", source: "E", target: "C" },
    ],
});

export const createGraphWeighted = (): GraphSnapshot => ({
    directed: false,
    nodes: [
        { id: "A", label: "A", x: 100, y: 180 },
        { id: "B", label: "B", x: 220, y: 80 },
        { id: "C", label: "C", x: 340, y: 180 },
        { id: "D", label: "D", x: 220, y: 280 },
    ],
    edges: [
        { id: "A-B", source: "A", target: "B", weight: 4 },
        { id: "B-C", source: "B", target: "C", weight: 2 },
        { id: "C-D", source: "C", target: "D", weight: 3 },
        { id: "D-A", source: "D", target: "A", weight: 1 },
        { id: "A-C", source: "A", target: "C", weight: 5 },
        { id: "B-D", source: "B", target: "D", weight: 1 },
    ],
});

export const createGraphUnionFind = (): GraphSnapshot => ({
    directed: false,
    nodes: [
        { id: "0", label: "0", x: 100, y: 120 },
        { id: "1", label: "1", x: 200, y: 60 },
        { id: "2", label: "2", x: 300, y: 120 },
        { id: "3", label: "3", x: 200, y: 200 },
    ],
    edges: [
        { id: "0-1", source: "0", target: "1" },
        { id: "1-2", source: "1", target: "2" },
        { id: "2-3", source: "2", target: "3" },
    ],
});

export const createDpFib = (): DpTableState => ({
    rows: 2,
    cols: 11,
    rowLabels: ["i", "F(i)"],
    colLabels: Array.from({ length: 11 }, (_, i) => String(i)),
    cells: [
        Array.from({ length: 11 }, (_, i) => i),
        Array.from({ length: 11 }, () => null),
    ],
    meta: { n: "10" },
});

export const createDpKnapsack = (): DpTableState => ({
    rows: 5,
    cols: 6,
    rowLabels: ["", "1", "2", "3", "4"],
    colLabels: ["0", "1", "2", "3", "4", "5"],
    cells: emptyCells(5, 6),
    meta: { items: "4", capacity: "5" },
});

export const createDpLCS = (): DpTableState => ({
    rows: 5,
    cols: 5,
    rowLabels: ["", "A", "B", "C", "D"],
    colLabels: ["", "X", "Y", "Z", "W"],
    cells: emptyCells(5, 5),
    meta: { s1: "ABCD", s2: "XYZW" },
});

export const createDpEdit = (): DpTableState => ({
    rows: 5,
    cols: 5,
    rowLabels: ["", "k", "i", "t", "e"],
    colLabels: ["", "s", "i", "t", ""],
    cells: emptyCells(5, 5),
    meta: { s1: "kite", s2: "sit" },
});

export const createDpCoin = (): DpTableState => ({
    rows: 2,
    cols: 12,
    rowLabels: ["amount", "min"],
    colLabels: Array.from({ length: 12 }, (_, i) => String(i)),
    cells: emptyCells(2, 12),
    meta: { coins: "1,3,4", target: "11" },
});

export const createDpMatrix = (): DpTableState => ({
    rows: 5,
    cols: 5,
    rowLabels: ["1", "2", "3", "4", "5"],
    colLabels: ["1", "2", "3", "4", "5"],
    cells: emptyCells(5, 5),
    meta: { dims: "10×30, 30×5, 5×60" },
});

export const createEmptyTreeVisual = () => ({
    visited: [] as string[],
    highlighted: [] as string[],
    compared: null as [string, string] | null,
    found: null as string | null,
    inserted: null as string | null,
});

export const createEmptyGraphVisual = () => ({
    visited: [] as string[],
    highlightedNodes: [] as string[],
    highlightedEdges: [] as string[],
    mstEdges: [] as string[],
    relaxedEdges: [] as string[],
    labels: {} as Record<string, string>,
});

export const createEmptyDpVisual = () => ({
    highlights: [] as { row: number; col: number }[],
    compare: null as { row: number; col: number }[] | null,
    solutionPath: [] as { row: number; col: number }[],
});

const TREE_PRESETS: Record<string, () => TreeSnapshot> = {
    "bst-insert": createBstPreset,
    "bst-search": createBstPreset,
    avl: createAvlPreset,
    "min-heap": createHeapPreset,
    trie: createTriePreset,
};

const GRAPH_PRESETS: Record<string, () => GraphSnapshot> = {
    topological: createGraphDAG,
    prims: createGraphWeighted,
    kruskals: createGraphWeighted,
    "floyd-warshall": createGraphWeighted,
    "union-find": createGraphUnionFind,
};

const DP_PRESETS: Record<string, () => DpTableState> = {
    fibonacci: createDpFib,
    knapsack: createDpKnapsack,
    lcs: createDpLCS,
    "edit-distance": createDpEdit,
    "coin-change": createDpCoin,
    "matrix-chain": createDpMatrix,
};

export const loadTreePreset = (algorithmId: string): TreeSnapshot => {
    const fn = TREE_PRESETS[algorithmId] ?? createBstPreset;
    return fn();
};

export const loadGraphPreset = (algorithmId: string): GraphSnapshot => {
    const fn = GRAPH_PRESETS[algorithmId] ?? createGraphWeighted;
    return fn();
};

export const loadDpPreset = (algorithmId: string): DpTableState => {
    const fn = DP_PRESETS[algorithmId] ?? createDpFib;
    return fn();
};
