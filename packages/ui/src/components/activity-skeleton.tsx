import { ScrollText, Clock, Hash, ExternalLink, CornerUpLeft, CornerUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Link } from "@tanstack/react-router";
import { Skeleton } from "./ui/skeleton";

export const ActivitySkeleton = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <Card className="w-full border-none text-center shadow-none bg-transparent">
        <CardHeader className="items-center w-full p-0">
          <ScrollText className="h-12 w-12 text-blue-500" />
          <CardTitle className="pt-4 text-3xl font-bold flex">
            <Skeleton className="h-8 w-[300px] mx-auto" />
          </CardTitle>
          <CardDescription className="pt-2 text-base text-slate-600 max-w-md">
            Your withdrawal request for{" "}
            <span className="font-bold text-slate-800">
              <Skeleton className="h-4 w-[80px] inline-block" />
            </span>{" "}
            from{" "}
            <span className="font-bold text-slate-800">
              <Skeleton className="h-4 w-[120px] inline-block" />
            </span>{" "}
            to{" "}
            <span className="font-bold text-slate-800">
              <Skeleton className="h-4 w-[100px] inline-block" />
            </span>{" "}
            has been <Skeleton className="h-4 w-[80px] inline-block" />
          </CardDescription>
        </CardHeader>
        <CardContent className="my-6 flex flex-col gap-2 w-full p-0">
          <div className="rounded-lg border bg-gray-100/50">
            <div className="flex flex-wrap items-center justify-between text-sm p-4 border-b">
              <div className="flex items-center font-medium text-slate-800">
                <Skeleton className="h-5 w-5 mr-2 rounded-full" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
              <span className="flex items-center text-slate-500">
                <Skeleton className="h-4 w-[120px]" />
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between text-sm p-4 border-b">
              <div className="flex items-center font-medium text-slate-800">
                <Hash className="mr-2 h-5 w-5" />
                Transaction
              </div>
              <div className="font-medium flex text-slate-800">
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between text-sm p-4 border-b">
              <div className="flex items-center font-medium text-slate-800">
                <CornerUpLeft className="mr-2 h-5 w-5" />
                From
              </div>
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <div className="flex flex-wrap items-center justify-between text-sm p-4 border-b">
              <div className="flex items-center font-medium text-slate-800">
                <CornerUpRight className="mr-2 h-5 w-5" />
                To
              </div>
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <div className="flex flex-wrap items-center justify-between text-sm p-4 border-b">
              <div className="flex items-center font-medium text-slate-800">
                <Skeleton className="h-5 w-5 mr-2 rounded-full" />
                Amount
              </div>
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <div className="bg-gray-100 text-center text-sm text-slate-600 px-4 py-2">
              Have questions about this process?{" "}
              <a
                href="https://github.com/wakeuplabs-io/arbitrum-connect/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                Learn More
              </a>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-6 p-0">
          <section className="w-full flex flex-col gap-3">
            <Skeleton className="h-10 w-full" />
          </section>

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
