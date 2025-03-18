"use client";

import { useState, useRef } from "react";
import {
  createProduct,
  updateProduct,
  uploadProductImage,
  type Product,
  type Category,
} from "@/services/menu";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/stores/auth";

interface ProductModalProps {
  product?: Product;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductModal({
  product,
  categories,
  isOpen,
  onClose,
  onSuccess,
}: ProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const authStore = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Token kontrolü
    if (!authStore.token) {
      const errorMsg = "İşlem için oturum bilgisi bulunamadı.";
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);

    // Form verilerini topla
    const formValues: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        formValues[key] = value;
      }
    }

    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      categoryId: formData.get("categoryId") as string,
      preparationTime:
        parseInt(formData.get("preparationTime") as string) || undefined,
      nutritionInfo: {
        calories: parseInt(formData.get("calories") as string) || undefined,
        protein: parseInt(formData.get("protein") as string) || undefined,
        carbs: parseInt(formData.get("carbs") as string) || undefined,
        fat: parseInt(formData.get("fat") as string) || undefined,
      },
      allergens: ((formData.get("allergens") as string) || "")
        .split(",")
        .map((allergen) => allergen.trim())
        .filter(Boolean),
    };

    try {
      let productId: string;

      if (product) {
        const updatedProduct = await updateProduct(product._id, data);
        productId = updatedProduct._id;
      } else {
        const newProduct = await createProduct(data);
        productId = newProduct._id;
      }

      if (productId) {
        const imageFile = fileInputRef.current?.files?.[0];
        if (imageFile) {
          await uploadProductImage(productId, imageFile);
        }
      } else {
      }

      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error("Ürün işlemi hatası:", error);

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
  console.log(categories);
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
                {product ? "Ürün Düzenle" : "Yeni Ürün"}
              </h3>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Input
                  label="Ürün Adı"
                  name="name"
                  defaultValue={product?.name}
                  required
                />

                <Input
                  label="Açıklama"
                  name="description"
                  defaultValue={product?.description}
                />

                <Input
                  label="Fiyat"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={product?.price}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kategori
                  </label>
                  <select
                    name="categoryId"
                    defaultValue={product?.categoryId}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Hazırlanma Süresi (dakika)"
                  name="preparationTime"
                  type="number"
                  defaultValue={product?.preparationTime}
                />

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Besin Değerleri</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Kalori"
                      name="calories"
                      type="number"
                      defaultValue={product?.nutritionInfo?.calories}
                    />
                    <Input
                      label="Protein (g)"
                      name="protein"
                      type="number"
                      defaultValue={product?.nutritionInfo?.protein}
                    />
                    <Input
                      label="Karbonhidrat (g)"
                      name="carbs"
                      type="number"
                      defaultValue={product?.nutritionInfo?.carbs}
                    />
                    <Input
                      label="Yağ (g)"
                      name="fat"
                      type="number"
                      defaultValue={product?.nutritionInfo?.fat}
                    />
                  </div>
                </div>

                <Input
                  label="Alerjenler (virgülle ayırın)"
                  name="allergens"
                  defaultValue={product?.allergens?.join(", ")}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ürün Görseli
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <Button
                    type="submit"
                    className="w-full sm:ml-3 sm:w-auto"
                    isLoading={isLoading}
                  >
                    {product ? "Güncelle" : "Oluştur"}
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
