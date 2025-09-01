'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CourseCategoryBadgeProps {
  category: {
    id: string;
    name: { ru?: string; en?: string; he?: string };
    icon?: string;
  };
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CourseCategoryBadge({ 
  category, 
  variant = 'default', 
  size = 'md', 
  className 
}: CourseCategoryBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <Badge 
      variant={variant}
      className={cn(
        sizeClasses[size],
        "font-medium inline-flex items-center gap-1",
        className
      )}
    >
      {category.icon && (
        <span className="text-current">{category.icon}</span>
      )}
      {category.name.ru || category.name.en || 'Category'}
    </Badge>
  );
}