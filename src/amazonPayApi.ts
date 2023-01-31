import crypto from "node:crypto";
import fs from "node:fs";
import fetch from "node-fetch";

type RequestParams = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: string;
  requestBody?: string;
};

const API_ENVIRONMENT = "sandbox";
const API_VERSION = "v2";
// 署名で使うので分離する。
// API ドキュメントでは
// https://pay-api.amazon.jp/:environment/:version
// となっているが、 PublicKeyId が SANDBOX- で始まっている場合には :environment をつけてはいけない。
const API_BASE_PATH = `/${API_VERSION}`;
// ドメインが .jp である点に注意（ドキュメントでは .com になっている場合がある）
const API_BASE_URL = `https://pay-api.amazon.jp`;

export const request = async ({
  method,
  path: relativePath,
  query,
  requestBody,
}: RequestParams) => {
  const requestAtStr = getRequestedAt();
  const headers = {
    accept: "application/json",
    "content-type": "application/json",
    "x-amz-pay-date": requestAtStr,
  };
  const path = `${API_BASE_PATH}${relativePath}`;
  const url = `${API_BASE_URL}${path}`;
  const authorization = generateAuthorizationToken({
    method,
    path,
    query,
    requestBody,
    headers,
  });

  return (
    await fetch(url, {
      method,
      headers: { ...headers, authorization },
    })
  ).json();
};

const getRequestedAt = (): string => {
  const now = new Date();

  // ミリ秒を消す
  // 2023-01-31T00:44:56Z
  return `${now.toISOString().split(".")[0]}Z`;
};

type AuthorizationTokenParams = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: string;
  requestBody?: string;
  headers: Record<string, string>;
};

const algorithm = "AMZN-PAY-RSASSA-PSS";
const privateKey = fs.readFileSync("./private.pem");

// https://developer.amazon.com/ja/docs/amazon-pay-api-v2/signing-requests.html
export const generateAuthorizationToken = ({
  method,
  path,
  query,
  requestBody,
  headers,
}: AuthorizationTokenParams): string => {
  const signedHeaders = Object.entries(headers)
    .map(([key, _]) => key)
    .sort()
    .join(";");
  const canonicalRequest = [
    method.toUpperCase(),
    path,
    query ?? "",
    ...Object.entries(headers)
      .map(([key, value]) => `${key.toLowerCase()}:${value}`)
      .sort(),
    "",
    signedHeaders,
    crypto
      .createHash("sha256")
      .update(requestBody ?? "")
      .digest("hex"),
  ].join("\n");

  const stringToSign = `${algorithm}\n${crypto
    .createHash("sha256")
    .update(canonicalRequest)
    .digest("hex")}`;

  const signature = sign(stringToSign);

  return `${algorithm} ${[
    ["PublicKeyId", process.env.AMAZON_PAY_PUBLIC_KEY_ID],
    ["SignedHeaders", signedHeaders],
    ["Signature", signature],
  ]
    .map((row) => row.join("="))
    .join(", ")}`;
};

const sign = (stringToSign: string): string => {
  const s = crypto.createSign("RSA-SHA256").update(stringToSign);

  return s.sign(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      saltLength: 20,
    },
    "base64"
  );
};
