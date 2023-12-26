import { Form, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/react";
import { getSession } from "../auth/session.server";

interface env {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  STORE_ID: string;
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return json({
    accesstoken: session.get("access_token"),
    idtoken: session.get("id_token"),
    state: session.get("state"),
    verifier: session.get("verifier"),
  });
}

export default function page() {
  const { accesstoken, idtoken, state, verifier } = useLoaderData();
  return (
    <div>
      <h1>login</h1>
      <Form method="post" action="/auth">
        <button type="submit">Login</button>
      </Form>
      <Form method="post" action="/logout">
        <button type="submit">Logout</button>
      </Form>
      <p>{accesstoken}</p>
      <p>{idtoken}</p>
      <p>{state}</p>
      <p>{verifier}</p>
    </div>
  );
}
