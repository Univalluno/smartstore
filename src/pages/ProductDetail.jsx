import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [cart, setCart] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({
    rating: 0,
    comment: "",
    userName: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Cargar datos al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('smartstore-cart');
    const savedReviews = localStorage.getItem('smartstore-reviews');

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedReviews) setReviews(JSON.parse(savedReviews));
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <p className="text-2xl text-gray-600 mb-6">Producto no encontrado</p>
        <button
          onClick={() => navigate('/')}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  // Filtrar reseñas para este producto
  const productReviews = reviews.filter(review => review.productName === product.name);

  // Calcular promedio de calificaciones
  const averageRating = productReviews.length > 0
    ? (productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length).toFixed(1)
    : 0;

  const handleAddToCart = () => {
    const currentCart = JSON.parse(localStorage.getItem('smartstore-cart') || '[]');
    const exists = currentCart.find((x) => x.name === product.name);

    let newCart;
    if (exists) {
      newCart = currentCart.map((x) =>
        x.name === product.name ? { ...x, qty: x.qty + 1 } : x
      );
    } else {
      newCart = [...currentCart, { ...product, qty: 1 }];
    }

    localStorage.setItem('smartstore-cart', JSON.stringify(newCart));
    setCart(newCart);

    // Mostrar notificación
    showNotification(`${product.name} agregado al carrito`, 'success');

    // REDIRIGIR A LA PÁGINA DE INICIO
    setTimeout(() => {
      navigate('/');
    }, 300);
  };

  const handleBuyNow = () => {
    const currentCart = JSON.parse(localStorage.getItem('smartstore-cart') || '[]');
    const exists = currentCart.find((x) => x.name === product.name);

    let newCart;
    if (exists) {
      newCart = currentCart.map((x) =>
        x.name === product.name ? { ...x, qty: x.qty + 1 } : x
      );
    } else {
      newCart = [...currentCart, { ...product, qty: 1 }];
    }

    localStorage.setItem('smartstore-cart', JSON.stringify(newCart));
    setCart(newCart);

    // Mostrar notificación
    showNotification(`${product.name} agregado al carrito`, 'success');

    // REDIRIGIR AL CHECKOUT CON EL CARRITO
    setTimeout(() => {
      navigate('/checkout', {
        state: {
          cart: newCart,
          total: newCart.reduce((a, i) => a + i.price * i.qty, 0)
        }
      });
    }, 300);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!userReview.rating) {
      showNotification('Por favor selecciona una calificación', 'error');
      return;
    }

    if (!userReview.comment.trim()) {
      showNotification('Por favor escribe un comentario', 'error');
      return;
    }

    const newReview = {
      id: Date.now(),
      productName: product.name,
      rating: userReview.rating,
      comment: userReview.comment,
      userName: userReview.userName || "Usuario Anónimo",
      date: new Date().toLocaleDateString('es-ES'),
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem('smartstore-reviews', JSON.stringify(updatedReviews));

    // Limpiar formulario
    setUserReview({
      rating: 0,
      comment: "",
      userName: "",
    });
    setShowReviewForm(false);

    showNotification('¡Gracias por tu reseña!', 'success');
  };

  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 ${type === 'success' ? 'bg-green-600 text-white' :
      type === 'error' ? 'bg-red-600 text-white' :
        'bg-blue-600 text-white'
      }`;
    notification.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  // Crear 4 miniaturas con la misma imagen
  const thumbnails = Array(4).fill(product.img);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Ruta de navegación */}
        <div className="mb-8 text-gray-600">
          <button
            onClick={() => navigate(-1)}
            className="hover:text-black flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </button>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="text-gray-400">Inicio</span>
            <span>›</span>
            <span className="text-gray-400">{product.category}</span>
            <span>›</span>
            <span className="text-gray-400">{product.subcategory}</span>
            <span>›</span>
            <span className="font-medium">{product.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Columna izquierda - Imágenes */}
          <div className="space-y-6">
            {/* Imagen principal */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 flex items-center justify-center">
              <img
                src={product.img}
                alt={product.name}
                className="max-h-96 w-auto object-contain"
              />
            </div>

            {/* Miniaturas (todas con la misma imagen) */}
            <div className="flex gap-4 overflow-x-auto pb-4">
              {thumbnails.map((thumb, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg flex items-center justify-center border-2 ${selectedImage === index
                    ? 'border-orange-600'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <img
                    src={thumb}
                    alt={`Vista ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>

            {/* Indicador de imagen seleccionada */}
            <div className="text-center text-gray-600 text-sm">
              Imagen {selectedImage + 1} de {thumbnails.length}
            </div>
          </div>

          {/* Columna derecha - Información */}
          <div className="space-y-8">
            {/* Título y categoría */}
            <div>
              <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                {product.category} / {product.subcategory}
              </span>
              <h1 className="text-4xl md:text-5xl font-black mt-4">{product.name}</h1>

              {/* Calificación promedio */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex text-yellow-400 text-2xl">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(averageRating) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="text-gray-700">
                  {averageRating} ({productReviews.length} {productReviews.length === 1 ? 'reseña' : 'reseñas'})
                </span>
              </div>
            </div>

            {/* Precio y descuento */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-5xl font-black text-orange-600">
                  ${product.price.toLocaleString()}
                </span>
                {product.old && (
                  <div className="flex flex-col">
                    <span className="text-2xl text-gray-500 line-through">
                      ${product.old.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400">
                      Ahorras: ${(product.old - product.price).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              {product.discount && (
                <div className="inline-flex items-center gap-2 bg-red-600 text-white font-bold px-6 py-3 rounded-full">
                  <span>{product.discount} DESCUENTO</span>
                  <span className="text-sm">¡Oferta especial!</span>
                </div>
              )}

              {/* Stock simulado */}
              <div className="mt-4">
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Disponible</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">¡Últimas unidades! Envío en 2-5 días hábiles</p>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Descripción</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {product.description || "Este producto de alta calidad ofrece el mejor rendimiento en su categoría. Diseñado para durar y con garantía incluida. ¡Aprovecha esta oferta única por tiempo limitado!"}
              </p>

              {/* Características */}
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Envío gratis a todo el país</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Garantía de 1 año</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Devolución en 30 días sin costo</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Stock disponible - Entrega inmediata</span>
                </li>
              </ul>
            </div>

            {/* Especificaciones técnicas */}
            {product.specs && (
              <div>
                <h3 className="text-2xl font-bold mb-4">Especificaciones Técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg">
                      <span className="text-gray-600 capitalize">{key}:</span>
                      <span className="font-medium ml-2">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-orange-600 to-pink-600 text-white text-2xl font-black py-6 rounded-2xl hover:shadow-2xl transition shadow-xl flex items-center justify-center gap-3"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                AGREGAR AL CARRITO
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBuyNow}
                className="flex-1 border-4 border-orange-600 text-orange-600 text-2xl font-black py-6 rounded-2xl hover:bg-orange-50 transition flex items-center justify-center gap-3"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                COMPRAR AHORA
              </motion.button>
            </div>
          </div>
        </div>

        {/* Sección de opiniones */}
        <div className="mt-20">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold">Opiniones de Clientes</h3>
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium"
            >
              Escribir una reseña
            </button>
          </div>

          {/* Formulario para agregar reseña */}
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-orange-200 rounded-2xl p-6 mb-8"
            >
              <h4 className="text-xl font-bold mb-4">Calificar este producto</h4>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Calificación con estrellas */}
                <div>
                  <label className="block mb-2">Tu calificación:</label>
                  <div className="flex gap-2 text-3xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserReview({ ...userReview, rating: star })}
                        className={`${star <= userReview.rating ? 'text-yellow-400' : 'text-gray-300'
                          } hover:text-yellow-500`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {userReview.rating === 0 ? 'Selecciona una calificación' :
                      userReview.rating === 1 ? 'Muy malo' :
                        userReview.rating === 2 ? 'Malo' :
                          userReview.rating === 3 ? 'Regular' :
                            userReview.rating === 4 ? 'Bueno' : 'Excelente'}
                  </p>
                </div>

                {/* Nombre (opcional) */}
                <div>
                  <label className="block mb-2">Tu nombre (opcional):</label>
                  <input
                    type="text"
                    value={userReview.userName}
                    onChange={(e) => setUserReview({ ...userReview, userName: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                {/* Comentario */}
                <div>
                  <label className="block mb-2">Tu comentario:</label>
                  <textarea
                    value={userReview.comment}
                    onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                    className="w-full p-3 border rounded-lg h-32"
                    placeholder="¿Qué te pareció el producto?"
                    required
                  />
                </div>

                {/* Botones del formulario */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
                  >
                    Enviar reseña
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false);
                      setUserReview({ rating: 0, comment: "", userName: "" });
                    }}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Rating promedio */}
          {productReviews.length > 0 ? (
            <>
              <div className="flex items-center gap-6 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-black">{averageRating}</div>
                  <div className="flex text-yellow-400 text-2xl">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < Math.floor(averageRating) ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <div className="text-gray-600 text-sm mt-1">
                    {productReviews.length} {productReviews.length === 1 ? 'reseña' : 'reseñas'}
                  </div>
                </div>

                {/* Distribución de calificaciones */}
                <div className="flex-1">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = productReviews.filter(r => r.rating === stars).length;
                      const percentage = productReviews.length > 0 ? (count / productReviews.length) * 100 : 0;

                      return (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm w-8">{stars}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-10">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Lista de reseñas */}
              <div className="space-y-6">
                {productReviews
                  .sort((a, b) => b.id - a.id) // Ordenar por más reciente
                  .map((review) => (
                    <div key={review.id} className="bg-white border rounded-2xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex text-yellow-400">
                              {"★".repeat(review.rating)}
                            </div>
                            <span className="font-bold">{review.userName}</span>
                          </div>
                          <p className="text-gray-700 mb-2">{review.comment}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{review.date}</span>
                            <span>•</span>
                            <span>{review.productName}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <p className="text-xl text-gray-600 mb-4">Este producto aún no tiene reseñas</p>
              <p className="text-gray-500 mb-6">Sé el primero en opinar sobre este producto</p>
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 font-medium text-lg"
              >
                Escribir la primera reseña
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
