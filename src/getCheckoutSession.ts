import { request } from "amazonPayApi";

type Params = {
  checkoutSessionId: string;
};

export const getCheckoutSession = async ({ checkoutSessionId }: Params) => {
  return request({
    method: "GET",
    path: `/checkoutSessions/${checkoutSessionId}`,
  });
};
