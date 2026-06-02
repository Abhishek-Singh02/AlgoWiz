import { Button } from "@components/ui";
import { useWorkspace, useWorkspaceActions } from "@stores";
import { cn } from "@utils";
import { Menu, Moon, Search, Sun } from "lucide-react";
import { FC } from "react";

export const TopNav: FC = () => {
    const theme = useWorkspace(({ ui }) => ui.theme);
    const { setCommandPaletteOpen, toggleTheme, setMobileLeftOpen } =
        useWorkspaceActions();
    const isDark = theme === "dark";

    return (
        <header className="h-11 shrink-0 flex items-center gap-3 px-3 border-b border-border bg-elevated">
            <Button
                variant="icon"
                className="lg:hidden"
                onClick={() => setMobileLeftOpen(true)}
                aria-label="Open menu"
            >
                <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 shrink-0">
                <div className="h-6 w-6 rounded-md bg-emerald-dim border border-emerald/30 flex items-center justify-center">
                    <span className="text-emerald text-xs font-bold">◇</span>
                </div>
                <span className="font-serif text-xl text-text-primary hidden sm:block">
                    Algo<span className="text-emerald">Wiz</span>
                </span>
            </div>
            <button
                type="button"
                onClick={() => setCommandPaletteOpen(true)}
                className={cn(
                    "flex-1 max-w-md mx-auto flex items-center gap-2 h-8 px-3 rounded-md",
                    "bg-overlay border border-border text-text-tertiary text-[13px]",
                    "hover:border-border-strong hover:text-text-secondary transition-colors shadow-surface",
                )}
            >
                <Search className="h-3.5 w-3.5 shrink-0" />
                <span className="flex-1 text-left">Search algorithms...</span>
                <kbd className="hidden sm:inline font-mono text-[10px] bg-subtle text-text-tertiary px-1.5 py-0.5 rounded border border-border">
                    ⌘K
                </kbd>
            </button>
            <Button
                variant="icon"
                onClick={() => toggleTheme()}
                aria-label={
                    isDark ? "Switch to light mode" : "Switch to dark mode"
                }
            >
                {isDark ? (
                    <Sun className="h-4 w-4" />
                ) : (
                    <Moon className="h-4 w-4" />
                )}
            </Button>
        </header>
    );
};
