// D:\smartstore\src\components\MegaMenu.jsx  ← VERSIÓN SIN DEPENDENCIAS
const categorias = [
  { nombre: "Mercado", icon: "🛒", subs: ["Frutas y Verduras", "Lácteos", "Carnes", "Despensa", "Aseo", "Bebés", "Licores"] },
  { nombre: "Tecnología", icon: "📱", subs: ["Celulares", "TV y Audio", "Computadores", "Videojuegos"] },
  { nombre: "Electrodomésticos", icon: "🏠", subs: ["Neveras", "Lavadoras", "Aires", "Cocinas"] },
  { nombre: "Moda Mujer", icon: "👗", subs: ["Ropa", "Zapatos", "Accesorios", "Belleza"] },
  { nombre: "Moda Hombre", icon: "👔", subs: ["Ropa", "Zapatos", "Accesorios"] },
  { nombre: "Hogar", icon: "🛋️", subs: ["Muebles", "Colchones", "Decoración"] },
  { nombre: "Juguetes", icon: "🧸", subs: ["Juguetería", "Bebés"] },
];

export default function MegaMenu({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={onClose} />}
      
      <div className={`fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"} overflow-y-auto`}>
        <div className="bg-gradient-to-r from-orange-600 to-pink-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-black">Menú</h2>
          <button onClick={onClose} className="text-4xl">×</button>
        </div>

        {categorias.map((cat) => (
          <details key={cat.nombre} className="group border-b">
            <summary className="flex justify-between items-center px-6 py-5 cursor-pointer hover:bg-orange-50 list-none">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{cat.icon}</span>
                <span className="font-bold text-lg">{cat.nombre}</span>
              </div>
              <span className="text-xl group-open:rotate-90 transition">›</span>
            </summary>
            <div className="bg-gray-50">
              {cat.subs.map((sub) => (
                <a key={sub} href="#" className="block px-16 py-4 hover:bg-orange-100 font-medium">
                  {sub}
                </a>
              ))}
            </div>
          </details>
        ))}
      </div>
    </>
  );
}