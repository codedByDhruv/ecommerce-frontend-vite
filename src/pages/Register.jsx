import { Link } from "react-router-dom";

const Register = () => (
  <div className="max-w-md mx-auto mt-10 p-4 border rounded">
    <h2 className="text-xl font-bold mb-4">Register</h2>
    <form className="space-y-4">
      <input className="w-full p-2 border" type="text" placeholder="Name" />
      <input className="w-full p-2 border" type="email" placeholder="Email" />
      <input className="w-full p-2 border" type="password" placeholder="Password" />
      <button className="w-full bg-blue-600 text-white p-2">Register</button>
    </form>

    {/* Login link */}
    <p className="mt-4 text-center text-sm text-gray-600">
      Already have an account?{" "}
      <Link to="/login" className="text-blue-600 hover:underline">
        Login here
      </Link>
    </p>
  </div>
);

export default Register;
