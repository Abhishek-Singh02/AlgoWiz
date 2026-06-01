import {
    aStar,
    avlTree,
    bellmanFord,
    bfs,
    binaryTreeMaze,
    bidirectionalSearch,
    bstInsert,
    bstSearch,
    bubbleSort,
    coinChange,
    countingSort,
    dfs,
    dijkstra,
    editDistance,
    fibonacci,
    floydWarshall,
    gbfs,
    heapSort,
    insertionSort,
    knapsack01,
    kruskalsMst,
    lcs,
    matrixChain,
    mergeSort,
    minHeap,
    primsMst,
    quickSort,
    radixSort,
    randomWallsMaze,
    recursiveDivisionMaze,
    selectionSort,
    shellSort,
    topologicalSort,
    trie,
    unionFind,
} from "@libs/algorithms";
import type {
    HeuristicType,
    MazeFn,
    PathfindingFn,
    SortingFn,
    TreeFn,
    GraphFn,
    DpFn,
} from "@libs/algorithms/types";

export type CategoryId =
    | "pathfinding"
    | "sorting"
    | "trees"
    | "graphs"
    | "dp";

export type AlgorithmTag =
    | "optimal"
    | "complete"
    | "heuristic"
    | "weighted"
    | "visited"
    | "end";

export type AlgorithmMeta = {
    id: string;
    name: string;
    category: CategoryId;
    complexity: string;
    complexityVariant: "emerald" | "violet" | "amber" | "rose";
    overview: string;
    tags: AlgorithmTag[];
    timeComplexity: string;
    spaceComplexity: string;
    bestCase?: string;
    pseudocode: string;
    stubPath: string;
    shortcut?: string;
};

export type PathfindingAlgorithmEntry = AlgorithmMeta & {
    category: "pathfinding";
    run: PathfindingFn;
};

export type SortingAlgorithmEntry = AlgorithmMeta & {
    category: "sorting";
    run: SortingFn;
};

export type TreesAlgorithmEntry = AlgorithmMeta & {
    category: "trees";
    run: TreeFn;
};

export type GraphsAlgorithmEntry = AlgorithmMeta & {
    category: "graphs";
    run: GraphFn;
};

export type DpAlgorithmEntry = AlgorithmMeta & {
    category: "dp";
    run: DpFn;
};

export type AlgorithmEntry =
    | PathfindingAlgorithmEntry
    | SortingAlgorithmEntry
    | TreesAlgorithmEntry
    | GraphsAlgorithmEntry
    | DpAlgorithmEntry;

