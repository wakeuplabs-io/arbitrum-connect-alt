import { BigNumber, ethers } from "ethers";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { AppRouteHandler } from "../../lib/types";
import { WithdrawExecuteRoute } from "./withdraw.routes";

export const withdrawExecuteHandler: AppRouteHandler<WithdrawExecuteRoute> = async (c) => {
  const body = await c.req.json();
  const { domain, message, signature, parentRpcUrl } = body;

  try {
    // ... verificación de firma ...

    // 3. Reconstruir y enviar la transacción raw
    const provider = new ethers.providers.JsonRpcProvider(parentRpcUrl);
    const tx = {
      nonce: parseInt(message.nonce),
      gasPrice: BigNumber.from(message.gasPrice),
      gasLimit: BigNumber.from(message.gasLimit),
      to: message.to,
      value: BigNumber.from(message.value),
      data: message.data,
      v: parseInt(signature.slice(130, 132), 16),
      r: signature.slice(0, 66),
      s: signature.slice(66, 130),
    };

    const serializedTx = ethers.utils.serializeTransaction(tx);
    const txResponse = await provider.sendTransaction(serializedTx);
    const receipt = await txResponse.wait();

    return c.json({ txHash: receipt.transactionHash }, HttpStatusCodes.OK);
  } catch (err) {
    console.error(err);
    return c.json(
      { message: "Error executing withdrawal transaction" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
