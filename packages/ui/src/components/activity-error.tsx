import { CircleX } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Link } from "@tanstack/react-router";
import parseError from "@/lib/parseError";

interface ActivityErrorProps {
  error: unknown;
}

export const ActivityError = ({ error }: ActivityErrorProps) => {
  const errorMessage = parseError(error);

  return (
    <div className="flex items-center justify-center w-full">
      <Card className="w-full border-none text-center shadow-none bg-transparent">
        <CardHeader className="items-center w-full p-0">
          <CircleX className="h-12 w-12 text-red-500" />
          <CardTitle className="pt-4 text-3xl font-bold text-red-500">
            Something went wrong
          </CardTitle>
          <CardDescription className="pt-2 text-base text-slate-600 max-w-md">
            We encountered an error while processing your request. Don&apos;t worry - your funds are
            safe.
          </CardDescription>
        </CardHeader>
        <CardContent className="my-6 flex flex-col gap-2 w-full p-0">
          <div className="rounded-lg border bg-red-100/80 border-red-500">
            <div className="flex flex-wrap items-center justify-between text-sm p-4 border-b border-red-500">
              <div className="flex items-center font-medium text-red-500">
                <CircleX className="mr-2 h-5 w-5" />
                {errorMessage}
              </div>
            </div>
            <div className="bg-red-50 text-center text-sm text-red-900 px-4 py-6 rounded-lg">
              <p className="mb-4">
                Please try again later or contact support if the issue persists.
              </p>
              <p>
                Need help?{" "}
                <a
                  href="https://github.com/wakeuplabs-io/arbitrum-connect/blob/main/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-red-600 hover:underline"
                >
                  Check our documentation
                </a>
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-6 p-0">
          <section className="w-full flex gap-3">
            <Button size="lg" asChild className="flex-1 bg-slate-900 text-white hover:bg-slate-800">
              <Link to="/activity">Go to my activity</Link>
            </Button>

            <Button size="lg" variant="outline" asChild className="flex-1">
              <Link to="/">Return home</Link>
            </Button>
          </section>
        </CardFooter>
      </Card>
    </div>
  );
};