export const PATHFINDING_ALGORITHMS: PathfindingAlgorithmEntry[] = [
    {
        id: "a-star",
        name: "A* Search",
        category: "pathfinding",
        complexity: "O(E log V)",
        complexityVariant: "emerald",
        overview:
            "Finds the shortest weighted path using a heuristic function to guide the search. Combines actual cost g(n) with estimated cost h(n) for each node.",
        tags: ["optimal", "complete", "heuristic", "weighted"],
        timeComplexity: "O(E log V)",
        spaceComplexity: "O(V)",
        bestCase: "O(1)",
        pseudocode: `function AStar(start, goal):
  openSet ← {start}
  gScore[start] ← 0
  while openSet not empty:
    current ← node in openSet with lowest f = g + h
    if current = goal: return reconstructPath
    // expand neighbors...`,
        stubPath: "src/libs/algorithms/pathfinding/a-star.ts",
        shortcut: "A",
        run: aStar,
    },
    {
        id: "dijkstra",
        name: "Dijkstra",
        category: "pathfinding",
        complexity: "O(E log V)",
        complexityVariant: "emerald",
        overview:
            "Finds shortest paths from a source to all vertices in a weighted graph with non-negative edge weights.",
        tags: ["optimal", "complete", "weighted"],
        timeComplexity: "O(E log V)",
        spaceComplexity: "O(V)",
        bestCase: "O(E)",
        pseudocode: `function Dijkstra(start):
  dist[start] ← 0
  while priorityQueue not empty:
    u ← extractMin()
    for each neighbor v of u:
      // relax edge...`,
        stubPath: "src/libs/algorithms/pathfinding/dijkstra.ts",
        shortcut: "D",
        run: dijkstra,
    },
    {
        id: "bfs",
        name: "BFS",
        category: "pathfinding",
        complexity: "O(V+E)",
        complexityVariant: "violet",
        overview:
            "Explores the graph layer by layer using a queue. Guarantees shortest path in unweighted graphs.",
        tags: ["optimal", "complete"],
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        pseudocode: `function BFS(start, goal):
  queue ← [start]
  while queue not empty:
    node ← dequeue()
    // visit neighbors...`,
        stubPath: "src/libs/algorithms/pathfinding/bfs.ts",
        run: bfs,
    },
    {
        id: "dfs",
        name: "DFS",
        category: "pathfinding",
        complexity: "O(V+E)",
        complexityVariant: "violet",
        overview:
            "Explores as far as possible along each branch before backtracking. Uses a stack or recursion.",
        tags: ["complete"],
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        pseudocode: `function DFS(node, goal):
  if node = goal: return true
  mark visited
  for neighbor in node.neighbors:
    if DFS(neighbor, goal): return true`,
        stubPath: "src/libs/algorithms/pathfinding/dfs.ts",
        run: dfs,
    },
    {
        id: "gbfs",
        name: "Greedy Best-First",
        category: "pathfinding",
        complexity: "O(E)",
        complexityVariant: "amber",
        overview:
            "Expands the node closest to the goal by heuristic h(n) only. Fast but not guaranteed optimal.",
        tags: ["heuristic", "complete"],
        timeComplexity: "O(E)",
        spaceComplexity: "O(V)",
        pseudocode: `function GBFS(start, goal):
  openSet ← priorityQueue by h(n)
  while openSet not empty:
    current ← popMinH()
    if current = goal: return path`,
        stubPath: "src/libs/algorithms/pathfinding/gbfs.ts",
        run: gbfs,
    },
    {
        id: "bellman-ford",
        name: "Bellman-Ford",
        category: "pathfinding",
        complexity: "O(VE)",
        complexityVariant: "amber",
        overview:
            "Single-source shortest paths in graphs that may have negative edge weights. Detects negative cycles.",
        tags: ["weighted"],
        timeComplexity: "O(V · E)",
        spaceComplexity: "O(V)",
        pseudocode: `for i in 1..|V|-1:
  for each edge (u,v,w):
    relax(u, v, w)`,
        stubPath: "src/libs/algorithms/pathfinding/bellman-ford.ts",
        run: bellmanFord,
    },
    {
        id: "bidirectional",
        name: "Bidirectional Search",
        category: "pathfinding",
        complexity: "O(b^(d/2))",
        complexityVariant: "violet",
        overview:
            "Runs two simultaneous searches from start and goal, meeting in the middle to reduce explored nodes.",
        tags: ["optimal", "complete"],
        timeComplexity: "O(b^(d/2))",
        spaceComplexity: "O(b^(d/2))",
        pseudocode: `function bidirectional(start, goal):
  frontierA ← {start}
  frontierB ← {goal}
  while both frontiers active:
    expand smaller frontier`,
        stubPath: "src/libs/algorithms/pathfinding/bidirectional.ts",
        run: bidirectionalSearch,
    },
];

