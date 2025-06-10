import {
  ChildToParentMessageStatus,
  ChildTransactionReceipt,
  getArbitrumNetwork,
  registerCustomArbitrumNetwork,
} from "@arbitrum/sdk";
import { ethers } from "ethers";
import formatTimeLeft from "./formatTimeLeft";
import parseError from "./parseError";
import { CONFIRMATION_BUFFER_MINUTES, SECONDS_IN_MINUTE, TxStatus } from "./types.js";
import { ChainData } from "../blockchain/chainsJsonType";
import { allChains } from "../blockchain/chains";

const chainList = [...allChains.mainnet, ...allChains.testnet];

export enum WithdrawalStatus {
  READY_TO_CLAIM = "readyToClaim",
  CLAIMED = "claimed",
  EXECUTED_BUT_FAILED = "executedButFailed",
  CLAIM_IN_PROGRESS = "claimInProgress",
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
  try {
    const parentChain = chainList.find((c) => c.chainId === childChain.parentChainId);

    if (!parentChain) {
      throw new Error("Parent chain not found");
    }

    const childChainProvider = new ethers.providers.JsonRpcProvider(childChain.rpcUrl);
    const parentChainProvider = new ethers.providers.JsonRpcProvider(parentChain.rpcUrl);

    // Get transaction receipt
    const txReceipt = await childChainProvider.getTransactionReceipt(childChainWithdrawTxHash);
    if (!txReceipt) {
      throw new Error("Transaction receipt not found");
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

    registerCustomArbitrumNetwork(
      { ...childChain, isCustom: true },
      {
        throwIfAlreadyRegistered: false,
      },
    );

    // Get L2 network to access its parameters
    const childNetwork = getArbitrumNetwork(
      await childChainProvider.getNetwork().then((n) => n.chainId),
    );

    // Get confirmation period blocks
    const confirmPeriodBlocks = childNetwork.confirmPeriodBlocks;

    // Get transaction timestamp
    const block = await childChainProvider.getBlock(txReceipt.blockNumber);
    const createdAtTimestamp = block.timestamp * 1000; // Convert to milliseconds

    // Get average L1 block time
    const latestL1Block = await parentChainProvider.getBlock("latest");
    const previousL1Block = await parentChainProvider.getBlock(latestL1Block.number - 100);
    const l1BlockTime = Math.round((latestL1Block.timestamp - previousL1Block.timestamp) / 100);

    const confirmationTimeInSeconds =
      l1BlockTime * confirmPeriodBlocks + CONFIRMATION_BUFFER_MINUTES * SECONDS_IN_MINUTE;

    // Calculate remaining time
    const now = Date.now();
    const confirmationDate = createdAtTimestamp + confirmationTimeInSeconds * 1000;
    const timeLeftInSeconds = Math.max(Math.floor((confirmationDate - now) / 1000), 0);

    // Format remaining time
    const formattedTimeLeft = formatTimeLeft(timeLeftInSeconds);

    if (timeLeftInSeconds === 0) {
      return {
        status: WithdrawalStatus.READY_TO_CLAIM,
      };
    }

    return {
      status: WithdrawalStatus.CLAIM_IN_PROGRESS,
      timeLeftInSeconds,
      formattedTimeLeft,
      claimableAt: confirmationDate / 1000,
    };
  } catch (error) {
    throw new Error(`Error calculating withdrawal claim time: ${parseError(error)}`);
  }
}
