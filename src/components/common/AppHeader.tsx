import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { LogOutIcon, UserIcon, SettingsIcon, Search, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import useAuthStore from "@/store/useAuthStore";
import { ROUTES } from "@/const/routes";
import { API_ROUTES } from "@/const/api";
import { UserAvatar } from "./UserAvatar";
import apiClient from "@/lib/axios";

interface SearchUser {
  id: number;
  name: string;
  userCode: string;
  profileImageUrl: string;
}

function AppHeader() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  // 검색 상태
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // 검색창 열릴 때 포커스
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // 외부 클릭 시 검색창 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearch(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 디바운스 검색
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await apiClient.get(API_ROUTES.USERS.SEARCH(searchQuery).url);
        if (response.data.success) {
          setSearchResults(response.data.payload);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleUserClick = (userCode: string) => {
    navigate(`/user/${userCode}`);
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <header className="shrink-0 z-20 w-full flex items-center justify-center bg-[#121212] border-b border-border">
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
            <Separator orientation="vertical" className="h-4!" />
            <NavLink className="font-semibold" to="/chat">
              Chat
            </NavLink>
          </div>
        </div>
        {/* 오른쪽 버튼 영역 */}
        <div className="flex items-center gap-3">
          {/* 사용자 검색 */}
          {user && (
            <div ref={searchContainerRef} className="relative">
              {showSearch ? (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="이름 또는 사용자 코드 검색"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 h-9 pr-8"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-9 w-9 p-0"
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* 검색 결과 드롭다운 */}
                  {(searchResults.length > 0 || isSearching) && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                      {isSearching ? (
                        <div className="p-3 text-center text-muted-foreground text-sm">검색 중...</div>
                      ) : searchResults.length > 0 ? (
                        searchResults.map((searchUser) => (
                          <div
                            key={searchUser.id}
                            className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer transition-colors"
                            onClick={() => handleUserClick(searchUser.userCode)}
                          >
                            <UserAvatar
                              src={searchUser.profileImageUrl}
                              name={searchUser.name}
                              userId={searchUser.id}
                              userCode={searchUser.userCode}
                              className="h-8 w-8"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{searchUser.name}</p>
                              <p className="text-xs text-muted-foreground">{searchUser.userCode}</p>
                            </div>
                          </div>
                        ))
                      ) : null}
                    </div>
                  )}
                </div>
              ) : (
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => setShowSearch(true)}>
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full ring-2 ring-transparent transition-all duration-200 hover:ring-primary/50 hover:scale-105 hover:cursor-pointer focus-visible:ring-primary"
                >
                  <UserAvatar
                    src={user.profileImageUrl}
                    name={user.name}
                    userId={user.id}
                    userCode={user.userCode}
                    role={user.role}
                    className="transition-transform duration-200"
                  />
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
