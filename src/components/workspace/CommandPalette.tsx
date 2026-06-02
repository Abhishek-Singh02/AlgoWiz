import { ALL_ALGORITHMS } from "@config/algorithms";
import { useWorkspace, useWorkspaceActions } from "@stores";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Sun, Zap } from "lucide-react";
import { FC, useEffect } from "react";

export const CommandPalette: FC = () => {
    const open = useWorkspace(({ commandPaletteOpen }) => commandPaletteOpen);
    const {
        setCommandPaletteOpen,
        selectAlgorithm,
        generateMaze,
        resetGrid,
        toggleTheme,
    } = useWorkspaceActions();

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setCommandPaletteOpen(!open);
            }
            if ((e.metaKey || e.ctrlKey) && e.key === "g") {
                e.preventDefault();
                void generateMaze();
            }
            if ((e.metaKey || e.ctrlKey) && e.key === "r") {
                e.preventDefault();
                resetGrid();
            }
            if ((e.metaKey || e.ctrlKey) && e.key === "t") {
                e.preventDefault();
                toggleTheme();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, setCommandPaletteOpen, generateMaze, resetGrid, toggleTheme]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.16 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={() => setCommandPaletteOpen(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{
                                duration: 0.16,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="pointer-events-auto w-full max-w-lg"
                        >
                            <Command
                                className="rounded-xl border border-white/10 bg-elevated shadow-2xl overflow-hidden"
                                label="Command palette"
                            >
                                <div className="flex items-center border-b border-white/[0.06] px-3">
                                    <Command.Input
                                        placeholder="Search algorithms..."
                                        className="flex-1 h-12 bg-transparent text-text-primary placeholder:text-text-tertiary outline-none text-[13px]"
                                        autoFocus
                                    />
                                    <kbd className="font-mono text-[10px] text-text-tertiary bg-subtle px-1.5 py-0.5 rounded border border-white/10">
                                        esc
                                    </kbd>
                                </div>
                                <Command.List className="max-h-80 overflow-y-auto p-2">
                                    <Command.Empty className="py-6 text-center text-text-tertiary text-sm">
                                        No results found.
                                    </Command.Empty>
                                    <Command.Group
                                        heading="SWITCH ALGORITHM"
                                        className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-text-tertiary"
                                    >
                                        {ALL_ALGORITHMS.map((algo) => (
                                            <Command.Item
                                                key={algo.id}
                                                value={`${algo.name} ${algo.id}`}
                                                onSelect={() => {
                                                    selectAlgorithm(algo.id);
                                                    setCommandPaletteOpen(
                                                        false,
                                                    );
                                                }}
                                                className="flex items-center justify-between gap-2 px-2 py-2 rounded-md text-[13px] text-text-secondary aria-selected:bg-emerald-dim aria-selected:text-text-primary cursor-pointer"
                                            >
                                                <span>{algo.name}</span>
                                                {algo.category && (
                                                    <kbd className="font-mono text-[10px] bg-subtle px-1.5 rounded border border-white/10">
                                                        {algo.category.length >
                                                        2
                                                            ? algo.category
                                                                  .charAt(0)
                                                                  .toUpperCase() +
                                                              algo.category.slice(
                                                                  1,
                                                              )
                                                            : algo.category.toUpperCase()}
                                                    </kbd>
                                                )}
                                            </Command.Item>
                                        ))}
                                    </Command.Group>
                                    <Command.Group
                                        heading="ACTIONS"
                                        className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-text-tertiary mt-2"
                                    >
                                        <Command.Item
                                            value="generate maze"
                                            onSelect={() => {
                                                void generateMaze();
                                                setCommandPaletteOpen(false);
                                            }}
                                            className="flex items-center justify-between px-2 py-2 rounded-md text-[13px] aria-selected:bg-emerald-dim cursor-pointer"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Zap className="h-4 w-4 text-emerald" />
                                                Generate Maze
                                            </span>
                                        </Command.Item>
                                        <Command.Item
                                            value="reset"
                                            onSelect={() => {
                                                resetGrid();
                                                setCommandPaletteOpen(false);
                                            }}
                                            className="flex items-center justify-between px-2 py-2 rounded-md text-[13px] aria-selected:bg-emerald-dim cursor-pointer"
                                        >
                                            <span className="flex items-center gap-2">
                                                <RotateCcw className="h-4 w-4" />
                                                Reset Visualization
                                            </span>
                                        </Command.Item>
                                        <Command.Item
                                            value="theme"
                                            onSelect={() => {
                                                toggleTheme();
                                                setCommandPaletteOpen(false);
                                            }}
                                            className="flex items-center justify-between px-2 py-2 rounded-md text-[13px] aria-selected:bg-emerald-dim cursor-pointer"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Sun className="h-4 w-4" />
                                                Toggle Theme
                                            </span>
                                        </Command.Item>
                                    </Command.Group>
                                </Command.List>
                                <div className="flex items-center gap-4 px-3 py-2 border-t border-white/[0.06] text-[10px] text-text-tertiary font-mono">
                                    <span>↑↓ navigate</span>
                                    <span>↵ select</span>
                                    <span>esc close</span>
                                </div>
                            </Command>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
