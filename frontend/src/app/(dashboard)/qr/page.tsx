"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  generateQR,
  getQRCodes,
  downloadQR,
  deleteQR,
  type QRCode,
} from "@/services/qr";

export default function QRPage() {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQRCodes = async () => {
      try {
        const data = await getQRCodes();
        setQRCodes(data);
      } catch (error) {
        console.error("QR kodlar yüklenirken hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQRCodes();
  }, []);

  const handleGenerateQR = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const tableNumber = parseInt(formData.get("tableNumber") as string);

    try {
      const newQRCode = await generateQR(tableNumber);
      setQRCodes((prev) => [...prev, newQRCode]);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("QR kod oluşturulurken bir hata oluştu.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadQR = async (qrCode: QRCode) => {
    try {
      const blob = await downloadQR(qrCode.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `masa-${qrCode.tableNumber}-qr.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("QR kod indirilirken hata oluştu:", error);
    }
  };

  const handleDeleteQR = async (qrCode: QRCode) => {
    if (window.confirm("Bu QR kodu silmek istediğinize emin misiniz?")) {
      try {
        await deleteQR(qrCode.id);
        setQRCodes((prev) => prev.filter((q) => q.id !== qrCode.id));
      } catch (error) {
        console.error("QR kod silinirken hata oluştu:", error);
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
            QR Kod Yönetimi
          </h2>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Yeni QR Kod Oluştur
          </h3>
        </div>
        <div className="p-4">
          <form onSubmit={handleGenerateQR} className="space-y-4">
            <Input
              label="Masa Numarası"
              name="tableNumber"
              type="number"
              min={1}
              required
            />

            {error && <div className="text-sm text-red-600">{error}</div>}

            <Button type="submit" isLoading={isGenerating}>
              QR Kod Oluştur
            </Button>
          </form>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">QR Kodlar</h3>
        </div>
        <div className="p-4">
          {qrCodes.length === 0 ? (
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
                QR kod bulunamadı
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Henüz hiç QR kod oluşturmadınız.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {qrCodes.map((qrCode) => (
                <div
                  key={qrCode.id}
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="focus:outline-none">
                      <p className="text-sm font-medium text-gray-900">
                        Masa {qrCode.tableNumber}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {new Date(qrCode.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownloadQR(qrCode)}
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
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteQR(qrCode)}
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
  );
}
