import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Features from "./pages/public/Features";
import Pricing from "./pages/public/Pricing";
import Contact from "./pages/public/Contact";
import FAQ from "./pages/public/FAQ";
import Privacy from "./pages/public/Privacy";
import Terms from "./pages/public/Terms";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  const location = useLocation();

  // Hide Navbar only on login & register
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  // Hide Footer on login, register, and dashboard
  const hideFooter =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900 dark:bg-gray-900 dark:text-neutral-100">
      {!hideNavbar && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer position="top-right" />
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
