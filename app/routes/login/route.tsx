import { gettoken } from "./Authorization.server";
import { AccessToken } from "./accessToken.server";
import { Form } from "@remix-run/react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { useLoaderData, json } from "@remix-run/react";

interface env {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  STORE_ID: string;
}

export async function loader({ request, context }: LoaderFunctionArgs) {

  const access_token = AccessToken({ context.env, request });
  return json(access_token);
  }


export async function action({ context }: ActionFunctionArgs) {
  let env = context.env as env;
  return gettoken({
    CLIENT_ID: env.CLIENT_ID,
    SHOP_ID: env.STORE_ID,
  });
}

export default function page() {
  let { code, state, access_token, expires_in, id_token, refresh_token } =
    useLoaderData();
  return (
    <div>
      <h1>login</h1>
      <Form method="post">
        <button type="submit">Login</button>
      </Form>
      <p>{code}</p>
      <p>{state}</p>
      <p>{access_token}</p>
      <p>{expires_in}</p>
      <p>{id_token}</p>
      <p>{refresh_token}</p>
    </div>
  );
}
