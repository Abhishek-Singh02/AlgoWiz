import { DpTable } from "@components/dp/DpTable";
import { DpLegend } from "@components/dp/DpLegend";
import { GraphFlowCanvas } from "@components/graphs/GraphFlowCanvas";
import { GraphLegend } from "@components/graphs/GraphLegend";
import { PathfinderGrid } from "@components/pathfinder/PathfinderGrid";
import { SortingBars } from "@components/sorting/SortingBars";
import { SortingLegend } from "@components/sorting/SortingLegend";
import { TreeFlowCanvas } from "@components/trees/TreeFlowCanvas";
import { TreeLegend } from "@components/trees/TreeLegend";
import { CursorReadout } from "@components/workspace/CursorReadout";
import { EmptyStates } from "@components/workspace/EmptyStates";
import { Legend } from "@components/workspace/Legend";
import { useWorkspace } from "@stores";
import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";

export const VisualizationCanvas: FC = () => {
    const category = useWorkspace(({ category }) => category);
    const stubMessage = useWorkspace(({ stubMessage }) => stubMessage);

    return (
        <div className="flex flex-col flex-1 min-h-0 relative bg-base">
            <AnimatePresence mode="wait">
                <motion.div
                    key={category}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.32 }}
                    className="flex flex-col flex-1 min-h-0"
                >
                    {category === "pathfinding" ? (
                        <>
                            <div className="relative flex-1 min-h-0 flex flex-col">
                                <PathfinderGrid />
                                <CursorReadout />
                            </div>
                            <Legend />
                        </>
                    ) : category === "sorting" ? (
                        <div className="flex flex-1 flex-col min-h-0 w-full">
                            <SortingBars />
                            <SortingLegend />
                        </div>
                    ) : category === "trees" ? (
                        <div className="flex flex-1 flex-col min-h-0 w-full">
                            <TreeFlowCanvas />
                            <TreeLegend />
                        </div>
                    ) : category === "graphs" ? (
                        <div className="flex flex-1 flex-col min-h-0 w-full">
                            <GraphFlowCanvas />
                            <GraphLegend />
                        </div>
                    ) : category === "dp" ? (
                        <div className="flex flex-1 flex-col min-h-0 w-full">
                            <DpTable />
                            <DpLegend />
                        </div>
                    ) : null}
                </motion.div>
            </AnimatePresence>
            <EmptyStates />
            {stubMessage && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 max-w-md px-4 py-2 rounded-lg bg-amber-dim border border-amber/30 text-amber text-xs font-mono text-center">
                    {stubMessage}
                </div>
            )}
        </div>
    );
};
