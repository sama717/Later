import type { ReactNode } from "react";
import logo from "/Logo.svg";

interface AuthLayoutProps {
  backgroundImage: string;
  children: ReactNode;
}

function AuthLayout({ backgroundImage, children }: AuthLayoutProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="w-full aspect-4/5 overflow-hidden bg-secondary relative rounded-[8px]">
          <img
            src={backgroundImage}
            alt="LATER"
            className="w-full h-full object-cover rounded-[8px]"
          />

          <div className="absolute inset-0 bg-black/50 rounded-[8px]" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <img src={logo} alt="LATER logo" className="w-24 h-24 invert" />
            <span className="text-[4rem] text-white font-heading font-medium">
              LATER
            </span>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto lg:mx-0">{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;