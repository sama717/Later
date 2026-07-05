import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* 1. Fixed Header Wrapper */}
      <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md">
        <Navbar />
      </header>

      {/* 2. Main content with top padding to offset the fixed navbar */}
      {/* Note: Adjust 'pt-20' to match the actual height of your Navbar */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;