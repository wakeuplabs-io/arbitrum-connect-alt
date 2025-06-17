import { ActivityStatus } from "@arbitrum-connect/db";

export const statusToTitle = {
  [ActivityStatus.INITIALIZED]: "Withdrawal Initiated",
  [ActivityStatus.CLAIMED]: "Withdrawal Claimed",
  [ActivityStatus.READY_TO_CLAIM]: "Ready to be Claimed",
  [ActivityStatus.EXECUTED_BUT_FAILED]: "Withdrawal Executed But Failed",
  [ActivityStatus.FORCED]: "Withdrawal Forced",
  [ActivityStatus.FORCED_CHALLENGE_PERIOD_COMPLETED]: "Forced Challenge Period Completed",
  [ActivityStatus.READY_TO_BE_FORCED]: "Ready to be Forced",
  [ActivityStatus.L2_MSG_INCLUDED]: "Withdrawal Included",
  [ActivityStatus.L2_MSG_SENT]: "Withdrawal Sent",
};

export const statusShorted = {
  [ActivityStatus.INITIALIZED]: "has been initiated",
  [ActivityStatus.CLAIMED]: "has been claimed",
  [ActivityStatus.READY_TO_CLAIM]: "is ready to be claimed",
  [ActivityStatus.EXECUTED_BUT_FAILED]: "has been executed but failed",
  [ActivityStatus.FORCED]: "has been forced",
  [ActivityStatus.FORCED_CHALLENGE_PERIOD_COMPLETED]: "has completed the forced challenge period",
  [ActivityStatus.READY_TO_BE_FORCED]: "is ready to be forced",
  [ActivityStatus.L2_MSG_INCLUDED]: "has been included",
  [ActivityStatus.L2_MSG_SENT]: "has been sent",
};

export const statusAction = {
  [ActivityStatus.INITIALIZED]: "Processing Withdrawal",
  [ActivityStatus.CLAIMED]: "Claimed",
  [ActivityStatus.READY_TO_CLAIM]: "Ready",
  [ActivityStatus.EXECUTED_BUT_FAILED]: "Failed",
  [ActivityStatus.FORCED]: "Forced",
  [ActivityStatus.FORCED_CHALLENGE_PERIOD_COMPLETED]: "Forced Challenge Period Completed",
  [ActivityStatus.READY_TO_BE_FORCED]: "Ready to be Forced",
  [ActivityStatus.L2_MSG_INCLUDED]: "Included",
  [ActivityStatus.L2_MSG_SENT]: "Sent",
};
