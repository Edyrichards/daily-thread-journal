
import React from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdf9f4]">
      <Header title={title} />
      <main className="flex-1 container max-w-md mx-auto px-6 py-6 pb-20 animate-fade-in">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
