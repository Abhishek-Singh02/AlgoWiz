import type { TreeSnapshot } from "@libs/algorithms/types";

const H_SPACING = 72;
const V_SPACING = 80;

export const layoutTree = (
    snapshot: TreeSnapshot,
): Map<string, { x: number; y: number }> => {
    const positions = new Map<string, { x: number; y: number }>();
    if (!snapshot.rootId) return positions;

    let index = 0;

    const walk = (nodeId: string | null | undefined, depth: number): void => {
        if (!nodeId) return;
        const node = snapshot.nodes[nodeId];
        if (!node) return;

        if (snapshot.variant === "trie" && node.children) {
            positions.set(nodeId, { x: index * H_SPACING, y: depth * V_SPACING });
            index++;
            for (const childId of node.children) {
                walk(childId, depth + 1);
            }
            return;
        }

        walk(node.left ?? null, depth + 1);
        positions.set(nodeId, { x: index * H_SPACING, y: depth * V_SPACING });
        index++;
        walk(node.right ?? null, depth + 1);
    };

    walk(snapshot.rootId, 0);
    return positions;
};
