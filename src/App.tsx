import { AppHeader, AppFooter, AppSidebar } from "./components/common";
import { Outlet } from "react-router";

/**
 * 메인 레이아웃 컴포넌트
 * @description ProtectedRoute에서 인증 처리를 하므로 여기서는 레이아웃만 담당
 */
function App() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="page">
            <div className="container">
              <Outlet />
            </div>
            <AppFooter />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