export const SORTING_ALGORITHMS: SortingAlgorithmEntry[] = [
    {
        id: "bubble",
        name: "Bubble Sort",
        category: "sorting",
        complexity: "O(n²)",
        complexityVariant: "amber",
        overview:
            "Repeatedly swaps adjacent elements if they are in the wrong order. Simple but inefficient for large inputs.",
        tags: [],
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        pseudocode: `for i in 0..n:
  for j in 0..n-i-1:
    if arr[j] > arr[j+1]: swap`,
        stubPath: "src/libs/algorithms/sorting/bubble.ts",
        run: bubbleSort,
    },
    {
        id: "merge",
        name: "Merge Sort",
        category: "sorting",
        complexity: "O(n log n)",
        complexityVariant: "emerald",
        overview:
            "Divide-and-conquer algorithm that splits the array, sorts halves, and merges them.",
        tags: ["optimal"],
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
        pseudocode: `function mergeSort(arr, l, r):
  if l < r:
  mid ← (l+r)/2
  mergeSort(arr, l, mid)
  mergeSort(arr, mid+1, r)
  merge(arr, l, mid, r)`,
        stubPath: "src/libs/algorithms/sorting/merge.ts",
        run: mergeSort,
    },
    {
        id: "quick",
        name: "Quick Sort",
        category: "sorting",
        complexity: "O(n log n)",
        complexityVariant: "emerald",
        overview:
            "Picks a pivot, partitions the array, and recursively sorts sub-arrays.",
        tags: [],
        timeComplexity: "O(n log n) avg",
        spaceComplexity: "O(log n)",
        pseudocode: `function quickSort(arr, low, high):
  if low < high:
  pi ← partition(arr, low, high)
  quickSort(arr, low, pi-1)
  quickSort(arr, pi+1, high)`,
        stubPath: "src/libs/algorithms/sorting/quick.ts",
        run: quickSort,
    },
    {
        id: "selection",
        name: "Selection Sort",
        category: "sorting",
        complexity: "O(n²)",
        complexityVariant: "amber",
        overview:
            "Repeatedly finds the minimum element from the unsorted portion and places it at the beginning.",
        tags: [],
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        pseudocode: `for i in 0..n:
  minIdx ← i
  for j in i+1..n:
    if arr[j] < arr[minIdx]: minIdx ← j
  swap arr[i], arr[minIdx]`,
        stubPath: "src/libs/algorithms/sorting/selection.ts",
        run: selectionSort,
    },
    {
        id: "insertion",
        name: "Insertion Sort",
        category: "sorting",
        complexity: "O(n²)",
        complexityVariant: "amber",
        overview:
            "Builds the sorted array one element at a time by inserting each into its correct position.",
        tags: [],
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        bestCase: "O(n)",
        pseudocode: `for i in 1..n:
  key ← arr[i]
  j ← i - 1
  while j ≥ 0 and arr[j] > key:
    arr[j+1] ← arr[j]; j--`,
        stubPath: "src/libs/algorithms/sorting/insertion.ts",
        run: insertionSort,
    },
    {
        id: "heap",
        name: "Heap Sort",
        category: "sorting",
        complexity: "O(n log n)",
        complexityVariant: "emerald",
        overview:
            "Builds a max-heap from the array, then repeatedly extracts the maximum to sort in place.",
        tags: [],
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(1)",
        pseudocode: `buildMaxHeap(arr)
for i from n-1 down to 1:
  swap arr[0], arr[i]
  heapify(arr, 0, i)`,
        stubPath: "src/libs/algorithms/sorting/heap.ts",
        run: heapSort,
    },
    {
        id: "shell",
        name: "Shell Sort",
        category: "sorting",
        complexity: "O(n^1.3)",
        complexityVariant: "violet",
        overview:
            "Generalized insertion sort that sorts elements far apart first, then reduces gap until gap = 1.",
        tags: [],
        timeComplexity: "O(n^1.3)–O(n²)",
        spaceComplexity: "O(1)",
        pseudocode: `for gap in sequence:
  for i from gap to n:
    insert arr[i] into gapped subarray`,
        stubPath: "src/libs/algorithms/sorting/shell.ts",
        run: shellSort,
    },
    {
        id: "counting",
        name: "Counting Sort",
        category: "sorting",
        complexity: "O(n+k)",
        complexityVariant: "emerald",
        overview:
            "Non-comparison sort that counts occurrences of each key in a range, then reconstructs the array.",
        tags: [],
        timeComplexity: "O(n + k)",
        spaceComplexity: "O(k)",
        pseudocode: `count[key] ← frequencies
prefix sum count
place elements by count index`,
        stubPath: "src/libs/algorithms/sorting/counting.ts",
        run: countingSort,
    },
    {
        id: "radix",
        name: "Radix Sort",
        category: "sorting",
        complexity: "O(nk)",
        complexityVariant: "emerald",
        overview:
            "Sorts integers digit by digit using a stable sub-sort (often counting sort) from least to most significant digit.",
        tags: [],
        timeComplexity: "O(n · k)",
        spaceComplexity: "O(n + k)",
        pseudocode: `for digit from least to most:
  stableSortByDigit(arr, digit)`,
        stubPath: "src/libs/algorithms/sorting/radix.ts",
        run: radixSort,
    },
];

