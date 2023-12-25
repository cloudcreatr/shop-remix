

interface env {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  STORE_ID: string;
}
interface AccessTokenResponse {
    access_token: string;
    expires_in: number;
    id_token: string;
    refresh_token: string;
  }

export async function AccessToken({ env, request }: { env: env; request: Request }) {
  const code = new URL(request.url).searchParams.get("code");
  const state = new URL(request.url).searchParams.get("state");

  
  if (code) {
    const clientId = env.CLIENT_ID;

    const body = new URLSearchParams();
    const clientSecret = env.CLIENT_SECRET;
    const credentials = btoa(`${clientId}:${clientSecret}`);

    body.append("grant_type", "authorization_code");
    body.append("client_id", clientId);
    body.append("redirect_uri", `https://shop.cloudcreatr.com/login`);
    body.append("code", code);

    console.log("auth", `Basic ${credentials}`);
    console.log("id", clientId, clientSecret);

    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36";

    const headers = {
      "content-type": "application/x-www-form-urlencoded",
      "User-Agent": userAgent,
      Origin: `https://shop.cloudcreatr.com/login`,
      "Authorization": `Basic ${credentials}`,
    };

    const tokenRequestUrl = `https://shopify.com/${env.STORE_ID}/auth/oauth/token`; // Token endpoint

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
    const { access_token, expires_in, id_token, refresh_token } =
      await response.json<AccessTokenResponse>();
    return {
      code,
      state,
      access_token,
      expires_in,
      id_token,
      refresh_token,
    };
  }
  return {
    code,
    state,
    access_token: "",
    expires_in: 0,
    id_token: "",
    refresh_token: "",
  };
}