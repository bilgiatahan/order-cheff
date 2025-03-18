// Bu dosya şimdilik boş bırakılmıştır çünkü backend'de karşılık gelen QR servisleri henüz geliştirilmemiştir.
// Backend'de QR servisleri eklendikten sonra burayı güncelleyeceğiz.
// İleriki API entegrasyonu için:
// import { api } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";

export interface QRCode {
  id: string;
  tableNumber: number;
  url: string;
  createdAt: string;
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
// QR servislerinin mocklanmış versiyonları geçici olarak bırakılmıştır

// Gerçekleştirim gelene kadar mock veri dönelim
export async function generateQR(tableNumber: number): Promise<QRCode> {
  try {
    // Tenant ID kontrolü
    const tenantId = getTenantId();
    console.log(
      `generateQR çağrıldı, masa no: ${tableNumber}, tenant ID: ${tenantId}`
    );

    // İleride gerçek API çağrısı yapılacak
    // Bu kod aktif edilecek:
    // const response = await api.post("/qr", { tableNumber });
    // return response.data;

    return {
      id: `mock-${Math.random().toString(36).substring(7)}`,
      tableNumber,
      url: `https://example.com/qr/${tableNumber}`,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("QR kodu oluştururken hata:", error);
    throw error;
  }
}

export async function getQRCodes(): Promise<QRCode[]> {
  try {
    // Tenant ID kontrolü
    const tenantId = getTenantId();
    console.log(`getQRCodes çağrıldı, tenant ID: ${tenantId}`);

    // İleride gerçek API çağrısı yapılacak
    // Bu kod aktif edilecek:
    // const response = await api.get("/qr");
    // return response.data;

    // Mock veri dönelim
    return [
      {
        id: "mock-qr-1",
        tableNumber: 1,
        url: "https://example.com/qr/1",
        createdAt: new Date().toISOString(),
      },
      {
        id: "mock-qr-2",
        tableNumber: 2,
        url: "https://example.com/qr/2",
        createdAt: new Date().toISOString(),
      },
      {
        id: "mock-qr-3",
        tableNumber: 3,
        url: "https://example.com/qr/3",
        createdAt: new Date().toISOString(),
      },
    ];
  } catch (error) {
    console.error("QR kodlarını getirirken hata:", error);
    throw error;
  }
}

export async function downloadQR(id: string): Promise<Blob> {
  try {
    // Tenant ID kontrolü
    const tenantId = getTenantId();
    console.log(`downloadQR çağrıldı, QR ID: ${id}, tenant ID: ${tenantId}`);

    // İleride gerçek API çağrısı yapılacak
    // Bu kod aktif edilecek:
    // const response = await api.get(`/qr/${id}/download`, { responseType: 'blob' });
    // return response.data;

    // Mock veri - boş bir PNG blob döndür
    return new Blob(["Mock QR Image"], { type: "image/png" });
  } catch (error) {
    console.error("QR kodunu indirirken hata:", error);
    throw error;
  }
}

export async function deleteQR(id: string): Promise<void> {
  try {
    // Tenant ID kontrolü
    const tenantId = getTenantId();
    console.log(`deleteQR çağrıldı, QR ID: ${id}, tenant ID: ${tenantId}`);

    // İleride gerçek API çağrısı yapılacak
    // Bu kod aktif edilecek:
    // await api.delete(`/qr/${id}`);

    console.log(`QR kodu silindi (mock): ${id}`);
    return;
  } catch (error) {
    console.error("QR kodunu silerken hata:", error);
    throw error;
  }
}
