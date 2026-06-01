import { cn } from "@utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-1.5 rounded-md text-[13px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/40 focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:pointer-events-none disabled:opacity-40",
    {
        variants: {
            variant: {
                generate:
                    "bg-emerald text-text-on-accent shadow-surface hover:brightness-110 active:scale-[0.98] px-3.5 h-8 font-semibold",
                reset: "h-8 w-8 rounded-md border border-border bg-elevated text-text-secondary hover:bg-overlay hover:text-text-primary hover:border-border-strong",
                visualise:
                    "h-8 px-3.5 rounded-md border border-emerald/40 bg-emerald-dim text-emerald font-medium hover:bg-emerald/20 hover:border-emerald/60 active:scale-[0.98]",
                ghost: "text-text-secondary hover:bg-overlay hover:text-text-primary px-2 py-1 rounded-md",
                icon: "h-8 w-8 rounded-md border border-transparent text-text-secondary hover:bg-overlay hover:text-text-primary hover:border-border",
            },
            size: {
                sm: "h-7 text-xs",
                md: "h-8",
                lg: "h-9",
            },
        },
        defaultVariants: {
            variant: "ghost",
            size: "md",
        },
    },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
        <button
            ref={ref}
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
        />
    ),
);
Button.displayName = "Button";
