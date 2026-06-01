import { LearningPanel } from "@components/workspace/LearningPanel";
import { Sheet } from "@components/ui";
import { useWorkspace, useWorkspaceActions } from "@stores";
import { FC } from "react";

export const LearningPanelMobile: FC = () => {
    const open = useWorkspace(({ ui }) => ui.mobileRightOpen);
    const { setMobileRightOpen } = useWorkspaceActions();

    return (
        <Sheet
            open={open}
            onOpenChange={setMobileRightOpen}
            side="right"
            title="Learning"
        >
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                <LearningPanel variant="embedded" />
            </div>
        </Sheet>
    );
};
