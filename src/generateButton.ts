import { sign, ALGORITHM } from "./amazonPayApi";
import crypto from "node:crypto";

type Params = {
  callbackUrl: string;
};

type Result = {
  payload: string;
  signature: string;
};

// https://developer.amazon.com/ja/docs/amazon-pay-checkout/add-the-amazon-pay-button.html#2-checkoutsession-%E3%83%9A%E3%82%A4%E3%83%AD%E3%83%BC%E3%83%89%E3%82%92%E7%94%9F%E6%88%90%E3%81%97%E3%81%BE%E3%81%99
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
