import { api } from "@/lib/axios";

export interface Category {
  _id: string;
  name: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  preparationTime?: number;
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  allergens?: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Kategorileri getirirken hata:", error);
    throw error;
  }
}

export async function createCategory(
  data: Omit<Category, "_id" | "createdAt" | "updatedAt">
): Promise<Category> {
  try {
    const response = await api.post("/categories", data);
    return response.data;
  } catch (error) {
    console.error("Kategori oluştururken hata:", error);
    throw error;
  }
}

export async function updateCategory(
  id: string,
  data: Partial<Category>
): Promise<Category> {
  try {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Kategori güncellerken hata:", error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await api.delete(`/categories/${id}`);
  } catch (error) {
    console.error("Kategori silerken hata:", error);
    throw error;
  }
}

export async function getProducts(categoryId?: string): Promise<Product[]> {
  try {
    const url = categoryId ? `/products?categoryId=${categoryId}` : "/products";
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Ürünleri getirirken hata:", error);
    throw error;
  }
}

export const createProduct = async (
  data: Omit<Product, "_id" | "createdAt" | "updatedAt">
): Promise<Product> => {
  try {
    const response = await api.post("/products", data);
    return response.data;
  } catch (error) {
    console.error("Ürün oluştururken hata:", error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  data: Partial<Product>
): Promise<Product> => {
  try {
    const response = await api.patch(`/products/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Ürün güncellerken hata:", error);
    throw error;
  }
};

export async function deleteProduct(id: string): Promise<void> {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    console.error("Ürün silerken hata:", error);
    throw error;
  }
}

export const uploadProductImage = async (
  productId: string,
  imageFile: File
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    await api.post(`/products/${productId}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Ürün resmi yüklerken hata:", error);
    throw error;
  }
};
