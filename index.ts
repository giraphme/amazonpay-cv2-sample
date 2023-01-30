import http, { IncomingMessage, ServerResponse } from "http";
import dotenv from "dotenv";
dotenv.config();

import { generateButton } from "./generateButton";

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
): Promise<ReturnType<typeof generateButton | typeof notFoundHandler>> => {
  const body = await parseRequestBody(req);
  const params = new URLSearchParams(req.url?.replace(/^(.*)\?(.*)$/, "$2"));
  const method = req.method?.toLowerCase();

  if (method === "get" && req.url?.startsWith("/generate-button")) {
    return generateButton({ callbackUrl: params.get("callbackUrl") ?? "" });
  }

  return notFoundHandler();
};

const notFoundHandler = () => ({ result: false });

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
