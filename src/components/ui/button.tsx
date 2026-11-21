import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[12px] border border-transparent bg-clip-padding font-heading font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-green-hover active:bg-green-active shadow-xs",
        outline:
          "border-border bg-card text-neutral-darker hover:bg-neutral-light hover:text-neutral-darker aria-expanded:bg-neutral-light",
        secondary:
          "bg-green-light border border-green-light-active text-green hover:bg-green-light-hover active:bg-green-light-active aria-expanded:bg-green-light",
        ghost:
          "hover:bg-neutral-light hover:text-neutral-darker aria-expanded:bg-neutral-light",
        destructive:
          "border-danger bg-card text-danger hover:bg-danger/10 active:bg-danger/20 focus-visible:border-danger focus-visible:ring-danger/30",
        link: "text-green hover:text-green-dark underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 gap-2 px-4 text-body-2",
        xs: "h-7 gap-1 rounded-md px-2 text-body-4 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-[10px] px-3 text-body-3 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-[52px] gap-2.5 px-6 text-body-1",
        icon: "size-11 rounded-[12px]",
        "icon-sm": "size-9 rounded-[10px]",
        "icon-xs": "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-lg": "size-[52px] rounded-[12px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
