import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Use `buttonVariants()` on <Link> for navigation, <Button> for actions.
 *   <Link href="/artisans" className={buttonVariants({ variant: "accent" })}>Find an artisan</Link>
 */
export const buttonVariants = cva(
  "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[background-color,color,border-color,transform,opacity] duration-300 ease-out-expo active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-[1.05em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-fg text-bg hover:bg-fg/85",
        accent: "bg-accent text-accent-fg hover:brightness-105",
        outline: "border border-border-strong bg-transparent text-fg hover:border-fg hover:bg-fg hover:text-bg",
        ghost: "bg-transparent text-fg hover:bg-surface-2",
        danger: "bg-danger text-white hover:bg-danger/90",
        light: "bg-white text-black hover:bg-white/85",
        glass: "border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-black",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-[0.9375rem]",
        lg: "h-14 px-7 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ComponentPropsWithoutRef<"button"> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
