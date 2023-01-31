import { request } from "amazonPayApi";

type Params = {
  checkoutSessionId: string;
};

// https://developer.amazon.com/ja/docs/amazon-pay-api-v2/checkout-session.html#get-checkout-session
export const getCheckoutSession = async ({ checkoutSessionId }: Params) => {
  return request({
    method: "GET",
    path: `/checkoutSessions/${checkoutSessionId}`,
  });
};
