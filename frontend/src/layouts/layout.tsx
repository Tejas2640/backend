import React, { ReactNode } from "react";
import Navbar from "../components/Navbar";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <div className="pt-16">{/* Add padding to avoid content overlap */}
        {children}
      </div>
    </>
  );
};

export default RootLayout;