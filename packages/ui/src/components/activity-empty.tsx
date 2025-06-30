import envParsed from "@/envParsed";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Link } from "@tanstack/react-router";

export const ActivityEmpty = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <Card className="w-full border-none text-center shadow-none bg-transparent">
        <CardHeader className="items-center w-full p-0">
          <CardTitle className="pt-4 text-3xl font-bold">No Activities Yet</CardTitle>
          <CardDescription className="pt-2 text-base text-slate-600 max-w-md">
            You haven&apos;t initiated any withdrawals yet. Start by withdrawing funds from any
            supported chain to track your transactions here.
          </CardDescription>
        </CardHeader>
        <CardContent className="my-6 flex flex-col gap-2 w-full p-0">
          <div className="rounded-lg border bg-gray-100/50">
            <div className="bg-gray-100 text-center text-sm text-slate-600 px-4 py-6">
              <p className="mb-4">
                Want to learn more about the withdrawal process?{" "}
                <a
                  href={envParsed().DOCS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Check out our documentation
                </a>
              </p>
              <p className="text-slate-500">
                Here you&apos;ll be able to track and manage all your withdrawal requests once you
                start using the bridge.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-6 p-0">
          <section className="w-full flex gap-3">
            <Button size="lg" asChild className="flex-1 bg-slate-900 text-white hover:bg-slate-800">
              <Link to="/">Start a Withdrawal</Link>
            </Button>
          </section>
        </CardFooter>
      </Card>
    </div>
  );
};
