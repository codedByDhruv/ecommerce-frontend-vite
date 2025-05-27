import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
    <Link to="/" className="text-xl font-bold">MyStore</Link>
    <div className="space-x-4">
      <Link to="/products">Products</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/orders">Orders</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Signup</Link> 
    </div>
  </nav>
);

export default Navbar;
