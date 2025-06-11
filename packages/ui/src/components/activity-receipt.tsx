import {
  ScrollText,
  Clock,
  LoaderCircle,
  CircleX,
  CircleCheck,
  CircleAlert,
  Hash,
  ExternalLink,
  CornerUpLeft,
  CornerUpRight,
  ClockAlert,
  Calendar,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Link } from "@tanstack/react-router";
import { ActivityStatus } from "@arbitrum-connect/db";
import { allChains } from "@/blockchain/chains";
import getTimeRemaining from "@/lib/getTimeRemaining";
import { ETH_NATIVE_TOKEN_DATA } from "@/blockchain/chainsJsonType";
import { formatDate } from "date-fns";
import { cn } from "@/lib/utils";
import { GetActivityResponse } from "@arbitrum-connect/api/src/routes/activities/get.routes";
import ClaimButton from "./claim-button";

const statusToTitle = {
  [ActivityStatus.INITIALIZED]: "Withdrawal Initiated",
  [ActivityStatus.CLAIMED]: "Withdrawal Claimed",
  [ActivityStatus.READY_TO_CLAIM]: "Ready to be Claimed",
  [ActivityStatus.EXECUTED_BUT_FAILED]: "Withdrawal Executed But Failed",
};

const statusShorted = {
  [ActivityStatus.INITIALIZED]: "has been initiated",
  [ActivityStatus.CLAIMED]: "has been claimed",
  [ActivityStatus.READY_TO_CLAIM]: "is ready to be claimed",
  [ActivityStatus.EXECUTED_BUT_FAILED]: "has been executed but failed",
};

const statusAction = {
  [ActivityStatus.INITIALIZED]: "Processing Withdrawal",
  [ActivityStatus.CLAIMED]: "Claimed",
  [ActivityStatus.READY_TO_CLAIM]: "Ready",
  [ActivityStatus.EXECUTED_BUT_FAILED]: "Failed",
};

const chainsList = [...allChains.testnet, ...allChains.mainnet];

const GRACE_PERIOD_MINUTES = 15;

