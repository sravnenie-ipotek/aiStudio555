'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CourseSkeletonProps {
  className?: string;
}

export function CourseSkeleton({ className }: CourseSkeletonProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-0">
        {/* Image Skeleton */}
        <div className="h-48 bg-gray-200 animate-pulse" />
      </CardHeader>

      <CardContent className="p-6">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-3" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-4" />
        
        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-4/6" />
        </div>

        {/* Metrics Skeleton */}
        <div className="flex items-center gap-4 mb-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
        </div>

        {/* Badges Skeleton */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
        </div>

        {/* Price Skeleton */}
        <div className="flex items-baseline gap-3 mb-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="w-full space-y-3">
          {/* Button Skeletons */}
          <div className="h-11 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-11 bg-gray-200 rounded animate-pulse w-full" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function CourseSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <CourseSkeleton key={i} />
      ))}
    </div>
  );
}