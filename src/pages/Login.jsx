import { Link } from "react-router-dom";

const Login = () => (
  <div className="max-w-md mx-auto mt-10 p-4 border rounded">
    <h2 className="text-xl font-bold mb-4">Login</h2>
    <form className="space-y-4">
      <input className="w-full p-2 border" type="email" placeholder="Email" />
      <input className="w-full p-2 border" type="password" placeholder="Password" />
      <button className="w-full bg-blue-600 text-white p-2">Login</button>
    </form>

    {/* Register link */}
    <p className="mt-4 text-center text-sm text-gray-600">
      Don't have an account?{" "}
      <Link to="/register" className="text-blue-600 hover:underline">
        Register here
      </Link>
    </p>
  </div>
);

export default Login;
