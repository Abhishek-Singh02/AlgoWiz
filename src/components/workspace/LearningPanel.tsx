import { Badge, SegmentedControl, Switch } from "@components/ui";
import {
    getAlgorithmById,
    HEURISTIC_OPTIONS,
    type AlgorithmTag,
} from "@config/algorithms";
import { useWorkspace, useWorkspaceActions } from "@stores";
import { cn } from "@utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    PanelCollapsedHeader,
    PanelHeader,
} from "@components/workspace/PanelHeader";
import { FC } from "react";

const tagVariant: Record<
    AlgorithmTag,
    "optimal" | "heuristic" | "weighted" | "visited" | "end"
> = {
    optimal: "optimal",
    complete: "optimal",
    heuristic: "heuristic",
    weighted: "weighted",
    visited: "visited",
    end: "end",
};

export type LearningPanelProps = {
    variant?: "desktop" | "embedded";
};

export const LearningPanel: FC<LearningPanelProps> = ({
    variant = "desktop",
}) => {
    const algorithmId = useWorkspace(({ algorithmId }) => algorithmId);
    const learningTab = useWorkspace(({ ui }) => ui.learningTab);
    const rightCollapsed = useWorkspace(({ ui }) => ui.rightCollapsed);
    const isEmbedded = variant === "embedded";
    const pathfindingConfig = useWorkspace(
        ({ pathfindingConfig }) => pathfindingConfig,
    );
    const category = useWorkspace(({ category }) => category);
    const treeConfig = useWorkspace(({ treeConfig }) => treeConfig);
    const graphConfig = useWorkspace(({ graphConfig }) => graphConfig);
    const dpState = useWorkspace(({ dpState }) => dpState);
    const {
        setLearningTab,
        toggleRightCollapsed,
        setHeuristic,
        setPathfindingConfig,
        setTreeInsertValue,
        setTreeShowNullChildren,
        setGraphConfig,
    } = useWorkspaceActions();

    const algo = getAlgorithmById(algorithmId);

    const tabs = [
        { id: "overview" as const, label: "Overview" },
        { id: "complexity" as const, label: "Complexity" },
        { id: "pseudocode" as const, label: "Pseudocode" },
    ];

    if (rightCollapsed && !isEmbedded) {
        return (
            <aside className="flex h-full w-full flex-col bg-elevated">
                <PanelCollapsedHeader
                    side="right"
                    onExpand={() => toggleRightCollapsed()}
                    expandLabel="Expand learning panel"
                />
            </aside>
        );
    }

    return (
        <aside
            className={cn(
                "h-full w-full bg-elevated flex flex-col min-h-0 overflow-hidden",
                isEmbedded && "min-w-0",
            )}
        >
            {isEmbedded ? (
                <div className="flex items-stretch border-b border-border shrink-0 min-h-[42px]">
                    <div className="flex min-w-0 flex-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setLearningTab(tab.id)}
                                className={cn(
                                    "flex-1 py-2.5 text-[11px] font-medium uppercase tracking-wide transition-colors relative",
                                    learningTab === tab.id
                                        ? "text-text-primary"
                                        : "text-text-tertiary hover:text-text-secondary",
                                )}
                            >
                                {tab.label}
                                {learningTab === tab.id && (
                                    <motion.span
                                        layoutId="learning-tab-indicator-mobile"
                                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <PanelHeader
                    side="right"
                    onCollapse={() => toggleRightCollapsed()}
                    collapseLabel="Collapse learning panel"
                >
                    <div className="flex min-w-0 flex-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setLearningTab(tab.id)}
                                className={cn(
                                    "flex-1 py-2.5 text-[11px] font-medium uppercase tracking-wide transition-colors relative",
                                    learningTab === tab.id
                                        ? "text-text-primary"
                                        : "text-text-tertiary hover:text-text-secondary",
                                )}
                            >
                                {tab.label}
                                {learningTab === tab.id && (
                                    <motion.span
                                        layoutId="learning-tab-indicator"
                                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </PanelHeader>
            )}
            <div className="flex-1 overflow-y-auto p-4">
                {!algo ? (
                    <p className="text-text-tertiary text-sm">
                        Select an algorithm to view details.
                    </p>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${algo.id}-${learningTab}`}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.18 }}
                        >
                            {learningTab === "overview" && (
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-text-primary mb-2">
                                            {algo.name}
                                        </h2>
                                        <p className="text-[13px] text-text-secondary leading-relaxed">
                                            {algo.overview}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {algo.tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant={tagVariant[tag]}
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    {category === "trees" && (
                                        <div className="space-y-3 pt-2 border-t border-border">
                                            <p className="text-[10px] uppercase tracking-wider text-text-tertiary">
                                                Configuration
                                            </p>
                                            <div>
                                                <label className="text-[11px] text-text-secondary block mb-1">
                                                    Insert value
                                                </label>
                                                <input
                                                    type="number"
                                                    value={treeConfig.insertValue}
                                                    onChange={(e) =>
                                                        setTreeInsertValue(
                                                            Number(e.target.value),
                                                        )
                                                    }
                                                    className="w-full rounded-md border border-border bg-overlay px-2 py-1.5 font-mono text-sm text-text-primary"
                                                />
                                            </div>
                                            <Switch
                                                label="Show null children"
                                                checked={treeConfig.showNullChildren}
                                                onCheckedChange={setTreeShowNullChildren}
                                            />
                                        </div>
                                    )}
                                    {category === "graphs" && (
                                        <div className="space-y-3 pt-2 border-t border-border">
                                            <p className="text-[10px] uppercase tracking-wider text-text-tertiary">
                                                Configuration
                                            </p>
                                            <Switch
                                                label="Directed graph"
                                                checked={graphConfig.directed}
                                                onCheckedChange={(v) =>
                                                    setGraphConfig("directed", v)
                                                }
                                            />
                                            <Switch
                                                label="Show edge weights"
                                                checked={graphConfig.showWeights}
                                                onCheckedChange={(v) =>
                                                    setGraphConfig("showWeights", v)
                                                }
                                            />
                                        </div>
                                    )}
                                    {category === "dp" && (
                                        <div className="space-y-2 pt-2 border-t border-border">
                                            <p className="text-[10px] uppercase tracking-wider text-text-tertiary">
                                                Table
                                            </p>
                                            <p className="font-mono text-[11px] text-text-secondary">
                                                {dpState.rows} × {dpState.cols}
                                            </p>
                                            {dpState.meta &&
                                                Object.entries(dpState.meta).map(
                                                    ([k, v]) => (
                                                        <p
                                                            key={k}
                                                            className="font-mono text-[10px] text-text-tertiary"
                                                        >
                                                            {k}: {v}
                                                        </p>
                                                    ),
                                                )}
                                        </div>
                                    )}
                                    {category === "pathfinding" && (
                                        <>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-text-tertiary mb-2">
                                                    Heuristic
                                                </p>
                                                <SegmentedControl
                                                    options={HEURISTIC_OPTIONS}
                                                    value={
                                                        pathfindingConfig.heuristic
                                                    }
                                                    onChange={setHeuristic}
                                                />
                                            </div>
                                            <div className="space-y-3 pt-2 border-t border-border">
                                                <p className="text-[10px] uppercase tracking-wider text-text-tertiary">
                                                    Configuration
                                                </p>
                                                <Switch
                                                    label="Allow diagonals"
                                                    checked={
                                                        pathfindingConfig.allowDiagonals
                                                    }
                                                    onCheckedChange={(v) =>
                                                        setPathfindingConfig(
                                                            "allowDiagonals",
                                                            v,
                                                        )
                                                    }
                                                />
                                                <Switch
                                                    label="Bidirectional"
                                                    checked={
                                                        pathfindingConfig.bidirectional
                                                    }
                                                    onCheckedChange={(v) =>
                                                        setPathfindingConfig(
                                                            "bidirectional",
                                                            v,
                                                        )
                                                    }
                                                />
                                                <Switch
                                                    label="Show g-values"
                                                    checked={
                                                        pathfindingConfig.showGValues
                                                    }
                                                    onCheckedChange={(v) =>
                                                        setPathfindingConfig(
                                                            "showGValues",
                                                            v,
                                                        )
                                                    }
                                                />
                                                <Switch
                                                    label="Show f-values"
                                                    checked={
                                                        pathfindingConfig.showFValues
                                                    }
                                                    onCheckedChange={(v) =>
                                                        setPathfindingConfig(
                                                            "showFValues",
                                                            v,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}
                                    <div className="rounded-lg border border-border bg-overlay/50 p-3 space-y-2 shadow-surface">
                                        <p className="text-[10px] uppercase tracking-wider text-text-tertiary">
                                            Complexity
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                                            <div>
                                                <span className="text-text-tertiary">
                                                    Time
                                                </span>
                                                <p className="text-emerald">
                                                    {algo.timeComplexity}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-text-tertiary">
                                                    Space
                                                </span>
                                                <p className="text-emerald">
                                                    {algo.spaceComplexity}
                                                </p>
                                            </div>
                                            {algo.bestCase && (
                                                <div className="col-span-2">
                                                    <span className="text-text-tertiary">
                                                        Best
                                                    </span>
                                                    <p className="text-emerald">
                                                        {algo.bestCase}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {learningTab === "complexity" && (
                                <div className="space-y-4 font-mono text-sm">
                                    <div>
                                        <p className="text-text-tertiary text-xs uppercase mb-1">
                                            Time
                                        </p>
                                        <p className="text-emerald text-lg">
                                            {algo.timeComplexity}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-text-tertiary text-xs uppercase mb-1">
                                            Space
                                        </p>
                                        <p className="text-emerald text-lg">
                                            {algo.spaceComplexity}
                                        </p>
                                    </div>
                                    {algo.bestCase && (
                                        <div>
                                            <p className="text-text-tertiary text-xs uppercase mb-1">
                                                Best case
                                            </p>
                                            <p className="text-emerald text-lg">
                                                {algo.bestCase}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                            {learningTab === "pseudocode" && (
                                <pre className="font-mono text-[11px] text-text-secondary leading-relaxed whitespace-pre-wrap bg-overlay rounded-lg p-3 border border-border shadow-surface">
                                    {algo.pseudocode}
                                </pre>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </aside>
    );
};
