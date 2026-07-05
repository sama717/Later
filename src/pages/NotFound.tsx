import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import bgImageLight from "../assets/404-bg-light.png";
import bgImageDark from "../assets/404-bg-dark.png";

function NotFound() {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="shrink-0">
        <Navbar />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale pointer-events-none dark:hidden"
          style={{ backgroundImage: `url(${bgImageLight})` }}
        />

        <div
          className="absolute inset-0 bg-cover bg-center grayscale pointer-events-none hidden dark:block"
          style={{ backgroundImage: `url(${bgImageDark})` }}
        />

        <div className="relative z-10 flex flex-col items-center gap-8">
          <h1 className="font-heading text-[10rem] sm:text-[10rem] md:text-[12rem] lg:text-[15rem] leading-none tracking-tight">
            404
          </h1>

          <div>
            <p className="text-muted-foreground text-sm sm:text-sm md:text-lg lg:text-lg mb-4">
              Maybe later. This page isn't ready to be found yet.
            </p>
            <Button render={<Link to="/" />} size="lg" className="w-50 h-12">
              Take Me Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
