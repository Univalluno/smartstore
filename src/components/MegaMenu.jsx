import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { id: "tecnologia", name: "Tecnología", subcategories: ["Celulares", "Tablets", "Computadores", "Televisores", "Audio y Sonido", "Smartwatches"] },
  { id: "mercado", name: "Mercado", subcategories: ["Abarrotes", "Bebidas", "Lácteos", "Carnes", "Frutas", "Snacks"] },
  { id: "electrodomesticos", name: "Electrodomésticos", subcategories: ["Neveras", "Lavadoras", "Aires Acondicionados"] },
  { id: "moda-mujer", name: "Moda Mujer", subcategories: ["Vestidos", "Blusas", "Jeans", "Zapatos"] },
  { id: "moda-hombre", name: "Moda Hombre", subcategories: ["Camisetas", "Pantalones"] },
  { id: "hogar", name: "Hogar", subcategories: ["Cama y Baño", "Cocina", "Decoración"] },
  { id: "juguetes", name: "Juguetes", subcategories: ["Construcción", "Muñecas", "Consolas"] },
];

const MegaMenu = ({ isOpen, onClose, onSelectCategory }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            className="fixed left-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto p-8"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black">Categorías</h2>
              <button onClick={onClose} className="text-4xl">×</button>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => { onSelectCategory(null); }}
                className="w-full text-left p-4 hover:bg-gray-100 rounded-xl text-xl font-bold"
              >
                🏠 Ver Todos los Productos
              </button>
              
              {categories.map((cat) => (
                <div key={cat.id} className="border-b pb-4">
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="w-full text-left p-4 hover:bg-gray-100 rounded-xl text-xl font-bold flex justify-between items-center"
                  >
                    <span>{cat.name}</span>
                    <span>›</span>
                  </button>
                  
                  <div className="pl-6 space-y-2 mt-2">
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => onSelectCategory(cat.id, sub)}
                        className="block w-full text-left p-3 hover:bg-orange-50 rounded-lg text-gray-700 hover:text-orange-600"
                      >
                        {sub}
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
};

export default MegaMenu;