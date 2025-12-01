import { motion, AnimatePresence } from "framer-motion";

export default function MegaMenu({ isOpen, onClose, onSelectCategory }) {
  const categories = [
    {
      id: "tecnologia",
      name: "Tecnología",
      icon: "💻",
      sub: [
        "Celulares",
        "Tablets",
        "Computadores",
        "Televisores",
        "Audio y Sonido",
        "Accesorios",
        "Smartwatches",
      ],
    },
    {
      id: "mercado",
      name: "Mercado",
      icon: "🛒",
      sub: [
        "Abarrotes",
        "Bebidas",
        "Lácteos",
        "Carnes",
        "Frutas",
        "Snacks",
        "Aseo del Hogar",
        "Aseo Personal",
      ],
    },
    {
      id: "electrodomesticos",
      name: "Electrodomésticos",
      icon: "❄️",
      sub: [
        "Neveras",
        "Lavadoras",
        "Estufas",
        "Microondas",
        "Licuadoras",
        "Cafeteras",
        "Aires Acondicionados",
      ],
    },
    {
      id: "moda-mujer",
      name: "Moda Mujer",
      icon: "👗",
      sub: ["Blusas", "Jeans", "Vestidos", "Zapatos", "Accesorios", "Ropa Interior"],
    },
    {
      id: "moda-hombre",
      name: "Moda Hombre",
      icon: "👕",
      sub: [
        "Camisetas",
        "Pantalones",
        "Chaquetas",
        "Zapatos",
        "Accesorios",
        "Ropa Deportiva",
      ],
    },
    {
      id: "hogar",
      name: "Hogar",
      icon: "🏠",
      sub: ["Muebles", "Decoración", "Cocina", "Organización", "Iluminación", "Cama y Baño"],
    },
    {
      id: "juguetes",
      name: "Juguetes",
      icon: "🧸",
      sub: ["Bebés", "Mesas", "Muñecas", "Carros", "Construcción", "Peluches"],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ x: -350 }}
            animate={{ x: 0 }}
            exit={{ x: -350 }}
            className="fixed left-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-orange-600">Categorías</h2>
              <button onClick={onClose} className="text-4xl text-gray-700">
                ×
              </button>
            </div>

            <div className="space-y-8">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="flex items-center gap-3 text-left w-full p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition font-semibold text-xl"
                  >
                    <span className="text-3xl">{cat.icon}</span>
                    {cat.name}
                  </button>

                  <div className="grid grid-cols-2 gap-2 mt-3 pl-2">
                    {cat.sub.map((s) => (
                      <button
                        key={s}
                        onClick={() => onSelectCategory(cat.id, s)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
