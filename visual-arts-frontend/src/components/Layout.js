import Navbar from "./Navbar";
import { Sidebar } from "./Sidebar"; // ✅ Named import
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = location.pathname.startsWith("/admin") || location.pathname.startsWith("/member");

  return (
    <div className="flex">
      {isAuthenticated && <Sidebar />}
      <div className="flex-1">
        <Navbar />
        <main className="p-5">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
