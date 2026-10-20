import "./App.css";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Home from "./Page/Home";
import ProductDetail from "./Page/ProductDetails";
import BlogIndexPage from "./features/blog/BlogIndexPage";
import BlogArticlePage from "./features/blog/BlogArticlePage";
import ErrorBoundary from "./Components/ErrorBoundary";
import ScrollToTop from "./Components/ScrollToTop";
import { Link, Route, Routes } from "react-router-dom";

function NotFound() {
  return (
    <section className="flex flex-1 items-center justify-center bg-[linear-gradient(135deg,#10091c,#1b0d2b,#0d0815)] px-5 py-20 text-center text-[#eee]">
      <div className="w-full max-w-[650px] rounded-[18px] border border-[rgba(212,175,55,0.45)] bg-[rgba(30,15,45,0.9)] p-8 shadow-[0_0_35px_rgba(120,60,180,0.25)] sm:p-12">
        <p className="mb-3 text-sm tracking-[0.3em] text-[#d4af37]">
          ERROR 404
        </p>
        <h1 className="mb-5 font-AbrilFatface text-3xl text-[#d4af37] sm:text-4xl">
          Esta página no existe
        </h1>
        <p className="mb-8 leading-relaxed text-[#d8d0df]">
          El camino que buscas no se encuentra aquí.
          Puedes volver al inicio y explorar los servicios
          de El Nido del Caos.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-lg border border-[#d4af37] bg-[#d4af37] px-6 py-3 font-semibold text-[#08060d] transition-colors hover:bg-transparent hover:text-[#d4af37]"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[#08060d]">
      <Navbar />

      <main className="flex flex-1 flex-col">
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <Home />
              </ErrorBoundary>
            }
          />
          <Route path="/blog" element={<ErrorBoundary><BlogIndexPage /></ErrorBoundary>} />
          <Route path="/blog/:slug" element={<ErrorBoundary><BlogArticlePage /></ErrorBoundary>} />
          <Route
            path="/servicios/:slug"
            element={
              <ErrorBoundary>
                <ProductDetail />
              </ErrorBoundary>
            }
          />
          <Route
            path="*"
            element={
              <ErrorBoundary>
                <NotFound />
              </ErrorBoundary>
            }
          />
        </Routes>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
