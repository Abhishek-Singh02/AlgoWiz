import { cn } from "@utils";
import { type ReactNode } from "react";

export type TabItem<T extends string> = {
    id: T;
    label: string;
};

export type TabsProps<T extends string> = {
    tabs: TabItem<T>[];
    value: T;
    onChange: (id: T) => void;
    trailing?: ReactNode;
    className?: string;
};

export const Tabs = <T extends string>({
    tabs,
    value,
    onChange,
    trailing,
    className,
}: TabsProps<T>) => (
    <div
        className={cn(
            "flex items-center gap-1 px-3 py-2 border-b border-border bg-elevated/80",
            className,
        )}
    >
        <div
            className="flex flex-1 items-center gap-0.5 rounded-lg bg-overlay p-0.5 border border-border"
            role="tablist"
        >
            {tabs.map((tab) => {
                const active = value === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            "flex-1 rounded-md px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-all duration-150",
                            active
                                ? "bg-elevated text-text-primary shadow-surface"
                                : "text-text-tertiary hover:text-text-secondary",
                        )}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
        {trailing}
    </div>
);
