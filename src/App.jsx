import "./index.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MegaMenu from "./components/MegaMenu";
import CartModal from "./components/CartModal"; // Asegúrate de que este componente exista
import ProductDetail from "./pages/ProductDetail";
import ChatWidget from "./components/ChatWidget"; // Ruta corregida si es necesario
import AuthPage from "./pages/AuthPage";
import ResetPassword from './pages/ResetPassword';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import { useAuth } from './context/AuthContext';
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSimulation from './pages/PaymentSimulation ';
import { AuthProvider } from './context/AuthContext'; // Importar el proveedor

// ----------------------------------------------------------------------
// DATOS DE PRODUCTOS (Sacado de la versión de Santiago)
// ----------------------------------------------------------------------
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
        img: "/images/tvsamsung65.webp", // Corregí la extensión de JPG a WEBP/JPG si es necesario, pero mantengo la ruta original
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
        img: "/images/lgoled55.webp", // Corregí la extensión de JPG a WEBP/JPG si es necesario, pero mantengo la ruta original
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
        img: "/images/Sony WH-1000XM5.jpg", // Corregí la ruta
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
        img: "/images/jblflip6.jpg", // Agregando una imagen de ejemplo
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
        img: "/images/aceitepremier.jpg", // Agregando una imagen de ejemplo
        description: "Aceite vegetal 100% puro, ideal para freír y cocinar."
    },
    {
        name: "Cerveza Corona Sixpack",
        price: 28900,
        old: 38900,
        discount: "-26%",
        category: "mercado",
        subcategory: "Bebidas",
        img: "/images/cerveza_corona.jpg", // Agregando una imagen de ejemplo
        description: "Sixpack de cerveza Corona 330ml, refrescante y ligera."
    },
    {
        name: "Leche Alquería 6 und",
        price: 25900,
        old: 33900,
        discount: "-24%",
        category: "mercado",
        subcategory: "Lácteos",
        img: "/images/leche_alqueria.jpg", // Agregando una imagen de ejemplo
        description: "Pack de 6 unidades de leche entera Alquería 1100ml."
    },
    {
        name: "Carne Molida Premium 1kg",
        price: 34900,
        old: 46900,
        discount: "-26%",
        category: "mercado",
        subcategory: "Carnes",
        img: "/images/carne_molida.jpg", // Agregando una imagen de ejemplo
        description: "Carne molida de res premium, ideal para hamburguesas y pastas."
    },
    {
        name: "Manzana Verde x kg",
        price: 8900,
        old: 12900,
        discount: "-31%",
        category: "mercado",
        subcategory: "Frutas",
        img: "/images/manzana_verde.jpg", // Agregando una imagen de ejemplo
        description: "Manzana verde fresca por kilogramo, rica en fibra y vitaminas."
    },
    {
        name: "Papas Supreme 10 und",
        price: 12900,
        old: 18900,
        discount: "-32%",
        category: "mercado",
        subcategory: "Snacks",
        img: "/images/papas_supreme.jpg", // Agregando una imagen de ejemplo
        description: "Pack de 10 unidades de papas fritas sabor original."
    },
    {
        name: "Jabón Dove 6 und",
        price: 18900,
        old: 26900,
        discount: "-30%",
        category: "mercado",
        subcategory: "Aseo Personal",
        img: "/images/jabon_dove.jpg", // Agregando una imagen de ejemplo
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
        img: "/images/haceb.webp", // Corregí la ruta
        description: "Nevera No Frost con tecnología inverter y eficiencia energética A++."
    },
    {
        name: "Nevera Samsung French Door",
        price: 6799900,
        old: 8999900,
        discount: "-24%",
        category: "electrodomesticos",
        subcategory: "Neveras",
        img: "/images/nevera_samsung.jpg", // Agregando una imagen de ejemplo
        description: "Nevera French Door con pantalla táctil, dispensador de agua y hielo."
    },
    {
        name: "Lavadora LG 19kg",
        price: 2399900,
        old: 3299900,
        discount: "-27%",
        category: "electrodomesticos",
        subcategory: "Lavadoras",
        img: "/images/lavadora_lg.jpg", // Agregando una imagen de ejemplo
        description: "Lavadora de carga frontal con TurboWash y motor inverter direct drive."
    },
    {
        name: "Aire Acondicionado 12000 BTU",
        price: 1799900,
        old: 2499900,
        discount: "-28%",
        category: "electrodomesticos",
        subcategory: "Aires Acondicionados",
        img: "/images/aire_lg.jpg", // Agregando una imagen de ejemplo
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
        img: "/images/vestido_midi.jpg", // Agregando una imagen de ejemplo
        description: "Vestido midi con estampado floral, ideal para ocasiones especiales."
    },
    {
        name: "Blusa Elegante",
        price: 89900,
        old: 139900,
        discount: "-36%",
        category: "moda-mujer",
        subcategory: "Blusas",
        img: "/images/blusa_elegante.jpg", // Agregando una imagen de ejemplo
        description: "Blusa de seda con detalles elegantes, perfecta para la oficina."
    },
    {
        name: "Jean Skinny",
        price: 149900,
        old: 219900,
        discount: "-32%",
        category: "moda-mujer",
        subcategory: "Jeans",
        img: "/images/jean_skinny.jpg", // Agregando una imagen de ejemplo
        description: "Jean skinny ajustado, corte moderno y cómodo para el día a día."
    },
    {
        name: "Tenis Adidas Blancos",
        price: 329900,
        old: 449900,
        discount: "-27%",
        category: "moda-mujer",
        subcategory: "Zapatos",
        img: "/images/tenis_adidas.jpg", // Agregando una imagen de ejemplo
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
        img: "/images/camiseta_nautica.jpg", // Agregando una imagen de ejemplo
        description: "Camiseta polo clásica de algodón, ideal para looks casuales."
    },
    {
        name: "Jean Slim Levi's",
        price: 219900,
        old: 299900,
        discount: "-27%",
        category: "moda-hombre",
        subcategory: "Pantalones",
        img: "/images/jean_slim.jpg", // Agregando una imagen de ejemplo
        description: "Jean slim fit Levi's, calidad premium y durabilidad garantizada."
    },
    {
        name: "Camisa Oxford",
        price: 179900,
        old: 259900,
        discount: "-31%",
        category: "moda-hombre",
        subcategory: "Camisetas",
        img: "/images/camisa_oxford.jpg", // Agregando una imagen de ejemplo
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
        img: "/images/sabanas_queen.jpg", // Agregando una imagen de ejemplo
        description: "Juego de sábanas de algodón egipcio para cama Queen size."
    },
    {
        name: "Sartén Antiadherente 28cm",
        price: 89900,
        old: 139900,
        discount: "-36%",
        category: "hogar",
        subcategory: "Cocina",
        img: "/images/sarten_28cm.jpg", // Agregando una imagen de ejemplo
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
        img: "/images/lego_lamborghini.jpg", // Agregando una imagen de ejemplo
        description: "Set Lego Technic Lamborghini Sián FKP 37 con más de 3,700 piezas."
    },
    {
        name: "Barbie Dreamhouse 2025",
        price: 899900,
        old: 1299900,
        discount: "-31%",
        category: "juguetes",
        subcategory: "Muñecas",
        img: "/images/barbie_dreamhouse.jpg", // Agregando una imagen de ejemplo
        description: "Casa de muñecas Barbie con 3 pisos y más de 70 accesorios."
    },
    {
        name: "Nintendo Switch OLED",
        price: 1999900,
        old: 2499900,
        discount: "-20%",
        category: "juguetes",
        subcategory: "Consolas",
        img: "/images/nintendo_switch.jpg", // Agregando una imagen de ejemplo
        description: "Consola Nintendo Switch OLED con pantalla de 7 pulgadas."
    },
    {
        name: "Set LEGO Star Wars",
        price: 499900,
        old: 699900,
        discount: "-28%",
        category: "juguetes",
        subcategory: "Construcción",
        img: "/images/lego_starwars.jpg", // Agregando una imagen de ejemplo
        description: "Set Lego Star Wars Millennium Falcon con figuras coleccionables."
    },
];

