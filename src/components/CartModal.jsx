// components/CartModal.jsx

import React from 'react';
import { motion, AnimatePresence } from "framer-motion";

function CartModal({ isOpen, onClose, cart, total, removeFromCart, clearCart, navigate }) {
    
    // Función para manejar la navegación a Checkout
    const handleCheckout = () => {
        onClose(); // Cierra el modal del carrito
        navigate('/checkout'); // Navega a la nueva página de Checkout
    };
    
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex justify-end"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Overlay oscuro para cerrar el modal */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={onClose}
                    />

                    {/* Contenido del Carrito */}
                    <motion.div
                        className="relative w-full max-w-sm md:max-w-md bg-white h-full shadow-2xl overflow-y-auto"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.3 }}
                    >
                        <header className="sticky top-0 p-6 bg-orange-600 text-white flex justify-between items-center z-10">
                            <h2 className="text-3xl font-black">🛒 Tu Carrito</h2>
                            <button onClick={onClose} className="text-3xl font-bold hover:text-gray-200 transition">
                                ✕
                            </button>
                        </header>

                        <div className="p-6 space-y-4 flex-1">
                            {cart.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="text-xl text-gray-500">El carrito está vacío.</p>
                                </div>
                            ) : (
                                cart.map((item, index) => (
                                    <div key={index} className="flex items-center border-b pb-4">
                                        <img src={item.img} alt={item.name} className="w-16 h-16 object-cover mr-4 rounded-lg" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 line-clamp-2">{item.name}</h3>
                                            <p className="text-orange-600 font-bold">${item.price.toLocaleString()} x {item.qty}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <button 
                                                onClick={() => removeFromCart(item.name)} 
                                                className="text-red-500 hover:text-red-700 font-bold text-xl leading-none"
                                                title="Quitar uno"
                                            >
                                                −
                                            </button>
                                            <span className="text-lg font-bold mt-1">${(item.price * item.qty).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pie de página con el total y botones de acción */}
                        {cart.length > 0 && (
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 shadow-2xl">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xl font-bold">Total:</span>
                                    <span className="text-3xl font-black text-orange-600">${total.toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={handleCheckout} // <--- Este botón lleva al Checkout
                                    className="w-full bg-green-600 text-white font-black text-xl py-4 rounded-xl hover:bg-green-700 transition mb-3 shadow-lg"
                                >
                                    PAGAR Y FINALIZAR COMPRA
                                </button>
                                <button
                                    onClick={clearCart}
                                    className="w-full text-sm text-gray-500 hover:text-red-500 transition"
                                >
                                    Vaciar Carrito
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default CartModal;