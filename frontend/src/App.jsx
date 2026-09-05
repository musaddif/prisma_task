import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ProductDetails from "./components/ProductDetails";
import CheckoutPage from "./components/CheckoutPage";
import PolicyPage from "./components/PolicyPage";
import TrackOrderPage from "./components/TrackOrderPage";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/policies/:slug" element={<PolicyPage />} />
        <Route path="/pages/tracking" element={<TrackOrderPage />} />
      </Routes>
    </Router>
  );
}

export default App;