export const TREES_ALGORITHMS: TreesAlgorithmEntry[] = [
    {
        id: "bst-insert",
        name: "BST Insert",
        category: "trees",
        complexity: "O(h)",
        complexityVariant: "emerald",
        overview:
            "Inserts a key into a binary search tree by walking left or right until an empty child is found.",
        tags: [],
        timeComplexity: "O(h)",
        spaceComplexity: "O(h)",
        pseudocode: `function insert(node, key):
  if node is null: return new Node(key)
  if key < node.key: node.left ← insert(node.left, key)
  else: node.right ← insert(node.right, key)`,
        stubPath: "src/libs/algorithms/trees/bst-insert.ts",
        run: bstInsert,
    },
    {
        id: "bst-search",
        name: "BST Search",
        category: "trees",
        complexity: "O(h)",
        complexityVariant: "emerald",
        overview:
            "Locates a key by comparing at each node and recursing left or right in a binary search tree.",
        tags: [],
        timeComplexity: "O(h)",
        spaceComplexity: "O(h)",
        pseudocode: `function search(node, key):
  if node is null: return false
  if key = node.key: return true
  return search(left or right, key)`,
        stubPath: "src/libs/algorithms/trees/bst-search.ts",
        run: bstSearch,
    },
    {
        id: "avl",
        name: "AVL Tree",
        category: "trees",
        complexity: "O(log n)",
        complexityVariant: "emerald",
        overview:
            "Self-balancing BST that maintains height balance via rotations after insert or delete.",
        tags: ["optimal"],
        timeComplexity: "O(log n)",
        spaceComplexity: "O(n)",
        pseudocode: `insert(node, key)
rebalance on unwind using rotations
if balance factor ∉ {-1,0,1}: rotate`,
        stubPath: "src/libs/algorithms/trees/avl.ts",
        run: avlTree,
    },
    {
        id: "min-heap",
        name: "Min Heap",
        category: "trees",
        complexity: "O(log n)",
        complexityVariant: "violet",
        overview:
            "Complete binary tree where each parent is ≤ its children. Supports O(log n) insert and extract-min.",
        tags: [],
        timeComplexity: "O(log n) insert",
        spaceComplexity: "O(n)",
        pseudocode: `insert(heap, x):
  append x; bubbleUp(last)
extractMin(heap):
  swap root, last; bubbleDown(root)`,
        stubPath: "src/libs/algorithms/trees/min-heap.ts",
        run: minHeap,
    },
    {
        id: "trie",
        name: "Trie",
        category: "trees",
        complexity: "O(m)",
        complexityVariant: "violet",
        overview:
            "Prefix tree for strings: each edge is a character. Efficient prefix search and autocomplete.",
        tags: [],
        timeComplexity: "O(m) per op",
        spaceComplexity: "O(ALPHABET · m · n)",
        pseudocode: `insert(word):
  node ← root
  for char in word:
    node ← node.children[char]
  node.isEnd ← true`,
        stubPath: "src/libs/algorithms/trees/trie.ts",
        run: trie,
    },
];

