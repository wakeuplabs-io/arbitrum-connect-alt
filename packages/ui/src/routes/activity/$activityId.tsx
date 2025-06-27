import { ActivityEmpty } from "@/components/activity-empty";
import { ActivityError } from "@/components/activity-error";
import { ActivityReceipt } from "@/components/activity-receipt";
import { ActivitySkeleton } from "@/components/activity-skeleton";
import createGetActivityQueryOptions from "@/query-options/createGetActivityQueryOptions";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

export const Route = createFileRoute({
  component: Activity,
});

function Activity() {
  const { activityId } = useParams({ from: "/activity/$activityId" });

  const { status, data, error, isFetching } = useQuery(createGetActivityQueryOptions(activityId));

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
