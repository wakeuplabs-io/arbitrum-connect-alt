import { Inbox__factory } from "@arbitrum/sdk/dist/lib/abi/factories/Inbox__factory";
import { ethers } from "ethers";
import * as HttpStatusCodes from "stoker/http-status-codes";
import env from "../../env";
import { AppRouteHandler } from "../../lib/types";
import { WithdrawRoute } from "./withdraw.routes";

const types = {
  WithdrawIntent: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "data", type: "bytes" },
    { name: "nonce", type: "uint256" },
  ],
};

/**
 * Withdraw endpoint handler
 * @type {AppRouteHandler<WithdrawRoute>}
 * @description Handles POST requests to the /withdraw endpoint
 *
 * @param {import('hono').Context} c - The Hono context object
 * @returns {Promise<Response>} JSON response with tx hash
 */
export const withdrawHandler: AppRouteHandler<WithdrawRoute> = async (c) => {
  const body = await c.req.json();
  const { message, signature, parentRpcUrl, childChainId, inboxContractAddress } = body;

  const domain = {
    name: "ArbitrumWithdraw",
    version: "1",
    chainId: childChainId,
    verifyingContract: inboxContractAddress,
  };

  try {
    const signer = ethers.utils.verifyTypedData(domain, types, message, signature);
    if (signer.toLowerCase() !== message.from.toLowerCase()) {
      return c.json({ message: "Invalid signature" }, HttpStatusCodes.BAD_REQUEST);
    }

    // Conexión a la L1 (Ethereum / Sepolia)
    const provider = new ethers.providers.JsonRpcProvider(parentRpcUrl);
    const wallet = new ethers.Wallet(env.PRIVATE_KEY, provider);

    const inbox = Inbox__factory.connect(domain.verifyingContract, wallet);

    const encodedMessage = ethers.utils.defaultAbiCoder.encode(
      ["address", "bytes"],
      [message.to, message.data],
    );

    const tx = await inbox.sendL2Message(encodedMessage, { gasLimit: 500_000 });
    await tx.wait();

    return c.json({ sendL2MessageTxHash: tx.hash }, HttpStatusCodes.OK);
  } catch (err) {
    console.error(err);
    return c.json(
      { message: "Error processing withdrawal intent" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
