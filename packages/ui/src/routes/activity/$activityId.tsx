import { ActivityReceipt } from "@/components/activity-receipt";
import { ActivitySkeleton } from "@/components/activity-skeleton";
import envParsed from "@/envParsed";
import { AppType } from "@arbitrum-connect/api";
import { GetActivityResponse } from "@arbitrum-connect/api/src/routes/activities/get.routes";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
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
  return (await activity.json()) as GetActivityResponse;
}

export const Route = createFileRoute("/activity/$activityId")({
  component: Activity,
  loader: async ({ params }) => {
    const activity = await fetchActivity(params.activityId);
    return { activity };
  },
  pendingComponent: () => (
    <div className="w-full flex justify-center">
      <div className="flex flex-col w-full max-w-3xl justify-center items-center gap-4 p-4">
        <ActivitySkeleton />
      </div>
    </div>
  ),
});

function Activity() {
  const { activity: initialActivity } = Route.useLoaderData();
  const { activityId } = useParams({ from: "/activity/$activityId" });

  const {
    data: activity,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["activity", activityId],
    queryFn: () => fetchActivity(activityId),
    initialData: initialActivity,
    refetchInterval: REFRESH_INTERVAL,
  });

  console.log("activity", new Date().toISOString(), activity.id, isFetching, error);

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col w-full max-w-3xl justify-center items-center gap-4 p-4">
        <ActivityReceipt activity={activity} />
      </div>
    </div>
  );
}
