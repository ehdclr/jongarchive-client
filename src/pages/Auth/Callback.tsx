import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import { API_ROUTES } from "@/const/api";
import { ROUTES } from "@/const/routes";
import useAuthStore from "@/store/useAuthStore";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("accessToken");
      const refreshToken = params.get("refreshToken");

      // URL에서 토큰 제거 (중복 실행 방지)
      window.history.replaceState({}, "", window.location.pathname);

      // 토큰이 없으면 이미 처리됐거나 잘못된 접근
      if (!accessToken || !refreshToken) {
        return;
      }

      try {
        await apiClient.post(API_ROUTES.AUTH.SET_COOKIES.url, {
          accessToken,
          refreshToken,
        });

        await fetchUser();

        toast.success("로그인 성공!", {
          description: "환영합니다!",
        });
        navigate(ROUTES.HOME.path);
      } catch {
        toast.error("로그인 실패", {
          description: "다시 시도해주세요.",
        });
        navigate(ROUTES.SIGNIN.path);
      }
    };

    handleCallback();
  }, [navigate, fetchUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
        <p className="mt-4 text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
