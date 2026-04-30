import HeaderNav1 from "./header/HeaderNav";
import Footer from "./header/Footer";
import { Outlet } from "react-router-dom";
import { useToggle } from "./Vendor/ThemeProvider";

export default function MainLayout() {
  const { enabled } = useToggle();

  return (
    <div className={enabled ? "dark" : "light"}>
      <HeaderNav1 />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}