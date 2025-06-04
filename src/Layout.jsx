// src/Layout.jsx
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const hideHeaderFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideHeaderFooter && <Navbar />}
      <main className="min-h-screen">
        <Outlet /> {/* This will render the current page */}
      </main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
};

export default Layout;
