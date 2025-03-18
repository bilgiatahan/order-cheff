"use client";

import { useState } from "react";
import { createCategory, updateCategory, type Category } from "@/services/menu";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface CategoryModalProps {
  category?: Category;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CategoryModal({
  category,
  isOpen,
  onClose,
  onSuccess,
}: CategoryModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      order: parseInt(formData.get("order") as string) || 0,
    };

    try {
      if (category) {
        await updateCategory(category.id, data);
      } else {
        await createCategory(data);
      }
      onSuccess();
      onClose();
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
                {category ? "Kategori Düzenle" : "Yeni Kategori"}
              </h3>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Input
                  label="Kategori Adı"
                  name="name"
                  defaultValue={category?.name}
                  required
                />

                <Input
                  label="Açıklama"
                  name="description"
                  defaultValue={category?.description}
                />

                <Input
                  label="Sıra"
                  name="order"
                  type="number"
                  defaultValue={category?.order}
                  min={0}
                />

                {error && <div className="text-sm text-red-600">{error}</div>}

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <Button
                    type="submit"
                    className="w-full sm:ml-3 sm:w-auto"
                    isLoading={isLoading}
                  >
                    {category ? "Güncelle" : "Oluştur"}
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
