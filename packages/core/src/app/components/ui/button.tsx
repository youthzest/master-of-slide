import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 items-center justify-center",
    "rounded-[2px] border-2 border-foreground text-[13px] font-black whitespace-nowrap select-none",
    "uppercase tracking-[0.02em] outline-none transition-[background-color,color,box-shadow,transform] duration-100",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "active:not-aria-[haspopup]:translate-x-[3px] active:not-aria-[haspopup]:translate-y-[3px]",
    "active:not-aria-[haspopup]:shadow-none",
    "disabled:pointer-events-none disabled:opacity-45",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-foreground text-background shadow-[4px_4px_0_var(--brand)]',
          'hover:-translate-x-px hover:-translate-y-px hover:shadow-[6px_6px_0_var(--brand)]',
          'aria-expanded:translate-x-[3px] aria-expanded:translate-y-[3px] aria-expanded:shadow-none',
        ].join(' '),
        brand: [
          'bg-brand text-brand-foreground shadow-[4px_4px_0_var(--foreground)]',
          'hover:-translate-x-px hover:-translate-y-px hover:shadow-[6px_6px_0_var(--foreground)]',
        ].join(' '),
        outline: [
          'bg-card text-foreground shadow-[3px_3px_0_var(--foreground)]',
          'hover:bg-accent hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_var(--foreground)]',
          'aria-expanded:translate-x-[3px] aria-expanded:translate-y-[3px] aria-expanded:bg-accent aria-expanded:shadow-none',
          'data-[state=on]:bg-secondary data-[state=on]:text-foreground',
        ].join(' '),
        secondary:
          'bg-secondary text-secondary-foreground shadow-[3px_3px_0_var(--foreground)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_var(--foreground)] aria-expanded:translate-x-[3px] aria-expanded:translate-y-[3px] aria-expanded:shadow-none',
        ghost: [
          'border-transparent text-foreground shadow-none hover:border-foreground hover:bg-accent hover:shadow-[3px_3px_0_var(--foreground)]',
          'aria-expanded:border-foreground aria-expanded:bg-accent aria-expanded:shadow-[3px_3px_0_var(--foreground)]',
        ].join(' '),
        destructive: [
          'bg-destructive text-white shadow-[4px_4px_0_var(--foreground)]',
          'hover:-translate-x-px hover:-translate-y-px hover:shadow-[6px_6px_0_var(--foreground)]',
          'focus-visible:ring-destructive/35',
        ].join(' '),
        link: 'text-foreground underline decoration-foreground/30 decoration-1 underline-offset-[3px] hover:decoration-foreground/70 [&_svg]:hidden',
      },
      size: {
        default: 'h-8 gap-1.5 px-3',
        xs: 'h-6 gap-1 rounded-[5px] px-2 text-[11.5px]',
        sm: 'h-7 gap-1.5 rounded-[5px] px-2.5 text-[12px]',
        lg: 'h-9 gap-1.5 px-3.5 text-[13.5px]',
        icon: 'size-8',
        'icon-xs': 'size-6 rounded-[5px]',
        'icon-sm': 'size-7 rounded-[5px]',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
