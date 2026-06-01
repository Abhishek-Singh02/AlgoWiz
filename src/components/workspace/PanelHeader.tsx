import { cn } from "@utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FC, type ReactNode } from "react";

const HEADER_ROW_CLASS =
    "flex items-stretch border-b border-border shrink-0 min-h-[49px] gap-2";

const COLLAPSE_BTN_CLASS =
    "flex w-10 shrink-0 items-center justify-center border-l border-border text-text-tertiary hover:bg-overlay hover:text-text-primary transition-colors";

const COLLAPSED_BTN_CLASS =
    "flex w-full min-h-[49px] items-center justify-center border-b border-border text-text-tertiary hover:bg-overlay hover:text-text-primary transition-colors";

export type PanelHeaderProps = {
    children: ReactNode;
    side: "left" | "right";
    onCollapse: () => void;
    collapseLabel: string;
};

/** Open panel: label/tabs on the left, collapse control on the right (inner edge). */
export const PanelHeader: FC<PanelHeaderProps> = ({
    children,
    side,
    onCollapse,
    collapseLabel,
}) => (
    <div className={HEADER_ROW_CLASS}>
        <div className="flex min-w-0 flex-1 items-stretch">{children}</div>
        <button
            type="button"
            onClick={onCollapse}
            className={COLLAPSE_BTN_CLASS}
            aria-label={collapseLabel}
        >
            {side === "left" ? (
                <ChevronLeft className="h-4 w-4" />
            ) : (
                <ChevronRight className="h-4 w-4" />
            )}
        </button>
    </div>
);

export type PanelCollapsedHeaderProps = {
    side: "left" | "right";
    onExpand: () => void;
    expandLabel: string;
};

/** Collapsed panel: same top slot, expand chevron only. */
export const PanelCollapsedHeader: FC<PanelCollapsedHeaderProps> = ({
    side,
    onExpand,
    expandLabel,
}) => (
    <div className={cn(HEADER_ROW_CLASS, "border-b-0")}>
        <button
            type="button"
            onClick={onExpand}
            className={cn(COLLAPSED_BTN_CLASS, "border-l-0")}
            aria-label={expandLabel}
        >
            {side === "left" ? (
                <ChevronRight className="h-4 w-4" />
            ) : (
                <ChevronLeft className="h-4 w-4" />
            )}
        </button>
    </div>
);
