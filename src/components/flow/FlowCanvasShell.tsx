import { useWorkspace } from "@stores";
import { cn } from "@utils";
import { Controls, ReactFlow, type ReactFlowProps } from "@xyflow/react";
import { FC, type ReactNode } from "react";

export type FlowCanvasShellProps = ReactFlowProps & {
    children?: ReactNode;
};

export const FlowCanvasShell: FC<FlowCanvasShellProps> = ({
    children,
    className,
    ...flowProps
}) => {
    const theme = useWorkspace(({ ui }) => ui.theme);

    return (
        <div className="flex flex-1 min-h-[360px] w-full p-4 md:p-6">
            <div className="flow-canvas relative flex-1 overflow-hidden rounded-lg border border-border bg-base shadow-panel min-h-[320px]">
                <div className="flow-canvas__grid" aria-hidden />
                <ReactFlow
                    {...flowProps}
                    className={cn(
                        theme === "dark" && "dark",
                        "flow-canvas__viewport",
                        className,
                    )}
                    colorMode={theme}
                >
                    <Controls
                        showInteractive={false}
                        position="bottom-left"
                        className="flow-canvas__controls"
                    />
                    {children}
                </ReactFlow>
            </div>
        </div>
    );
};
