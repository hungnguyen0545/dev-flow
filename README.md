This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

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

## TailwindCSS & Font Setup

<b>TailwindCSS</b>

- With version 4 and above, all config & setup of TailwindCSS will add on [`global.css`] (https://github.com/hungnguyen0545/dev-flow/blob/main/app/globals.css) file instead of tailwind.config.js file.

<b>Fonts</b>

- Two main ways to import fonts into source:
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

- Save all assets such as: images, icons, svg, favicon, metadata informations..., in [`public`] (https://github.com/hungnguyen0545/dev-flow/tree/main/public) file.

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

- <i><b>Note:</b> If you add Metadata Information in layout.js is default, and it will specific when add it in each page</i>

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
