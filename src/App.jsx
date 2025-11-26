import './index.css'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)

  // Carrusel automático de ofertas principales (como en éxito)
  const heroOffers = [
    { title: "Hasta 60% en Tecnología", img: "https://exitocol.vtexassets.com/arquivos/ids/22789012-1200-auto" },
    { title: "iPhone 17 Pro Max desde $5.539.900", img: "https://exitocol.vtexassets.com/arquivos/ids/22687451-1200-auto" },
    { title: "TV Samsung 65\" QLED 4K a $2.595.904", img: "https://exitocol.vtexassets.com/arquivos/ids/22145678-1200-auto" },
    { title: "Nevera Haceb 541 Lts Side by Side $2.479.905", img: "https://exitocol.vtexassets.com/arquivos/ids/22451211-1200-auto" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroOffers.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const allProducts = [
    // Tecnología
    ...[
      { name: "iPhone 15 Pro 256GB", price: 5299900, old: 6299900, img: "https://exitocol.vtexassets.com/arquivos/ids/22308535/iphone-15-pro-max-256gb-negro-titanio-1019183_a.jpg", discount: "-16%" },
      { name: "MacBook Air M3 512GB", price: 6899900, old: 8499900, img: "https://exitocol.vtexassets.com/arquivos/ids/22587412/macbook-air-13-pulgadas-chip-m3-8gb-256gb-ssd-gris-espacial-1028901_a.jpg", discount: "-19%" },
      { name: "PS5 Slim 1TB + 2 Juegos", price: 2649900, old: 3299900, img: "https://exitocol.vtexassets.com/arquivos/ids/22687451/consola-playstation-5-slim-1tb-digital-edition-blanco-1027895_a.jpg", discount: "-20%" },
      { name: "Samsung Galaxy S24 Ultra", price: 5899900, old: 7299900, img: "https://exitocol.vtexassets.com/arquivos/ids/22478963/celular-samsung-galaxy-s24-ultra-256gb-12gb-ram-titanio-negro-1026789_a.jpg", discount: "-19%" },
      { name: "TV LG 65\" OLED 4K", price: 4899900, old: 6899900, img: "https://exitocol.vtexassets.com/arquivos/ids/22145678/smart-tv-lg-55-pulgadas-oled-4k-uhd-oled55c3psa-1023456_a.jpg", discount: "-29%" },
    ],
    // Mercado y Hogar
    ...[
      { name: "Aceite Gourmet 3000ml", price: 35900, old: 49900, img: "https://exitocol.vtexassets.com/arquivos/ids/19876543/aceite-gourmet-girasol-3000ml-1001234_a.jpg", discount: "-28%" },
      { name: "Pañales Huggies Etapa 4 x100", price: 129900, old: 179900, img: "https://exitocol.vtexassets.com/arquivos/ids/21234567/panal-huggies-active-sec-etapa-4-x100-1012345_a.jpg", discount: "-28%" },
      { name: "Detergente Ariel 5kg", price: 54900, old: 79900, img: "https://exitocol.vtexassets.com/arquivos/ids/20987654/detergente-ariel-5kg-1009876_a.jpg", discount: "-31%" },
      { name: "Cerveza Aguila Lata x18", price: 45900, old: 59900, img: "https://exitocol.vtexassets.com/arquivos/ids/20123456/cerveza-aguila-lata-18-pack-1005678_a.jpg", discount: "-23%" },
      { name: "Café Sello Rojo 500g", price: 28900, old: 37900, img: "https://exitocol.vtexassets.com/arquivos/ids/19876543/cafe-sello-rojo-500g-1004321_a.jpg", discount: "-24%" },
    ]
  ]

  const addToCart = (p) => {
    setCart(prev => {
      const exists = prev.find(x => x.name === p.name)
      if (exists) return prev.map(x => x.name === p.name ? { ...x, qty: x.qty + 1 } : x)
      return [...prev, { ...p, qty: 1 }]
    })
    setCartOpen(true)
  }

  const total = cart.reduce((a, i) => a + i.price * i.qty, 0)
  const itemsCount = cart.reduce((a, i) => a + i.qty, 0)

  return (
    <>
      {/* Header fijo */}
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-pink-600 text-white z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-4xl font-black tracking-tighter">SmartStore</h1>
          <div className="hidden lg:flex items-center bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 w-96">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Buscar en SmartStore..." className="bg-transparent outline-none text-white placeholder-white/70 flex-1" />
          </div>
          <button onClick={() => setCartOpen(true)} className="relative bg-white/20 backdrop-blur-lg rounded-full px-8 py-4 flex items-center gap-3 hover:bg-white/30 transition">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="font-bold text-lg">Carrito ({itemsCount})</span>
          </button>
        </div>
      </header>

      {/* Hero con carrusel automático */}
      <section className="relative h-screen overflow-hidden pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <img src={heroOffers[currentSlide].img} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <div className="absolute bottom-20 left-10 text-white">
              <h1 className="text-6xl md:text-8xl font-black mb-4">BLACK DAYS 2025</h1>
              <p className="text-3xl md:text-5xl font-bold">{heroOffers[currentSlide].title}</p>
              <button className="mt-8 bg-yellow-400 text-black font-black text-xl px-12 py-6 rounded-full hover:bg-yellow-300 transform hover:scale-110 transition">
                ¡COMPRA AHORA!
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {heroOffers.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`w-4 h-4 rounded-full transition ${i === currentSlide ? 'bg-white w-12' : 'bg-white/50'}`} />
          ))}
        </div>
      </section>

      {/* Productos */}
      <section className="max-w-7xl mx-auto px-6 py-20 -mt-32 relative z-10">
        <h2 className="text-5xl font-black text-center mb-16 text-white drop-shadow-2xl">OFERTAS IMBATIBLES 🔥</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {allProducts.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer group"
              onClick={() => addToCart(p)}
            >
              <div className="relative">
                <img src={p.img} alt={p.name} className="w-full h-48 object-cover group-hover:scale-110 transition" />
                <div className="absolute top-3 left-3 bg-red-600 text-white font-bold px-4 py-2 rounded-full text-sm">
                  {p.discount}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm line-clamp-2">{p.name}</h3>
                <div className="mt-3">
                  <span className="text-2xl font-black text-orange-600">${p.price.toLocaleString()}</span>
                  <span className="block text-xs text-gray-500 line-through">${p.old.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Carrito lateral (igual que antes pero más pulido) */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50" onClick={() => setCartOpen(false)} />
            <motion.div initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }} className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto">
              <div className="p-8 border-b-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black">Mi Carrito ({itemsCount})</h2>
                  <button onClick={() => setCartOpen(false)} className="text-4xl hover:bg-gray-100 rounded-full p-2">×</button>
                </div>
              </div>
              <div className="p-8 space-y-6">
                {cart.length === 0 ? <p className="text-center text-gray-500 text-xl py-20">Carrito vacío</p> : cart.map(item => (
                  <div key={item.name} className="flex gap-4 bg-gray-50 p-6 rounded-3xl">
                    <img src={item.img} alt="" className="w-24 h-24 object-cover rounded-2xl" />
                    <div className="flex-1">
                      <h4 className="font-bold">{item.name}</h4>
                      <p className="text-2xl font-black text-orange-600">${(item.price * item.qty).toLocaleString()}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <button onClick={() => setCart(prev => prev.map(x => x.name === item.name ? { ...x, qty: x.qty - 1 } : x).filter(x => x.qty > 0))} className="w-10 h-10 bg-gray-300 rounded-full">-</button>
                        <span className="text-xl font-bold w-12 text-center">{item.qty}</span>
                        <button onClick={() => setCart(prev => prev.map(x => x.name === item.name ? { ...x, qty: x.qty + 1 } : x))} className="w-10 h-10 bg-orange-500 text-white rounded-full">+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {cart.length > 0 && (
                <div className="border-t-2 p-8 bg-gradient-to-r from-orange-500 to-pink-600 text-white">
                  <div className="flex justify-between text-3xl font-black mb-6">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                  <button className="w-full bg-white text-orange-600 font-black text-2xl py-6 rounded-3xl hover:bg-gray-100 transition">
                    IR A PAGAR
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="bg-gray-900 text-white py-20 mt-40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black mb-4">SmartStore</h2>
          <p className="text-2xl text-gray-400">Proyecto Final Ingeniería de Sistemas • Universidad del Valle • 2025</p>
          <p className="mt-10 text-gray-500">© 2025 SmartStore – Hecho por un estudiante de 10mo semestre que dejó el estándar altísimo</p>
        </div>
      </footer>
    </>
  )
}

export default App