"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { isZodError } from "@/types/zod";
import { register, checkSubdomain } from "@/services/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [generalError, setGeneralError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      businessName: formData.get("businessName") as string,
      subdomain: formData.get("subdomain") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      // Form validasyonu
      const validatedData = registerSchema.parse(data);

      // Subdomain kontrolü
      const isSubdomainAvailable = await checkSubdomain(
        validatedData.subdomain
      );
      if (!isSubdomainAvailable) {
        setErrors({
          subdomain: "Bu alt alan adı zaten kullanımda",
        });
        return;
      }

      // API'ye kayıt isteği gönder
      await register(validatedData);

      // Başarılı kayıt sonrası yönlendirme
      router.push("/dashboard");
    } catch (error: unknown) {
      if (isZodError(error)) {
        const fieldErrors: Partial<RegisterFormData> = {};
        error.errors.forEach((err) => {
          const [field] = err.path;
          fieldErrors[field as keyof RegisterFormData] = err.message;
        });
        setErrors(fieldErrors);
      } else if (error instanceof Error) {
        setGeneralError(error.message);
      } else {
        setGeneralError(
          "Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin."
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
              Yeni Hesap Oluşturun
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="İşletme Adı"
              type="text"
              name="businessName"
              autoComplete="organization"
              required
              error={errors.businessName}
            />

            <Input
              label="Alt Alan Adı"
              type="text"
              name="subdomain"
              autoComplete="off"
              required
              placeholder="isletmeniz"
              helperText="isletmeniz.ordercheff.com"
              error={errors.subdomain}
            />

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
              autoComplete="new-password"
              required
              error={errors.password}
            />

            {generalError && (
              <div className="text-sm text-red-600">{generalError}</div>
            )}

            <div>
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Hesap Oluştur
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
                  Zaten hesabınız var mı?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
