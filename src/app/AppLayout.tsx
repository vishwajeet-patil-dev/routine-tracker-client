import { Outlet } from "react-router";
import Header from "../components/Header";
import Nav from "../components/Nav";

function AppLayout() {
  return (
    <div className="h-dvh px-4 py-4 flex flex-col">
      <div className="shrink-0">
        <Header />
      </div>
      <div className="flex-1 min-h-0">
        <Outlet />
      </div>
      <div className="shrink-0">
        <Nav />
      </div>
    </div>
  );
}

export default AppLayout;
