import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <div className="mx-auto max-w-4xl px-2 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <Link to={"/"} className="px-3 py-2 bg-green-500 text-white font-bold block text-center ">
          Home
        </Link>
        <Link to={"/login"} className="px-3 py-2 bg-blue-500 text-white font-bold block text-center ml-auto">
          Sign In
        </Link>
      </div>
    </div>
  );
}