// ----------------------------------------------------------------------
// COMPONENTE HOME PAGE (Lógica de la versión de Santiago)
// ----------------------------------------------------------------------
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
    const { user, logout } = useAuth();
    const isAuthenticated = !!user; //

    // Datos del carrusel (Sacados de la versión de Santiago)
    const heroOffers = [
        {
            title: "Hasta 60% en Tecnología",
            img: "/images/black1.jpg",
        },
        {
            title: "iPhone Pro Max con Descuento",
            img: "/images/iPhone-15.jpg", // Corregí a iPhone-15.jpg
        },
        {
            title: 'TV Samsung 65" QLED 4K',
            img: "/images/tvsamsung65.webp", // Corregí la ruta
        },
        {
            title: "Nevera Haceb Side by Side",
            img: "/images/haceb.webp", // Corregí la ruta
        },
    ];

    // Efecto para el slider automático
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroOffers.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroOffers.length]); // Dependencia agregada para evitar warnings

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
        setSearchTerm(""); // Limpiar búsqueda al seleccionar categoría
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

        // Si hay subcategoría seleccionada, solo se muestran productos de esa subcategoría
        return matchCategory && product.subcategory === selectedSubcategory;
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

        // Mostrar notificación de éxito
        showNotification(`${p.name} agregado al carrito`, 'success');

        // Redirigir a la página de inicio (redundante si ya estamos en /, pero se mantiene)
        if (navigate.location?.pathname !== '/') {
            navigate('/');
        }
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

    const sectionTitle = searchTerm
        ? `RESULTADOS PARA "${searchTerm.toUpperCase()}"`
        : selectedSubcategory
            ? selectedSubcategory.toUpperCase()
            : selectedCategory
                ? selectedCategory.replace("-", " ").toUpperCase()
                : "OFERTAS IMBATIBLES";

    // Función para mostrar notificación
    const showNotification = (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-[100] flex items-center gap-3 ${type === 'success' ? 'bg-green-600 text-white' :
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

    // Componente de Producto (renderizado dentro de HomePage)
    const ProductCard = ({ product }) => {
        const productReviews = reviews.filter(r => r.productName === product.name);
        const averageRating = productReviews.length > 0
            ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
            : '—';

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative group flex flex-col"
            >
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">
                    {product.discount}
                </div>
                <div className="flex-grow flex items-center justify-center p-4" onClick={() => navigate(`/producto/${encodeURIComponent(product.name)}`)}>
                    <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-48 object-contain cursor-pointer"
                    />
                </div>
                <div className="p-4 flex flex-col justify-between flex-grow">
                    <h3
                        className="text-gray-800 font-semibold text-lg hover:text-orange-600 transition cursor-pointer flex-grow"
                        onClick={() => navigate(`/producto/${encodeURIComponent(product.name)}`)}
                    >
                        {product.name}
                    </h3>
                    <div className="flex items-center text-sm my-1">
                        <span className="text-yellow-500 font-bold mr-1">{averageRating}</span>
                        <span className="text-gray-500">({productReviews.length} reseñas)</span>
                    </div>
                    <div className="mt-2">
                        <p className="text-gray-500 line-through text-sm">${product.old.toLocaleString('es-CO')}</p>
                        <p className="text-3xl font-black text-orange-600">${product.price.toLocaleString('es-CO')}</p>
                    </div>
                    <button
                        onClick={() => addToCart(product)}
                        className="mt-4 bg-orange-600 text-white font-bold py-3 rounded-full hover:bg-orange-700 transition shadow-lg flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Añadir
                    </button>
                </div>
            </motion.div>
        );
    };

    return (
        <>
            {/* Header (Mantenido arriba, fuera de Routes) */}

            <MegaMenu
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                onSelectCategory={handleSelectCategory}
            />

            <main className="pt-[100px] md:pt-[100px]"> {/* Ajuste de padding-top para el header fijo */}

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

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                            <div className="absolute inset-x-0 bottom-4 md:bottom-6 text-center px-4 md:px-6">
                                <h1 className="text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-black text-white drop-shadow-2xl leading-none mb-1 md:mb-2">
                                    BLACK DAYS 2025
                                </h1>
                                <p className="text-base md:text-xl lg:text-3xl font-bold text-white drop-shadow-xl mb-3 md:mb-4">
                                    {heroOffers[currentSlide].title}
                                </p>
                                <button
                                    onClick={() => navigate('/productos')}
                                    className="bg-yellow-400 text-black font-black text-sm md:text-xl px-6 md:px-12 py-3 md:py-6 rounded-full hover:bg-yellow-300 transition shadow-xl transform hover:scale-[1.02]"
                                >
                                    ¡VER TODAS LAS OFERTAS!
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </section>

                {/* Sección de Productos */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-8 border-b-4 border-orange-500 pb-2">
                        {sectionTitle} ({filteredProducts.length})
                    </h2>
                    {filteredProducts.length === 0 ? (
                        <p className="text-xl text-gray-600">No se encontraron productos que coincidan con los criterios de búsqueda o filtro.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            <AnimatePresence>
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.name} product={product} />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </section>
                <ChatWidget />
            </main>

            {/* Carrito Modal (Mantenido fuera de Routes para que esté en todas las páginas) */}
            <CartModal
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
                cartItems={cart}
                total={total}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
                navigate={navigate}
            />

        </>
    );
}

// ----------------------------------------------------------------------
// COMPONENTE PRINCIPAL (Rutas)
// ----------------------------------------------------------------------
function App() {
    // Definir la ruta PrivateRoute (protección de rutas)
    const PrivateRoute = ({ children }) => {
        const { user } = useAuth();
        return user ? children : <Navigate to="/auth" replace />;
    };

    return (
        <Router>
            <HomePage /> {/* Renderizar HomePage con Header, MegaMenu, y ChatWidget */}
            <Routes>
                {/* La ruta principal (/) ya es manejada por HomePage al renderizar los productos */}
                <Route path="/" element={null} />

                {/* Rutas de Producto */}
                <Route
                    path="/producto/:name"
                    element={
                        <ProductDetail
                            allProducts={allProducts}
                            reviews={JSON.parse(localStorage.getItem('smartstore-reviews') || '[]')}
                            addReview={(pName, rating, comment, uName) => {
                                const newReview = {
                                    id: Date.now(),
                                    productName: pName,
                                    rating,
                                    comment,
                                    userName: uName || "Usuario Anónimo",
                                    date: new Date().toLocaleDateString('es-ES'),
                                };
                                const currentReviews = JSON.parse(localStorage.getItem('smartstore-reviews') || '[]');
                                const updatedReviews = [...currentReviews, newReview];
                                localStorage.setItem('smartstore-reviews', JSON.stringify(updatedReviews));
                                return newReview;
                            }}
                            addToCart={(p) => {
                                // Redirigir la acción de agregar al carrito al estado de HomePage
                                const savedCart = JSON.parse(localStorage.getItem('smartstore-cart') || '[]');
                                const exists = savedCart.find((x) => x.name === p.name);
                                const updatedCart = exists
                                    ? savedCart.map((x) => (x.name === p.name ? { ...x, qty: x.qty + 1 } : x))
                                    : [...savedCart, { ...p, qty: 1 }];
                                localStorage.setItem('smartstore-cart', JSON.stringify(updatedCart));
                                // Mostrar notificación de éxito (Puedes optimizar esto si deseas)
                                const notification = document.createElement('div');
                                notification.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-[100] flex items-center gap-3 bg-green-600 text-white`;
                                notification.innerHTML = `
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>${p.name} agregado al carrito</span>
                                `;
                                document.body.appendChild(notification);
                                setTimeout(() => notification.remove(), 3000);
                            }}
                        />
                    }
                />

                {/* Rutas de Autenticación y Perfil */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/perfil" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                
                {/* Rutas de Checkout y Pago */}
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/pago/:orderNumber" element={<PaymentSimulation />} />

                {/* Manejo de rutas no encontradas (404) */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default () => (
    <AuthProvider>
        <App />
    </AuthProvider>
);