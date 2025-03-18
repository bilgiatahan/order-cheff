"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { isZodError } from "@/types/zod";
import { login } from "@/services/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [generalError, setGeneralError] = useState("");

  // Sayfa yüklendiğinde tenant ID hata kontrolü
  useEffect(() => {
    // localStorage'dan auth_error_reason kontrolü
    const errorReason = localStorage.getItem("auth_error_reason");
    if (errorReason === "tenant_missing") {
      setGeneralError(
        "Oturum bilgilerinizde bir sorun oluştu (Tenant ID bulunamadı). Lütfen tekrar giriş yapın."
      );
      // Bir kez gösterildikten sonra temizle
      localStorage.removeItem("auth_error_reason");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      // Form validasyonu
      const validatedData = loginSchema.parse(data);

      // API'ye giriş isteği gönder
      await login(validatedData);

      // Başarılı giriş sonrası yönlendirme
      router.push("/dashboard");
    } catch (error: unknown) {
      if (isZodError(error)) {
        const fieldErrors: Partial<LoginFormData> = {};
        error.errors.forEach((err) => {
          const [field] = err.path;
          fieldErrors[field as keyof LoginFormData] = err.message;
        });
        setErrors(fieldErrors);
      } else if (error instanceof Error) {
        // Tenant ID hatası için özel mesaj
        if (
          error.message.includes("tenant") ||
          error.message.includes("Token")
        ) {
          setGeneralError(
            `${error.message}. Lütfen tekrar giriş yapmayı deneyin.`
          );
        } else {
          setGeneralError(error.message);
        }
      } else {
        setGeneralError(
          "Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Hesabınıza Giriş Yapın
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="E-posta Adresi"
              type="email"
              name="email"
              autoComplete="email"
              required
              error={errors.email}
            />

            <Input
              label="Şifre"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              error={errors.password}
            />

            {generalError && (
              <div className="bg-red-50 border border-red-200 text-sm text-red-600 p-3 rounded">
                {generalError}
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Giriş Yap
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Hesabınız yok mu?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/register"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Yeni Hesap Oluştur
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
