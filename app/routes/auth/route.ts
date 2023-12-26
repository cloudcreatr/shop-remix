import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { commitSession, getSession } from "./session.server";
import { GetAuthCode } from "./RedirectCustomer.server";
import { AccessToken } from "./accessToken.server";
import { TokenExchange } from "./TokenExchange.server";

type env = {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  STORE_ID: string;
  REDIRECT_URI: string;
  LOGOUT_REDIRECT_URI: string;
};

export async function action({ request, context }: ActionFunctionArgs) {
  let env = context.env as env;
  return GetAuthCode({
    CLIENT_ID: env.CLIENT_ID,
    SHOP_ID: env.STORE_ID,
    request,
    REDIRECT_URL: env.REDIRECT_URI,
  });
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const code = new URL(request.url).searchParams.get("code");
  const state = new URL(request.url).searchParams.get("state");

  if (!code) throw new Response("No Code", { status: 400 });
  const session = await getSession(request.headers.get("Cookie"));
  if (state != session.get("state"))
    throw new Response("State does not match", { status: 400 });
  const verifier = session.get("verifier");

  const env = context.env as env;
  let token = await AccessToken({
    code,
    verifier: verifier || "",
    clientId: env.CLIENT_ID,
    clientSecret: env.CLIENT_SECRET,
    STORE_ID: env.STORE_ID,
    REDIRECT_URL: env.REDIRECT_URI,
  });

  let { access_token } = await TokenExchange({
    accessToken: token.access_token,
    clientId: env.CLIENT_ID,
    clientSecret: env.CLIENT_SECRET,
    STORE_ID: env.STORE_ID,
    REDIRECT_URL: env.REDIRECT_URI,
  });

  session.set("access_token", access_token);
  session.set("id_token", token.id_token);
  session.unset("state");
  session.unset("verifier");

  return redirect("/login", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
