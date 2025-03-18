import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">OrderCheff</h3>
            <p className="text-gray-600">
              Restoranınızı dijitalleştirin, müşteri deneyimini iyileştirin.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/menu"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Menü
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900"
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">İletişim</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Email: info@ordercheff.com</li>
              <li>Tel: +90 (555) 123 45 67</li>
              <li>Adres: İstanbul, Türkiye</li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Sosyal Medya</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Instagram
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Twitter
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} OrderCheff. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
