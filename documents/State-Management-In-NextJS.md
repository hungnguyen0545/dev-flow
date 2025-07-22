## State Management In NextJS

- With NextJs, Using those libraries or methods like: `ContextAPI`, `Redux`,... and others are all `hook-based patterns` in Next.js would `turn component` into a `client-side component`. This goes `against` the core of Next.js and its `server-side capabilities`.

<b>💡 Why can’t we use Hooks on the server side?</b>

- React hooks `rely on the component lifecycle`, which is specific to the client-side rendering environment.

- Hooks like useState, useEffect, or any other `aren't available on the server` because they `interact with the DOM`, which doesn't exist on the server.

- However, you can simulate some hook behavior on the server using libraries like `react-dom/server`, but it's not the same as client-side hooks.

<h3>Overall URL</h3>
A URL (Uniform Resource Locator) with parameters typically consists of several components:

- 1/ `Scheme`: Specifies the protocol used to access the resource, such as `http:// or https://`.

- 2/ `Domain`: The `domain name` or `IP address` of the server hosting the resource.

- 3/ `Port`: (Optional) Specifies the `port number` to which the request should be sent. Default ports are often omitted (e.g., port `80 for HTTP`, port `443 for HTTPS`).

- 4/ `Path`: The specific resource or endpoint on the server, typically `represented as a series of directories and filenames`.

- 5/ `Query Parameters`: (Also known as `searchParams` in Next.js) Additional data sent to the server as part of the request, typically u`sed for filtering or modifying` the requested resource. Query parameters are` appended to the URL after` a question mark `"?"` and separated by ampersands `"&"`
  - For example: ?param1=value1&param2=value2

- 6/ `Fragment`: (Optional) Specifies a specific section within the requested resource, often used in web pages to `navigate to a particular section`. It is indicated by a hash `"#" followed by the fragment identifier` -- often used for scolling to specific section.
  - For example: ?param1=value1&param2=value2#introduction

<h3>URL State Management</h3>

- Lots of websites, not just Amazon, use `URLs as state management` to keep track of stuff.

- By managing state via the URL, you can easily `share links`, and when someone else opens that link, they'll see the same result as you did.

- This also helps `improve SEO`.

<b>💡 How does URL as a state management improve SEO?</b>

- When you use `unique URLs to represent different states or pages` within your website, each URL serves `as a distinct entry point` for search engines to crawl and index your content.

- This means that all the variations of your content, such as `different filters`, `sorting options`, or `pagination`, `have their own URLs`, making it `easier for search engines` to `discover` and `rank your pages` appropriately.

- For Example,
  - Your website is like a big library, and each URL is like a unique bookshelf.
  - When you organize your books (`content`) on different bookshelves (`URLs`),
  - It's easier for people (`search engines`) to find the specific book (`content`) they're looking for.

<h3>Ways to retrieve the URL information in NextJS</h3>

- `Page (Server Component)`: If you’re on the main page file, then you can access the information through page props
  - For example: /books/1234/?page=2&filter=latest
  - Then,
    - `params` : will hold 1234
    - `searchParams`: will hold `page & filter` values

```jsx
async function Page({ params, searchParams }) {
  const { id } = await params;
  const { page, filter } = await searchParmas;

  return <h1>My Page</h1>;
}
export default Page;
```

- `Hook (Client Component)`: NextJs provides two specific hooks, namely [useParams](https://nextjs.org/docs/app/api-reference/functions/use-params) and [useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params),

```jsx
"use client";

import { useSearchParams } from "next/navigation";

export default function SearchBar() {
  const params = useParams();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  return <>Selected Type: {type}</>;
}
```

- <b>Rule:</b>
  - If your component is `near` its parent `Page`, you can pass `params` and `searchParams` of `Page props` to its respective children. A bit of `prop drilling` won’t hurt.
  - If the component is `far away` from `Page`, you should use the above-mentioned `hooks` instead.

<h3>How to do URL State Management</h3>

<b>1/ Next.js Link</b>

- [Link Ref](https://nextjs.org/docs/app/api-reference/components/link#href-required)

```jsx
<Link
  href={{
    pathname: "/jobs",
    query: { type: "softwaredeveloper" },
  }} // xx/jobs?type=softwaredeveloper
>
  All Jobs
</Link>
```

<b>2/ Next.js Router</b>

- Only apply on Client Components

```jsx
"use client";

import { useRouter } from "next/navigation";

const MyComponent = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push({
      pathname: "/search",
      query: { q: "your_search_query_here" },
    }); // xx/search?q=your_search_query_here
  };

  return <button onClick={handleButtonClick}>Search</button>;
};

export default MyComponent;
```

<b>3/ Programmatically</b>

- We can use a built-in JavaScript object, [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams), to create a new URL and navigate to it using `useRouter` or `window.location`

```jsx
const handleButtonClick = () => {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set("q", "your_search_query_here");

  window.location.href = `${window.location.pathname}?${searchParams.toString()}`;
};
```

- Some function utilities

```jsx
export const updateSearchParams = (type: string, value: string) => {
  // Get the current URL search params
  const searchParams = new URLSearchParams(window.location.search);

  // Set the specified search parameter to the given value
  searchParams.set(type, value);

  // Set the specified search parameter to the given value
  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

  return newPathname;
};

export const deleteSearchParams = (type: string) => {
  // Set the specified search parameter to the given value
  const newSearchParams = new URLSearchParams(window.location.search);

  // Delete the specified search parameter
  newSearchParams.delete(type.toLocaleLowerCase());

  // Construct the updated URL pathname with the deleted search parameter
  const newPathname = `${
    window.location.pathname
  }?${newSearchParams.toString()}`;

  return newPathname;
};
```

<b>4/ NPM Package</b>

- Recommendation: [query-string](https://www.npmjs.com/package/query-string)

- The above solutions will work perfectly fine if it’s a `small application` where you don’t have too many things to handle in the URL. However, as the application `becomes complex`, it gets a bit `difficult to manage all parameters in the URL`.

- We need preserving `URL history/state` so we `don’t lose the previous` information when changing URL and provide the best UX.

```jsx
export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}
```

```jsx
const handleUpdateParams = (value: string) => {
  const newUrl = formUrlQuery({
    params: searchParams.toString(),
    key: "location",
    value,
  });

  router.push(newUrl);
};
```

<h3> Issues </h3>

<b>How to deals with sensitive data when using URL State Management? </b>
