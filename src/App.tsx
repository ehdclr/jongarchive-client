import { AppHeader, AppFooter } from "./components/common";
import { Outlet, useLocation } from "react-router";
import useAuthStore from "./store/useAuthStore";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  const { isAuthenticated, fetchUser } = useAuthStore();

  useEffect(() => {
    // ✅ 앱 로드 시 사용자 정보 가져오기
    // 로그인/회원가입 페이지가 아니고, 아직 인증되지 않았으면 시도
    const publicPaths = ['/signin', '/signup'];
    const isPublicPath = publicPaths.some(path => location.pathname.startsWith(path));

    if (!isPublicPath && !isAuthenticated) {
      fetchUser();
    }
  }, [location.pathname, isAuthenticated, fetchUser]);

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
