import "./App.css";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Home from "./Page/Home";
import ProductDetail from "./Page/ProductDetails";
import ErrorBoundary from "./Components/ErrorBoundary";
import ScrollToTop from "./Components/ScrollToTop";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[#08060d]">
      <Navbar />

      <main className="flex flex-1 flex-col">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/servicios/:slug" element={<ProductDetail />} />
          </Routes>
        </ErrorBoundary>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
