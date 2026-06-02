import { Badge } from "@components/ui";
import {
    CATEGORY_GROUPS,
    type AlgorithmEntry,
    type CategoryId,
} from "@config/algorithms";
import { useWorkspace, useWorkspaceActions } from "@stores";
import { cn } from "@utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    PanelCollapsedHeader,
    PanelHeader,
} from "@components/workspace/PanelHeader";
import { ChevronRight } from "lucide-react";
import { FC } from "react";

const complexityVariant = (
    v: AlgorithmEntry["complexityVariant"],
):
    | "complexityEmerald"
    | "complexityViolet"
    | "complexityAmber"
    | "complexityRose" => {
    const map = {
        emerald: "complexityEmerald",
        violet: "complexityViolet",
        amber: "complexityAmber",
        rose: "complexityRose",
    } as const;
    return map[v];
};

const EXPLORER_HINTS: Record<CategoryId, string[]> = {
    pathfinding: ["click: draw wall", "drag: move node", "shift+drag: weight"],
    sorting: ["visualise: run sort", "reset: new array"],
    trees: ["visualise: run on tree", "reset: reload preset"],
    graphs: ["visualise: run on graph", "reset: reload preset"],
    dp: ["visualise: fill table", "reset: reload preset"],
};

export const AlgorithmExplorer: FC = () => {
    const algorithmId = useWorkspace(({ algorithmId }) => algorithmId);
    const category = useWorkspace(({ category }) => category);
    const expandedGroups = useWorkspace(({ ui }) => ui.expandedGroups);
    const leftCollapsed = useWorkspace(({ ui }) => ui.leftCollapsed);
    const { selectAlgorithm, toggleGroupExpanded, toggleLeftCollapsed } =
        useWorkspaceActions();

    if (leftCollapsed) {
        return (
            <aside className="flex h-full w-full flex-col bg-elevated">
                <PanelCollapsedHeader
                    side="left"
                    onExpand={() => toggleLeftCollapsed()}
                    expandLabel="Expand explorer"
                />
            </aside>
        );
    }

    return (
        <aside className="h-full w-full bg-elevated flex flex-col min-h-0 overflow-hidden">
            <PanelHeader
                side="left"
                onCollapse={() => toggleLeftCollapsed()}
                collapseLabel="Collapse explorer"
            >
                <div className="flex items-center px-3">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
                        Explorer
                    </span>
                </div>
            </PanelHeader>
            <div className="flex-1 overflow-y-auto py-2 min-h-0">
                {CATEGORY_GROUPS.map((group) => {
                    const expanded = expandedGroups[group.id] ?? true;
                    return (
                        <div key={group.id} className="mb-1">
                            <button
                                type="button"
                                onClick={() => toggleGroupExpanded(group.id)}
                                className="w-full flex items-center gap-1 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-text-tertiary hover:text-text-secondary"
                            >
                                <ChevronRight
                                    className={cn(
                                        "h-3 w-3 transition-transform",
                                        expanded && "rotate-90",
                                    )}
                                />
                                {group.label}
                            </button>
                            <AnimatePresence>
                                {expanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        {group.algorithms.length === 0 ? (
                                            <p className="px-4 py-2 text-xs text-text-disabled">
                                                Coming soon
                                            </p>
                                        ) : (
                                            group.algorithms.map((algo, i) => (
                                                <motion.button
                                                    key={algo.id}
                                                    type="button"
                                                    initial={{
                                                        opacity: 0,
                                                        x: -4,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        delay: i * 0.02,
                                                    }}
                                                    onClick={() =>
                                                        selectAlgorithm(algo.id)
                                                    }
                                                    className={cn(
                                                        "w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-[13px] relative min-w-0",
                                                        algorithmId === algo.id
                                                            ? "bg-emerald-dim text-text-primary"
                                                            : "text-text-secondary hover:bg-overlay hover:text-text-primary",
                                                    )}
                                                >
                                                    {algorithmId ===
                                                        algo.id && (
                                                        <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-emerald rounded-r" />
                                                    )}
                                                    <span className="truncate pl-1 min-w-0 flex-1">
                                                        {algo.name}
                                                    </span>
                                                    <Badge
                                                        variant={complexityVariant(
                                                            algo.complexityVariant,
                                                        )}
                                                        className="shrink-0 scale-90 max-w-[72px] truncate"
                                                    >
                                                        {algo.complexity}
                                                    </Badge>
                                                </motion.button>
                                            ))
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
            <div className="p-3 border-t border-border font-mono text-[10px] text-text-tertiary leading-relaxed space-y-0.5 shrink-0">
                {EXPLORER_HINTS[category].map((hint) => (
                    <p key={hint}>{hint}</p>
                ))}
            </div>
        </aside>
    );
};
