"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  getCategories,
  getProducts,
  deleteCategory,
  deleteProduct,
  type Category,
  type Product,
} from "@/services/menu";
import Button from "@/components/ui/Button";
import CategoryModal from "@/components/menu/CategoryModal";
import ProductModal from "@/components/menu/ProductModal";
import { useAuthStore } from "@/stores/auth";

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Category | Product | null>(
    null
  );

  const { token, tenantId } = useAuthStore();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!tenantId) {
        console.error("Tenant ID bulunamadı, veri yüklenemedi");
        setError("Oturum bilgisi eksik. Lütfen tekrar giriş yapın.");
        setIsLoading(false);
        return;
      }

      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getProducts(selectedCategory || undefined),
      ]);

      setCategories(categoriesData);
      setProducts(productsData);
    } catch (error) {
      console.error("Veri yüklenirken hata oluştu:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Oturum süreniz dolmuş. Lütfen yeniden giriş yapın.");
        } else if (error.response?.status === 403) {
          setError("Bu içeriğe erişim izniniz yok.");
        } else if (error.response?.status === 404) {
          setError("İstediğiniz içerik bulunamadı.");
        } else if (error.response && error.response.status >= 500) {
          setError("Sunucu hatası. Lütfen daha sonra tekrar deneyin.");
        } else {
          setError(
            "Menü verileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
          );
        }
      } else {
        setError(
          "Menü verileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Kullanıcı oturum bilgilerini kontrol et
    if (!token || !tenantId) {
      console.warn("Kullanıcı kimliği eksik, yüklemeyi atlıyoruz");
      return;
    }

    fetchData();
  }, [selectedCategory, token, tenantId]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedItem(category);
    setIsCategoryModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedItem(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) {
      try {
        await deleteCategory(categoryId);
        await fetchData();
      } catch (error) {
        console.error("Kategori silinirken hata oluştu:", error);
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      try {
        await deleteProduct(productId);
        await fetchData();
      } catch (error) {
        console.error("Ürün silinirken hata oluştu:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-red-500 text-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {error}
        </div>
        <Button onClick={fetchData}>Yeniden Dene</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Menü Yönetimi
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedItem(null);
              setIsCategoryModalOpen(true);
            }}
          >
            Yeni Kategori
          </Button>
          <Button
            onClick={() => {
              setSelectedItem(null);
              setIsProductModalOpen(true);
            }}
          >
            Yeni Ürün
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Kategoriler */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Kategoriler</h3>
            </div>
            <nav className="flex-1 overflow-y-auto" aria-label="Kategoriler">
              <div className="border-b border-gray-200">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    getProducts().then(setProducts);
                  }}
                  className={`w-full px-3 py-2 text-sm font-medium text-left hover:bg-gray-50 ${
                    !selectedCategory
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  Tüm Ürünler
                </button>
              </div>
              {categories.map((category, index) => (
                <div key={index} className="border-b border-gray-200">
                  <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-50">
                    <button
                      onClick={() => handleCategoryClick(category._id)}
                      className={`flex-1 text-sm font-medium text-left ${
                        selectedCategory === category._id
                          ? "text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      {category.name}
                    </button>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Ürünler */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white shadow rounded-lg">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Ürünler</h3>
            </div>
            <div className="p-4">
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Ürün bulunamadı
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Bu kategoride henüz ürün bulunmuyor.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="focus:outline-none">
                          <p className="text-sm font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {product.price} ₺
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CategoryModal
        category={selectedItem as Category}
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setSelectedItem(null);
        }}
        onSuccess={fetchData}
      />

      <ProductModal
        product={selectedItem as Product}
        categories={categories}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedItem(null);
        }}
        onSuccess={fetchData}
      />
    </div>
  );
}
