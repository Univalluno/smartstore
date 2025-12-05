import "./index.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MegaMenu from "./components/MegaMenu";
import ProductDetail from "./pages/ProductDetail";

const allProducts = [
  // TECNOLOGÍA - Celulares
  {
    name: "iPhone 15 Pro Max 256GB",
    price: 5299900,
    old: 6799900,
    discount: "-22%",
    category: "tecnologia",
    subcategory: "Celulares",
    img: "public/images/iphone-15.Webp",
    specs: {
      pantalla: '6.7" Super Retina XDR',
      procesador: "A17 Pro",
      ram: "8 GB",
      almacenamiento: "256 GB",
      camara: "48 MP",
      bateria: "4422 mAh"
    },
    description: "El iPhone más avanzado con Dynamic Island, cámara de 48 MP y chip A17 Pro."
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    price: 5899900,
    old: 7799900,
    discount: "-24%",
    category: "tecnologia",
    subcategory: "Celulares",
    img: "public/images/galaxys24ultra.jpg",
    specs: {
      pantalla: '6.8" Dynamic AMOLED 2X',
      procesador: "Snapdragon 8 Gen 3",
      ram: "12 GB",
      almacenamiento: "256 GB",
      camara: "200 MP",
      bateria: "5000 mAh"
    },
    description: "Potencia máxima con S Pen incluido, cámara de 200 MP y inteligencia artificial Galaxy AI."
  },
  {
    name: "Xiaomi 14 Pro 512GB",
    price: 4199900,
    old: 5599900,
    discount: "-25%",
    category: "tecnologia",
    subcategory: "Celulares",
    img: "public/images/xiaomi14pro.webp",
    specs: {
      pantalla: '6.73" LTPO AMOLED',
      procesador: "Snapdragon 8 Gen 3",
      ram: "12 GB",
      almacenamiento: "512 GB",
      camara: "50 MP",
      bateria: "4880 mAh"
    },
    description: "Fotografía profesional con Leica, carga hiperrápida de 120W y rendimiento extremo."
  },
  {
    name: "Motorola Edge 50 Pro",
    price: 2899900,
    old: 3899900,
    discount: "-26%",
    category: "tecnologia",
    subcategory: "Celulares",
    img: "/images/motoedge.webp",
    specs: {
      pantalla: '6.7" pOLED 144Hz',
      procesador: "Snapdragon 7 Gen 3",
      ram: "12 GB",
      almacenamiento: "256 GB",
      camara: "50 MP",
      bateria: "4500 mAh"
    },
    description: "Pantalla curva 144Hz, cámara con IA y diseño premium."
  },

  // Tablets
  {
    name: 'iPad Pro 11" M2 256GB',
    price: 4299900,
    old: 5599900,
    discount: "-23%",
    category: "tecnologia",
    subcategory: "Tablets",
    img: "/images/ipadpro11.webp",
    specs: {
      pantalla: '11" Liquid Retina XDR',
      procesador: "Apple M2",
      ram: "8 GB",
      almacenamiento: "256 GB",
      camara: "12 MP",
      bateria: "Hasta 10 horas"
    },
    description: "Tablet profesional con chip M2, compatibilidad con Apple Pencil y Magic Keyboard."
  },
  {
    name: "Samsung Galaxy Tab S9",
    price: 3499900,
    old: 4699900,
    discount: "-26%",
    category: "tecnologia",
    subcategory: "Tablets",
    img: "/images/galaxytabs9.jpg",
    specs: {
      pantalla: '11" Dynamic AMOLED 2X',
      procesador: "Snapdragon 8 Gen 2",
      ram: "8 GB",
      almacenamiento: "128 GB",
      camara: "13 MP",
      bateria: "8400 mAh"
    },
    description: "Tablet con S Pen incluido, resistencia al agua y pantalla AMOLED de 120Hz."
  },

  // Computadores
  {
    name: "MacBook Air M3 512GB",
    price: 6899900,
    old: 8799900,
    discount: "-21%",
    category: "tecnologia",
    subcategory: "Computadores",
    img: "/images/macbookairm3.jpeg",
    specs: {
      pantalla: '13.6" Liquid Retina',
      procesador: "Apple M3",
      ram: "8 GB",
      almacenamiento: "512 GB",
      graficos: "GPU 10-core",
      bateria: "18 horas"
    },
    description: "Laptop ultradelgada con chip M3, pantalla Retina y hasta 18 horas de batería."
  },
  {
    name: "ASUS ROG Strix G16",
    price: 9999900,
    old: 13999900,
    discount: "-29%",
    category: "tecnologia",
    subcategory: "Computadores",
    img: "/images/asusrogstrixg16.webp",
    specs: {
      pantalla: '16" IPS 165Hz',
      procesador: "Intel Core i9",
      ram: "32 GB",
      almacenamiento: "1 TB SSD",
      graficos: "RTX 4070",
      bateria: "90 Wh"
    },
    description: "Gaming laptop de alto rendimiento con refrigeración avanzada y RGB Aura Sync."
  },

  // Televisores
  {
    name: 'TV Samsung QLED 65" 4K',
    price: 4599900,
    old: 6799900,
    discount: "-32%",
    category: "tecnologia",
    subcategory: "Televisores",
    img: "/images/tvsamsung65.jpg",
    specs: {
      pantalla: '65" QLED 4K',
      resolucion: "3840 x 2160",
      hdr: "HDR10+, HLG",
      sonido: "Dolby Atmos",
      smart: "Tizen OS",
      puertos: "4 HDMI, 2 USB"
    },
    description: "TV QLED con Quantum Dot, Object Tracking Sound y Gaming Hub integrado."
  },
  {
    name: 'LG OLED 55"',
    price: 5499900,
    old: 7999900,
    discount: "-31%",
    category: "tecnologia",
    subcategory: "Televisores",
    img: "/images/lgoled55.jpg",
    specs: {
      pantalla: '55" OLED 4K',
      resolucion: "3840 x 2160",
      hdr: "Dolby Vision, HDR10",
      sonido: "AI Sound Pro",
      smart: "webOS 23",
      puertos: "4 HDMI, 3 USB"
    },
    description: "TV OLED con píxeles autoiluminados, α9 Gen6 AI Processor y Dolby Vision."
  },

  // Audio
  {
    name: "Sony WH-1000XM5",
    price: 1499900,
    old: 1999900,
    discount: "-25%",
    category: "tecnologia",
    subcategory: "Audio y Sonido",
    img: "/images/sonyxm5.jpg",
    specs: {
      tipo: "Audífonos Over-ear",
      cancelacion: "Noise Cancelling Pro",
      bateria: "30 horas",
      conectividad: "Bluetooth 5.2",
      peso: "250 g",
      microfono: "8 micrófonos"
    },
    description: "Audífonos con cancelación de ruido líder, sonido Hi-Res y comodidad todo el día."
  },
  {
    name: "JBL Flip 6",
    price: 599900,
    old: 899900,
    discount: "-33%",
    category: "tecnologia",
    subcategory: "Audio y Sonido",
    img: "/images/jblflip6.jpg",
    specs: {
      tipo: "Parlante Bluetooth",
      potencia: "30W RMS",
      bateria: "12 horas",
      resistencia: "IP67 agua y polvo",
      conectividad: "Bluetooth 5.1",
      peso: "550 g"
    },
    description: "Parlante portátil resistente con JBL Pro Sound y PartyBoost para stereo pairing."
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
    description: "Aceite vegetal 100% puro, ideal para freír y cocinar."
  },
  {
    name: "Cerveza Corona Sixpack",
    price: 28900,
    old: 38900,
    discount: "-26%",
    category: "mercado",
    subcategory: "Bebidas",
    img: "/images/cerveza_corona.jpg",
    description: "Sixpack de cerveza Corona 330ml, refrescante y ligera."
  },
  {
    name: "Leche Alquería 6 und",
    price: 25900,
    old: 33900,
    discount: "-24%",
    category: "mercado",
    subcategory: "Lácteos",
    img: "/images/leche_alqueria.jpg",
    description: "Pack de 6 unidades de leche entera Alquería 1100ml."
  },
  {
    name: "Carne Molida Premium 1kg",
    price: 34900,
    old: 46900,
    discount: "-26%",
    category: "mercado",
    subcategory: "Carnes",
    img: "/images/carne_molida.jpg",
    description: "Carne molida de res premium, ideal para hamburguesas y pastas."
  },
  {
    name: "Manzana Verde x kg",
    price: 8900,
    old: 12900,
    discount: "-31%",
    category: "mercado",
    subcategory: "Frutas",
    img: "/images/manzana_verde.jpg",
    description: "Manzana verde fresca por kilogramo, rica en fibra y vitaminas."
  },
  {
    name: "Papas Supreme 10 und",
    price: 12900,
    old: 18900,
    discount: "-32%",
    category: "mercado",
    subcategory: "Snacks",
    img: "/images/papas_supreme.jpg",
    description: "Pack de 10 unidades de papas fritas sabor original."
  },
  {
    name: "Jabón Dove 6 und",
    price: 18900,
    old: 26900,
    discount: "-30%",
    category: "mercado",
    subcategory: "Aseo Personal",
    img: "/images/jabon_dove.jpg",
    description: "Pack de 6 jabones Dove para cuidado suave de la piel."
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
    description: "Nevera No Frost con tecnología inverter y eficiencia energética A++."
  },
  {
    name: "Nevera Samsung French Door",
    price: 6799900,
    old: 8999900,
    discount: "-24%",
    category: "electrodomesticos",
    subcategory: "Neveras",
    img: "/images/nevera_samsung.jpg",
    description: "Nevera French Door con pantalla táctil, dispensador de agua y hielo."
  },
  {
    name: "Lavadora LG 19kg",
    price: 2399900,
    old: 3299900,
    discount: "-27%",
    category: "electrodomesticos",
    subcategory: "Lavadoras",
    img: "/images/lavadora_lg.jpg",
    description: "Lavadora de carga frontal con TurboWash y motor inverter direct drive."
  },
  {
    name: "Aire Acondicionado 12000 BTU",
    price: 1799900,
    old: 2499900,
    discount: "-28%",
    category: "electrodomesticos",
    subcategory: "Aires Acondicionados",
    img: "/images/aire_lg.jpg",
    description: "Aire acondicionado split con tecnología inverter y modo sleep."
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
    description: "Vestido midi con estampado floral, ideal para ocasiones especiales."
  },
  {
    name: "Blusa Elegante",
    price: 89900,
    old: 139900,
    discount: "-36%",
    category: "moda-mujer",
    subcategory: "Blusas",
    img: "/images/blusa_elegante.jpg",
    description: "Blusa de seda con detalles elegantes, perfecta para la oficina."
  },
  {
    name: "Jean Skinny",
    price: 149900,
    old: 219900,
    discount: "-32%",
    category: "moda-mujer",
    subcategory: "Jeans",
    img: "/images/jean_skinny.jpg",
    description: "Jean skinny ajustado, corte moderno y cómodo para el día a día."
  },
  {
    name: "Tenis Adidas Blancos",
    price: 329900,
    old: 449900,
    discount: "-27%",
    category: "moda-mujer",
    subcategory: "Zapatos",
    img: "/images/tenis_adidas.jpg",
    description: "Tenis deportivos Adidas, cómodos y versátiles para cualquier ocasión."
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
    description: "Camiseta polo clásica de algodón, ideal para looks casuales."
  },
  {
    name: "Jean Slim Levi's",
    price: 219900,
    old: 299900,
    discount: "-27%",
    category: "moda-hombre",
    subcategory: "Pantalones",
    img: "/images/jean_slim.jpg",
    description: "Jean slim fit Levi's, calidad premium y durabilidad garantizada."
  },
  {
    name: "Camisa Oxford",
    price: 179900,
    old: 259900,
    discount: "-31%",
    category: "moda-hombre",
    subcategory: "Camisetas",
    img: "/images/camisa_oxford.jpg",
    description: "Camisa Oxford de algodón, perfecta para ocasiones formales."
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
    description: "Juego de sábanas de algodón egipcio para cama Queen size."
  },
  {
    name: "Sartén Antiadherente 28cm",
    price: 89900,
    old: 139900,
    discount: "-36%",
    category: "hogar",
    subcategory: "Cocina",
    img: "/images/sarten_28cm.jpg",
    description: "Sartén antiadherente de 28cm, apta para todo tipo de cocinas."
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
    description: "Set Lego Technic Lamborghini Sián FKP 37 con más de 3,700 piezas."
  },
  {
    name: "Barbie Dreamhouse 2025",
    price: 899900,
    old: 1299900,
    discount: "-31%",
    category: "juguetes",
    subcategory: "Muñecas",
    img: "/images/barbie_dreamhouse.jpg",
    description: "Casa de muñecas Barbie con 3 pisos y más de 70 accesorios."
  },
  {
    name: "Nintendo Switch OLED",
    price: 1999900,
    old: 2499900,
    discount: "-20%",
    category: "juguetes",
    subcategory: "Consolas",
    img: "/images/nintendo_switch.jpg",
    description: "Consola Nintendo Switch OLED con pantalla de 7 pulgadas."
  },
  {
    name: "Set LEGO Star Wars",
    price: 499900,
    old: 699900,
    discount: "-28%",
    category: "juguetes",
    subcategory: "Construcción",
    img: "/images/lego_starwars.jpg",
    description: "Set Lego Star Wars Millennium Falcon con figuras coleccionables."
  },
];

