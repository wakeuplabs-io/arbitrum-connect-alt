import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/activity/")({
  component: Activity,
});

function Activity() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <h3>Activity Page</h3>
    </div>
  );
}
