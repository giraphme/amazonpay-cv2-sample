import fs from "node:fs";
// @ts-expect-error
import { AmazonPayClient } from "@amazonpay/amazon-pay-api-sdk-nodejs";

type Params = {
  callbackUrl: string;
};

type Result = {
  payload: string;
  signature: string;
};

const privateKey = fs.readFileSync("./private.pem");

export const generateButton = async ({
  callbackUrl,
}: Params): Promise<Result> => {
  const config = {
    publicKeyId: process.env.AMAZON_PAY_PUBLIC_KEY_ID,
    privateKey,
    region: "jp",
    sandbox: true,
  };

  const client = new AmazonPayClient(config);
  const payload = {
    webCheckoutDetails: {
      checkoutReviewReturnUrl: callbackUrl,
    },
    scopes: ["name", "email", "phoneNumber", "billingAddress"],
    chargePermissionType: "Recurring",
    storeId: process.env.AMAZON_PAY_STORE_ID,
  };
  const signature = client.generateButtonSignature(payload);

  return { payload: JSON.stringify(payload), signature };
};
