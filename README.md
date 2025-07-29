## Introduction

<h3>THE DEVFLOW PROJECT</h3>

This is a `Learning Project` from [JSMastery](https://jsmastery.com/) - All resources are provided as follows:

- Design: https://www.figma.com/design/2vtjgodtBxTdg0zOUHPvXh/JSM-Pro---DevOverflow?node-id=1-49&p=f&t=pSJTuQhCiICF03is-0

- Assets: [Resources](https://github.com/hungnguyen0545/dev-flow/tree/main/public)

- Database Schema: [Schema](https://www.mermaidchart.com/raw/c536cd1d-4449-4b13-ab26-6eff83763267?theme=light&version=v0.1&format=svg)

## Tech Stack

- [Next.js](https://nextjs.org/)

- [React](https://react.dev/)

- [NextAuth](https://authjs.dev/)

- [MongoDB](https://www.mongodb.com/)

- [TypeScript](https://www.typescriptlang.org/)

- [ShadCN UI](https://ui.shadcn.com/)

- [TailwindCSS](https://tailwindcss.com/)

- [React Hook Form](https://react-hook-form.com)

- [Zod](https://zod.dev/)

- [Husky](https://github.com/hungnguyen0545/dev-flow/blob/main/documents/Husky_Security.md)

## Quick Start

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
Follow these steps to set up the project locally on your machine.

<b>Prerequisites</b>

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm(Node Package Manager)](https://www.npmjs.com/)

<b>Set Up Environment Variables</b>

```bash
git clone git@github.com:hungnguyen0545/.git
cd dev-flow
```

<b>Installation</b>

```bash
npm install
```

<b>Set Up Environment Variables</b>
Create a new file named .env in the root of your project and add the following content:

```bash
# Mongodb
MONGODB_URI=

# OpenAI
OPENAI_API_KEY=

# Rapid API
NEXT_PUBLIC_RAPID_API_KEY=

# Auth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_SECRET=
NEXTAUTH_URL=

# Tiny Editor
NEXT_PUBLIC_TINY_EDITOR_API_KEY=

NEXT_PUBLIC_SERVER_URL=

NODE_ENV=
```

Replace the placeholder values with your actual credentials. You can obtain these credentials by signing up on the respective websites

<b>Running the Project</b>

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ------------- Detail Setups ------------------

## ESlint & Prettier Setup

<b>Step 1/ Install necessary packages:</b>

- Used for config eslint to make code more standard

```bash
npm install eslint-config-standard --legacy-peer-deps
#and
npm install eslint-plugin-n eslint-plugin-promise --legacy-peer-deps
```

<i> <b>NOTE:</b> --legacy-peer-deps: resolve mismatch version between eslint and some packages in source</i>

- Used for auto save by prettier and following eslint rules

```bash
npm install eslint-config-prettier --legacy-peer-deps
#and
npm install prettier --legacy-peer-deps
```

- Used for auto save import by order

```bash
npm i eslint-plugin-import --save-dev --legacy-peer-deps
```

<b>Step 2/ Config files: </b>

- Config Workspace Settings (vscode/settings.json)

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.addMissingImports": "explicit"
  },
  "prettier.tabWidth": 2,
  "prettier.useTabs": false,
  "prettier.semi": true,
  "prettier.singleQuote": false,
  "prettier.jsxSingleQuote": false,
  "prettier.trailingComma": "es5",
  "prettier.arrowParens": "always",
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

- Config EsLint (eslint.config.mjs)

```js
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "standard",
    "plugin:tailwindcss/recommended",
    "prettier"
  ),
  {
    rules: {
      "no-undef": "off",
    },
  },
];
```

<b>Step 3/ Install extensions & Reload</b>

- Install: Eslint, Prettier for Eslint, and Prettier
- After installed, Reload VSCode and Done.

## TailwindCSS & ShadUI & Font Setup

<b>TailwindCSS</b>

- [Documentation & Installation](https://tailwindcss.com/docs/installation/using-vite)
- With version 4 and above, all config & setup of TailwindCSS will add on [global.css](https://github.com/hungnguyen0545/dev-flow/blob/main/app/globals.css) file instead of tailwind.config.js file.

<b>ShadCN/UI</b>

- [Documentation & Installation](https://ui.shadcn.com/docs/installation/next)
- It is a <i>component library</i>. It is more like a design system starter kit, not a full npm library.
- Note: To use `utility classes` for theming set `tailwind.cssVariables` to `false` in your `components.json` file - that was created after init ShadCN.

<b>Fonts</b>

- Use `next/font/google` can automatically self-host any Google Font.

```ts
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  variable: "--font-roboto",
  weight: '400',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
```

- Use `next/font/local` specify the src of your local font file. Fonts can be stored in the public folder or co-located inside the app folder.

```ts
import localFont from 'next/font/local'

const myFont = localFont({
  src: './my-font.woff2',
  variable: '--font-myFont'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${myFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
```

## Assets & Metadata Setup

<b>Assets</b>

- Save all assets such as: images, icons, svg, favicon, metadata informations..., in [public](https://github.com/hungnguyen0545/dev-flow/tree/main/public) file.

<b>Metadata<b>

- Update static Metadata with `metadata` object

```js
export const metadata: Metadata = {
  title: "Dev Overflow",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  icons: {
    icon: "/images/site-logo.svg",
  },
};
```

- <b>Note:</b> <i>If you add Metadata Information in layout.js is default, and it will specific when add it in each page</i>

- Update dynamic Metadata with `generateMetadata`

```ts
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const { id } = await params;

  // fetch data
  const product = await fetch(`https://.../${id}`).then((res) => res.json());

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.title,
    openGraph: {
      images: ["/some-specific-page-image.jpg", ...previousImages],
    },
  };
}

export default function Page({ params, searchParams }: Props) {}
```

## Next-Theme Setup

- Purpose: To config theme toggler ( on/off `Dark Mode` )

<b>Step 1/ Install next-themes</b>

- [Documentation & Installation](https://www.npmjs.com/package/next-themes)

```bash
npm install next-themes
```

<b>Step 2/ Create Theme Provider </b>

```ts
"use client";

import {
  ThemeProvider as NextThemeProvider,
  ThemeProviderProps,
} from "next-themes";
import React from "react";

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
};

export default ThemeProvider;
```

<b>Step 3/ Wrap your Root layout</b>

```html
<html lang="en" suppressHydrationWarning>
  <body suppressHydrationWarning>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  </body>
</html>
```

- <b>Note:</b> If you do not add `suppressHydrationWarning` to your `<html>` you will get warnings because `next-themes` updates that element. This property only applies `one level deep`, so it won't block hydration warnings on other elements.

<b>Step 4/ Add mode toggle</b>

- Get toggle button from [ShadCN](https://ui.shadcn.com/docs/dark-mode/next#install-next-themes)

## Issues

<h3><i>Hydration</i></h3>

- 1/ What is Hydration?
  - `Hydration` is the process where React takes over the `static HTML` sent from the `server` and makes it interactive on the client side.

  - A `hydration` issue happens when the` HTML rendered on the server` is `different` from what React tries to render on the client. This mismatch causes warnings or bugs.

- 2/ Why does it happen?
  - ❌ Using random values (e.g. Math.random(), Date.now()) during server render
  - ❌ Accessing window or document on the server
  - ❌ Rendering different UI based on client-only state (`Often`)

- 3/ How to Fit It?
  - Move client-only logic into useEffect (runs only on the client)

  ```ts
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(Date.now());
  }, []);
  ```

  - Avoid dynamic values in server-rendered output
  - Use conditional rendering

  ```ts
  const isClient = typeof window !== "undefined";
  ```

<h3><i>Mismatch version between packages</i></h3>

- Happens When: You or one of your dependencies expects one version of a package…but a different version is installed.

- Types of Mismatches:
  - Peer dependency mismatch: Library expects a version of React that differs from yours
    - Ex: next-themes needs React 18, you use 19
  - Hard dependency mismatch: Two packages require conflicting versions of the same sub-package
    - Ex: A wants lodash@4, B wants lodash@3
  - Transitive mismatch: a sub-dependency version is incompatible
  - Ex: next > postcss conflict

- How to fix it?
  - Use `--legacy-peer-deps`: Bypass errors in npm install (not recommended long-term)

    ```bash
    npm install next-themes --legacy-peer-deps
    ```

  - Use `packageManager` & `overrides`
    - With `packageManager`: it declares required package manager & version, lock down your toolchain and avoid mysterious “`install failed`” errors due to version mismatches. You should check `Node.js Compatibility` and the `Packages Compatibility` to find the right version

    - With `overrides`: lets you force specific versions of dependencies or sub-dependencies, even if their original package asked for a different one

    - Ex: In `package.json` file:

    ```bash
    "packageManager": "npm@10.7.0",
    "overrides": {
      "react": "$react",
      "react-dom": "$react-dom",
      "tailwindcss": "$tailwindcss",
      "eslint": "$eslint",
      "eslint-config-standard": "$eslint-config-standard",
      "eslint-plugin-n": "$eslint-plugin-n",
      "eslint-plugin-promise": "$eslint-plugin-promise",
      "eslint-plugin-tailwindcss": "$eslint-plugin-tailwindcss"
    }
    ```
