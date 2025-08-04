import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { readFile } from "node:fs/promises";
import { resolvers } from "./resolvers.js";
import { authMiddleware, handleLogin } from "./auth.js";
import { getUser } from "./database/users.js";
import { createCompanyLoader } from "./database/companies.js";

const PORT = 9000;
const app = express();

/*
This middleware is added before any route handler (including /graphql), so it runs for every request and:
Looks for a JWT in the Authorization header.

Why must the token be sent in the Authorization header using the Bearer scheme?
 - Because the expressjwt middleware expects the token in that format by default.
 
If the token is present and valid, it decodes the payload (e.g., { sub, email }) and attaches it to req.auth.
If the token is invalid or missing:
It does nothing if credentialsRequired: false
It throws an error if credentialsRequired: true
*/
app.use(cors(), express.json(), authMiddleware);

//Login handler
app.post("/login", handleLogin);

const typeDefs = await readFile("./schema.graphql", "utf-8");

/*
if JWT payload was:
{
  "sub": "user123",
  "email": "someone@example.com"
}
Then after middleware runs:
req.auth = { sub: "user123", email: "someone@example.com" }
*/
async function getContext({ req }) {
  //instantiating a new DataLoader per request:
  //No cross-request caching
  //Prevents the infinite caching bug, where stale data could leak between users if DataLoader is shared globally
  const companyLoader = createCompanyLoader();
  const context = { companyLoader };

  if (req.auth) {
    context.user = await getUser(req.auth.sub);
  }
  return context;
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

await apolloServer.start();

/*
expressMiddleware provides context to resolvers
 every resolver receives a context object with auth, which will be:
 The decoded JWT if the user is authenticated.
 undefined if not.
*/
app.use("/graphql", cors(), express.json(), expressMiddleware(apolloServer, { context: getContext }));

app.listen(PORT, () => {
  console.log(`Express running on Port ${PORT}`);
  console.log(`Apollo running on Port ${PORT}/graphql`);
});
