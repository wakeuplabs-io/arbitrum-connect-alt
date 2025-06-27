import { useQuery } from "@tanstack/react-query";
import { ETH_NATIVE_TOKEN_DATA } from "@arbitrum-connect/utils";
import { formatDate } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ActivityStatus } from "@arbitrum-connect/db";
import {
  ChevronLeft,
  ChevronRight,
  CircleX,
  CircleCheck,
  CircleAlert,
  ClockFading,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ActivityListSkeleton } from "@/components/activity-list-skeleton";
import { ActivityError } from "@/components/activity-error";
import { ActivityEmpty } from "@/components/activity-empty";
import { statusToTitle } from "@/lib/statusTexts";
import UsdPrice from "@/components/usd-price";
import useWallet from "@/hooks/useWallet";
import createGetActivitiesQueryOptions from "@/query-options/createGetActivitiesQueryOptions";
import createGetChainQueryOptions from "@/query-options/createGetChainQueryOptions";
import { GetActivityResponse } from "@arbitrum-connect/api/src/routes/activities/get.routes";

export const Route = createFileRoute({
  component: Activity,
});

function Activity() {
  const [, walletAddress, isConnecting] = useWallet();
  const [page, setPage] = useState(1);

  const { status, data, error } = useQuery(createGetActivitiesQueryOptions(walletAddress, page));

  if (isConnecting || (walletAddress && status === "pending")) {
    return (
      <div className="w-full flex justify-center">
        <div className="flex flex-col max-w-3xl w-full gap-4 p-4">
          <ActivityListSkeleton />
        </div>
      </div>
    );
  }

  if (walletAddress && status === "error") {
    return (
      <div className="w-full flex justify-center">
        <div className="flex flex-col max-w-3xl w-full gap-4 p-4">
          <ActivityError error={error} />
        </div>
      </div>
    );
  }

  if (!data || data.items.length === 0 || !walletAddress) {
    return (
      <div className="w-full flex justify-center">
        <div className="flex flex-col max-w-3xl w-full gap-4 p-4">
          <ActivityEmpty />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col max-w-3xl w-full gap-4 p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ChevronLeft />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">My Activity</h1>
        </div>
        <div className="space-y-4 w-full">
          {data.items.map((activity) => (
            <ActivityItem key={`activity-${activity.id}`} activity={activity} />
          ))}
        </div>
        {data && data.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 100);
              }}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPage((p) => Math.min(data.totalPages, p + 1));
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 100);
              }}
              disabled={page === data.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: GetActivityResponse }) {
  const { data: childChain } = useQuery(createGetChainQueryOptions(activity.childChainId));
  const { data: parentChain } = useQuery(createGetChainQueryOptions(childChain?.parentChainId));

  const nativeTokenData = childChain?.bridgeUiConfig?.nativeTokenData ?? ETH_NATIVE_TOKEN_DATA;

  return (
    <Link
      key={activity.id}
      to="/activity/$activityId"
      params={{ activityId: activity.id.toString() }}
      className="block rounded-2xl focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
    >
      <Card className="overflow-hidden rounded-2xl hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {activity.status === ActivityStatus.INITIALIZED && (
                <ClockFading className="h-4 w-4 text-slate-800" />
              )}
              {activity.status === ActivityStatus.EXECUTED_BUT_FAILED && (
                <CircleX className="h-4 w-4 text-red-500" />
              )}
              {activity.status === ActivityStatus.CLAIMED && (
                <CircleCheck className="h-4 w-4 text-green-500" />
              )}
              {activity.status === ActivityStatus.READY_TO_CLAIM && (
                <CircleAlert className="h-4 w-4 text-blue-500" />
              )}
              <span
                className={cn("font-medium", {
                  "text-slate-800": activity.status === ActivityStatus.INITIALIZED,
                  "text-blue-500": activity.status === ActivityStatus.READY_TO_CLAIM,
                  "text-green-500": activity.status === ActivityStatus.CLAIMED,
                  "text-red-500": activity.status === ActivityStatus.EXECUTED_BUT_FAILED,
                })}
              >
                {statusToTitle[activity.status as keyof typeof statusToTitle]}
              </span>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {formatDate(new Date(activity.createdAt * 1000), "MMM d, yyyy h:mm a")}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-gray-600">{childChain?.name || "Unknown Chain"}</span>
              <span className="text-sm text-gray-400">→</span>
              <span className="text-sm text-gray-600">{parentChain?.name || "Unknown Chain"}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-medium">
                {activity.withdrawAmount} {nativeTokenData.symbol}
              </span>
              <UsdPrice
                ethAmount={activity.withdrawAmount}
                isLoading={false}
                disabled={nativeTokenData.symbol !== ETH_NATIVE_TOKEN_DATA.symbol}
                className="text-xs font-extralight"
                addParenthesis
              />
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
        </div>
      </Card>
    </Link>
  );
}