export const GRAPHS_ALGORITHMS: GraphsAlgorithmEntry[] = [
    {
        id: "topological",
        name: "Topological Sort",
        category: "graphs",
        complexity: "O(V+E)",
        complexityVariant: "emerald",
        overview:
            "Linear ordering of vertices in a DAG such that for every edge u→v, u comes before v.",
        tags: ["complete"],
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        pseudocode: `DFS or Kahn's algorithm:
  track in-degrees, enqueue zeros,
  remove edges, append to order`,
        stubPath: "src/libs/algorithms/graphs/topological.ts",
        run: topologicalSort,
    },
    {
        id: "prims",
        name: "Prim's MST",
        category: "graphs",
        complexity: "O(E log V)",
        complexityVariant: "emerald",
        overview:
            "Grows a minimum spanning tree by adding the cheapest edge from the tree to a new vertex.",
        tags: ["weighted", "optimal"],
        timeComplexity: "O(E log V)",
        spaceComplexity: "O(V)",
        pseudocode: `tree ← {start}
while tree ≠ V:
  pick min edge (u,v) with u in tree, v not
  add v to tree`,
        stubPath: "src/libs/algorithms/graphs/prims.ts",
        run: primsMst,
    },
    {
        id: "kruskals",
        name: "Kruskal's MST",
        category: "graphs",
        complexity: "O(E log E)",
        complexityVariant: "emerald",
        overview:
            "Sorts edges by weight and adds each if it does not form a cycle, using union-find.",
        tags: ["weighted", "optimal"],
        timeComplexity: "O(E log E)",
        spaceComplexity: "O(V)",
        pseudocode: `sort edges by weight
for edge in edges:
  if find(u) ≠ find(v):
    union(u,v); add edge to MST`,
        stubPath: "src/libs/algorithms/graphs/kruskals.ts",
        run: kruskalsMst,
    },
    {
        id: "floyd-warshall",
        name: "Floyd-Warshall",
        category: "graphs",
        complexity: "O(V³)",
        complexityVariant: "amber",
        overview:
            "All-pairs shortest paths by considering each vertex as an intermediate hop.",
        tags: ["weighted"],
        timeComplexity: "O(V³)",
        spaceComplexity: "O(V²)",
        pseudocode: `for k in 1..V:
  for i,j: dist[i][j] ← min(dist[i][j], dist[i][k]+dist[k][j])`,
        stubPath: "src/libs/algorithms/graphs/floyd-warshall.ts",
        run: floydWarshall,
    },
    {
        id: "union-find",
        name: "Union-Find",
        category: "graphs",
        complexity: "O(α(n))",
        complexityVariant: "violet",
        overview:
            "Disjoint-set structure with path compression and union by rank for near-constant connectivity queries.",
        tags: [],
        timeComplexity: "O(α(n)) amortized",
        spaceComplexity: "O(n)",
        pseudocode: `find(x): root with path compression
union(a,b): link roots by rank`,
        stubPath: "src/libs/algorithms/graphs/union-find.ts",
        run: unionFind,
    },
];

