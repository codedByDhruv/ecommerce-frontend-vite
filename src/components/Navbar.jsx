import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LogOut } from "lucide-react";

const getInitials = (email) => {
  return email ? email.slice(0, 2).toUpperCase() : "";
};

const getRandomColor = (seed) => {
  const colors = ["#EF4444", "#10B981", "#3B82F6", "#F59E0B", "#8B5CF6"];
  let index = seed.charCodeAt(0) % colors.length;
  return colors[index];
};

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const user = auth?.user;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
        MyStore
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-4 text-sm md:text-base">
        {!user ? (
          <>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition">Products</Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600 transition">Signup</Link>
          </>
        ) : (
          <>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition hidden sm:inline">Products</Link>
            <Link to="/cart" className="text-gray-700 hover:text-blue-600 transition hidden sm:inline">Cart</Link>
            <Link to="/orders" className="text-gray-700 hover:text-blue-600 transition hidden sm:inline">Orders</Link>
            {/* Avatar + Logout */}
            <div className="flex items-center gap-2">
              <div
                className="rounded-full w-9 h-9 flex items-center justify-center text-white text-sm font-bold shadow"
                style={{ backgroundColor: getRandomColor(user.email) }}
                title={user.email}
              >
                {getInitials(user.email)}
              </div>
              <button
                onClick={handleLogout}
                className="p-1 hover:bg-gray-100 rounded-full transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
