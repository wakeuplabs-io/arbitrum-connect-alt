import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
            <Card
              key={i}
              className="overflow-hidden rounded-2xl hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="mt-1 flex items-cente">
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <span className="text-sm text-gray-400">→</span>
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-4 w-24" />
          <Button variant="outline" size="sm" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
