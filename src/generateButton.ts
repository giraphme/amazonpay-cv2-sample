import fs from "node:fs";
// @ts-expect-error
import Client from "@amazonpay/amazon-pay-api-sdk-nodejs";

type Params = {
  callbackUrl: string;
};

type Result = {
  payload: string;
  signature: string;
};

const privateKey = fs.readFileSync("./private.pem");

export const generateButton = ({ callbackUrl }: Params): Result => {
  const config = {
    publicKeyId: process.env.AMAZON_PAY_PUBLIC_KEY_ID,
    privateKey,
    region: "jp",
    sandbox: true,
  };

  const testPayClient = new Client.AmazonPayClient(config);
  const payload = {
    webCheckoutDetails: {
      checkoutReviewReturnUrl: callbackUrl,
    },
    scopes: ["name", "email", "phoneNumber", "billingAddress"],
    chargePermissionType: "Recurring",
    storeId: process.env.AMAZON_PAY_STORE_ID,
  };
  const signature = testPayClient.generateButtonSignature(payload);

  return { payload: JSON.stringify(payload), signature };
};
