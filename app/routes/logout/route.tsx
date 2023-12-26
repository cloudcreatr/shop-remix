import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import {
  getSession,
  commitSession,
  destroySession,
} from "../auth/session.server";

export async function action({ request, context }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("id_token")) {
    return redirect("/");
  }

  const id_token = session.get("id_token");
  session.unset("id_token");
  session.unset("access_token");

  const url = new URL(
    `https://shopify.com/${context.env.STORE_ID}/auth/logout`
  );
  url.searchParams.set("id_token_hint", id_token);
  url.searchParams.set(
    "post_logout_redirect_uri",
    context.env.LOGOUT_REDIRECT_URI
  );
  return redirect(url.toString(), {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
