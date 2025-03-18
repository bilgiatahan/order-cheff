import { api } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";

export type UserRole = "admin" | "manager" | "staff";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  businessName: string;
  subdomain: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface CreateStaffData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateStaffData {
  name?: string;
  email?: string;
  role?: UserRole;
  password?: string;
}

export async function login(credentials: LoginCredentials): Promise<void> {
  try {
    console.log("Login isteği gönderiliyor...");
    const response = await api.post("/auth/login", credentials);
    console.log("Login yanıtı:", response.data);

    const { token } = response.data;
    if (!token) {
      throw new Error("Token alınamadı");
    }

    // JWT token'ı decode et ve tenant ID'yi al
    try {
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        throw new Error("Geçersiz JWT token formatı");
      }

      const payload = tokenParts[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = JSON.parse(
        typeof window !== "undefined"
          ? window.atob(base64)
          : Buffer.from(base64, "base64").toString("binary")
      );

      console.log("Decoded token:", decodedPayload);

      if (!decodedPayload.tenantId) {
        throw new Error("Token içinde tenant ID bulunamadı");
      }

      const tenantId = decodedPayload.tenantId;
      console.log("Tenant ID:", tenantId);

      useAuthStore.getState().setToken(token);
      useAuthStore.getState().setTenantId(tenantId);
      console.log("Token ve tenant ID store'a kaydedildi");
    } catch (error) {
      console.error("Token decode hatası:", error);
      throw new Error("Token işlenirken hata oluştu");
    }
  } catch (error) {
    console.error("Login hatası:", error);
    throw error;
  }
}

export async function register(
  credentials: RegisterCredentials
): Promise<void> {
  try {
    const response = await api.post("/auth/register", credentials);
    const { token } = response.data;

    if (!token) {
      throw new Error("Token alınamadı");
    }

    // JWT token'ı decode et ve tenant ID'yi al
    try {
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        throw new Error("Geçersiz JWT token formatı");
      }

      const payload = tokenParts[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = JSON.parse(
        typeof window !== "undefined"
          ? window.atob(base64)
          : Buffer.from(base64, "base64").toString("binary")
      );

      if (!decodedPayload.tenantId) {
        throw new Error("Token içinde tenant ID bulunamadı");
      }

      const tenantId = decodedPayload.tenantId;
      console.log("Tenant ID:", tenantId);

      useAuthStore.getState().setToken(token);
      useAuthStore.getState().setTenantId(tenantId);
      console.log("Token ve tenant ID store'a kaydedildi");
    } catch (error) {
      console.error("Token decode hatası:", error);
      throw new Error("Token işlenirken hata oluştu");
    }
  } catch (error) {
    console.error("Kayıt hatası:", error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  useAuthStore.getState().clearAuth();
}

export async function checkSubdomain(subdomain: string): Promise<boolean> {
  try {
    await api.get(`/auth/check-subdomain/${subdomain}`);
    return true;
  } catch {
    return false;
  }
}

// NOT: Aşağıdaki servisler backend'de henüz uygulanmadı
// Mock versiyonlarını geçici olarak kullanıyoruz

export async function getProfile(): Promise<User> {
  console.warn(
    "Profile servis endpointi henüz backend'de uygulanmamıştır. Mock veri dönülüyor."
  );
  return {
    id: "mock-user",
    name: "Demo Kullanıcı",
    email: "demo@example.com",
    role: "admin",
    createdAt: new Date().toISOString(),
  };
}

export async function updateProfile(data: UpdateProfileData): Promise<User> {
  console.warn(
    "Profile servis endpointi henüz backend'de uygulanmamıştır. Mock veri dönülüyor."
  );
  return {
    id: "mock-user",
    name: data.name || "Demo Kullanıcı",
    email: data.email || "demo@example.com",
    role: "admin",
    createdAt: new Date().toISOString(),
  };
}

// Personel yönetimi servisleri
export async function getStaff(): Promise<User[]> {
  console.warn(
    "Staff servis endpointi henüz backend'de uygulanmamıştır. Mock veri dönülüyor."
  );
  return [
    {
      id: "mock-user-1",
      name: "Demo Admin",
      email: "admin@example.com",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "mock-user-2",
      name: "Demo Yönetici",
      email: "manager@example.com",
      role: "manager",
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function createStaff(data: CreateStaffData): Promise<User> {
  console.warn(
    "Staff servis endpointi henüz backend'de uygulanmamıştır. Mock veri dönülüyor."
  );
  return {
    id: `mock-user-${Math.random().toString(36).substring(7)}`,
    name: data.name,
    email: data.email,
    role: data.role,
    createdAt: new Date().toISOString(),
  };
}

export async function updateStaff(
  _id: string,
  data: UpdateStaffData
): Promise<User> {
  console.warn(
    "Staff servis endpointi henüz backend'de uygulanmamıştır. Mock veri dönülüyor."
  );
  return {
    id: "mock-user",
    name: data.name || "Demo Kullanıcı",
    email: data.email || "demo@example.com",
    role: data.role || "admin",
    createdAt: new Date().toISOString(),
  };
}

export async function deleteStaff(_id: string): Promise<void> {
  console.warn("Staff servis endpointi henüz backend'de uygulanmamıştır.");
  return Promise.resolve();
}

// Yetki kontrolü için yardımcı fonksiyonlar
export function hasPermission(
  user: User | null,
  requiredRole: UserRole
): boolean {
  if (!user) return false;

  const roleHierarchy: Record<UserRole, number> = {
    admin: 3,
    manager: 2,
    staff: 1,
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}
