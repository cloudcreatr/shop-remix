import { Form } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/react";

interface env {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  STORE_ID: string;
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  return json({
    message: "hello world",
  });
}

export default function page() {
  return (
    <div>
      <h1>login</h1>
      <Form method="post" action="/auth">
        <button type="submit">Login</button>
      </Form>
      <Form method="post" action="/logout">
        <button type="submit">Logout</button>
      </Form>
    </div>
  );
}
