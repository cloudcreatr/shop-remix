export interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
}

interface AccessTokenInput {
  code: string;
  verifier: string;
  clientId: string;
  clientSecret: string;
  STORE_ID: string;
  REDIRECT_URL: string;
}

export async function AccessToken({
  code,
  verifier,
  clientId,
  clientSecret,
  STORE_ID,
  REDIRECT_URL,
}: AccessTokenInput): Promise<AccessTokenResponse> {
  const body = new URLSearchParams();

  const credentials = btoa(`${clientId}:${clientSecret}`);

  body.append("grant_type", "authorization_code");
  body.append("client_id", clientId);
  body.append("redirect_uri", REDIRECT_URL);
  body.append("code", code);
  body.append("code_verifier", verifier);

  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${credentials}`,
  };

  const tokenRequestUrl = `https://shopify.com/${STORE_ID}/auth/oauth/token`; // Token endpoint

  const response = await fetch(tokenRequestUrl, {
    method: "POST",
    headers,
    body,
  });
  if (!response.ok) {
    throw new Response(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }

  return await response.json<AccessTokenResponse>();
}
