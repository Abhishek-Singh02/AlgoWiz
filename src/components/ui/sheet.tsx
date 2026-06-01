import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@utils";
import { X } from "lucide-react";
import { FC, type ReactNode } from "react";

export type SheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
    side?: "left" | "right" | "bottom";
    title?: string;
};

export const Sheet: FC<SheetProps> = ({
    open,
    onOpenChange,
    children,
    side = "left",
    title,
}) => (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" />
            <Dialog.Content
                className={cn(
                    "fixed z-50 bg-elevated border-white/10 flex flex-col",
                    side === "left" &&
                        "inset-y-0 left-0 w-[280px] border-r animate-in slide-in-from-left",
                    side === "right" &&
                        "inset-y-0 right-0 w-[300px] border-l animate-in slide-in-from-right",
                    side === "bottom" &&
                        "inset-x-0 bottom-0 max-h-[85vh] border-t rounded-t-xl animate-in slide-in-from-bottom",
                )}
            >
                {title && (
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <Dialog.Title className="font-medium text-text-primary">
                            {title}
                        </Dialog.Title>
                        <Dialog.Close className="text-text-tertiary hover:text-text-primary">
                            <X className="h-4 w-4" />
                        </Dialog.Close>
                    </div>
                )}
                {children}
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);
