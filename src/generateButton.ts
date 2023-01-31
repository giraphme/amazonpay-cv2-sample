import { sign, ALGORITHM } from "./amazonPayApi";
import crypto from "node:crypto";

type Params = {
  callbackUrl: string;
};

type Result = {
  payload: string;
  signature: string;
};

export const generateButton = async ({
  callbackUrl,
}: Params): Promise<Result> => {
  const payload = JSON.stringify({
    webCheckoutDetails: {
      checkoutReviewReturnUrl: callbackUrl,
    },
    scopes: ["name", "email", "phoneNumber", "billingAddress"],
    chargePermissionType: "Recurring",
    storeId: process.env.AMAZON_PAY_STORE_ID,
  });
  const signature = signPayload(payload);

  return { payload, signature };
};

const signPayload = (payload: string) => {
  const stringToSign = `${ALGORITHM}\n${crypto
    .createHash("SHA256")
    .update(payload)
    .digest("hex")}`;

  return sign(stringToSign);
};
