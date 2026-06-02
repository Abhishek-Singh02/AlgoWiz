import type { GraphVisualState } from "@libs/algorithms/types";
import { cn } from "@utils";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { FC, memo } from "react";

export type GraphFlowNodeData = {
    label: string;
    nodeId: string;
    visual: GraphVisualState;
};

export const GraphFlowNode: FC<NodeProps> = memo(({ data }) => {
    const d = data as GraphFlowNodeData;
    const { visual, nodeId, label } = d;
    const isVisited = visual.visited.includes(nodeId);
    const isHighlighted = visual.highlightedNodes.includes(nodeId);

    return (
        <div
            className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border font-mono text-sm font-medium shadow-surface",
                isHighlighted && "border-emerald bg-emerald-dim text-emerald",
                isVisited &&
                    !isHighlighted &&
                    "border-sky/40 bg-sky-dim text-sky",
                !isVisited &&
                    !isHighlighted &&
                    "border-border bg-elevated text-text-primary",
            )}
        >
            <Handle
                type="target"
                position={Position.Top}
                className="!opacity-0 !w-1 !h-1"
            />
            {label}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!opacity-0 !w-1 !h-1"
            />
        </div>
    );
});

GraphFlowNode.displayName = "GraphFlowNode";
