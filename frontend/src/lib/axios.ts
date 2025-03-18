import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    const tenantId = useAuthStore.getState().tenantId;

    const isAuthEndpoint = config.url?.startsWith("/auth/");

    // Token varsa her requeste ekle
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Tenant ID kontrolü
    if (tenantId) {
      // Tenant ID varsa, auth dışındaki tüm isteklere ekle
      config.headers["x-tenant-id"] = tenantId;
      console.log(
        `Tenant ID header'a eklendi: ${tenantId}, URL: ${config.url}`
      );
    } else if (!isAuthEndpoint) {
      // Auth endpoint'i değilse ve tenantId yoksa, bu bir hatadır
      // TÜM endpoint'ler (auth hariç) tenant ID gerektirir
      const warning = `Tenant ID bu endpoint için zorunludur, ancak bulunamadı: ${config.url}`;
      console.warn(warning);

      // Login sayfasında değilsek yönlendir
      if (
        typeof window !== "undefined" &&
        !window.location.href.includes("/login")
      ) {
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
        throw new Error(
          "Tenant bilgisi bulunamadı. Lütfen tekrar giriş yapın."
        );
      }
    }

    return config;
  },
  (error) => {
    console.error("İstek hatası:", error);
    return Promise.reject(error);
  }
);

// Yanıt interceptor'ı
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const errorData = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };

    console.error("Yanıt hatası:", errorData);

    if (error.response?.status === 401) {
      console.log("401 hatası, oturum kapatılıyor (yönlendirme aktif)");

      // Tenant bulunamadı hatası için özel mesaj
      if (
        error.response?.data?.message?.includes("Tenant bilgisi bulunamadı")
      ) {
        console.error(
          "Önemli: Tenant ID bulunamadı hatası. Oturum bilgileri kontrol edilmeli."
        );
      }

      // Yönlendirmeyi aktif hale getiriyoruz
      // if (
      //   typeof window !== "undefined" &&
      //   !window.location.href.includes("/login")
      // ) {
      //   useAuthStore.getState().clearAuth();
      //   window.location.href = "/login";
      // }
    }
    return Promise.reject(error);
  }
);
