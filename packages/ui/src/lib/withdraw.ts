import { ChainData, toHex } from "@arbitrum-connect/utils";
import {
  ChildToParentTransactionRequest,
  EthBridger,
  registerCustomArbitrumNetwork,
} from "@arbitrum/sdk";
import { BigNumber, ethers } from "ethers";

function percentIncrease(value: BigNumber, percent: BigNumber): BigNumber {
  return value.mul(percent.add(100)).div(100);
}

export async function createWithdrawalRequest(
  childChain: ChainData,
  amountInEther: string,
  walletAddress: string,
) {
  registerCustomArbitrumNetwork(
    { ...childChain, isCustom: true },
    {
      throwIfAlreadyRegistered: false,
    },
  );

  const provider = new ethers.providers.JsonRpcProvider(childChain.rpcUrl);
  const ethBridger = await EthBridger.fromProvider(provider);

  const request = await ethBridger.getWithdrawalRequest({
    amount: BigNumber.from(ethers.utils.parseEther(amountInEther)),
    destinationAddress: walletAddress,
    from: walletAddress,
  });

  return request;
}

export async function estimateGasLimitWithdrawalRequest(
  childChain: ChainData,
  request: ChildToParentTransactionRequest,
) {
  const provider = new ethers.providers.JsonRpcProvider(childChain.rpcUrl);

  const estimatedGasLimit = await provider.estimateGas(request.txRequest);

  return percentIncrease(estimatedGasLimit, BigNumber.from(30));
}

export async function withdraw(
  childChain: ChainData,
  request: ChildToParentTransactionRequest,
  childChainSigner: ethers.Signer,
  estimatedGasLimit: BigNumber,
): Promise<string> {
  const signerChainId = await childChainSigner.getChainId();

  if (toHex(childChain.chainId) !== toHex(signerChainId)) {
    throw new Error("Chain ID mismatch");
  }

  const tx = await childChainSigner.sendTransaction({
    ...request.txRequest,
    gasLimit: estimatedGasLimit,
  });

  return tx.hash;
}
