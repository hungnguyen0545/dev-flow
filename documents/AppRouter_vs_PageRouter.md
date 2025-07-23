# App Router vs Page Router in Next.js

In **Next.js**, the concepts of **App Router** and **Page Router** represent two different routing systems. These differ significantly between versions before and after Next.js 13.

---

## 🔹 1. Page Router (Traditional)

### 📌 Characteristics:

- Used from **Next.js v1 to v12** (still supported in v13–14).
- Based on the `pages/` directory.
- Each `.js` or `.ts` file in `pages/` becomes a route.

### 📂 Example structure:

```
/pages
  └── index.js          => "/"
  └── about.js          => "/about"
  └── blog/[slug].js    => "/blog/:slug"
```

### ✅ Pros:

- Easy to understand.
- Well-documented and widely used.

### ❌ Cons:

- Limited support for nested layouts.
- No built-in support for streaming/loading states.
- Often relies on client-side rendering if not using `getServerSideProps`.

---

## 🔹 2. App Router (Modern, from v13+)

### 📌 Characteristics:

- Introduced in **Next.js 13** as a modern approach.
- Based on the `app/` directory.
- Uses **React Server Components (RSC)** by default.
- Clear separation between client-side and server-side components.

### 📂 Example structure:

```
/app
  └── page.tsx               => "/"
  └── about/page.tsx         => "/about"
  └── blog/[slug]/page.tsx   => "/blog/:slug"
  └── layout.tsx             => shared layout
  └── loading.tsx            => shown during loading
  └── error.tsx              => error handling
```

### 🧠 Key Features:

| Feature                | App Router                     |
| ---------------------- | ------------------------------ |
| ✅ Server Components   | Yes                            |
| ✅ Nested Layouts      | Yes                            |
| ✅ Streaming UI        | Yes (via `loading.tsx`)        |
| ✅ Route Groups        | Yes (e.g., `(marketing)/home`) |
| ✅ Automatic Caching   | Yes                            |
| ✅ File-based Metadata | `metadata.ts`                  |
| ✅ Nested Routing      | Yes                            |

### ❌ Cons:

- Steeper learning curve for beginners.
- Requires understanding of client/server boundaries.

---

## ⚖️ Quick Comparison

| Criteria                 | Page Router         | App Router                         |
| ------------------------ | ------------------- | ---------------------------------- |
| Main Directory           | `pages/`            | `app/`                             |
| Default Component Type   | Client Component    | Server Component                   |
| Nested Layouts           | No (`_app.js` only) | Yes (`layout.tsx`)                 |
| Streaming UI             | No                  | Yes                                |
| Routing Flexibility      | Less                | High (Groups, Intercepting routes) |
| Meta Tags                | `Head` component    | `metadata` export                  |
| Performance Optimization | Manual              | Built-in (caching, SSR, streaming) |

---

## 💡 When to Use What?

| Scenario                              | Recommendation |
| ------------------------------------- | -------------- |
| Legacy projects using `pages/`        | Page Router    |
| New projects needing layout/streaming | App Router     |
| You're familiar with SSR and RSC      | App Router     |

---

## 🧭 Conclusion

- **Page Router** = Traditional, simple, stable.
- **App Router** = Modern, powerful, slightly complex but highly optimized.

> 🔥 **Next.js recommends using App Router for new projects (v13+).**
