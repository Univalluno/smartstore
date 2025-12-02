import "./index.css";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MegaMenu from "./components/MegaMenu";

const allProducts = [
  // TECNOLOGÍA - Celulares
  {
    name: "iPhone 15 Pro Max 256GB",
    price: 5299900,
    old: 6799900,
    discount: "-22%",
    category: "tecnologia",
    subcategory: "Celulares",
    img: "public/images/iPhone-15.WEBP",
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    price: 5899900,
    old: 7799900,
    discount: "-24%",
    category: "tecnologia",
    subcategory: "Celulares",
    img: "public/images/galaxys24ultra.jpg",
  },
  {
    name: "Xiaomi 14 Pro 512GB",
    price: 4199900,
    old: 5599900,
    discount: "-25%",
    category: "tecnologia",
    subcategory: "Celulares",
    img: "public/images/xiaomi14pro.WEBP",
  },
  {
    name: "Motorola Edge 50 Pro",
    price: 2899900,
    old: 3899900,
    discount: "-26%",
    category: "tecnologia",
    subcategory: "Celulares",
    img: "public/images/motoedge.WEBP",
  },

  // Tablets
  {
    name: 'iPad Pro 11" M2 256GB',
    price: 4299900,
    old: 5599900,
    discount: "-23%",
    category: "tecnologia",
    subcategory: "Tablets",
    img: "public/images/ipadpro11.WEBP",
  },
  {
    name: "Samsung Galaxy Tab S9",
    price: 3499900,
    old: 4699900,
    discount: "-26%",
    category: "tecnologia",
    subcategory: "Tablets",
    img: "public/images/galaxytabs9.jpg",
  },

  // Computadores
  {
    name: "MacBook Air M3 512GB",
    price: 6899900,
    old: 8799900,
    discount: "-21%",
    category: "tecnologia",
    subcategory: "Computadores",
    img: "public/images/macbookairm3.jpeg",
  },
  {
    name: "ASUS ROG Strix G16",
    price: 9999900,
    old: 13999900,
    discount: "-29%",
    category: "tecnologia",
    subcategory: "Computadores",
    img: "public/images/asusrogstrixg16.WEBP",
  },

  // Televisores
  {
    name: 'TV Samsung QLED 65" 4K',
    price: 4599900,
    old: 6799900,
    discount: "-32%",
    category: "tecnologia",
    subcategory: "Televisores",
    img: "public/images/tvsamsung65.WEBP",
  },
  {
    name: 'LG OLED 55"',
    price: 5499900,
    old: 7999900,
    discount: "-31%",
    category: "tecnologia",
    subcategory: "Televisores",
    img: "public/images/lgoled55.WEBP",
  },

  // Audio
  {
    name: "Sony WH-1000XM5",
    price: 1499900,
    old: 1999900,
    discount: "-25%",
    category: "tecnologia",
    subcategory: "Audio y Sonido",
    img: "public/images/Sony WH-1000XM5.jpg",
  },
  {
    name: "JBL Flip 6",
    price: 599900,
    old: 899900,
    discount: "-33%",
    category: "tecnologia",
    subcategory: "Audio y Sonido",
    img: "public/images/jblflip6.jpg",
  },

  // Smartwatches
  {
    name: "Apple Watch Series 9",
    price: 2199900,
    old: 2799900,
    discount: "-21%",
    category: "tecnologia",
    subcategory: "Smartwatches",
    img: "/images/applewatch9.jpg",
  },

  // MERCADO
  {
    name: "Aceite Premier 3000ml",
    price: 35900,
    old: 52900,
    discount: "-32%",
    category: "mercado",
    subcategory: "Abarrotes",
    img: "/images/aceitepremier.jpg",
  },
  {
    name: "Cerveza Corona Sixpack",
    price: 28900,
    old: 38900,
    discount: "-26%",
    category: "mercado",
    subcategory: "Bebidas",
    img: "/images/cerveza_corona.jpg",
  },
  {
    name: "Leche Alquería 6 und",
    price: 25900,
    old: 33900,
    discount: "-24%",
    category: "mercado",
    subcategory: "Lácteos",
    img: "/images/leche_alqueria.jpg",
  },
  {
    name: "Carne Molida Premium 1kg",
    price: 34900,
    old: 46900,
    discount: "-26%",
    category: "mercado",
    subcategory: "Carnes",
    img: "/images/carne_molida.jpg",
  },
  {
    name: "Manzana Verde x kg",
    price: 8900,
    old: 12900,
    discount: "-31%",
    category: "mercado",
    subcategory: "Frutas",
    img: "/images/manzana_verde.jpg",
  },
  {
    name: "Papas Supreme 10 und",
    price: 12900,
    old: 18900,
    discount: "-32%",
    category: "mercado",
    subcategory: "Snacks",
    img: "/images/papas_supreme.jpg",
  },
  {
    name: "Jabón Dove 6 und",
    price: 18900,
    old: 26900,
    discount: "-30%",
    category: "mercado",
    subcategory: "Aseo Personal",
    img: "/images/jabon_dove.jpg",
  },

  // ELECTRODOMÉSTICOS
  {
    name: "Nevera Haceb 420L No Frost",
    price: 2899900,
    old: 3899900,
    discount: "-26%",
    category: "electrodomesticos",
    subcategory: "Neveras",
    img: "/images/nevera_haceb.jpg",
  },
  {
    name: "Nevera Samsung French Door",
    price: 6799900,
    old: 8999900,
    discount: "-24%",
    category: "electrodomesticos",
    subcategory: "Neveras",
    img: "/images/nevera_samsung.jpg",
  },
  {
    name: "Lavadora LG 19kg",
    price: 2399900,
    old: 3299900,
    discount: "-27%",
    category: "electrodomesticos",
    subcategory: "Lavadoras",
    img: "/images/lavadora_lg.jpg",
  },
  {
    name: "Aire Acondicionado 12000 BTU",
    price: 1799900,
    old: 2499900,
    discount: "-28%",
    category: "electrodomesticos",
    subcategory: "Aires Acondicionados",
    img: "/images/aire_lg.jpg",
  },

  // MODA MUJER
  {
    name: "Vestido Midi Estampado",
    price: 129900,
    old: 189900,
    discount: "-32%",
    category: "moda-mujer",
    subcategory: "Vestidos",
    img: "/images/vestido_midi.jpg",
  },
  {
    name: "Blusa Elegante",
    price: 89900,
    old: 139900,
    discount: "-36%",
    category: "moda-mujer",
    subcategory: "Blusas",
    img: "/images/blusa_elegante.jpg",
  },
  {
    name: "Jean Skinny",
    price: 149900,
    old: 219900,
    discount: "-32%",
    category: "moda-mujer",
    subcategory: "Jeans",
    img: "/images/jean_skinny.jpg",
  },
  {
    name: "Tenis Adidas Blancos",
    price: 329900,
    old: 449900,
    discount: "-27%",
    category: "moda-mujer",
    subcategory: "Zapatos",
    img: "/images/tenis_adidas.jpg",
  },

  // MODA HOMBRE
  {
    name: "Camiseta Polo Nautica",
    price: 149900,
    old: 219900,
    discount: "-32%",
    category: "moda-hombre",
    subcategory: "Camisetas",
    img: "/images/camiseta_nautica.jpg",
  },
  {
    name: "Jean Slim Levi's",
    price: 219900,
    old: 299900,
    discount: "-27%",
    category: "moda-hombre",
    subcategory: "Pantalones",
    img: "/images/jean_slim.jpg",
  },
  {
    name: "Camisa Oxford",
    price: 179900,
    old: 259900,
    discount: "-31%",
    category: "moda-hombre",
    subcategory: "Camisetas",
    img: "/images/camisa_oxford.jpg",
  },

  // HOGAR
  {
    name: "Juego de Sábanas Queen",
    price: 179900,
    old: 269900,
    discount: "-33%",
    category: "hogar",
    subcategory: "Cama y Baño",
    img: "/images/sabanas_queen.jpg",
  },
  {
    name: "Sartén Antiadherente 28cm",
    price: 89900,
    old: 139900,
    discount: "-36%",
    category: "hogar",
    subcategory: "Cocina",
    img: "/images/sarten_28cm.jpg",
  },

  // JUGUETES
  {
    name: "Lego Technic Lamborghini",
    price: 1799900,
    old: 2499900,
    discount: "-28%",
    category: "juguetes",
    subcategory: "Construcción",
    img: "/images/lego_lamborghini.jpg",
  },
  {
    name: "Barbie Dreamhouse 2025",
    price: 899900,
    old: 1299900,
    discount: "-31%",
    category: "juguetes",
    subcategory: "Muñecas",
    img: "/images/barbie_dreamhouse.jpg",
  },

  // PRODUCTOS ADICIONALES (20)
  {
    name: "Cámara Canon EOS R6",
    price: 6599900,
    old: 7999900,
    discount: "-18%",
    category: "tecnologia",
    subcategory: "Cámaras",
    img: "/images/",
  },
  {
    name: "Nintendo Switch OLED",
    price: 1999900,
    old: 2499900,
    discount: "-20%",
    category: "juguetes",
    subcategory: "Consolas",
    img: "/images/nintendo_switch.jpg",
  },
  {
    name: "Micrófono Blue Yeti",
    price: 599900,
    old: 899900,
    discount: "-33%",
    category: "tecnologia",
    subcategory: "Audio y Sonido",
    img: "/images/blue_yeti.jpg",
  },
  {
    name: 'Smart TV LG 75" 4K',
    price: 7599900,
    old: 9999900,
    discount: "-24%",
    category: "tecnologia",
    subcategory: "Televisores",
    img: "/images/lg_75_4k.jpg",
  },
  {
    name: 'Monitor Samsung Odyssey 32"',
    price: 1899900,
    old: 2499900,
    discount: "-24%",
    category: "tecnologia",
    subcategory: "Computadores",
    img: "/images/monitor_odyssey32.jpg",
  },
  {
    name: 'Bicicleta Montaña 29"',
    price: 899900,
    old: 1299900,
    discount: "-30%",
    category: "hogar",
    subcategory: "Deportes",
    img: "/images/bicicleta_montana.jpg",
  },
  {
    name: "Silla Gamer DXRacer",
    price: 499900,
    old: 799900,
    discount: "-38%",
    category: "hogar",
    subcategory: "Muebles",
    img: "/images/silla_gamer.jpg",
  },
  {
    name: "Smartwatch Garmin Fenix 7",
    price: 2199900,
    old: 2999900,
    discount: "-26%",
    category: "tecnologia",
    subcategory: "Smartwatches",
    img: "/images/garmin_fenix7.jpg",
  },
  {
    name: "Café en grano 1kg",
    price: 49900,
    old: 69900,
    discount: "-29%",
    category: "mercado",
    subcategory: "Bebidas",
    img: "/images/cafe_grano.jpg",
  },
  {
    name: "Perfume Chanel N°5",
    price: 399900,
    old: 549900,
    discount: "-27%",
    category: "moda-mujer",
    subcategory: "Perfumes",
    img: "/images/perfume_chanel.jpg",
  },
  {
    name: "Plancha Philips Steam",
    price: 299900,
    old: 399900,
    discount: "-25%",
    category: "hogar",
    subcategory: "Electrodomésticos",
    img: "/images/plancha_philips.jpg",
  },
  {
    name: "Set Ollas Tefal 10 piezas",
    price: 349900,
    old: 499900,
    discount: "-30%",
    category: "hogar",
    subcategory: "Cocina",
    img: "/images/set_ollas_tefal.jpg",
  },
  {
    name: "Tablet Amazon Fire HD 10",
    price: 599900,
    old: 899900,
    discount: "-33%",
    category: "tecnologia",
    subcategory: "Tablets",
    img: "/images/amazon_fire_hd10.jpg",
  },
  {
    name: "Auriculares Bose QuietComfort",
    price: 899900,
    old: 1199900,
    discount: "-25%",
    category: "tecnologia",
    subcategory: "Audio y Sonido",
    img: "/images/bose_qc.jpg",
  },
  {
    name: "Reloj Fossil Gen 6",
    price: 1299900,
    old: 1599900,
    discount: "-19%",
    category: "moda-hombre",
    subcategory: "Smartwatches",
    img: "/images/fossil_gen6.jpg",
  },
  {
    name: "Set LEGO Star Wars",
    price: 499900,
    old: 699900,
    discount: "-28%",
    category: "juguetes",
    subcategory: "Construcción",
    img: "/images/lego_starwars.jpg",
  },
  {
    name: "Camiseta Nike Dri-FIT",
    price: 129900,
    old: 179900,
    discount: "-28%",
    category: "moda-hombre",
    subcategory: "Camisetas",
    img: "/images/camiseta_nike.jpg",
  },
  {
    name: "Zapatillas Puma Running",
    price: 299900,
    old: 399900,
    discount: "-25%",
    category: "moda-mujer",
    subcategory: "Zapatos",
    img: "/images/zapatillas_puma.jpg",
  },
  {
    name: "Cama King Size Deluxe",
    price: 1299900,
    old: 1599900,
    discount: "-18%",
    category: "hogar",
    subcategory: "Cama y Baño",
    img: "/images/cama_king.jpg",
  },
  {
    name: "Espejo Decorativo 80x60cm",
    price: 199900,
    old: 299900,
    discount: "-33%",
    category: "hogar",
    subcategory: "Decoración",
    img: "/images/espejo_decorativo.jpg",
  },
  {
    name: "Auriculares Gamer HyperX",
    price: 599900,
    old: 799900,
    discount: "-25%",
    category: "tecnologia",
    subcategory: "Audio y Sonido",
    img: "/images/hyperx_gamer.jpg",
  },
];

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const heroOffers = [
    {
      title: "Hasta 60% en Tecnología",
      img: "public/images/black1.jpg",
    },
    {
      title: "iPhone Pro Max con Descuento",
      img: "public/images/iPhone-15.WEBP",
    },
    {
      title: 'TV Samsung 65" QLED 4K',
      img: "public/images/tvsamsung65.WEBP",
    },
    {
      title: "Nevera Haceb Side by Side",
      img: "public/images/haceb.webp",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroOffers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectCategory = (categoryId, subcategory = null) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategory);
    setMenuOpen(false);
  };

  // FILTRO DE PRODUCTOS (MEJORADO: si no hay productos en sub, muestra toda la categoría)
  const filteredProducts = allProducts.filter((product) => {
    if (!selectedCategory) return true;
    const matchCategory = product.category === selectedCategory;
    if (!selectedSubcategory) return matchCategory;

    const hasProductsInSub = allProducts.some(
      (p) =>
        p.category === selectedCategory && p.subcategory === selectedSubcategory
    );

    return hasProductsInSub
      ? matchCategory && product.subcategory === selectedSubcategory
      : matchCategory;
  });

  const addToCart = (p) => {
    setCart((prev) => {
      const exists = prev.find((x) => x.name === p.name);
      if (exists)
        return prev.map((x) =>
          x.name === p.name ? { ...x, qty: x.qty + 1 } : x
        );
      return [...prev, { ...p, qty: 1 }];
    });
    setCartOpen(true);
  };

  const total = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const itemsCount = cart.reduce((a, i) => a + i.qty, 0);

  const sectionTitle = selectedSubcategory
    ? selectedSubcategory.toUpperCase()
    : selectedCategory
    ? selectedCategory.replace("-", " ").toUpperCase()
    : "OFERTAS IMBATIBLES";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-pink-600 text-white z-50 shadow-2xl">
        <div className="flex items-center justify-between px-8 py-4 gap-6">
          <button
            onClick={() => setMenuOpen(true)}
            className="bg-red-500 p-3 rounded-lg"
          >
            <svg
              className="w-9 h-9 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <h1 className="text-4xl font-black tracking-tighter">SmartStore</h1>

          <div className="hidden lg:flex items-center bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 w-96">
            <svg
              className="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar en SmartStore..."
              className="bg-transparent outline-none text-white placeholder-white/70 flex-1"
            />
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="relative bg-white/20 backdrop-blur-lg rounded-full px-8 py-4 flex items-center gap-3 hover:bg-white/30 transition"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="font-bold text-lg">Carrito ({itemsCount})</span>
          </button>
        </div>
      </header>

      <MegaMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelectCategory={handleSelectCategory}
      />

      <section className="relative h-[42vh] md:h-[48vh] lg:h-[52vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <img
              src={heroOffers[currentSlide].img}
              alt="Oferta"
              className="w-full h-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-6 text-center px-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-2xl leading-none mb-2">
                BLACK DAYS 2025
              </h1>
              <p className="text-xl md:text-3xl font-bold text-white drop-shadow-xl mb-4">
                {heroOffers[currentSlide].title}
              </p>
              <button className="bg-yellow-400 text-black font-black text-xl md:text-2xl px-10 py-5 rounded-full hover:bg-yellow-300 transform hover:scale-110 transition shadow-2xl">
                ¡COMPRA AHORA!
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {heroOffers.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentSlide ? "bg-white w-10" : "bg-white/70"
              }`}
            />
          ))}
        </div>
        {/* Flechas del slider */}
        <button
          onClick={() =>
            setCurrentSlide((prev) =>
              prev === 0 ? heroOffers.length - 1 : prev - 1
            )
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-black/60 transition text-4xl z-30"
        >
          ‹
        </button>

        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % heroOffers.length)
          }
          className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/50 text-white p-6 rounded-full hover:bg-black/70 text-6xl font-bold z-30"
        >
          ›
        </button>
      </section>

      <section className="max-w-7xl mx-auto px-6 -mt-16 md:-mt-20 relative z-20">
        <h2 className="text-5xl md:text-6xl font-black text-center mb-16 text-white bg-black/60 px-8 py-6 rounded-2xl inline-block mx-auto">
          {sectionTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredProducts.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer group hover:scale-[1.03] transition-transform duration-300"
              onClick={() => addToCart(p)}
            >
              <div className="relative flex items-center justify-center bg-gray-100 h-[340px]">
                <img
                  src={p.img}
                  alt={p.name}
                  className="h-[200px] w-auto object-contain group-hover:scale-105 transition"
                />

                <div className="absolute top-3 left-3 bg-red-600 text-white font-bold px-4 py-2 rounded-full text-sm">
                  {p.discount}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg line-clamp-2">{p.name}</h3>
                <div className="mt-3">
                  <span className="text-3xl font-black text-orange-600">
                    ${p.price.toLocaleString()}
                  </span>
                  <span className="block text-xs text-gray-500 line-through">
                    ${p.old.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: 500 }}
              animate={{ x: 0 }}
              exit={{ x: 500 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black">
                  Tu Carrito ({itemsCount})
                </h2>
                <button onClick={() => setCartOpen(false)} className="text-4xl">
                  ×
                </button>
              </div>
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 text-xl mt-20">
                  El carrito está vacío
                </p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div
                      key={item.name}
                      className="flex gap-4 mb-6 border-b pb-4"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-orange-600 font-bold">
                          ${item.price.toLocaleString()} × {item.qty}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="mt-10 text-2xl font-black text-right">
                    Total: ${total.toLocaleString()}
                  </div>
                  <button className="w-full mt-6 bg-orange-600 text-white py-6 rounded-xl font-black text-xl hover:bg-orange-700">
                    IR A PAGAR
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="bg-gray-900 text-white py-20 mt-40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black mb-4">SmartStore</h2>
          <p className="text-2xl text-gray-400">
            Proyecto Final • Universidad del Valle • 2025
          </p>
          <p className="mt-10 text-gray-500">© 2025 SmartStore </p>
        </div>
      </footer>
    </>
  );
}

export default App;
