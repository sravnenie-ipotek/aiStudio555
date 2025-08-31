import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary-yellow text-text-primary shadow hover:bg-yellow-hover',
        secondary: 'border-transparent bg-surface-light text-text-secondary hover:bg-surface-gray',
        destructive: 'border-transparent bg-error text-white shadow hover:bg-error/80',
        outline: 'border-border-gray text-text-secondary hover:bg-surface-light',
        success: 'border-transparent bg-success text-white shadow hover:bg-success/80',
        warning: 'border-transparent bg-warning text-white shadow hover:bg-warning/80',
        info: 'border-transparent bg-info text-white shadow hover:bg-info/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
