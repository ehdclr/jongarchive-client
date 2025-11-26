import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <main className="w-full h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm flex flex-col px-6 gap-6">
        <div className="flex flex-col text-center">
          <div className="text-4xl mb-2">👑</div>
          <h4 className="text-xl font-semibold">관리자 로그인</h4>
          <p className="text-muted-foreground text-sm mt-1">관리자 계정으로 로그인하세요</p>
        </div>
        <Button type="button" variant="secondary" onClick={handleGoogleLogin} className="w-full">
          <img src="/assets/icons/google.svg" alt="Google" className="w-[18px] h-[18px] mr-2" />
          Google로 로그인
        </Button>
      </div>
    </main>
  );
}
