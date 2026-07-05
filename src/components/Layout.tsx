import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

function Layout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md">
        <Navbar />
      </header>
      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      <ScrollToTop />
      <Footer />
    </div>
  );
}

export default Layout;
