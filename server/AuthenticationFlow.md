No Markdown, markdown can be found below:

User Login:

The client sends a POST request to /login with the user's email and password.

On the server, handleLogin is called. It:

Looks up the user using the email.

Checks if the provided password matches.

If valid, it creates a JWT token with a payload containing:

sub: the user's ID (subject)

email: the user's email

It signs the token using a secret key.

The token is sent back in the response as a plain string.

The client stores this token somewhere locally (such as in memory, localStorage, or sessionStorage).

Token Details:

The token is signed (not encrypted), which means:

Its content (the payload) can be decoded and viewed by anyone who has it.

But no one can tamper with it without breaking the signature.

So yes, you can "decrypt" or decode the token to view the sub and email, but you can't modify it without invalidating it.

Creating a New Job:

The client sends a GraphQL mutation to http://localhost:9000/graphql, including:

The mutation data in the body.

The JWT token in the Authorization header using the Bearer scheme:
Authorization: Bearer <your_token_here>

The request reaches the server at port 9000. The authMiddleware runs first. It uses the expressjwt library, which:

Automatically checks for the Authorization header using the Bearer scheme (by default).

If a valid token is found, it decodes the payload and assigns it to req.auth.

If the token is missing or invalid:

If credentialsRequired: false, it does nothing and does not throw an error.

If credentialsRequired: true, it throws a 401 Unauthorized error.

Then, the expressMiddleware from Apollo Server runs. It uses the getContext function to create a context object for GraphQL resolvers. In this function:

req.auth is read.

That object (or undefined) is returned as context.auth and becomes accessible in every resolver.

Now the resolvers run. For example, in the createJob mutation:

The resolver receives context.auth.

If context.auth is not present, it throws an Unauthorized error.

If it is present, it proceeds to create the job.

Final Summary:

Yes, you're absolutely right. When a user logs in, they receive a signed token containing their user ID and email. The client stores this token and must include it in the Authorization header when making GraphQL requests. The server uses middleware to extract and verify the token, making the decoded payload available in req.auth. The GraphQL context then passes that into the resolvers, which check if authentication exists before proceeding with operations like creating a job.

---

### ✅ **User Login**

1. **Client calls** `/login` with email and password.

2. On the server:

   - `handleLogin` runs.

   - It finds the user by email.

   - Verifies the password.

   - If valid, it **creates a JWT** using:

     ```js
     const claims = { sub: user.id, email: user.email };
     const token = jwt.sign(claims, secret);
     ```

   - That token is **returned to the client** as a string.

3. This JWT is now stored client-side (e.g. localStorage, sessionStorage, or memory).

---

### ✅ **JWT Properties**

- The token is **signed**, not encrypted.

  - Signing ensures the token hasn’t been tampered with.
  - But the contents (i.e., the payload like `sub`, `email`) are still **base64-encoded and readable** by anyone who has the token.
  - This is normal and expected — never put sensitive info like passwords in the payload.

---

### ✅ **Authenticated Request to Create a Job**

1. The client now wants to call the `createJob` mutation.

   - It sends:

     - The mutation body (GraphQL query).
     - The JWT in the request header like:

       ```
       Authorization: Bearer <token>
       ```

2. **Request hits the server (`http://localhost:9000/graphql`)**:

   - **First**, `authMiddleware` runs:

     - This uses `expressjwt`, which:

       - Extracts the token from the `Authorization` header.
       - Verifies it using the secret.
       - If valid, decodes it and attaches the payload to `req.auth`.
       - If invalid:

         - Does nothing (because `credentialsRequired: false`).

3. **Then**, `expressMiddleware` for Apollo runs:

   - It calls `getContext({ req })`, which grabs `req.auth` and passes it into `context`.

4. **Inside resolvers**, `context.auth` is now accessible.

   - In `createJob`, this is checked:

     ```js
     if (!context.auth) throw unauthorizedError("User must be authenticated first");
     ```

   - If `auth` exists (valid JWT), the job is created.

---

### ✅ Final Recap

You said:

> “each resolver function now receives context including createJob which can now check if auth property exists on context and if it does allows user to create job”

✅ **Correct. That is exactly what's happening.**

---

### 🧠 Bonus: Optional Next Steps You Might Consider

If you're interested in refining this system further, here are some things to explore:

- 🔐 **Role-based access control** (add `role` to JWT claims and check it in resolvers)
- ⏱️ **Token expiration** (set `expiresIn` in `jwt.sign(...)`)
- 🚫 **Force `credentialsRequired: true`** in production to reject unauthenticated requests early
- 🔄 **Refresh tokens** (for long-lived sessions)

Let me know if you'd like examples for any of these!
