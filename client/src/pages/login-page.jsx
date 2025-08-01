import { useState } from "react";
import { login } from "../lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(false);
    //login user - if success saves JWT to local storage and returns ID and email
    const user = await login(email, password);
    if (user) {
      console.log(user);
      // onLogin(user);
    } else {
      setError(true);
    }
  }

  return (
    <div className="py-8 px-4">
      <section className="max-w-4xl mx-auto">
        <div className="p-2 bg-gray-300 ">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <form onSubmit={onSubmit}>
            <div className="mt-2">
              <label htmlFor="title">Email</label>
              <input
                name="email"
                id="email"
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-white w-full"
              />
            </div>
            <div className="mt-2">
              <label htmlFor="description">Password</label>
              <input
                name="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-white w-full"
              />
            </div>
            <button type="submit" className="mt-2 w-full px-3 py-2 bg-black text-white font-bold block text-center">
              Login
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
