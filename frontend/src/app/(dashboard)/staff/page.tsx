"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getProfile,
  getStaff,
  deleteStaff,
  hasPermission,
  type User,
  type UserRole,
} from "@/services/auth";
import Button from "@/components/ui/Button";
import StaffModal from "@/components/staff/StaffModal";

const roleLabels: Record<UserRole, string> = {
  admin: "Yönetici",
  manager: "Müdür",
  staff: "Personel",
};

const roleColors: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-800",
  manager: "bg-blue-100 text-blue-800",
  staff: "bg-green-100 text-green-800",
};

export default function StaffPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [staff, setStaff] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, staffData] = await Promise.all([
          getProfile(),
          getStaff(),
        ]);

        setCurrentUser(userData);

        if (!hasPermission(userData, "manager")) {
          router.push("/dashboard");
          return;
        }

        setStaff(staffData);
      } catch (error) {
        console.error("Veriler yüklenirken hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu personeli silmek istediğinize emin misiniz?")) {
      try {
        await deleteStaff(id);
        setStaff((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        console.error("Personel silinirken hata oluştu:", error);
      }
    }
  };

  const handleSuccess = (updatedStaff: User) => {
    setStaff((prev) => {
      const index = prev.findIndex((s) => s.id === updatedStaff.id);
      if (index === -1) {
        return [...prev, updatedStaff];
      }
      const newStaff = [...prev];
      newStaff[index] = updatedStaff;
      return newStaff;
    });
    setIsModalOpen(false);
    setSelectedStaff(null);
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
            Personel Yönetimi
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Button
            onClick={() => {
              setSelectedStaff(null);
              setIsModalOpen(true);
            }}
          >
            Yeni Personel Ekle
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          {staff.length === 0 ? (
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Personel bulunamadı
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Henüz hiç personel eklenmemiş.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ad Soyad
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      E-posta
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Yetki
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kayıt Tarihi
                    </th>
                    <th className="px-6 py-3 bg-gray-50"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staff.map((person) => (
                    <tr key={person.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {person.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {person.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            roleColors[person.role]
                          }`}
                        >
                          {roleLabels[person.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(person.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {hasPermission(currentUser, "admin") ||
                          (currentUser?.role === "manager" &&
                            person.role === "staff" && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedStaff(person);
                                    setIsModalOpen(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Düzenle
                                </button>
                                <button
                                  onClick={() => handleDelete(person.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Sil
                                </button>
                              </>
                            ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <StaffModal
        staff={selectedStaff}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStaff(null);
        }}
        onSuccess={handleSuccess}
        currentUserRole={currentUser?.role || "staff"}
      />
    </div>
  );
}
