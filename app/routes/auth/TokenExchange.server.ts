export interface TokenExchangeResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
}

interface TokenExchangeInput {
  accessToken: string;
  clientId: string;
  clientSecret: string;
  STORE_ID: string;
  REDIRECT_URL: string;
}

export async function TokenExchange({
  accessToken,
  clientId,
  clientSecret,
  STORE_ID,
  REDIRECT_URL,
}: TokenExchangeInput): Promise<TokenExchangeResponse> {
  const body = new URLSearchParams();

  const credentials = btoa(`${clientId}:${clientSecret}`);

  body.append("grant_type", "urn:ietf:params:oauth:grant-type:token-exchange");
  body.append("client_id", clientId);
  body.append("redirect_uri", REDIRECT_URL);
  body.append("subject_token", accessToken);
  body.append(
    "subject_token_type",
    "urn:ietf:params:oauth:token-type:access_token"
  );
  body.append("scopes", "https://api.customers.com/auth/customer.graphql");
  body.append("audience", "30243aa5-17c1-465a-8493-944bcc4e88aa");

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

  return await response.json<TokenExchangeResponse>();
}
