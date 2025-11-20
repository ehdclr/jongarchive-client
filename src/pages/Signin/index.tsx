import { useState } from "react";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";
import { useNavigate } from "react-router";
import { getErrorMessage } from "@/const/error";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import { API_ROUTES } from "@/const/api";
import useAuthStore from "@/store/useAuthStore";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "비밀번호는 8자 이상이어야 합니다." }).max(20, { message: "비밀번호는 20자 이하이어야 합니다." }),
});

export default function Signin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await apiClient.post(API_ROUTES.AUTH.SIGNIN.url, values);

      if (response.data.success) {
        toast.success("로그인 성공!", {
          description: "환영합니다!",
        });
        navigate("/"); // 메인 페이지로 이동
        setUser(response.data.payload);
      }
    } catch (error) {
        
      const errorType = error.response?.data?.error?.type || "unknown_error";
      const errorMessage = getErrorMessage(errorType) || "로그인에 실패했습니다.";
      toast.error("로그인 실패", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <main className="w-full h-full min-h-[720px] flex items-center justify-center gap-6 p-6">
      <div className="w-full max-w-100 flex flex-col px-6 gap-6">
        <div className="flex flex-col">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">로그인</h4>
          <p className="text-muted-foreground">로그인을 위한 정보를 입력해주세요.</p>
        </div>
        <div className="grid gap-3">
          <Button type="button" variant={"secondary"} onClick={handleGoogleLogin}>
            <img src="/assets/icons/google.svg" alt="@GOOGLE-LOGO" className="w-[18px] h-[18px] mr-1" />
            구글 로그인
          </Button>
          {/* 경계선 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 text-muted-foreground bg-black uppercase">OR CONTINUE WITH</span>
            </div>
          </div>
          {/* 로그인 폼 */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="이메을 입력해주세요" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="비밀번호를 입력해주세요" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              <div className="w-full flex flex-col gap-3">
                <Button type="submit" className="flex-1 !bg-blue-800/50" variant="outline">
                  로그인
                </Button>
                <div className="text-center text-muted-foreground">
                  계정이 없으신가요?
                  <NavLink to={"/signup"} className="text-primary underline ml-2">
                    회원가입
                  </NavLink>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
