"use client";

import { useState } from "react";
import {
  createStaff,
  updateStaff,
  hasPermission,
  type User,
  type UserRole,
  type CreateStaffData,
  type UpdateStaffData,
} from "@/services/auth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface StaffModalProps {
  staff?: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (staff: User) => void;
  currentUserRole: UserRole;
}

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "staff", label: "Personel" },
  { value: "manager", label: "Müdür" },
  { value: "admin", label: "Yönetici" },
];

export default function StaffModal({
  staff,
  isOpen,
  onClose,
  onSuccess,
  currentUserRole,
}: StaffModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      if (staff) {
        // Personel güncelleme
        const data: UpdateStaffData = {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          role: formData.get("role") as UserRole,
        };

        const password = formData.get("password") as string;
        if (password) {
          data.password = password;
        }

        const updatedStaff = await updateStaff(staff.id, data);
        onSuccess(updatedStaff);
      } else {
        // Yeni personel ekleme
        const data: CreateStaffData = {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
          role: formData.get("role") as UserRole,
        };

        const newStaff = await createStaff(data);
        onSuccess(newStaff);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />

        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <span className="sr-only">Kapat</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {staff ? "Personel Düzenle" : "Yeni Personel Ekle"}
              </h3>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Input
                  label="Ad Soyad"
                  name="name"
                  defaultValue={staff?.name}
                  required
                />

                <Input
                  label="E-posta"
                  name="email"
                  type="email"
                  defaultValue={staff?.email}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Yetki
                  </label>
                  <select
                    name="role"
                    defaultValue={staff?.role || "staff"}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    {roleOptions
                      .filter((option) =>
                        hasPermission(
                          {
                            id: "",
                            name: "",
                            email: "",
                            role: currentUserRole,
                            createdAt: "",
                          },
                          option.value
                        )
                      )
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                </div>

                <Input
                  label={staff ? "Yeni Şifre" : "Şifre"}
                  name="password"
                  type="password"
                  required={!staff}
                />

                {error && <div className="text-sm text-red-600">{error}</div>}

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <Button
                    type="submit"
                    className="w-full sm:ml-3 sm:w-auto"
                    isLoading={isLoading}
                  >
                    {staff ? "Güncelle" : "Ekle"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-3 w-full sm:mt-0 sm:w-auto"
                    onClick={onClose}
                  >
                    İptal
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
