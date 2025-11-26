import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Copy, Check, LayoutGridIcon, HomeIcon, UserIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useCategories } from "@/hooks/useCategories";

function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: categoriesData, isLoading } = useCategories();
  const categories = categoriesData?.payload ?? [];
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  const currentUser = {
    name: "익명 늑대",
    userCode: "WOLF001K7J",
    avatar: "🐺",
  };

  const handleCopyUserCode = async () => {
    try {
      await navigator.clipboard.writeText(currentUser.userCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      //TODO: 나중에 수정(배포시) HTTPS가 아닌 환경에서 fallback
      const textArea = document.createElement("textarea");
      textArea.value = currentUser.userCode;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 현재 경로에 따른 active 상태
  const isPostsPage = location.pathname.startsWith("/posts");
  const isProfilePage = location.pathname.startsWith("/profile");
  const isHomePage = location.pathname === "/";

  return (
    <aside className="w-64 shrink-0 bg-card border-r border-border flex flex-col">
      {/* 헤더 영역 */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">🐷 개돼지 갱생소</h1>
        <p className="text-xs text-muted-foreground mt-1">B급 감성 커뮤니티</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4 py-4 space-y-4">
          {/* 공통 메뉴 */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground px-2 mb-2">메뉴</p>
            <button
              onClick={() => navigate("/")}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                isHomePage ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-muted"
              }`}
            >
              <HomeIcon className="h-4 w-4" />홈
            </button>
            <button
              onClick={() => navigate("/posts")}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                isPostsPage ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-muted"
              }`}
            >
              <LayoutGridIcon className="h-4 w-4" />
              게시물
            </button>
            <button
              onClick={() => navigate("/profile")}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                isProfilePage ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-muted"
              }`}
            >
              <UserIcon className="h-4 w-4" />
              프로필
            </button>
          </div>

          {/* 카테고리 (접었다 펼 수 있음) - Posts 페이지에서만 표시 */}
          {isPostsPage && (
            <Collapsible open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
              <CollapsibleTrigger className="w-full flex items-center justify-between px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                카테고리
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isCategoryOpen ? "" : "-rotate-90"}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-2">
                <button
                  onClick={() => setSelectedCategoryId(null)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                    selectedCategoryId === null ? "bg-muted font-semibold" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <LayoutGridIcon className="h-4 w-4" />
                  전체
                </button>
                {isLoading ? (
                  <>
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategoryId(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                        selectedCategoryId === category.id ? "bg-muted font-semibold" : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                      {category.name}
                    </button>
                  ))
                )}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </ScrollArea>

      {/* 유저 정보 */}
      <div className="p-6 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">{currentUser.avatar}</div>
          <div className="flex-1">
            <p className="font-semibold text-foreground text-sm">{currentUser.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-muted-foreground">{currentUser.userCode}</p>
              <button onClick={handleCopyUserCode} className="text-muted-foreground hover:text-foreground transition-colors">
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Posts 페이지에서만 표시 */}
      {isPostsPage && (
        <div className="p-4 border-t border-border">
          <Button onClick={() => navigate("/posts/new")} className="w-full bg-[#5cff72] text-[#0b0b0d] hover:bg-[#5cff72]/90" size="sm">
            ✏️ 새로운 토픽
          </Button>
        </div>
      )}
    </aside>
  );
}

export { AppSidebar };
