import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector
import Layout from "./components/Layout";
import HomePage from "./pages/General/HomePage";
import AboutUs from "./pages/General/AboutUs";
import ContactUs from "./pages/General/ContactUs";
import Login from "./pages/General/Login";
import Register from "./pages/General/Register";
import Dashboard from "./pages/Admin/Dashboard";

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth); // Access token from Redux state
  return token ? children : <Navigate to="/login" />; // Redirect if no token
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* General Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Pages (using PrivateRoute) */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;