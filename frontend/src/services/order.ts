import type { Product } from "./menu";
// İleriki API entegrasyonu için api import ediliyor
// Şu anda mock verilerle çalışıyoruz, ancak api kullanılmadığı için
// yorum satırına alıyorum
// import { api } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
// Bu dosya şimdilik boş bırakılmıştır çünkü backend'de karşılık gelen order servisleri henüz geliştirilmemiştir.
// Backend'de order servisleri eklendikten sonra burayı güncelleyeceğiz.

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  notes?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderItem {
  productId: string;
  quantity: number;
  notes?: string;
}

export interface CreateOrder {
  tableNumber: number;
  items: CreateOrderItem[];
}

// Tüm api isteklerinde tenant ID kontrolü yapmak için yardımcı fonksiyon
function getTenantId(): string {
  const tenantId = useAuthStore.getState().tenantId;
  if (!tenantId) {
    throw new Error("Tenant ID bulunamadı. Lütfen tekrar giriş yapınız.");
  }
  return tenantId;
}

// NOT: Bu servisler backend'de henüz uygulanmadı
// Order servislerinin mocklanmış versiyonları geçici olarak bırakılmıştır

export async function getOrders(status?: OrderStatus): Promise<Order[]> {
  try {
    // Tenant ID otomatik olarak interceptor tarafından header'a eklenir
    // Burada kontrol etmemize gerek yok, zaten axios interceptor yapıyor
    // Ancak debugging için kontrol ediyoruz
    const tenantId = getTenantId();
    console.log(`getOrders çağrıldı, tenant ID: ${tenantId}`);

    // Gerçek API entegrasyonu için (şimdilik mock data):
    // const queryParams = status ? `?status=${status}` : '';
    // const response = await api.get(`/orders${queryParams}`);
    // return response.data;

    // Mock data
    // İleriki geliştirmede statusa göre filtreleme eklenecek
    console.log(`Siparişler sorgulandı, filtre: ${status || "tümü"}`);
    return getMockOrders();
  } catch (error) {
    console.error("Siparişleri getirirken hata:", error);
    throw error;
  }
}

export async function getOrder(id: string): Promise<Order> {
  try {
    // Tenant ID kontrolü
    const tenantId = getTenantId();
    console.log(`getOrder çağrıldı, sipariş ID: ${id}, tenant ID: ${tenantId}`);

    // Gerçek API entegrasyonu için:
    // const response = await api.get(`/orders/${id}`);
    // return response.data;

    // Mock data
    const mockOrder = getMockOrders().find((order) => order.id === id);
    if (!mockOrder) {
      throw new Error("Sipariş bulunamadı");
    }
    return mockOrder;
  } catch (error) {
    console.error("Siparişi getirirken hata:", error);
    throw error;
  }
}

export async function createOrder(data: CreateOrder): Promise<Order> {
  try {
    // Tenant ID kontrolü
    const tenantId = getTenantId();
    console.log(`createOrder çağrıldı, tenant ID: ${tenantId}`, data);

    // Gerçek API entegrasyonu için:
    // const response = await api.post('/orders', data);
    // return response.data;

    // Mock data
    const mockProducts = getMockProducts();
    const mockItems = data.items.map((item) => {
      const product = mockProducts.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Ürün bulunamadı: ${item.productId}`);
      }

      return {
        id: `item-${Math.random().toString(36).substring(7)}`,
        orderId: "new-order",
        productId: item.productId,
        product,
        quantity: item.quantity,
        notes: item.notes,
        createdAt: new Date().toISOString(),
      };
    });

    const order: Order = {
      id: `order-${Math.random().toString(36).substring(7)}`,
      tableNumber: data.tableNumber,
      status: "pending",
      items: mockItems,
      totalAmount: mockItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return order;
  } catch (error) {
    console.error("Sipariş oluştururken hata:", error);
    throw error;
  }
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order> {
  try {
    // Tenant ID kontrolü
    const tenantId = getTenantId();
    console.log(
      `updateOrderStatus çağrıldı, sipariş ID: ${id}, yeni durum: ${status}, tenant ID: ${tenantId}`
    );

    // Gerçek API entegrasyonu için:
    // const response = await api.patch(`/orders/${id}/status`, { status });
    // return response.data;

    // Mock data
    const mockOrder = getMockOrders().find((order) => order.id === id);
    if (!mockOrder) {
      throw new Error("Sipariş bulunamadı");
    }

    return {
      ...mockOrder,
      status,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Sipariş durumunu güncellerken hata:", error);
    throw error;
  }
}

export async function cancelOrder(id: string): Promise<void> {
  try {
    // Tenant ID kontrolü
    const tenantId = getTenantId();
    console.log(
      `cancelOrder çağrıldı, sipariş ID: ${id}, tenant ID: ${tenantId}`
    );

    // Gerçek API entegrasyonu için:
    // await api.delete(`/orders/${id}`);
    // return;

    // Mock işlem
    console.log(`Sipariş iptal edildi (mock): ${id}`);
    return;
  } catch (error) {
    console.error("Siparişi iptal ederken hata:", error);
    throw error;
  }
}

// Mock veriler - backend hazır olduğunda kaldırılacak
function getMockOrders(): Order[] {
  const mockProducts = getMockProducts();
  return [
    {
      id: "order-1",
      tableNumber: 1,
      status: "preparing",
      items: [
        {
          id: "item-1",
          orderId: "order-1",
          productId: "product-1",
          product: mockProducts[0],
          quantity: 2,
          createdAt: new Date().toISOString(),
        },
        {
          id: "item-2",
          orderId: "order-1",
          productId: "product-2",
          product: mockProducts[1],
          quantity: 1,
          notes: "Az soslu",
          createdAt: new Date().toISOString(),
        },
      ],
      totalAmount: mockProducts[0].price * 2 + mockProducts[1].price,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Diğer mock siparişler...
  ];
}

function getMockProducts(): Product[] {
  return [
    {
      id: "product-1",
      name: "Cheeseburger",
      description: "Klasik peynirli burger",
      price: 85,
      categoryId: "category-1",
      imageUrl: "/images/cheeseburger.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "product-2",
      name: "Pizza Margarita",
      description: "Domates sosu, mozarella peyniri ve fesleğenli pizza",
      price: 110,
      categoryId: "category-2",
      imageUrl: "/images/pizza-margarita.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Diğer mock ürünler...
  ];
}
