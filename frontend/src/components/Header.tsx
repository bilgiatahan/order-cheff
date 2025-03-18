import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.svg"
              alt="OrderCheff Logo"
              width={40}
              height={40}
              className="text-blue-600"
            />
            <span className="text-2xl font-bold text-gray-800">OrderCheff</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/menu" className="text-gray-600 hover:text-gray-900">
              Menü
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              Hakkımızda
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              İletişim
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
