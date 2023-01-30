import http, { IncomingMessage, ServerResponse } from "http";

import { generateButton } from "./generateButton";

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");
    const result = handleRequest(req);
    res.end(JSON.stringify(result));
  }
);

const handleRequest = (
  req: IncomingMessage
): ReturnType<typeof generateButton | typeof notFoundHandler> => {
  if (req.method === "get" && req.url === "/generate-button") {
    return generateButton();
  }

  return notFoundHandler();
};

const notFoundHandler = () => ({ result: false });

server.listen(4000);
