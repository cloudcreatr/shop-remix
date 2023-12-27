import {
  json,
  LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";

import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

interface LoaderData {
  accesstoken: string;
}

export async function loader({ context, request }: LoaderFunctionArgs) {
  const start = performance.now();
  const session = await context.getSession(request.headers.get("Cookie"));
  const end = performance.now();
  console.log("session", { session });
  console.log(`session took ${end - start} milliseconds.`);
  return json<LoaderData>({
    accesstoken: session.has("access_token")
      ? session.get("access_token")!
      : "no token",
  });
}

export default function Index() {
  const { accesstoken } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
          <p> {accesstoken}</p>
        </li>
      </ul>
    </div>
  );
}