export const DP_ALGORITHMS: DpAlgorithmEntry[] = [
    {
        id: "fibonacci",
        name: "Fibonacci",
        category: "dp",
        complexity: "O(n)",
        complexityVariant: "emerald",
        overview:
            "Classic intro to DP: F(n) = F(n-1) + F(n-2) with memoization or bottom-up tabulation.",
        tags: [],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        pseudocode: `dp[0]←0; dp[1]←1
for i in 2..n: dp[i]←dp[i-1]+dp[i-2]`,
        stubPath: "src/libs/algorithms/dp/fibonacci.ts",
        run: fibonacci,
    },
    {
        id: "knapsack",
        name: "0/1 Knapsack",
        category: "dp",
        complexity: "O(nW)",
        complexityVariant: "amber",
        overview:
            "Maximize value with weight capacity W; each item taken at most once.",
        tags: [],
        timeComplexity: "O(n · W)",
        spaceComplexity: "O(n · W)",
        pseudocode: `for each item i, weight w, value v:
  for cap from W down to w:
    dp[cap] ← max(dp[cap], dp[cap-w]+v)`,
        stubPath: "src/libs/algorithms/dp/knapsack.ts",
        run: knapsack01,
    },
    {
        id: "lcs",
        name: "LCS",
        category: "dp",
        complexity: "O(mn)",
        complexityVariant: "violet",
        overview:
            "Longest subsequence common to two strings (not necessarily contiguous).",
        tags: [],
        timeComplexity: "O(m · n)",
        spaceComplexity: "O(m · n)",
        pseudocode: `if X[i]=Y[j]: dp[i][j]←dp[i-1][j-1]+1
else: dp[i][j]←max(dp[i-1][j], dp[i][j-1])`,
        stubPath: "src/libs/algorithms/dp/lcs.ts",
        run: lcs,
    },
    {
        id: "edit-distance",
        name: "Edit Distance",
        category: "dp",
        complexity: "O(mn)",
        complexityVariant: "violet",
        overview:
            "Minimum insertions, deletions, and substitutions to transform one string into another.",
        tags: [],
        timeComplexity: "O(m · n)",
        spaceComplexity: "O(m · n)",
        pseudocode: `Levenshtein recurrence on prefixes of s1, s2`,
        stubPath: "src/libs/algorithms/dp/edit-distance.ts",
        run: editDistance,
    },
    {
        id: "coin-change",
        name: "Coin Change",
        category: "dp",
        complexity: "O(nA)",
        complexityVariant: "amber",
        overview:
            "Fewest coins to make amount A, or count ways to make A, depending on variant.",
        tags: [],
        timeComplexity: "O(n · A)",
        spaceComplexity: "O(A)",
        pseudocode: `dp[0]←0
for amount a: dp[a]←min(dp[a-coin]+1) over coins`,
        stubPath: "src/libs/algorithms/dp/coin-change.ts",
        run: coinChange,
    },
    {
        id: "matrix-chain",
        name: "Matrix Chain",
        category: "dp",
        complexity: "O(n³)",
        complexityVariant: "rose",
        overview:
            "Optimal parenthesization of matrix multiplications to minimize scalar multiplications.",
        tags: [],
        timeComplexity: "O(n³)",
        spaceComplexity: "O(n²)",
        pseudocode: `for length L in 2..n:
  for i,j with j-i+1=L:
    dp[i][j]←min cost over split k`,
        stubPath: "src/libs/algorithms/dp/matrix-chain.ts",
        run: matrixChain,
    },
];

export const MAZE_GENERATORS: Record<
    string,
    { id: string; label: string; run: MazeFn }
> = {
    simple: {
        id: "simple",
        label: "simple maze",
        run: binaryTreeMaze,
    },
    "recursive-division": {
        id: "recursive-division",
        label: "recursive division",
        run: recursiveDivisionMaze,
    },
    "random-walls": {
        id: "random-walls",
        label: "random walls",
        run: randomWallsMaze,
    },
};

export const CATEGORY_GROUPS: {
    id: CategoryId;
    label: string;
    algorithms: AlgorithmEntry[];
    comingSoon?: boolean;
}[] = [
    {
        id: "pathfinding",
        label: "PATHFINDING",
        algorithms: PATHFINDING_ALGORITHMS,
    },
    {
        id: "sorting",
        label: "SORTING",
        algorithms: SORTING_ALGORITHMS,
    },
    {
        id: "trees",
        label: "TREES",
        algorithms: TREES_ALGORITHMS,
    },
    {
        id: "graphs",
        label: "GRAPHS",
        algorithms: GRAPHS_ALGORITHMS,
    },
    {
        id: "dp",
        label: "DYNAMIC PROG",
        algorithms: DP_ALGORITHMS,
    },
];

export const ALL_ALGORITHMS: AlgorithmEntry[] = [
    ...PATHFINDING_ALGORITHMS,
    ...SORTING_ALGORITHMS,
    ...TREES_ALGORITHMS,
    ...GRAPHS_ALGORITHMS,
    ...DP_ALGORITHMS,
];

export const getAlgorithmById = (id: string): AlgorithmEntry | undefined =>
    ALL_ALGORITHMS.find((a) => a.id === id);

export const DEFAULT_ALGORITHM_ID = "a-star";

export const HEURISTIC_OPTIONS: { id: HeuristicType; label: string }[] = [
    { id: "manhattan", label: "Manhattan" },
    { id: "euclidean", label: "Euclidean" },
    { id: "chebyshev", label: "Chebyshev" },
    { id: "octile", label: "Octile" },
];
