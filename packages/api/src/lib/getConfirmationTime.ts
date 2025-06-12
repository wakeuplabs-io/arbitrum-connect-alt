import { ChainData } from "@arbitrum-connect/utils";
import { BLOCK_TIME_IN_SECONDS, CONFIRMATION_BUFFER_MINUTES, SECONDS_IN_MINUTE } from "./types";

export default function getConfirmationTime(chain: ChainData) {
  let confirmationTimeInSeconds: number;

  if (chain.bridgeUiConfig.fastWithdrawalTime) {
    confirmationTimeInSeconds = chain.bridgeUiConfig.fastWithdrawalTime / 1000;
  } else {
    confirmationTimeInSeconds =
      BLOCK_TIME_IN_SECONDS * chain.confirmPeriodBlocks +
      CONFIRMATION_BUFFER_MINUTES * SECONDS_IN_MINUTE;
  }

  return confirmationTimeInSeconds;
}
