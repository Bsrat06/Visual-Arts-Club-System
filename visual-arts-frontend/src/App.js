import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/General/HomePage";
import AboutUs from "./pages/General/AboutUs";
import ContactUs from "./pages/General/ContactUs";
import Login from "./pages/General/Login";
import Register from "./pages/General/Register";
import Dashboard from "./pages/Admin/Dashboard";

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

          {/* Admin Pages */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
