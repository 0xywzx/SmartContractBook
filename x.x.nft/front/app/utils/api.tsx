import { Content, Session } from "../types/types";

export const createSession = async () => {
  const response = await fetch("/api/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch session");
  };

  const data = await response.json() as Session;

  return data;
}

export const readContent = async (
  tokenIndex: number,
  chainId: number,
  sessionId: string,
  signature: string
) => {
  const params = new URLSearchParams();
  params.append("tokenIndex", String(tokenIndex));
  params.append("chainId", String(chainId));
  params.append("sessionId", sessionId);
  params.append("signature", signature);

  const response = await fetch(`/api/content?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!response.ok) {
    throw new Error("Does not have permission to access the content");
  };

  const data = await response.json() as Content;

  return data;
}