import { AppHeader, AppFooter } from "./components/common";
import { Outlet } from "react-router";

function App() {

  return (
    <>
      {/* Header 부터  */}
      <div className="page">
      <AppHeader />
        <div className="container">
          <Outlet />
        </div>
        <AppFooter />
      </div>
    </>
  );
}

export default App;
