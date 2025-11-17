import { NavLink, useNavigate } from "react-router";
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";

function AppHeader() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  return (
    <header className="fixed top-0 z-20 w-full flex items-center justify-center bg-[#121212]">
    <div className="w-full max-w-[1440px] flex items-center justify-between px-4 py-2">
      {/* 로고 & 네비게이션 영역  */}
      <div className="flex items-center gap-5">
        <img src="https://github.com/ehdclr.png" alt="@LOGO" className="w-6 h-6 cursor-pointer rounded-full" onClick={() => navigate('/')}/>
        <div className="flex items-center gap-5">
          <NavLink className="font-semibold" to="/post">
            Post
          </NavLink>
          {/* <Separator orientation="vertical" className="h-4!" /> */}
          <NavLink className="font-semibold" to="/calendar">
            Calendar
          </NavLink>
        </div>
      </div>
      {/* 오른쪽 버튼 영역 */}
      <div className="flex items-center gap-5">
        <span>
          <div className="flex items-center justify-center font-semibold">
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </span>
      </div>
    </div>
  </header>
  )
}

export { AppHeader };