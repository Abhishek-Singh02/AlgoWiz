import { AlgorithmExplorer } from "@components/workspace/AlgorithmExplorer";
import { CommandPalette } from "@components/workspace/CommandPalette";
import { LearningPanel } from "@components/workspace/LearningPanel";
import { LearningPanelMobile } from "@components/workspace/LearningPanelMobile";
import { PlaybackControls } from "@components/workspace/PlaybackControls";
import { TimelineBar } from "@components/workspace/TimelineBar";
import { TopNav } from "@components/workspace/TopNav";
import { VisualizationCanvas } from "@components/workspace/VisualizationCanvas";
import { Sheet, TooltipProvider } from "@components/ui";
import { useWorkspace, useWorkspaceActions } from "@stores";
import { cn } from "@utils";
import { FC, useEffect } from "react";

export const WorkspaceLayout: FC = () => {
    const mobileLeftOpen = useWorkspace(({ ui }) => ui.mobileLeftOpen);
    const leftCollapsed = useWorkspace(({ ui }) => ui.leftCollapsed);
    const rightCollapsed = useWorkspace(({ ui }) => ui.rightCollapsed);
    const { setMobileLeftOpen, setMobileRightOpen, setCommandPaletteOpen } =
        useWorkspaceActions();

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setCommandPaletteOpen(false);
                setMobileLeftOpen(false);
                setMobileRightOpen(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [setCommandPaletteOpen, setMobileLeftOpen, setMobileRightOpen]);

    const leftWidth = leftCollapsed ? "44px" : "220px";
    const rightWidth = rightCollapsed ? "44px" : "280px";

    return (
        <TooltipProvider>
            <div className="h-dvh flex flex-col overflow-hidden bg-base">
                <TopNav />
                <div className="flex-1 min-h-0">
                    <div
                        className="hidden lg:grid h-full min-h-0 w-full"
                        style={{
                            gridTemplateColumns: `${leftWidth} minmax(0, 1fr) ${rightWidth}`,
                        }}
                    >
                        <div className="min-h-0 min-w-0 overflow-hidden border-r border-border">
                            <AlgorithmExplorer />
                        </div>
                        <div className="min-h-0 min-w-0 flex flex-col overflow-hidden">
                            <PlaybackControls />
                            <VisualizationCanvas />
                        </div>
                        <div className="min-h-0 min-w-0 overflow-hidden border-l border-border">
                            <LearningPanel />
                        </div>
                    </div>

                    <div className="lg:hidden flex flex-col h-full min-h-0 w-full">
                        <p className="shrink-0 px-3 py-1.5 text-center text-[11px] text-amber/90 bg-amber-dim border-b border-amber/20">
                            AlgoWiz works best on desktop — full panels and
                            timeline controls.
                        </p>
                        <PlaybackControls />
                        <VisualizationCanvas />
                    </div>
                </div>
                <TimelineBar />
                <CommandPalette />
                <Sheet
                    open={mobileLeftOpen}
                    onOpenChange={setMobileLeftOpen}
                    side="left"
                    title="Algorithms"
                >
                    <div className="h-full min-h-0 overflow-hidden">
                        <AlgorithmExplorer />
                    </div>
                </Sheet>
                <LearningPanelMobile />
                <MobileFab />
            </div>
        </TooltipProvider>
    );
};

const MobileFab: FC = () => {
    const { setMobileRightOpen, visualise, resetGrid } = useWorkspaceActions();

    return (
        <div
            className={cn(
                "lg:hidden fixed bottom-24 right-4 flex flex-col gap-2 z-30",
            )}
        >
            <button
                type="button"
                onClick={() => void visualise()}
                className="h-12 w-12 rounded-full bg-emerald text-base shadow-lg flex items-center justify-center"
                aria-label="Visualise"
            >
                ▶
            </button>
            <button
                type="button"
                onClick={() => setMobileRightOpen(true)}
                className="h-10 w-10 rounded-full bg-elevated border border-white/10 text-text-secondary"
                aria-label="Learning panel"
            >
                i
            </button>
            <button
                type="button"
                onClick={() => resetGrid()}
                className="h-10 w-10 rounded-full bg-elevated border border-white/10 text-text-secondary text-sm"
                aria-label="Reset"
            >
                ↺
            </button>
        </div>
    );
};
