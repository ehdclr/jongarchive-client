import { NavLink, useNavigate } from "react-router";
import { Button } from "../ui/button";
import { LogOutIcon, UserIcon, SettingsIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import useAuthStore from "@/store/useAuthStore";
import { ROUTES } from "@/const/routes";

function AppHeader() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  return (
    <header className="fixed top-0 z-20 w-full flex items-center justify-center bg-[#121212]">
      <div className="w-full max-w-[1440px] flex items-center justify-between px-4 py-2">
        {/* 로고 & 네비게이션 영역  */}
        <div className="flex items-center gap-5">
          <img src="https://github.com/ehdclr.png" alt="@LOGO" className="w-6 h-6 cursor-pointer rounded-full" onClick={() => navigate("/")} />
          <div className="flex items-center gap-5">
            <NavLink className="font-semibold" to="/posts">
              Post
            </NavLink>
            <Separator orientation="vertical" className="h-4!" />
            <NavLink className="font-semibold" to="/calendar">
              Calendar
            </NavLink>
            <Separator orientation="vertical" className="h-4!" />
            <NavLink className="font-semibold" to="/portfolio">
              Portfolio
            </NavLink>
          </div>
        </div>
        {/* 오른쪽 버튼 영역 */}
        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full ring-2 ring-transparent transition-all duration-200 hover:ring-primary/50 hover:scale-105 hover:cursor-pointer focus-visible:ring-primary"
                >
                  <Avatar className="h-9 w-9 transition-transform duration-200">
                    <AvatarImage src={user.profileImageUrl ?? undefined} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0) ?? "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE.path)}>
                  <UserIcon className="mr-2 h-4 w-4" />내 정보
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(ROUTES.SETTINGS.path)}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  설정
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate("/signin")}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export { AppHeader };
