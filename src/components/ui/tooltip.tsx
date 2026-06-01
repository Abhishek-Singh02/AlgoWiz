import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@utils";
import { FC, type ReactNode } from "react";

export type TooltipProps = {
    children: ReactNode;
    content: string;
};

export const TooltipProvider = TooltipPrimitive.Provider;

export const Tooltip: FC<TooltipProps> = ({ children, content }) => (
    <TooltipPrimitive.Root delayDuration={300}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                className={cn(
                    "z-50 rounded-md bg-elevated border border-white/10 px-3 py-2 text-xs text-text-secondary shadow-lg",
                )}
                sideOffset={6}
            >
                {content}
                <TooltipPrimitive.Arrow className="fill-elevated" />
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
);
