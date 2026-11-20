import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from "@/lib/utils"
import { Slot } from 'radix-ui'

// Figma "LUMEN / Status badge" (100:303) plus the duration chip from "Micro-task row" (100:326).
const badgeVariants = cva(
  'group/badge inline-flex h-8 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full px-3 text-caption whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-4!',
  {
    variants: {
      variant: {
        // Active / Energy. Emerald-deep, not #059669: 4.94:1 vs 3.4:1 on mint.
        default: 'bg-mint text-emerald-deep',
        // Focus Session Complete.
        complete: 'bg-cream text-ink',
        muted: 'h-6 rounded-md bg-muted px-2 text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span'

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
