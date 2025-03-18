"use client";

import { useState, useEffect } from "react";
import {
  getProfile,
  updateProfile,
  type User,
  type UpdateProfileData,
} from "@/services/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.error("Profil bilgileri yüklenirken hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const data: UpdateProfileData = {
      name: (formData.get("name") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
      currentPassword: (formData.get("currentPassword") as string) || undefined,
      newPassword: (formData.get("newPassword") as string) || undefined,
    };

    // Boş alanları temizle
    Object.keys(data).forEach((key) => {
      if (!data[key as keyof UpdateProfileData]) {
        delete data[key as keyof UpdateProfileData];
      }
    });

    try {
      const updatedUser = await updateProfile(data);
      setUser(updatedUser);
      setSuccess("Profil bilgileriniz başarıyla güncellendi.");

      // Şifre alanlarını temizle
      const form = e.currentTarget as HTMLFormElement;
      form.currentPassword.value = "";
      form.newPassword.value = "";
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Profil güncellenirken bir hata oluştu.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Profil Ayarları
          </h2>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Ad Soyad"
              name="name"
              defaultValue={user?.name}
              required
            />

            <Input
              label="E-posta"
              name="email"
              type="email"
              defaultValue={user?.email}
              required
            />

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">
                Şifre Değiştir
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Şifrenizi değiştirmek istemiyorsanız bu alanları boş
                bırakabilirsiniz.
              </p>

              <div className="mt-6 space-y-6">
                <Input
                  label="Mevcut Şifre"
                  name="currentPassword"
                  type="password"
                />

                <Input label="Yeni Şifre" name="newPassword" type="password" />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" isLoading={isSaving}>
                Değişiklikleri Kaydet
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
