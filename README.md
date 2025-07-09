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
- 💎 [Detailed Features](#detailed-features)
  - [Checker](#detailed-features--checker)
  - [Conversion](#detailed-features--conversion)
    - [Conversion Array](#detailed-features--conversion-array)
    - [Currency](#detailed-features--conversion-currency)
    - [Json](#detailed-features--conversion-json)
    - [Number](#detailed-features--conversion-number)
    - [Object](#detailed-features--conversion-object)
    - [Stringify](#detailed-features--conversion-stringify)
    - [Strings](#detailed-features--conversion-strings)
    - [Boolean](#detailed-features--conversion-boolean)
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
- 🧬 **Next.js support**: helpers for dynamic routes, building URLs, reading env, extracting client IP
- 🛠 Additional TypeScript types: `OmitStrict`, `PartialByKeys`, etc.

---

<h2 id="nextjs-support">🧬 Next.js Support</h2>

This package also provides utilities specially built for Next.js environments, neatly separated into their own entry points:

- <h3 id="nextjs-support--globals">`rzl-utils-js/next`</h3>  
  Helpers for building URLs, generating dynamic routes, reading environment variables, etc.  
  ✅ Safe to use in both Next.js pages & API routes.

  [Read More Docs](docs/next-js/global.md)

  ***

- <h3 id="nextjs-support--server-only">`rzl-utils-js/next/server`</h3>   
  Utilities meant to run in Next.js server-only contexts (like middleware or server actions) for tasks such as extracting real client IPs.  
  ⚠️ Will throw if used outside a Next.js server environment.

  [Read More Docs](docs/next-js/server-only.md)

---

<h2 id="detailed-features">💎 Detailed Features</h2>

  - <h3 id="detailed-features--checker">
    Checker - 
    <a href="/docs/detailed-features/checker.md">
      Read More Docs.
    </a> 
    </h3> 
    
    ***

  - <h3 id="detailed-features--conversion">Conversion</h3>  

    - <h4 id="detailed-features--conversion-array">
        Array -
        <a href="/docs/detailed-features/conversion/array.md">
          Read More Docs.
        </a> 
      </h4>

      ***
    - <h4 id="detailed-features--conversion-currency">Currency - 
        <a href="/docs/detailed-features/conversion/currency.md">
          Read More Docs.
        </a> 
      </h4> 

      ***
    - <h4 id="detailed-features--conversion-json">
      Json - 
      <a href="/docs/detailed-features/conversion/json.md">
        Read More Docs.
      </a> 
    </h4> 

     
    - <h4 id="detailed-features--conversion-number">
        Number - 
        <a href="/docs/detailed-features/conversion/number.md">
          Read More Docs.
        </a> 
      </h4> 
      
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
