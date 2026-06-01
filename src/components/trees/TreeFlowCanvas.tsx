import { FlowCanvasShell } from "@components/flow/FlowCanvasShell";
import { TreeFlowNode, type TreeFlowNodeData } from "@components/trees/TreeFlowNode";
import { layoutTree } from "@components/trees/treeLayout";
import { useWorkspace } from "@stores";
import { ReactFlowProvider, type Edge, type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FC, useMemo } from "react";

const nodeTypes = { treeNode: TreeFlowNode };

const TreeFlowInner: FC = () => {
    const treeState = useWorkspace(({ treeState }) => treeState);
    const treeVisual = useWorkspace(({ treeVisual }) => treeVisual);

    const { nodes, edges } = useMemo(() => {
        const positions = layoutTree(treeState);
        const rfNodes: Node<TreeFlowNodeData>[] = [];
        const rfEdges: Edge[] = [];

        for (const [id, node] of Object.entries(treeState.nodes)) {
            const pos = positions.get(id) ?? { x: 0, y: 0 };
            rfNodes.push({
                id,
                type: "treeNode",
                position: pos,
                data: {
                    label: String(node.value),
                    visual: treeVisual,
                    nodeId: id,
                    variant: treeState.variant,
                },
            });

            if (treeState.variant === "trie" && node.children) {
                for (const childId of node.children) {
                    rfEdges.push({
                        id: `${id}-${childId}`,
                        source: id,
                        target: childId,
                        style: { stroke: "var(--border-default)" },
                    });
                }
            } else {
                if (node.left) {
                    rfEdges.push({
                        id: `${id}-${node.left}`,
                        source: id,
                        target: node.left,
                        style: { stroke: "var(--border-default)" },
                    });
                }
                if (node.right) {
                    rfEdges.push({
                        id: `${id}-${node.right}`,
                        source: id,
                        target: node.right,
                        style: { stroke: "var(--border-default)" },
                    });
                }
            }
        }

        return { nodes: rfNodes, edges: rfEdges };
    }, [treeState, treeVisual]);

    return (
        <FlowCanvasShell
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{
                style: { stroke: "var(--border-default)", strokeWidth: 1.5 },
            }}
        />
    );
};

export const TreeFlowCanvas: FC = () => (
    <ReactFlowProvider>
        <TreeFlowInner />
    </ReactFlowProvider>
);
