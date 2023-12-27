import { logDevReady } from "@remix-run/cloudflare";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import {
  createCookie,
  createWorkersKVSessionStorage,
} from "@remix-run/cloudflare";

import * as build from "@remix-run/dev/server-build";

if (process.env.NODE_ENV === "development") {
  logDevReady(build);
}

type SessionData = {
  verifier: string;
  state: string;
  access_token: string;
  id_token: string;
};

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => {
    const sessionCookie = createCookie("__session", {
      domain: "cloudcreatr.com",
      httpOnly: true,
      maxAge: 7200,
      path: "/",
      sameSite: "lax",
      secrets: [
        "c32ba072c91c4a85c0ab982ed9cab0fc133e552e606aeee6c93d98d8a583f28a",
      ],
      secure: true,
    });

    const { getSession, commitSession, destroySession } =
      createWorkersKVSessionStorage<SessionData>({
        // The KV Namespace where you want to store sessions
        kv: context.env.SESSION_KV,
        cookie: sessionCookie,
      });

    return {
      env: context.env,
      getSession: (p) => getSession(p),
      commitSession: (p) => commitSession(p),
      destroySession: (p) => destroySession(p),
    };
  },
  mode: build.mode,
});
