import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "./database/users.js";

const secret = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64");

/*
Why must the token be sent in the Authorization header using the Bearer scheme?
- Authorization header using Bearer Token scheme: Bearer <your_jwt_token>
- expressjwt middleware (from the express-jwt package) parses this header automatically by default.

If the token is present and valid, it decodes the payload (e.g., { sub, email }) and attaches it to req.auth.

If the token is invalid or missing:
 - It does nothing if credentialsRequired: false
 - It throws an error if credentialsRequired: true
*/

/* 
If you used a different scheme or header (e.g., X-Token: <jwt>), you'd need to configure expressjwt manually to look for it using getToken:
  expressjwt({
    secret,
    algorithms: ["HS256"],
    getToken: (req) => req.headers["x-token"],
  });
*/

export const authMiddleware = expressjwt({
  algorithms: ["HS256"],
  credentialsRequired: false,
  secret,
});

/*
Why do we get sub, email? Is this defined by the library or the JWT?
- it's not from the library — you define what’s in the JWT when you create it.

const claims = { sub: user.id, email: user.email };
const token = jwt.sign(claims, secret);
sub: Stands for "subject" and is often used to store the user ID. This is a JWT convention, not a requirement.
email: Arbitrary — you can include anything.

These fields are part of the payload of your JWT.
You define them when calling jwt.sign() (using the jsonwebtoken package).
*/

export async function handleLogin(req, res) {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user || user.password !== password) {
    res.sendStatus(401);
  } else {
    const claims = { sub: user.id, email: user.email };
    const token = jwt.sign(claims, secret);
    res.json({ token });
  }
}
