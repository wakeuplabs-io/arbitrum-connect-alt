import { ChainData } from "@/blockchain/chainsJsonType";
import {
  ChildTransactionReceipt,
  registerCustomArbitrumNetwork,
  ChildToParentMessage,
} from "@arbitrum/sdk";
import { ethers } from "ethers";

// 🔧 Constante de incremento total del costo (ej: 1.5 = +50%)
const TOTAL_COST_INCREASE = 1.5;

// 📐 Factor para aplicar a gasLimit y gasPrice por igual
const INCREASE_FACTOR_BPS = Math.round(Math.sqrt(TOTAL_COST_INCREASE) * 1000); // base 1000

export async function estimateGasLimitClaim(parentChain: ChainData) {
  const parentChainProvider = new ethers.providers.JsonRpcProvider(parentChain.rpcUrl);

  const estimateGas = ethers.BigNumber.from(500000);

  const gasLimit = estimateGas.mul(INCREASE_FACTOR_BPS).div(1000); // +22.5%

  const currentGasPrice = await parentChainProvider.getGasPrice();
  const gasPrice = currentGasPrice.mul(INCREASE_FACTOR_BPS).div(1000); // +22.5%

  const gasCost = gasLimit.mul(gasPrice);
  const gasCostInEther = ethers.utils.formatEther(gasCost);

  return {
    gasLimit,
    gasPrice,
    gasCost,
    gasCostInEther,
  };
}

export async function claim(
  childChain: ChainData,
  parentChain: ChainData,
  parentChainSigner: ethers.Signer,
  childChainWithdrawalTxHash: string,
  gasCostDetails: { gasPrice: ethers.BigNumber; gasLimit: ethers.BigNumber },
): Promise<string> {
  registerCustomArbitrumNetwork(
    { ...parentChain, isCustom: true },
    {
      throwIfAlreadyRegistered: false,
    },
  );
  registerCustomArbitrumNetwork(
    { ...childChain, isCustom: true },
    {
      throwIfAlreadyRegistered: false,
    },
  );

  const childChainProvider = new ethers.providers.JsonRpcProvider(childChain.rpcUrl);

  // Get transaction receipt and extract event
  const txReceipt = await childChainProvider.getTransactionReceipt(childChainWithdrawalTxHash);
  const l2TxReceipt = new ChildTransactionReceipt(txReceipt);
  const [event] = l2TxReceipt.getChildToParentEvents();

  if (!event) {
    throw new Error("Withdrawal request event not found.");
  }

  const childToParentReceipt = new ChildTransactionReceipt(txReceipt);

  // Get messages from child to parent
  const messages = await childToParentReceipt.getChildToParentMessages(parentChainSigner);
  if (messages.length === 0) {
    throw new Error("No child to parent message found in transaction");
  }

  const message = messages[0];

  const claimTx = await message.execute(childChainProvider, {
    gasPrice: gasCostDetails.gasPrice,
    gasLimit: gasCostDetails.gasLimit,
  });

  const receipt = await claimTx.wait();

  if (receipt.status !== 1) {
    throw new Error("Claim transaction failed");
  }

  return receipt.transactionHash;
}
