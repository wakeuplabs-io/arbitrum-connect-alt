import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { ChevronLeft, Eye } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const ActivityListSkeleton = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col max-w-3xl w-full gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ChevronLeft />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">My Activity</h1>
        </div>
        <div className="space-y-4 w-full">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="overflow-hidden rounded-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="mt-1">
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <span className="text-sm text-gray-400">→</span>
                    <Skeleton className="h-4 w-24" />
                    <span className="text-sm text-gray-400">•</span>
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0" disabled>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </div>
  );
};
