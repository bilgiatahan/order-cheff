import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-posta adresi gereklidir")
    .email("Geçerli bir e-posta adresi giriniz"),
  password: z
    .string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .max(100, "Şifre çok uzun"),
});

export const registerSchema = z.object({
  businessName: z
    .string()
    .min(2, "İşletme adı en az 2 karakter olmalıdır")
    .max(50, "İşletme adı çok uzun"),
  subdomain: z
    .string()
    .min(3, "Alt alan adı en az 3 karakter olmalıdır")
    .max(30, "Alt alan adı çok uzun")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Alt alan adı sadece küçük harf, rakam ve tire içerebilir"
    ),
  email: z
    .string()
    .min(1, "E-posta adresi gereklidir")
    .email("Geçerli bir e-posta adresi giriniz"),
  password: z
    .string()
    .min(8, "Şifre en az 8 karakter olmalıdır")
    .max(100, "Şifre çok uzun")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
      "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir"
    ),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
