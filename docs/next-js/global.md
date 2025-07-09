### Docs `rzl-utils-js/next`   
  
  #### 🚀 Next.js Helper Summary

  | <small>Function / Type </small>          | <small>What it does</small>                                                                                                                                        | <small>Reads / Validates</small>                                                                | <small>Example Output</small>                                           |
  | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
  | <small>getBaseUrl()</small>              | <small>Get frontend base URL from `NEXT_PUBLIC_BASE_URL` (defaults to `http://localhost:3000`), appends FE port if needed, normalizes URL.</small>                 | <small>✅ `NEXT_PUBLIC_BASE_URL`<br>✅ `NEXT_PUBLIC_PORT_FE`</small>                            | <small>`"http://localhost:3000"`</small>                                |
  | <small>getBackendApiUrl(options)</small> | <small>Get backend API base URL from `NEXT_PUBLIC_BACKEND_API_URL` (defaults to `http://localhost:8000`), appends BE port, plus optional `options.suffix`.</small> | <small>✅ `NEXT_PUBLIC_BACKEND_API_URL`<br>✅ `NEXT_PUBLIC_PORT_BE`</small>                     | <small>`"http://localhost:8000/api"`</small>                            |
  | <small>getBackendApiEndpoint()</small>   | <small>Build full endpoint URL combining `getBackendApiUrl` + prefix (`/api` by default) + pathname, can exclude origin.</small>                                   | <small>✅ Prefix (`/api`)<br>✅ Normalizes duplicate slashes<br>✅ Boolean `withOrigin`</small> | <small>`"http://localhost:8000/api/users"`<br>or `"/api/users"`</small> |
  | <small>generateRoute()</small>           | <small>Generates URL from dynamic Next.js route (`/post/[id]`) with params object. Validates missing, empty & invalid chars.</small>                               | <small>✅ Params cleaned strings<br>❌ Invalid: `? & # = / space ' " ( ) + ; % @ :`</small>     | <small>`"/post/123"`</small>                                            |
  | <small>ExtractRouteParams<T></small>     | <small>Type helper: extracts `[param]` from string into `{ param: string }`. Recursive.</small>                                                                    | <small>⚡️ Pure TS type — compile time only</small>                                             | <small>`{ id: string }`</small>                                         |
  | <small>HasDynamicSegments<T></small>     | <small>Type helper: checks if string contains `[param]`.</small>                                                                                                   | <small>⚡️ Pure TS type — compile time only</small>                                             | <small>`true` / `false`</small>                                         |

  #### ✨ Example for `"rzl-utils-js/next"`: Dynamic route & URL helpers (Next.js)

  ```ts
  import {
    getBaseUrl,
    getBackendApiUrl,
    getBackendApiEndpoint,
    generateRoute,
  } from "rzl-utils-js/next";

  console.log(getBaseUrl());
  // -> "http://localhost:3000"

  console.log(getBackendApiUrl({ suffix: "/v1" }));
  // -> "http://localhost:8000/v1"

  console.log(getBackendApiEndpoint("/users"));
  // -> "http://localhost:8000/api/users"

  console.log(generateRoute("/post/[id]", { id: "123" }));
  // -> "/post/123"
  ```
---

[Back](https://github.com/rzl-app/rzl-utils-js?tab=readme-ov-file#nextjs-support--globals)

---
