import { useState, useEffect } from "react";
import { Link } from "react-router";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, ClockIcon, CloudIcon, SunIcon, CloudRainIcon, CloudSnowIcon, ArrowRightIcon, SparklesIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PostCard, PostCardSkeleton } from "@/components/posts";
import { usePostsInfinite } from "@/hooks/usePosts";
import useAuthStore from "@/store/useAuthStore";

// 날씨 아이콘 매핑
const weatherIcons: Record<string, React.ReactNode> = {
  sunny: <SunIcon className="h-8 w-8 text-yellow-500" />,
  cloudy: <CloudIcon className="h-8 w-8 text-gray-400" />,
  rainy: <CloudRainIcon className="h-8 w-8 text-blue-400" />,
  snowy: <CloudSnowIcon className="h-8 w-8 text-blue-200" />,
};

export default function HomePage() {
  const { user } = useAuthStore();
  const { data, isLoading } = usePostsInfinite(3);
  const recentPosts = data?.pages[0]?.payload ?? [];

  // 현재 시간 상태
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1초마다 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 날씨 데이터 (추후 API 연동)
  const weather = {
    condition: "sunny",
    temperature: 12,
    description: "맑음",
    location: "서울",
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      {/* 인사말 섹션 */}
      <section>
        <h1 className="text-3xl font-bold">안녕하세요, {user?.name ?? "방문자"}님!</h1>
        <p className="mt-2 text-muted-foreground">오늘도 좋은 하루 되세요.</p>
      </section>

      {/* 날짜, 시간, 날씨 카드 */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* 오늘 날짜 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">오늘 날짜</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(currentTime, "yyyy년 M월 d일", { locale: ko })}</div>
            <p className="text-sm text-muted-foreground">{format(currentTime, "EEEE", { locale: ko })}</p>
          </CardContent>
        </Card>

        {/* 현재 시간 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">현재 시간</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">{format(currentTime, "HH:mm:ss")}</div>
            <p className="text-sm text-muted-foreground">{format(currentTime, "a", { locale: ko })}</p>
          </CardContent>
        </Card>

        {/* 날씨 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">날씨</CardTitle>
            {weatherIcons[weather.condition]}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weather.temperature}°C</div>
            <p className="text-sm text-muted-foreground">
              {weather.location} · {weather.description}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* AI 기능 예고 섹션 */}
      <section>
        <Card className="border-dashed">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <SparklesIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">AI 기능 준비 중</h3>
              <p className="text-sm text-muted-foreground">게시글 AI 요약, 자동 태깅 등 다양한 AI 기능이 곧 추가됩니다.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 최근 게시물 섹션 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">최근 게시물</h2>
          <Button
            asChild
            className="group relative overflow-hidden rounded-full border border-primary/20 bg-primary/5 px-6 text-primary transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]"
          >
            <Link to="/posts">
              <span className="relative z-10 flex items-center gap-2 font-medium">
                전체 보기
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((postData) => (
              <PostCard key={postData.post.id} data={postData} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">아직 게시물이 없습니다.</p>
              <Button asChild className="mt-4">
                <Link to="/posts/new">첫 게시물 작성하기</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
