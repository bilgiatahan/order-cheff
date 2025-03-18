import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Restoranınızı Dijitalleştirin
                </h1>
                <p className="text-xl mb-8">
                  OrderCheff ile müşterilerinize modern bir sipariş deneyimi
                  sunun. QR menü sistemi ile siparişleri kolayca yönetin.
                </p>
                <div className="flex gap-4">
                  <Link
                    href="/register"
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
                  >
                    Hemen Başlayın
                  </Link>
                  <Link
                    href="/about"
                    className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
                  >
                    Daha Fazla Bilgi
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <Image
                  src="/restaurant.jpg"
                  alt="Restaurant Management"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Özellikler</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="mb-6">
                  <Image
                    src="/icons/qr-code.svg"
                    alt="QR Menü"
                    width={64}
                    height={64}
                    className="mx-auto text-blue-600"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4">QR Menü Sistemi</h3>
                <p className="text-gray-600">
                  Masalarınıza özel QR kodlar ile müşterilerinize kolay erişim
                  sağlayın.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="mb-6">
                  <Image
                    src="/icons/order.svg"
                    alt="Sipariş Yönetimi"
                    width={64}
                    height={64}
                    className="mx-auto text-blue-600"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4">Sipariş Yönetimi</h3>
                <p className="text-gray-600">
                  Gelen siparişleri anlık takip edin ve hızlıca işleme alın.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="mb-6">
                  <Image
                    src="/icons/analytics.svg"
                    alt="Analitik"
                    width={64}
                    height={64}
                    className="mx-auto text-blue-600"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Analitik Raporlar
                </h3>
                <p className="text-gray-600">
                  Satış ve performans verilerinizi detaylı raporlarla analiz
                  edin.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-900 text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Hemen Şimdi Başlayın</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Restoranınızı dijital dünyaya taşımak için OrderCheffi tercih
              edin. 14 gün ücretsiz deneme ile başlayın.
            </p>
            <Link
              href="/register"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300"
            >
              Ücretsiz Deneyin
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
