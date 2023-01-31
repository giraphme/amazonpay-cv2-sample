import http, { IncomingMessage, ServerResponse } from "http";
import dotenv from "dotenv";
dotenv.config();

import { generateButton } from "./generateButton";
import { getCheckoutSession } from "getCheckoutSession";

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");
    const result = await handleRequest(req);
    res.end(JSON.stringify(result));
  }
);

const handleRequest = async (
  req: IncomingMessage
): Promise<
  Awaited<
    ReturnType<
      typeof generateButton | typeof getCheckoutSession | typeof notFoundHandler
    >
  >
> => {
  const body = await parseRequestBody(req);
  const params = new URLSearchParams(req.url?.replace(/^(.*)\?(.*)$/, "$2"));
  const method = req.method?.toLowerCase();

  if (method === "get" && req.url?.startsWith("/generate-button")) {
    return generateButton({ callbackUrl: params.get("callbackUrl") ?? "" });
  }

  if (method === "get" && req.url?.startsWith("/checkout-sessions")) {
    return getCheckoutSession({
      checkoutSessionId: params.get("checkoutSessionId") ?? "",
    });
  }

  return notFoundHandler();
};

const notFoundHandler = async () => ({ result: false });

const parseRequestBody = async (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      resolve(body ? JSON.parse(body) : {});
    });
  });
};

server.listen(4000);
