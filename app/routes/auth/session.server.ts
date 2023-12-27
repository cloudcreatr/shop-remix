import {
  createCookie,
  createWorkersKVSessionStorage,
  createCookieSessionStorage,
} from "@remix-run/cloudflare"; // or cloudflare/deno

type SessionData = {
  verifier: string;
  state: string;
  access_token: string;
  id_token: string;
};

const sessionCookie = createCookie("__session", {
  domain: "cloudcreatr.com",
  httpOnly: true,
  maxAge: 7200,
  path: "/",
  sameSite: "lax",
  secrets: ["c32ba072c91c4a85c0ab982ed9cab0fc133e552e606aeee6c93d98d8a583f28a"],
  secure: true,
});

const { getSession, commitSession, destroySession } =
  createWorkersKVSessionStorage<SessionData>({
    // The KV Namespace where you want to store sessions
    kv: SESSION_KV,
    cookie: sessionCookie,
  });

// const { getSession, commitSession, destroySession } =
//   createCookieSessionStorage<SessionData>({
//     cookie: {
//       name: "__session",
//       domain: "cloudcreatr.com",

//       httpOnly: true,
//       maxAge: 7200,
//       path: "/",
//       sameSite: "lax",
//       secrets: [
//         "c32ba072c91c4a85c0ab982ed9cab0fc133e552e606aeee6c93d98d8a583f28a",
//       ],
//       secure: true,
//     },
//   });

export { getSession, commitSession, destroySession };
