import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 font-sans">
      <main className="bg-white p-12 rounded-2xl shadow-xl max-w-lg w-full text-center border">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Loteos App 🗺️
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Bienvenido a la nueva plataforma de administración de loteos y mapas interactivos SVG.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition-colors"
          >
            Ir al Panel de Administración →
          </Link>
        </div>
      </main>
    </div>
  );
}