function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    // Cargar carrito desde localStorage al iniciar
    const savedCart = localStorage.getItem('smartstore-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [reviews, setReviews] = useState(() => {
    // Cargar reseñas desde localStorage al iniciar
    const savedReviews = localStorage.getItem('smartstore-reviews');
    return savedReviews ? JSON.parse(savedReviews) : [];
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const heroOffers = [
    {
      title: "Hasta 60% en Tecnología",
      img: "/images/black1.jpg",
    },
    {
      title: "iPhone Pro Max con Descuento",
      img: "/images/iphone15.jpg",
    },
    {
      title: 'TV Samsung 65" QLED 4K',
      img: "/images/tvsamsung65.jpg",
    },
    {
      title: "Nevera Haceb Side by Side",
      img: "/images/haceb.jpg",
    },
  ];

  // Efecto para el slider automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroOffers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('smartstore-cart', JSON.stringify(cart));
  }, [cart]);

  // Guardar reseñas en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('smartstore-reviews', JSON.stringify(reviews));
  }, [reviews]);

  const handleSelectCategory = (categoryId, subcategory = null) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategory);
    setMenuOpen(false);
  };

  // FILTRO DE PRODUCTOS CON BÚSQUEDA
  const filteredProducts = allProducts.filter((product) => {
    // Filtro por búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.subcategory.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    
    // Filtro por categoría
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

  const addReview = (productName, rating, comment, userName) => {
    const newReview = {
      id: Date.now(),
      productName,
      rating,
      comment,
      userName: userName || "Usuario Anónimo",
      date: new Date().toLocaleDateString('es-ES'),
    };
    
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    return newReview;
  };

  const removeFromCart = (productName) => {
    setCart((prev) => {
      const item = prev.find((x) => x.name === productName);
      if (item && item.qty > 1) {
        return prev.map((x) =>
          x.name === productName ? { ...x, qty: x.qty - 1 } : x
        );
      } else {
        return prev.filter((x) => x.name !== productName);
      }
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const itemsCount = cart.reduce((a, i) => a + i.qty, 0);

  const sectionTitle = selectedSubcategory
    ? selectedSubcategory.toUpperCase()
    : selectedCategory
    ? selectedCategory.replace("-", " ").toUpperCase()
    : "OFERTAS IMBATIBLES";

  // Mostrar notificación
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 ${
      type === 'success' ? 'bg-green-600 text-white' :
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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-pink-600 text-white z-50 shadow-2xl">
        <div className="flex items-center justify-between px-4 md:px-8 py-4 gap-4 md:gap-6">
          <button
            onClick={() => setMenuOpen(true)}
            className="bg-red-500 p-3 rounded-lg hover:bg-red-600 transition"
          >
            <svg
              className="w-6 h-6 md:w-9 md:h-9 text-white"
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

          <button 
            onClick={() => {
              navigate('/');
              setSelectedCategory(null);
              setSelectedSubcategory(null);
              setSearchTerm("");
            }} 
            className="text-2xl md:text-4xl font-black tracking-tighter hover:opacity-90 transition"
          >
            SmartStore
          </button>

          {/* Buscador */}
          <div className="hidden lg:flex items-center bg-white/20 backdrop-blur-lg rounded-full px-4 md:px-6 py-2 md:py-3 w-64 md:w-96">
            <svg
              className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3"
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
              placeholder="Buscar productos..."
              className="bg-transparent outline-none text-white placeholder-white/70 flex-1 text-sm md:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="text-white/70 hover:text-white ml-2"
              >
                ✕
              </button>
            )}
          </div>

          {/* Botón del carrito */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative bg-white/20 backdrop-blur-lg rounded-full px-4 md:px-8 py-2 md:py-4 flex items-center gap-2 md:gap-3 hover:bg-white/30 transition"
          >
            <svg
              className="w-5 h-5 md:w-7 md:h-7"
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
            <span className="font-bold text-sm md:text-lg">Carrito ({itemsCount})</span>
          </button>
        </div>
      </header>

      <MegaMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelectCategory={handleSelectCategory}
      />

      {/* Hero Slider */}
      <section className="relative h-[40vh] md:h-[48vh] lg:h-[52vh] overflow-hidden">
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
            <div className="absolute inset-x-0 bottom-4 md:bottom-6 text-center px-4 md:px-6">
              <h1 className="text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-black text-white drop-shadow-2xl leading-none mb-1 md:mb-2">
                BLACK DAYS 2025
              </h1>
              <p className="text-base md:text-xl lg:text-3xl font-bold text-white drop-shadow-xl mb-3 md:mb-4">
                {heroOffers[currentSlide].title}
              </p>
              <button 
                onClick={() => navigate('/')}
                className="bg-yellow-400 text-black font-black text-base md:text-xl lg:text-2xl px-6 md:px-10 py-3 md:py-5 rounded-full hover:bg-yellow-300 transform hover:scale-110 transition shadow-2xl"
              >
                ¡COMPRA AHORA!
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicadores del slider */}
        <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {heroOffers.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentSlide ? "bg-white w-6 md:w-10" : "bg-white/70"
              }`}
            />
          ))}
        </div>
        
        {/* Flecha izquierda */}
        <button
          onClick={() =>
            setCurrentSlide((prev) =>
              prev === 0 ? heroOffers.length - 1 : prev - 1
            )
          }
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full hover:bg-black/60 transition text-2xl md:text-4xl z-30"
        >
          ‹
        </button>

        {/* Flecha derecha */}
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % heroOffers.length)
          }
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full hover:bg-black/60 transition text-2xl md:text-4xl z-30"
        >
          ›
        </button>
      </section>

      {/* Sección de productos */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 -mt-12 md:-mt-16 lg:-mt-20 relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-center md:text-left text-white bg-black/60 px-4 md:px-8 py-3 md:py-6 rounded-2xl mb-4 md:mb-0">
            {sectionTitle}
          </h2>
          {searchTerm && (
            <div className="text-sm md:text-xl text-white bg-black/40 px-4 py-2 rounded-lg">
              Resultados para: <span className="font-bold">"{searchTerm}"</span>
            </div>
          )}
        </div>
        
        {/* Mensaje si no hay productos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 md:py-20 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl shadow-xl">
            <p className="text-xl md:text-2xl text-gray-600 mb-4">No se encontraron productos</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(null);
                setSelectedSubcategory(null);
              }}
              className="bg-orange-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-orange-700 font-bold text-lg md:text-xl transition"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
            {filteredProducts.map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden cursor-pointer group hover:scale-[1.02] transition-all duration-300"
                onClick={() => navigate(`/product/${p.name.replace(/\s+/g, '-')}`, { state: { product: p } })}
              >
                <div className="relative flex items-center justify-center bg-gray-100 h-48 md:h-64 lg:h-[340px]">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-32 md:h-40 w-auto object-contain group-hover:scale-105 transition duration-300"
                  />

                  {/* Badge de descuento */}
                  {p.discount && (
                    <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-red-600 text-white font-bold px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm">
                      {p.discount}
                    </div>
                  )}
                </div>
                <div className="p-3 md:p-4 lg:p-6">
                  <h3 className="font-bold text-sm md:text-base lg:text-lg line-clamp-2 mb-2">{p.name}</h3>
                  <div className="space-y-1">
                    <span className="text-xl md:text-2xl lg:text-3xl font-black text-orange-600">
                      ${p.price.toLocaleString()}
                    </span>
                    {p.old && (
                      <span className="block text-xs md:text-sm text-gray-500 line-through">
                        ${p.old.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p);
                      showNotification(`${p.name} agregado al carrito`, 'success');
                    }}
                    className="w-full mt-3 md:mt-4 bg-gray-100 hover:bg-orange-600 hover:text-white text-gray-800 py-2 md:py-3 rounded-lg font-bold text-sm md:text-base transition"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Carrito (Modal) */}
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
              className="fixed right-0 top-0 h-full w-full max-w-md md:max-w-lg bg-white shadow-2xl z-50 overflow-y-auto p-4 md:p-6 lg:p-8"
            >
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-black">
                  Tu Carrito ({itemsCount})
                </h2>
                <div className="flex gap-2 md:gap-4">
                  {cart.length > 0 && (
                    <button 
                      onClick={() => {
                        clearCart();
                        showNotification('Carrito vaciado', 'info');
                      }}
                      className="text-red-600 hover:text-red-800 text-xs md:text-sm font-medium px-2 md:px-3 py-1 border border-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Vaciar
                    </button>
                  )}
                  <button 
                    onClick={() => setCartOpen(false)} 
                    className="text-2xl md:text-4xl hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-12 md:py-20">
                  <svg className="w-16 h-16 md:w-20 md:h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <p className="text-gray-500 text-lg md:text-xl mb-4">El carrito está vacío</p>
                  <button 
                    onClick={() => {setCartOpen(false); navigate('/');}}
                    className="bg-orange-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-orange-700 font-bold text-base md:text-lg"
                  >
                    Explorar productos
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 md:space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                    {cart.map((item) => (
                      <div
                        key={item.name}
                        className="flex gap-3 md:gap-4 border-b pb-4 md:pb-6"
                      >
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-sm md:text-base line-clamp-2">{item.name}</h4>
                          <p className="text-orange-600 font-bold text-base md:text-lg">
                            ${item.price.toLocaleString()} × {item.qty}
                          </p>
                          <div className="flex gap-3 md:gap-4 mt-2">
                            <button 
                              onClick={() => {
                                removeFromCart(item.name);
                                showNotification(`${item.name} eliminado`, 'info');
                              }}
                              className="text-red-600 hover:text-red-800 text-xs md:text-sm font-medium"
                            >
                              Eliminar
                            </button>
                            <button 
                              onClick={() => {
                                setCart(prev => prev.map(x => 
                                  x.name === item.name ? { ...x, qty: x.qty + 1 } : x
                                ));
                                showNotification(`${item.name} agregado`, 'success');
                              }}
                              className="text-green-600 hover:text-green-800 text-xs md:text-sm font-medium"
                            >
                              Agregar uno más
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 md:mt-10 pt-6 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg md:text-xl font-bold">Subtotal:</span>
                      <span className="text-lg md:text-xl font-bold">${total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Envío:</span>
                      <span className="text-green-600 font-bold">GRATIS</span>
                    </div>
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                      <span className="text-xl md:text-2xl font-black">Total:</span>
                      <span className="text-xl md:text-2xl font-black text-orange-600">${total.toLocaleString()}</span>
                    </div>
                    
                    <div className="space-y-3 md:space-y-4">
                      <button 
                        onClick={() => {
                          setCartOpen(false);
                          showNotification("¡Gracias por tu compra! Total: $" + total.toLocaleString(), 'success');
                          setTimeout(() => {
                            clearCart();
                          }, 500);
                        }}
                        className="w-full bg-gradient-to-r from-orange-600 to-pink-600 text-white py-4 md:py-6 rounded-xl font-black text-lg md:text-xl hover:opacity-90 transition"
                      >
                        FINALIZAR COMPRA
                      </button>
                      <button 
                        onClick={() => {
                          setCartOpen(false);
                          navigate('/');
                        }}
                        className="w-full border-2 border-orange-600 text-orange-600 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-orange-50 transition"
                      >
                        Seguir comprando
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 md:py-16 lg:py-20 mt-20 md:mt-32 lg:mt-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">SmartStore</h2>
          <p className="text-base md:text-xl lg:text-2xl text-gray-400 mb-6 md:mb-8">
            Proyecto Final • Universidad del Valle • 2025
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-gray-500 text-sm md:text-base">
            <span>Tecnología • Electrodomésticos • Mercado • Moda • Hogar</span>
            <span className="hidden md:block">•</span>
            <span>© 2025 SmartStore - Todos los derechos reservados</span>
          </div>
          <p className="mt-8 md:mt-10 text-gray-500 text-xs md:text-sm">
            Las imágenes son de referencia. Los precios pueden cambiar sin previo aviso.
          </p>
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default App;