import {
    GraphFlowNode,
    type GraphFlowNodeData,
} from "@components/graphs/GraphFlowNode";
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

const nodeTypes = { graphNode: GraphFlowNode };

const GraphFlowInner: FC = () => {
    const graphState = useWorkspace(({ graphState }) => graphState);
    const graphVisual = useWorkspace(({ graphVisual }) => graphVisual);
    const showWeights = useWorkspace(({ graphConfig }) => graphConfig.showWeights);

    const { nodes, edges } = useMemo(() => {
        const rfNodes: Node<GraphFlowNodeData>[] = graphState.nodes.map((n, i) => ({
            id: n.id,
            type: "graphNode",
            position: { x: n.x ?? 80 + (i % 3) * 120, y: n.y ?? 60 + Math.floor(i / 3) * 100 },
            data: {
                label: n.label,
                nodeId: n.id,
                visual: graphVisual,
            },
        }));

        const rfEdges: Edge[] = graphState.edges.map((e) => {
            const inMst = graphVisual.mstEdges.includes(e.id);
            const relaxed = graphVisual.relaxedEdges.includes(e.id);
            const highlighted = graphVisual.highlightedEdges.includes(e.id);
            return {
                id: e.id,
                source: e.source,
                target: e.target,
                label: showWeights && e.weight != null ? String(e.weight) : undefined,
                labelStyle: { fill: "var(--text-secondary)", fontSize: 10 },
                animated: highlighted && !inMst,
                style: {
                    stroke: inMst
                        ? "var(--accent-emerald)"
                        : relaxed
                          ? "var(--accent-violet)"
                          : highlighted
                            ? "var(--accent-amber)"
                            : "var(--border-default)",
                    strokeWidth: inMst || highlighted ? 2.5 : 1.5,
                },
            };
        });

        return { nodes: rfNodes, edges: rfEdges };
    }, [graphState, graphVisual, showWeights]);

    return (
        <div className="flex flex-1 min-h-[360px] w-full p-4 md:p-6">
            <div className="flex-1 rounded-lg border border-border bg-overlay/40 shadow-panel overflow-hidden min-h-[320px]">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.25 }}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    proOptions={{ hideAttribution: true }}
                >
                    <Background color="var(--border-subtle)" gap={16} />
                    <Controls showInteractive={false} className="!bg-elevated !border-border" />
                </ReactFlow>
            </div>
        </div>
    );
};

export const GraphFlowCanvas: FC = () => (
    <ReactFlowProvider>
        <GraphFlowInner />
    </ReactFlowProvider>
);
