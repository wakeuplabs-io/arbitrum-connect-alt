import { ActivityEmpty } from "@/components/activity-empty";
import { ActivityError } from "@/components/activity-error";
import { ActivityReceipt } from "@/components/activity-receipt";
import { ActivitySkeleton } from "@/components/activity-skeleton";
import envParsed from "@/envParsed";
import { AppType } from "@arbitrum-connect/api";
import { GetActivityResponse } from "@arbitrum-connect/api/src/routes/activities/get.routes";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { hc } from "hono/client";

const REFRESH_INTERVAL = 60000; // 1 minute

export async function fetchActivity(activityId: string) {
  const client = hc<AppType>(envParsed().API_URL, {
    headers: { "Cache-Control": "no-cache" },
  });
  const activity = await client.api.activities[":id"].$get({
    param: {
      id: activityId,
    },
  });

  if (!activity.ok) {
    throw new Error("Failed to fetch activity");
  }

  return (await activity.json()) as GetActivityResponse;
}

export const Route = createFileRoute({
  component: Activity,
});

function Activity() {
  const { activityId } = useParams({ from: "/activity/$activityId" });

  const { status, data, error, isFetching } = useQuery({
    queryKey: ["activity", activityId],
    queryFn: () => fetchActivity(activityId),
    refetchInterval: REFRESH_INTERVAL,
  });

  if (status === "pending") {
    return (
      <div className="w-full flex justify-center">
        <div className="flex flex-col w-full max-w-3xl justify-center items-center gap-4 p-4">
          <ActivitySkeleton />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full flex justify-center">
        <div className="flex flex-col w-full max-w-3xl justify-center items-center gap-4 p-4">
          <ActivityError error={error} />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full flex justify-center">
        <div className="flex flex-col w-full max-w-3xl justify-center items-center gap-4 p-4">
          <ActivityEmpty />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col w-full max-w-3xl justify-center items-center gap-4 p-4">
        <ActivityReceipt activity={data} isFetching={isFetching} />
      </div>
    </div>
  );
}
