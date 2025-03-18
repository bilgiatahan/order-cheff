"use client";

import { useState, useEffect } from "react";
import {
  getOrders,
  updateOrderStatus,
  cancelOrder,
  type Order,
  type OrderStatus,
} from "@/services/order";
import Button from "@/components/ui/Button";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Bekliyor",
  preparing: "Hazırlanıyor",
  ready: "Hazır",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
};

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  delivered: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    OrderStatus | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await getOrders(selectedStatus);
      setOrders(data);
    } catch (error) {
      console.error("Siparişler yüklenirken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      await fetchOrders();
    } catch (error) {
      console.error("Sipariş durumu güncellenirken hata oluştu:", error);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm("Bu siparişi iptal etmek istediğinize emin misiniz?")) {
      try {
        await cancelOrder(orderId);
        await fetchOrders();
      } catch (error) {
        console.error("Sipariş iptal edilirken hata oluştu:", error);
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

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Sipariş Yönetimi
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <select
            value={selectedStatus || ""}
            onChange={(e) =>
              setSelectedStatus(
                (e.target.value || undefined) as OrderStatus | undefined
              )
            }
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Tüm Siparişler</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          {orders.length === 0 ? (
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
                Sipariş bulunamadı
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Henüz hiç sipariş bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border rounded-lg overflow-hidden"
                >
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-medium">
                          Masa {order.tableNumber}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[order.status]
                          }`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString("tr-TR")}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.product.name} x {item.quantity}
                            </div>
                            {item.notes && (
                              <div className="text-sm text-gray-500">
                                Not: {item.notes}
                              </div>
                            )}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {(item.product.price * item.quantity).toFixed(2)} ₺
                          </div>
                        </div>
                      ))}
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between font-medium">
                          <span>Toplam</span>
                          <span>{order.totalAmount.toFixed(2)} ₺</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {order.status !== "cancelled" &&
                    order.status !== "delivered" && (
                      <div className="px-4 py-3 bg-gray-50 text-right space-x-3">
                        {order.status === "pending" && (
                          <Button
                            onClick={() =>
                              handleStatusChange(order.id, "preparing")
                            }
                          >
                            Hazırlanmaya Başla
                          </Button>
                        )}
                        {order.status === "preparing" && (
                          <Button
                            onClick={() =>
                              handleStatusChange(order.id, "ready")
                            }
                          >
                            Hazır
                          </Button>
                        )}
                        {order.status === "ready" && (
                          <Button
                            onClick={() =>
                              handleStatusChange(order.id, "delivered")
                            }
                          >
                            Teslim Edildi
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          İptal Et
                        </Button>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
