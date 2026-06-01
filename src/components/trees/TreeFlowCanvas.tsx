import { TreeFlowNode, type TreeFlowNodeData } from "@components/trees/TreeFlowNode";
import { layoutTree } from "@components/trees/treeLayout";
import { useWorkspace } from "@stores";
import {
    Background,
    Controls,
    ReactFlow,
    ReactFlowProvider,
    type Edge,
    type Node,
} from "@xyflow/react";
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
        <div className="flex flex-1 min-h-[360px] w-full p-4 md:p-6">
            <div className="flex-1 rounded-lg border border-border bg-overlay/40 shadow-panel overflow-hidden min-h-[320px]">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.3 }}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    proOptions={{ hideAttribution: true }}
                    className="bg-transparent"
                >
                    <Background color="var(--border-subtle)" gap={16} />
                    <Controls showInteractive={false} className="!bg-elevated !border-border" />
                </ReactFlow>
            </div>
        </div>
    );
};

export const TreeFlowCanvas: FC = () => (
    <ReactFlowProvider>
        <TreeFlowInner />
    </ReactFlowProvider>
);
