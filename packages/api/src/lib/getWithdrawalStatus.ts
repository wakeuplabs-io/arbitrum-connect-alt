import {
  ChildToParentMessageStatus,
  ChildTransactionReceipt,
  registerCustomArbitrumNetwork,
} from "@arbitrum/sdk";
import { ethers } from "ethers";
import { SECONDS_IN_MINUTE, TxStatus } from "./types.js";
import { ChainData, allChainsList } from "@arbitrum-connect/utils";
import getConfirmationTime from "./getConfirmationTime";
import { providers } from "ethers";

export enum WithdrawalStatus {
  READY_TO_CLAIM = "readyToClaim",
  CLAIMED = "claimed",
  EXECUTED_BUT_FAILED = "executedButFailed",
  CLAIM_IN_PROGRESS = "claimInProgress",
  NOT_FOUND = "notFound",
}

export interface WithdrawalStatusResult {
  status: WithdrawalStatus;
  timeLeftInSeconds?: number;
  formattedTimeLeft?: string;
  claimableAt?: number;
}

export async function getWithdrawalStatus(
  childChain: ChainData,
  childChainWithdrawTxHash: string,
): Promise<WithdrawalStatusResult> {
  registerCustomArbitrumNetwork(
    { ...childChain, isCustom: true },
    {
      throwIfAlreadyRegistered: false,
    },
  );

  const parentChain = allChainsList.find((c) => c.chainId === childChain.parentChainId);

  if (!parentChain) {
    throw new Error("Parent chain not found");
  }

  const childChainProvider = new ethers.providers.JsonRpcProvider(childChain.rpcUrl);
  const parentChainProvider = new ethers.providers.JsonRpcProvider(parentChain.rpcUrl);

  // Get transaction receipt

  let txReceipt: providers.TransactionReceipt | null = null;

  try {
    txReceipt = await childChainProvider.getTransactionReceipt(childChainWithdrawTxHash);
    if (!txReceipt) {
      return {
        status: WithdrawalStatus.NOT_FOUND,
      };
    }
  } catch {
    console.error("Error getting transaction receipt", childChainWithdrawTxHash);

    return {
      status: WithdrawalStatus.NOT_FOUND,
    };
  }

  if (txReceipt.status === TxStatus.FAILURE) {
    return {
      status: WithdrawalStatus.EXECUTED_BUT_FAILED,
    };
  }

  // Create the L2 transaction receipt
  const l2TxReceipt = new ChildTransactionReceipt(txReceipt);

  // Get L2 to L1 messages
  const messages = await l2TxReceipt.getChildToParentMessages(parentChainProvider);

  if (messages.length === 0) {
    throw new Error("No L2 to L1 message found in transaction");
  }

  // Get message status
  const messageStatus = await messages[0].status(childChainProvider);

  if (messageStatus === ChildToParentMessageStatus.EXECUTED) {
    return {
      status: WithdrawalStatus.CLAIMED,
    };
  }

  if (messageStatus === ChildToParentMessageStatus.CONFIRMED) {
    return {
      status: WithdrawalStatus.READY_TO_CLAIM,
    };
  }

  // Get transaction timestamp
  const block = await childChainProvider.getBlock(txReceipt.blockNumber);
  const createdAtTimestamp = block.timestamp; // Convert to milliseconds

  const confirmationTimeInSeconds = getConfirmationTime(childChain);

  // Calculate remaining time
  const confirmationDate = createdAtTimestamp + confirmationTimeInSeconds;

  const timeLeftInSeconds = Math.max(Math.floor((confirmationDate - Date.now()) / 1000), 0);
  const addMinutesIfNoTimeLeft = timeLeftInSeconds === 0 ? 2 * SECONDS_IN_MINUTE : 0;

  return {
    status: WithdrawalStatus.CLAIM_IN_PROGRESS,
    claimableAt: confirmationDate + addMinutesIfNoTimeLeft,
  };
}
