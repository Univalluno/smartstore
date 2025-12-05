import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl">Producto no encontrado</p>
        <button 
          onClick={() => navigate('/')}
          className="ml-4 text-blue-600 hover:text-blue-800"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Aquí manejaremos agregar al carrito (luego conectaremos con el contexto)
    alert(`${product.name} agregado al carrito`);
    // Podríamos redirigir al carrito o mantener en la página
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-10 text-gray-600 hover:text-black flex items-center gap-2 text-lg"
        >
          ← Volver atrás
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Imagen del producto */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex items-center justify-center">
            <img
              src={product.img}
              alt={product.name}
              className="max-h-96 w-auto object-contain"
            />
          </div>

          {/* Información del producto */}
          <div className="space-y-8">
            <div>
              <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                {product.category} / {product.subcategory}
              </span>
              <h1 className="text-5xl font-black mt-4">{product.name}</h1>
            </div>

            {/* Precio */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-5xl font-black text-orange-600">
                  ${product.price.toLocaleString()}
                </span>
                {product.old && (
                  <span className="text-2xl text-gray-500 line-through">
                    ${product.old.toLocaleString()}
                  </span>
                )}
              </div>
              {product.discount && (
                <span className="inline-block bg-red-600 text-white font-bold px-6 py-2 rounded-full text-lg">
                  {product.discount} DESCUENTO
                </span>
              )}
            </div>

            {/* Descripción (simulada) */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Descripción</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Este producto de alta calidad ofrece el mejor rendimiento en su
                categoría. Diseñado para durar y con garantía incluida.
                ¡Aprovecha esta oferta única por tiempo limitado!
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Envío gratis a todo el país
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Garantía de 1 año
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Devolución en 30 días
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Stock disponible
                </li>
              </ul>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-orange-600 to-pink-600 text-white text-2xl font-black py-6 rounded-2xl hover:shadow-2xl transition shadow-xl"
              >
                AGREGAR AL CARRITO
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  handleAddToCart();
                  navigate('/');
                }}
                className="flex-1 border-4 border-orange-600 text-orange-600 text-2xl font-black py-6 rounded-2xl hover:bg-orange-50 transition"
              >
                COMPRAR AHORA
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;