export const ActivityReceipt = ({ activity }: { activity: GetActivityResponse }) => {
  const childChain = chainsList.find((c) => c.chainId === activity.childChainId);
  const parentChain = chainsList.find((c) => c.chainId === childChain?.parentChainId);

  if (!childChain || !parentChain) {
    return null;
  }

  const activityDate = activity.claimableAt || activity.createdAt;

  const claimableAt = new Date(activityDate * 1000);

  const timeRemaining = getTimeRemaining(
    claimableAt,
    activity.claimableAt ? 0 : GRACE_PERIOD_MINUTES,
  );

  const timeExpired =
    activity.status === ActivityStatus.INITIALIZED &&
    !activity.claimableAt &&
    !timeRemaining.remaining;

  const nativeTokenData = childChain.bridgeUiConfig.nativeTokenData ?? ETH_NATIVE_TOKEN_DATA;

  return (
    <div className="flex items-center justify-center w-full">
      <Card className="w-full border-none text-center shadow-none bg-transparent">
        <CardHeader className="items-center w-full p-0">
          <ScrollText className="h-12 w-12 text-blue-500" />
          <CardTitle className="pt-4 text-3xl font-bold">
            {statusToTitle[activity.status as keyof typeof statusToTitle] ?? "-"}
          </CardTitle>
          <CardDescription className="pt-2 text-base text-slate-600 max-w-md">
            Your withdrawal request for{" "}
            <span className="font-bold text-slate-800">
              {activity.withdrawAmount} {nativeTokenData.symbol}
            </span>{" "}
            from <span className="font-bold text-slate-800">{childChain.name}</span> to{" "}
            <span className="font-bold text-slate-800">{parentChain.name}</span>{" "}
            {statusShorted[activity.status as keyof typeof statusShorted] ?? "-"}
          </CardDescription>
        </CardHeader>
        <CardContent className="my-6 flex flex-col gap-2 w-full p-0">
          <div className="rounded-lg border bg-gray-100/50">
            <div className="flex flex-wrap items-center justify-between text-sm p-4 border-b">
              <div
                className={cn("flex items-center font-medium text-slate-800", {
                  "text-slate-800": activity.status === ActivityStatus.INITIALIZED,
                  "text-red-500": activity.status === ActivityStatus.EXECUTED_BUT_FAILED,
                  "text-green-500": activity.status === ActivityStatus.CLAIMED,
                  "text-blue-500": activity.status === ActivityStatus.READY_TO_CLAIM,
                  "text-yellow-500": timeExpired,
                })}
              >
                {!timeExpired && activity.status === ActivityStatus.INITIALIZED && (
                  <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                )}
                {activity.status === ActivityStatus.EXECUTED_BUT_FAILED && (
                  <CircleX className="mr-2 h-5 w-5" />
                )}
                {activity.status === ActivityStatus.CLAIMED && (
                  <CircleCheck className="mr-2 h-5 w-5" />
                )}
                {activity.status === ActivityStatus.READY_TO_CLAIM && (
                  <CircleAlert className="mr-2 h-5 w-5" />
                )}
                {timeExpired && <ClockAlert className="mr-2 h-5 w-5" />}
                {(!timeExpired && statusAction[activity.status as keyof typeof statusAction]) ||
                  "-"}
                {timeExpired && "Potential network failure"}
              </div>
              {activity.status === ActivityStatus.INITIALIZED && (
                <span className="flex items-center text-slate-500">
                  <Clock className="mr-2 h-5 w-5" />
                  <abbr
                    title={`Withdrawal initiated at ${formatDate(
                      new Date(activity.createdAt * 1000),
                      "MMM d, yyyy h:mm a",
                    )}`}
                  >
                    {timeRemaining.formatted}
                  </abbr>
                </span>
              )}
              {activity.status !== ActivityStatus.INITIALIZED && (
                <span className="flex items-center text-slate-500">
                  <Calendar className="mr-2 h-5 w-5" />
                  <abbr title={`Withdrawal initiated at`}>
                    {formatDate(new Date(activity.createdAt * 1000), "MMM d, yyyy h:mm a")}
                  </abbr>
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between text-sm p-4 border-b">
              <div className="flex items-center font-medium text-slate-800">
                <Hash className="mr-2 h-5 w-5" />
                Transaction
              </div>
              <a
                href={`${childChain.explorerUrl}/tx/${activity.childChainWithdrawTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium flex text-slate-800 hover:underline"
              >
                View <ExternalLink className="size-4 ml-1" />
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-between text-sm p-4 border-b">
              <div className="flex items-center font-medium text-slate-800">
                <CornerUpLeft className="mr-2 h-5 w-5" />
                From
              </div>
              {childChain.name}
            </div>
            <div className="flex flex-wrap items-center justify-between text-sm p-4 border-b">
              <div className="flex items-center font-medium text-slate-800">
                <CornerUpRight className="mr-2 h-5 w-5" />
                To
              </div>
              {parentChain.name}
            </div>
            <div className="flex flex-wrap items-center justify-between text-sm p-4 border-b">
              <div className="flex items-center font-medium text-slate-800">
                <img
                  src={nativeTokenData.logoUrl}
                  alt={nativeTokenData.name}
                  className="mr-2 h-5 w-5"
                />
                Amount
              </div>
              {activity.withdrawAmount} {nativeTokenData.symbol}
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
            {activity.status === ActivityStatus.READY_TO_CLAIM && (
              <ClaimButton activity={activity} />
            )}
            {timeExpired && (
              <Button
                size="lg"
                asChild
                className="w-full bg-yellow-500 text-white hover:bg-yellow-400"
              >
                <Link to="/activity">Try emergency process</Link>
              </Button>
            )}
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
