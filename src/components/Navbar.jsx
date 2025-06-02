import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

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
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">MyStore</Link>
      <div className="space-x-4 flex items-center">
        <Link to="/products">Products</Link>

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Signup</Link>
          </>
        ) : (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
            <div className="flex items-center gap-2">
              <div
                className="rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: getRandomColor(user.email) }}
                title={user.email}
              >
                {getInitials(user.email)}
              </div>
              <span className="text-sm hidden sm:inline">{user.email}</span>
              <button
                onClick={handleLogout}
                className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
