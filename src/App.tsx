import { AppHeader, AppFooter } from "./components/common";
import { Outlet } from "react-router";

/**
 * 메인 레이아웃 컴포넌트
 * @description ProtectedRoute에서 인증 처리를 하므로 여기서는 레이아웃만 담당
 */
function App() {
  return (
    <div className="page">
      <AppHeader />
      <div className="container">
        <Outlet />
      </div>
      <AppFooter />
    </div>
  );
}

export default App;