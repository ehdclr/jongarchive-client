import { useState } from "react";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router";
import { AvatarUpload } from "@/components/common";
import { getErrorMessage } from "@/const/error";
import { toast } from "sonner";
import apiClient from "@/lib/axios";

import { API_ROUTES } from "@/const/api";

const formSchema = z
  .object({
    email: z.string().email({ message: "이메일 형식이 올바르지 않습니다." }),
    socialId: z.string(), // 소셜 로그인 시 사용
    password: z.string().min(8, { message: "비밀번호는 8자 이상이어야 합니다." }).max(20, { message: "비밀번호는 20자 이하이어야 합니다." }),
    confirmPassword: z.string().min(8, { message: "비밀번호는 8자 이상이어야 합니다." }).max(20, { message: "비밀번호는 20자 이하이어야 합니다." }),
    provider: z.enum(["local"]),
    name: z.string().min(1, { message: "이름을 입력해주세요." }).max(20, { message: "이름은 20자 이하로 입력해주세요." }),
    phoneNumber: z.string().optional(),
    bio: z.string().optional(),
    profileImage: z.instanceof(File).nullable().optional(),
  })
  .superRefine(({ password, confirmPassword, phoneNumber }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "비밀번호가 일치하지 않습니다.",
        path: ["confirmPassword"],
      });
    }
    if (phoneNumber && !/^\d{3}-\d{4}-\d{4}$/.test(phoneNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "전화번호 형식이 올바르지 않습니다.",
        path: ["phoneNumber"],
      });
    }
  });

export default function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      socialId: "",
      password: "",
      confirmPassword: "",
      provider: "local",
      name: "",
      phoneNumber: "",
      bio: "",
      profileImage: null,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // FormData 생성
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("name", values.name);
      formData.append("provider", values.provider);

      if (values.phoneNumber) {
        formData.append("phoneNumber", values.phoneNumber);
      }
      if (values.bio) {
        formData.append("bio", values.bio);
      }
      if (values.profileImage) {
        formData.append("profileImage", values.profileImage);
      }

      const response = await apiClient.post(API_ROUTES.USERS.SIGNUP.url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("회원가입 성공!", {
          description: "환영합니다! 로그인 페이지로 이동합니다.",
        });

        // 2초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      }
    } catch (error: any) {
      console.error("회원가입 에러:", error);

      // 백엔드 에러 응답 구조에 따라 처리
      const errorType = error.response?.data?.error?.type;
      const errorMessage = error.response?.data?.message || getErrorMessage(errorType) || "회원가입에 실패했습니다.";

      toast.error("회원가입 실패", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full h-full min-h-[720px] flex items-center justify-center gap-6 pt-15">
      {/* 퍼블리싱 부터  */}
      <div className="w-100 max-w-100 flex flex-col px-6 gap-6">
        <div className="flex flex-col">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">회원가입</h4>
          <p className="text-muted-foreground">회원가입을 위한 정보를 입력해주세요.</p>
        </div>
        <div className="grid gap-3">
          {/* 회원가입 폼 */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* 프로필 이미지 업로더 */}
              <FormField
                control={form.control}
                name="profileImage"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      Profile Image <span className="text-xs">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <AvatarUpload {...field} value={value instanceof File ? URL.createObjectURL(value) : undefined} onChange={onChange} disabled={false} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      Email <span className="text-xs text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="이메일을 입력해주세요" {...field} />
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
                    <FormLabel className="text-muted-foreground">
                      Password <span className="text-xs text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="비밀번호를 입력해주세요" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      Confirm Password <span className="text-xs text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="비밀번호 확인을 입력해주세요" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      Name <span className="text-xs text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="이름을 입력해주세요" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      Phone Number <span className="text-xs">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="전화번호를 입력해주세요" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      Bio <span className="text-xs">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="소개를 입력해주세요" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              <div className="w-full flex flex-col gap-3">
                <Button type="submit" className="flex-1 !bg-blue-800/50" variant="outline">
                  회원가입
                </Button>
                <div className="text-center text-muted-foreground">
                  이미 계정이 있으신가요?
                  <NavLink to={"/signin"} className="text-primary underline ml-2">
                    로그인
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
