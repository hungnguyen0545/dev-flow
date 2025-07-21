## Understanding Authentication and Authorization in Web Security

In this lesson, we explore `two crucial concepts` in web security. Understanding these concepts is foundational for implementing secure systems.

- `Authentication` is the process of verifying the identity of a user. It ensures that the person or entity accessing the system is who they claim to be.

- `Authorization`, on the other hand, determines what actions a user is allowed to perform within the system after they've been authenticated. It defines the permissions and access levels granted to users based on their identity and role.

<h3> 🤔 Why do we need authentication?</h3>

- It is crucial for `protecting sensitive information` and ensuring that only authorized users can access it. It's the first line of defense against unauthorized access and data breaches.

- `Without proper authentication`, anyone could access your system and` potentially steal or manipulate your data.` This could lead to financial loss, reputational damage, and legal consequences.

—————————

<h3>Types of Authentication</h3>
- There are various ways to implement authentication and authorization on the web:

<h3>1/ Session-based</h3>

- A session is `created on the server` for each user after they log in. The server then sends a `unique session identifier` (usually stored as a `cookie`) to the `client`, which is used for `subsequent requests to authenticate` the user

<h3>🍪 What's a cookie?</h3>

- A cookie is a small `piece of data` that a `web server sends to a user's web browser`. The browser then `stores` this data and `sends it back` with every subsequent request to the same server. Cookies are commonly used for various purposes, including `session management`, `tracking user preferences`, and `personalizing user experiences`.

- You can think of cookies as a way for websites to `remember` users and their preferences `across different sessions`.

<b>Workflow</b>

- When a user logs in, the server generates a `unique session ID` and `stores session data` (like user ID, expiration time, etc.)
- The server's `response` containing the session ID
- User's web browser stored it in `Cookie`
- Next subsequent requests, the client `send request containing session ID`
- The server `verifies` the session ID against the stored session data to authenticate the user.

<b>Pros</b>

- `Secure`: Session data is stored on the server, reducing the risk of token theft.
- `Easy to implement`: Many web frameworks provide built-in support for session management.
- `Automatic expiration`: Sessions can be set to expire after a certain period, enhancing security.

Cons

- `Scalability issues`: Storing session data on the server can lead to scalability challenges, especially in distributed systems.
- `Server-side storage`: Requires server resources to manage session data, increasing server load.
- `Vulnerable to CSRF attacks`: Session identifiers stored in cookies can be susceptible to CSRF attacks if not properly secured.

—————————

<h3>2. Token-based (JWT)</h3>

- A token containing `user information` is generated after successful login and sent to the client. This token is then `included in subsequent requests` to authenticate the user.

<b>Workflow</b>

- After successful authentication, the server generates a `JWT` containing `user information` and signs it with a `secret key`.
- The server sends the JWT to the client, usually in the `response body` or as `a header`.
- The client includes the JWT in the header of subsequent `requests`.
- The server `verifies` the JWT's signature and decodes its payload to authenticate the user.

<b>Pros</b>

- `Stateless`: Tokens contain all necessary information for authentication, eliminating the need for server-side storage.
- `Scalable`: Tokens can be easily distributed across multiple servers, improving scalability.
- `Enhanced security`: Tokens can be encrypted and signed to prevent tampering and unauthorized access.

<b>Cons</b>

- `Token management`: Requires additional effort to `manage token lifecycle`, including expiration and revocation.
- `Token size`: Tokens can be larger than session identifiers, `increasing network overhead`.
- `Vulnerable to token theft`: If not properly secured (e.g., through HTTPS), tokens can be intercepted and used by malicious actors.
  ——————————

<h3>3/ OAuth</h3>
  
- OAuth is a protocol for delegated authorization, allowing `third-party services` to access a user's resources without exposing their credentials. Users can grant limited access to their data to external applications.
  
<b>Workflow</b>

- `Register` your application with the OAuth provider and obtain client credentials (client ID and client secret).
- `Redirect` users to the OAuth provider's authentication endpoint.
- After authentication, the OAuth provider redirects the user back to your application with an `authorization code`.
- `Exchange` the authorization code for an access token --- optionally a refresh token.
- `Use` the access token to access the user's resources on behalf of the user.

<b>Pros</b>

- `Single sign-on (SSO)`: Users can `access multiple services` with a single set of credentials, improving user experience.
- `Granular permissions`: Users can `grant limited access` to their resources, enhancing privacy and security.
- `Widely supported`: OAuth is a widely `adopted standard` used by many popular services and platforms.

<b>Cons</b>

- `Complexity`: Implementing OAuth can be `complex`, requiring understanding of the protocol and its various flows.
- `Trust dependency`: Users must `trust` third-party services with access to their data, `raising privacy concerns`.
- `Token management`: Requires handling of access tokens and refresh tokens, `adding complexity to authentication flow`.

——————————

<h3>4. Basic authentication</h3>

- It involves users `providing` their credentials `username and password` with each request, `encoded and sent` to the server. It's `simple` but `less secure` compared to other methods.

<b>Workflow</b>

- Clients `encode` the` username and password` in a Base64-encoded string and includes it in the `request header`.
- The server `decodes` the string, `extracts` the credentials, and `validates` them against the stored credentials.

<b>Pros</b>

- `Simple to implement`: Requires minimal setup and configuration, making it easy to get started.
- `Universal support`: Basic authentication is supported by virtually all web browsers and servers.
- `No session management`: Does not require server-side storage or session management, reducing server load.

<b>Cons</b>

- `Lack of security`: Credentials are sent with every request, increasing the risk of interception and unauthorized access.
- `No encryption`: Credentials are sent in plaintext, making them vulnerable to interception.
- `Limited functionality`: Does not support features like session management or granular permissions, limiting its usability in complex applications.

<b>Note: </b> Avoid using `basic authentication` for sensitive applications as credentials are sent with every request, making them susceptible to interception.

<h4>Resources: </h4>

- [Authentication & Authorization](https://auth0.com/docs/authorization/concepts/authz-and-authn)
- [Session Based Authentication - roadmap.sh](https://roadmap.sh/guides/session-based-authentication)
- [Basics of Authentication - roadmap.sh](https://roadmap.sh/guides/basics-of-authentication)
- [JWT Authentication - roadmap.sh](https://roadmap.sh/guides/jwt-authentication)
