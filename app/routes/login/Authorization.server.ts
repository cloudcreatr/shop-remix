import { redirect } from "@remix-run/cloudflare";
export async function gettoken({
  CLIENT_ID,
  
  SHOP_ID,
}: {
  CLIENT_ID: string;
  
  SHOP_ID: string;
}) {

  
  const loginUrl = new URL(`https://shopify.com/${SHOP_ID}/auth/oauth/authorize`); // Authorize Endpoint goes here

  loginUrl.searchParams.set('client_id', CLIENT_ID);
  loginUrl.searchParams.append('response_type', 'code');
  loginUrl.searchParams.append('redirect_uri', "https://shop.cloudcreatr.com/login");
  loginUrl.searchParams.set(
    'scope',
    'openid email https://api.customers.com/auth/customer.graphql',
  );
  //  const verifier = await generateCodeVerifier();
  // const challenge = await generateCodeChallenge(verifier);
  // 	loginUrl.searchParams.append('code_challenge', challenge);
  // loginUrl.searchParams.append('code_challenge_method', 'S256');
	 const state = await generateRandomString()
  // const nonce = await generateRandomString()

  

  loginUrl.searchParams.append('state', state);
  // loginUrl.searchParams.append('nonce', nonce);

  return redirect(loginUrl.toString());

}

function getNonce(token: string) {
  return decodeJwt(token).payload.nonce;
}

function decodeJwt(token: string) {
  const [header, payload, signature] = token.split('.');

  const decodedHeader = JSON.parse(atob(header));
  const decodedPayload = JSON.parse(atob(payload));

  return {
    header: decodedHeader,
    payload: decodedPayload,
    signature,
  };
}


export async function generateRandomString(): Promise<string> {
  const timestamp = Date.now().toString();
  const randomString = Math.random().toString(36).substring(2);
  return timestamp + randomString;
}

export async function generateCodeVerifier() {
  const rando = generateRandomCode();
  return base64UrlEncode(rando);
}
export async function generateCodeChallenge(codeVerifier: string) {
  const digestOp = await crypto.subtle.digest(
    {name: 'SHA-256'},
    new TextEncoder().encode(codeVerifier),
  );
  const hash = convertBufferToString(digestOp);
  return base64UrlEncode(hash);
}
function generateRandomCode() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return String.fromCharCode.apply(null, Array.from(array));
}
function base64UrlEncode(str: string) {
  const base64 = btoa(str);
  // This is to ensure that the encoding does not have +, /, or = characters in it.
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
function convertBufferToString(hash: ArrayBuffer) {
  const uintArray = new Uint8Array(hash);
  const numberArray = Array.from(uintArray);
  return String.fromCharCode(...numberArray);
}