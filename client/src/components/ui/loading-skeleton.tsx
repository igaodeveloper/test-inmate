import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export function LoadingSkeleton({ className, count = 1 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse bg-gray-300 dark:bg-gray-600 rounded",
            className
          )}
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300 dark:bg-gray-600" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>
    </div>
  );
}

export function TradeSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24" />
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16" />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2" />
          <div className="flex space-x-2">
            <div className="w-16 h-20 bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="w-16 h-20 bg-gray-300 dark:bg-gray-600 rounded" />
          </div>
        </div>
        <div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2" />
          <div className="w-16 h-20 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>
    </div>
  );
}
