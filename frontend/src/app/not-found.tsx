import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="max-w-2xl w-full mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              404 hatası
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              Sayfa Bulunamadı
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Üzgünüz, aradığınız sayfayı bulamadık. Sayfa kaldırılmış, adı
              değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Ana Sayfaya Dön
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Bize Ulaşın
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
