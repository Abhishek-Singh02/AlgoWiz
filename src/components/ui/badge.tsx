import { cn } from "@utils";
import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";

const badgeVariants = cva(
    "inline-flex items-center gap-1 rounded-md font-medium leading-none",
    {
        variants: {
            variant: {
                optimal:
                    "border border-emerald/35 bg-emerald-dim text-emerald px-2 py-1 text-[10px] uppercase tracking-wider",
                heuristic:
                    "border border-violet/35 bg-violet-dim text-violet px-2 py-1 text-[10px] uppercase tracking-wider",
                weighted:
                    "border border-amber/35 bg-amber-dim text-amber px-2 py-1 text-[10px] uppercase tracking-wider",
                visited:
                    "border border-sky/35 bg-sky-dim text-sky px-2 py-1 text-[10px] uppercase tracking-wider",
                end: "border border-rose/35 bg-rose-dim text-rose px-2 py-1 text-[10px] uppercase tracking-wider",
                complexityEmerald:
                    "font-mono normal-case border border-emerald/30 bg-emerald-dim/80 text-emerald text-[10px] px-1.5 py-0.5 rounded",
                complexityViolet:
                    "font-mono normal-case border border-violet/30 bg-violet-dim/80 text-violet text-[10px] px-1.5 py-0.5 rounded",
                complexityAmber:
                    "font-mono normal-case border border-amber/30 bg-amber-dim/80 text-amber text-[10px] px-1.5 py-0.5 rounded",
                complexityRose:
                    "font-mono normal-case border border-rose/30 bg-rose-dim/80 text-rose text-[10px] px-1.5 py-0.5 rounded",
                statusRunning:
                    "normal-case border border-emerald/40 bg-emerald-dim text-emerald text-[11px] font-medium px-2.5 py-1 rounded-full",
                statusPaused:
                    "normal-case border border-violet/40 bg-violet-dim text-violet text-[11px] font-medium px-2.5 py-1 rounded-full",
                statusIdle:
                    "normal-case border border-border bg-overlay text-text-tertiary text-[11px] font-medium px-2.5 py-1 rounded-full",
                statusComplete:
                    "normal-case border border-emerald/50 bg-emerald-dim text-emerald text-[11px] font-semibold px-2.5 py-1 rounded-full",
            },
        },
        defaultVariants: {
            variant: "optimal",
        },
    },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
    VariantProps<typeof badgeVariants>;

export const Badge = ({ className, variant, children, ...props }: BadgeProps) => (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
        {children}
    </span>
);

export const StatusBadge = ({
    status,
}: {
    status: "idle" | "running" | "paused" | "complete";
}) => {
    const map = {
        idle: "statusIdle" as const,
        running: "statusRunning" as const,
        paused: "statusPaused" as const,
        complete: "statusComplete" as const,
    };
    const dotColor = {
        idle: "bg-text-tertiary",
        running: "bg-emerald shadow-[0_0_6px_var(--accent-emerald)] animate-pulse",
        paused: "bg-violet",
        complete: "bg-emerald",
    };
    return (
        <Badge variant={map[status]}>
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColor[status])} />
            {status}
        </Badge>
    );
};
