import http, { IncomingMessage, ServerResponse } from "http";

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
  const params = await getParams(req);

  if (req.method === "get" && req.url === "/generate-button") {
    return generateButton(params);
  }

  return notFoundHandler();
};

const notFoundHandler = () => ({ result: false });

const getParams = async (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      resolve(body);
    });
  });
};

server.listen(4000);
