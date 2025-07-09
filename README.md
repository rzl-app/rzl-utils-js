<div align="center">
  <h1><strong>⚡️ Packages <code>rzl-utils-js</code> 🚀</strong></h1>
</div>

<p align="center">
🚀 <strong>Rzl Utility JavaScript</strong> 🚀<br/>
A lightweight, modern TypeScript utility library for Node.js & browser.<br/>
Provides reusable helpers to simplify your JavaScript / TypeScript projects.<br/>
<strong>Built with ❤️ by <a href="https://github.com/rzl-app">@rzl-app</a>.</strong>
</p>

<div align="center">

[![Latest Version on NPM](https://img.shields.io/npm/v/rzl-utils-js?color=blue&style=flat-rounded)](https://npmjs.com/package/rzl-utils-js)
[![downloads](https://img.shields.io/npm/dt/rzl-utils-js?style=flat-rounded)](https://npmjs.com/package/rzl-utils-js)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.17.0-blue.svg?logo=node.js&style=flat-square)](https://nodejs.org/en/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/rzl-app/rzl-utils-js/blob/main/CONTRIBUTING.md)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/rzl-app/rzl-utils-js/blob/main/LICENSE.md)
[![GitHub](https://img.shields.io/badge/GitHub-rzl--app%2Frzl--utils--js-181717?logo=github)](https://github.com/rzl-app/rzl-utils-js)
[![Repo on GitHub](https://img.shields.io/badge/Repo-on%20GitHub-181717?logo=github&style=flat-rounded)](https://github.com/rzl-app)

</div>

---

## 📚 Table of Contents

- 💻 [Requirements](#requirements)
- ⚙️ [Installation](#installation)
- ✨ [Features](#features)
- 🧬 [NextJS Support](#nextjs-support)
- 🔥 [Usage](#usage)
- ❤️ [Sponsor](#sponsor-this-package)
- 📜 [Changelog](#changelog)
- 🤝 [Contributing](#contributing)
- 🛡 [Security](#security)
- 🙌 [Credits](#credits)
- 📄 [License](#license)

---

<h2 id="requirements">💻 Requirements</h2>

- **Node.js >=18.17.0**  
  This package leverages modern JavaScript & TypeScript features that require Node.js version 18.17.0 or higher.

- Works with:
  - ✅ Node.js (18.17.0+)
  - ✅ Modern browsers (via bundlers like Webpack / Vite)

---

<h2 id="installation">⚙️ Installation</h2>

#### With NPM

```bash
  npm install rzl-utils-js
```

#### With Yarn

```bash
  yarn add rzl-utils-js
```

#### With PNPM

```bash
  pnpm add rzl-utils-js
```

---

<h2 id="features">✨ Features</h2>

- 🚀 Written in **TypeScript** — fully typed & safe
- ⚡ Small, tree-shakable & fast
- 📦 Works in **Node.js** & modern browsers
- ❤️ Simple API, easy to extend
- 🧬 Next.js Support

---

<h2 id="nextjs-support">🧬 Next.js Support</h2>

This package also provides utilities specially built for Next.js environments, neatly separated into their own entry points:

- `rzl-utils-js/next`  
   Helpers for building URLs, generating dynamic routes, reading environment variables, etc.  
   ✅ Safe to use in both Next.js pages & API routes.

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

  ***

- `rzl-utils-js/next/server`  
  Utilities meant to run in Next.js server-only contexts (like middleware or server actions) for tasks such as extracting real client IPs.  
  ⚠️ Will throw if used outside a Next.js server environment.

  #### 🚀 Server-only Helpers (Next.js)

  | <small>Function / Type </small>                            | <small>What it does</small>                                                                                                                                                                                               | <small>Reads / Validates</small>                                                                                                                                     | <small>Example Output</small>                                |
  | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
  | <small>`getClientIpOrUrl(request, includeFullUrl)`</small> | <small>Extracts the real client IP from `x-forwarded-for`, normalizes IPv6, optionally builds full URL using `x-forwarded-proto` & `x-forwarded-port`. Designed for **Next.js middleware / server actions** only.</small> | <small>✅ Checks `NextRequest` instance<br>✅ Reads `x-forwarded-for`, `x-forwarded-proto`, `x-forwarded-port`<br>✅ Validates `boolean` on `includeFullUrl`</small> | <small>`"127.0.0.1"`<br>or `"http://127.0.0.1:3000"`</small> |

  #### ⚡ Example for `"rzl-utils-js/next/server"`: Server-only helpers (middleware/server-action)

  ```ts
  import { NextRequest } from "next/server";
  import { getClientIpOrUrl } from "rzl-utils-js/next/server";

  export function middleware(request: NextRequest) {
    console.log(getClientIpOrUrl(request)); // full URL
    console.log(getClientIpOrUrl(request, false)); // IP only
    return new Response("OK");
  }
  ```

  #### ⚠️ Important:

  If you run this outside of a Next.js environment (like plain Node.js or in non-Next projects), you might see errors such as:

  ```js
    Error: Cannot find module 'next/server'
    // or:
    Could not resolve "next/server"
  ```

---

<h2 id="usage">🔥 Usage</h2>

#### Easy to use, just import on your code base.

##### Example Function Import:

```ts
import { isServer } from "rzl-utils-js";

console.log(isServer);
// true if running on Node.js, false if browser
```

##### Example TypeScript Helper Import:

```ts
import type { OmitStrict } from "rzl-utils-js/types";

type MyType = OmitStrict<OtherType, "omitedProps">;
// Fully strict TS omit that requires all keys to exist in target
```

---

<h2 id="sponsor-this-package">❤️ Sponsor this package</h2>

Help support development:  
[👉 Become a sponsor](https://github.com/sponsors/rzl-app)

---

<h2 id="changelog">📝 Changelog</h2>

See [CHANGELOG](CHANGELOG.md).

---

<h2 id="contributing">🤝 Contributing</h2>

See [CONTRIBUTING](CONTRIBUTING.md).

---

<h2 id="security">🛡 Security</h2>

Please report issues to [rizalvindwiky1998@gmail.com](mailto:rizalvindwiky1998@gmail.com).

---

<h2 id="credits">🙌 Credits</h2>

- [Rzl App](https://github.com/rzl-app)
- [All Contributors](../../contributors)

---

<h2 id="license">📜 License</h2>

The MIT License (MIT).  
Please see [License File](LICENSE.md) for more information.

---

✅ **Enjoy using `rzl-utils-js`?**  
Star this repo ⭐ and share it with other JavaScript developers!

---
