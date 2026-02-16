import { Outlet } from "react-router-dom";
import { Header } from "../components";

const RootLayout = () => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-[#0e0c16] to-[#1a162b] text-gray-100">
      <Header />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
