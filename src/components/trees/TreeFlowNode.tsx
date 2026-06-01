import type { TreeVisualState } from "@libs/algorithms/types";
import { cn } from "@utils";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { FC, memo } from "react";

export type TreeFlowNodeData = {
    label: string;
    visual: TreeVisualState;
    nodeId: string;
    variant: "binary" | "heap" | "trie";
};

export const TreeFlowNode: FC<NodeProps> = memo(({ data }) => {
    const d = data as TreeFlowNodeData;
    const { visual, nodeId, label, variant } = d;
    const isVisited = visual.visited.includes(nodeId);
    const isHighlighted = visual.highlighted.includes(nodeId);
    const isCompared = visual.compared?.includes(nodeId);
    const isFound = visual.found === nodeId;
    const isInserted = visual.inserted === nodeId;

    return (
        <div
            className={cn(
                "flex h-11 min-w-[44px] items-center justify-center rounded-md border px-2 font-mono text-sm shadow-surface transition-colors",
                isFound && "border-emerald bg-emerald-dim text-emerald",
                isInserted && !isFound && "border-sky/50 bg-sky-dim text-sky",
                isCompared && !isFound && "border-amber/50 bg-amber-dim text-amber",
                isHighlighted && !isCompared && !isFound && "border-violet/50 bg-violet-dim",
                isVisited && !isHighlighted && !isFound && "border-sky/30 bg-overlay",
                !isVisited &&
                    !isHighlighted &&
                    !isFound &&
                    "border-border bg-elevated text-text-primary",
                variant === "trie" && "text-xs min-w-[36px] h-9",
            )}
        >
            <Handle type="target" position={Position.Top} className="!bg-border !w-2 !h-2" />
            {label}
            <Handle type="source" position={Position.Bottom} className="!bg-border !w-2 !h-2" />
        </div>
    );
});

TreeFlowNode.displayName = "TreeFlowNode";
