// pages/CheckoutPage.jsx
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function CheckoutPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart = [], total = 0 } = location.state || {};
    const { user } = useAuth();

    // Estados para formulario
    const [step, setStep] = useState(1); // 1: Envío, 2: Pago, 3: Confirmación
    const [paymentMethod, setPaymentMethod] = useState('nequi');

    // Datos de envío
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [shippingNotes, setShippingNotes] = useState('');

    // Datos de pago
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    // Estados generales
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderCreated, setOrderCreated] = useState(false);
    const [orderData, setOrderData] = useState(null);

    // Cargar datos del usuario si está autenticado
    useEffect(() => {
        if (user) {
            setCustomerName(user.name || '');
            setCustomerEmail(user.email || '');
        }
    }, [user]);


    // Validar si hay productos
    useEffect(() => {
        if (cart.length === 0) {
            navigate('/');
        }
    }, [cart, navigate]);

    // Calcular total con impuestos (Colombia 19% IVA)
    const tax = total * 0.19;
    const grandTotal = total + tax;

    const handleSubmitShipping = (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !city || !state || !zipCode) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerEmail)) {
            alert('Por favor ingresa un email válido');
            return;
        }

        // Validar teléfono (Colombia)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(customerPhone.replace(/\D/g, ''))) {
            alert('Por favor ingresa un número de celular válido (10 dígitos)');
            return;
        }

        setStep(2);
    };

    const handleSubmitPayment = async (e) => {
        e.preventDefault();

        console.log('🛒 Enviando pedido...');
        console.log('📋 Datos:', {
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            city,
            state,
            zipCode,
            shippingNotes,
            paymentMethod,
            cartItems: cart,
            totalAmount: total
        });

        if (paymentMethod === 'card') {
            if (!cardNumber || !cardName || !expiry || !cvv) {
                alert('Por favor completa todos los datos de la tarjeta');
                return;
            }

            // Validar tarjeta
            const cleanCardNumber = cardNumber.replace(/\s/g, '');
            if (cleanCardNumber.length !== 16) {
                alert('Número de tarjeta inválido (debe tener 16 dígitos)');
                return;
            }

            // Validar CVV
            if (cvv.length !== 3) {
                alert('CVV inválido (debe tener 3 dígitos)');
                return;
            }
        }

        setIsProcessing(true);

        try {
            // Preparar datos de la orden
            const orderDataToSend = {
                customerName,
                customerEmail,
                customerPhone,
                shippingAddress,
                city,
                state,
                zipCode,
                shippingNotes,
                paymentMethod,
                cartItems: cart,
                totalAmount: total
            };

            // Añadir userId si existe
            // Validar usuario autenticado
            if (!user?.id) {
                alert('Debes iniciar sesión para completar la compra');
                setIsProcessing(false);
                return;
            }

            // Enviar userId REAL (UUID)
            orderDataToSend.userId = user.id;


            console.log('📤 Enviando a /api/orders:', orderDataToSend);

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDataToSend)
            });

            console.log('📥 Respuesta recibida. Status:', response.status);

            const result = await response.json();
            console.log('📊 Resultado JSON:', result);

            // VERIFICAR si la orden fue creada exitosamente
            // VERIFICAR si la orden fue creada exitosamente
            if (result.success) {
                setOrderData(result);
                setOrderCreated(true);
                setStep(3);

                // Limpiar carrito
                localStorage.removeItem('smartstore-cart');

                // REDIRIGIR A LA SIMULACIÓN DE PAGO
                navigate(`/payment/${paymentMethod}`, {
                    state: {
                        orderNumber: result.orderNumber || result.orderId,
                        total: total,
                        customerEmail: customerEmail,
                        customerName: customerName
                    }
                });

            } else {
                throw new Error(result.error || 'Error del servidor');

            }

        } catch (error) {
            console.error('❌ Error completo:', error);
            console.error('📌 Mensaje:', error.message);
            console.error('📌 Stack:', error.stack);
            alert('Error procesando tu pedido: ' + error.message + '. Revisa la consola para más detalles.');
        } finally {
            setIsProcessing(false);
        }
    };


    const processRealPayment = async (orderId, orderNumber) => {
        // Aquí integrarías con una pasarela REAL
        // Ejemplo con PayU Colombia:
        /*
        const paymentData = {
          merchantId: 'TU_MERCHANT_ID',
          accountId: 'TU_ACCOUNT_ID',
          description: `Orden ${orderNumber}`,
          referenceCode: orderNumber,
          amount: grandTotal,
          tax: tax,
          taxReturnBase: total,
          currency: 'COP',
          buyerEmail: customerEmail,
          buyerFullName: customerName,
          buyerPhone: customerPhone,
          shippingAddress: shippingAddress,
          shippingCity: city,
          shippingCountry: 'CO',
          test: false // Cambiar a true para pruebas
        };
        
        // Redirigir a PayU
        window.location.href = 'https://checkout.payulatam.com/ppp-web-gateway-payu/?' + new URLSearchParams(paymentData);
        */

        // Por ahora mostramos un mensaje
        alert(`Orden ${orderNumber} creada. Integra aquí tu pasarela de pago preferida (PayU, MercadoPago, Culqi, etc.)`);
    };

    const showPaymentInstructions = (orderNumber) => {
        const instructions = {
            nequi: `Para pagar con Nequi:\n1. Abre la app Nequi\n2. Ve a "Pagar" → "Pagar con QR"\n3. Escanea el código o usa el número: 3101234567\n4. Referencia: ${orderNumber}\n\nUna vez realizado el pago, tu orden será procesada.`,
            pse: `Para pagar con PSE:\n1. Serás redirigido al portal de tu banco\n2. Inicia sesión con tus credenciales\n3. Confirma el pago de $${grandTotal.toLocaleString()}\n4. Referencia: ${orderNumber}`,
            daviplata: `Para pagar con DaviPlata:\n1. Abre la app DaviPlata\n2. Ve a "Pagar servicios"\n3. Busca "SmartStore"\n4. Ingresa el monto: $${grandTotal.toLocaleString()}\n5. Referencia: ${orderNumber}`,
            cash: `Para pago en efectivo:\n1. Guarda tu número de orden: ${orderNumber}\n2. Realiza el pago en nuestros puntos autorizados\n3. Muestra tu número de orden\n\nDirección: Calle 123, Ciudad`
        };

        alert(instructions[paymentMethod]);
    };

    // Generar factura PDF (simulación)
    const generateInvoice = () => {
        alert(`Factura generada para orden ${orderData?.orderNumber}\n\nSe ha enviado a: ${customerEmail}`);
        // En una implementación real, aquí generarías y descargarías el PDF
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Pasos */}
                <div className="flex justify-between items-center mb-8">
                    {[1, 2, 3].map((num) => (
                        <div key={num} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= num ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                {num}
                            </div>
                            <div className="ml-2">
                                <div className="text-sm font-medium">
                                    {num === 1 ? 'Envío' : num === 2 ? 'Pago' : 'Confirmación'}
                                </div>
                            </div>
                            {num < 3 && <div className={`w-16 h-1 mx-2 ${step > num ? 'bg-orange-600' : 'bg-gray-300'}`} />}
                        </div>
                    ))}
                </div>

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                        {step === 1 ? 'Datos de Envío' : step === 2 ? 'Método de Pago' : '¡Pedido Confirmado!'}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {step === 1 ? 'Ingresa tus datos de contacto y envío' :
                            step === 2 ? 'Selecciona cómo deseas pagar' :
                                'Tu pedido ha sido procesado exitosamente'}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Resumen del Pedido (siempre visible) */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
                            <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>

                            {cart.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No hay productos</p>
                            ) : (
                                <>
                                    <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                                        {cart.map((item) => (
                                            <div key={item.name} className="flex items-center gap-4 border-b pb-4">
                                                <img src={item.img} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                                                    <p className="text-gray-600 text-xs">{item.qty} × ${item.price.toLocaleString()}</p>
                                                </div>
                                                <p className="font-bold text-sm">${(item.price * item.qty).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-3 border-t pt-6">
                                        <div className="flex justify-between text-sm">
                                            <span>Subtotal:</span>
                                            <span>${total.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Envío:</span>
                                            <span className="text-green-600 font-bold">GRATIS</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>IVA (19%):</span>
                                            <span>${tax.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold border-t pt-3">
                                            <span>Total a pagar:</span>
                                            <span className="text-orange-600">${grandTotal.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Formulario Principal */}
                    <div className="md:col-span-2">
                        {step === 1 && (
                            <form onSubmit={handleSubmitShipping} className="bg-white rounded-2xl shadow-xl p-6">
                                <h2 className="text-xl font-bold mb-6">Información de Contacto</h2>

                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre Completo *
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Correo Electrónico *
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Teléfono/Celular *
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="3101234567"
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                                            required
                                        />
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold mb-6">Dirección de Envío</h2>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Dirección Completa *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Calle 123 #45-67, Barrio"
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            value={shippingAddress}
                                            onChange={(e) => setShippingAddress(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ciudad *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Cali"
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Departamento *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Valle del Cauca"
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                                value={state}
                                                onChange={(e) => setState(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Código Postal *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="760001"
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                                value={zipCode}
                                                onChange={(e) => setZipCode(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Instrucciones de entrega (opcional)
                                        </label>
                                        <textarea
                                            placeholder="Ej: Timbrar dos veces, dejar con el portero, etc."
                                            className="w-full p-3 border border-gray-300 rounded-lg h-24"
                                            value={shippingNotes}
                                            onChange={(e) => setShippingNotes(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-orange-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition"
                                >
                                    Continuar al Pago
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleSubmitPayment} className="bg-white rounded-2xl shadow-xl p-6">
                                <h2 className="text-xl font-bold mb-6">Selecciona Método de Pago</h2>

                                <div className="space-y-4 mb-6">
                                    {[
                                        { id: 'nequi', name: 'Nequi', icon: '💸', desc: 'Pago instantáneo con celular' },
                                        { id: 'pse', name: 'PSE', icon: '🏦', desc: 'Pago seguro en línea' },
                                        { id: 'card', name: 'Tarjeta Crédito/Débito', icon: '💳', desc: 'Visa, Mastercard, Amex' },
                                        { id: 'daviplata', name: 'DaviPlata', icon: '📱', desc: 'Billetera digital Bancolombia' },
                                        { id: 'cash', name: 'Contraentrega', icon: '💰', desc: 'Paga al recibir tu pedido' },
                                    ].map((method) => (
                                        <label
                                            key={method.id}
                                            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${paymentMethod === method.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method.id}
                                                checked={paymentMethod === method.id}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="mr-3"
                                            />
                                            <span className="text-2xl mr-3">{method.icon}</span>
                                            <div>
                                                <span className="font-medium">{method.name}</span>
                                                <p className="text-sm text-gray-500">{method.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                {paymentMethod === 'card' && (
                                    <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                                        <h3 className="font-bold mb-4">Datos de la Tarjeta</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Número de Tarjeta
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="1234 5678 9012 3456"
                                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                                    value={cardNumber}
                                                    onChange={(e) => {
                                                        let value = e.target.value.replace(/\D/g, '');
                                                        if (value.length > 16) value = value.slice(0, 16);
                                                        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                                                        setCardNumber(value);
                                                    }}
                                                    maxLength={19}
                                                />
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Nombre en la Tarjeta
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="JUAN PEREZ"
                                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                                        value={cardName}
                                                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Expira
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="MM/AA"
                                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                                            value={expiry}
                                                            onChange={(e) => {
                                                                let value = e.target.value.replace(/\D/g, '');
                                                                if (value.length > 4) value = value.slice(0, 4);
                                                                if (value.length > 2) {
                                                                    value = value.slice(0, 2) + '/' + value.slice(2);
                                                                }
                                                                setExpiry(value);
                                                            }}
                                                            maxLength={5}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            CVV
                                                        </label>
                                                        <input
                                                            type="password"
                                                            placeholder="123"
                                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                                            value={cvv}
                                                            onChange={(e) => {
                                                                let value = e.target.value.replace(/\D/g, '');
                                                                if (value.length > 3) value = value.slice(0, 3);
                                                                setCvv(value);
                                                            }}
                                                            maxLength={3}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="font-bold text-blue-800 mb-2">Resumen de tu compra</h3>
                                    <p className="text-blue-700 text-sm">
                                        <strong>Envío a:</strong> {shippingAddress}, {city}<br />
                                        <strong>Contacto:</strong> {customerName} - {customerPhone}<br />
                                        <strong>Total:</strong> ${grandTotal.toLocaleString()} (incluye IVA)
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className={`w-full py-4 rounded-xl font-bold text-lg ${isProcessing ? 'bg-gray-400' : 'bg-gradient-to-r from-orange-600 to-pink-600 hover:opacity-90'} text-white transition`}
                                >
                                    {isProcessing ? 'Procesando pedido...' : `Confirmar y Pagar $${grandTotal.toLocaleString()}`}
                                </button>
                            </form>
                        )}

                        {step === 3 && orderData && (
                            <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
                                <div className="text-green-600 text-6xl mb-4">✅</div>
                                <h2 className="text-2xl font-bold mb-4">¡Pedido Confirmado!</h2>

                                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                    <p className="text-lg mb-2">
                                        <strong>Número de Orden:</strong> {orderData.orderNumber}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Número de Factura:</strong> {orderData.invoiceNumber}
                                    </p>
                                    <p className="mb-4">
                                        Hemos enviado los detalles a: <strong>{customerEmail}</strong>
                                    </p>

                                    <div className="border-t pt-4">
                                        <h3 className="font-bold mb-2">Resumen:</h3>
                                        <p>Total: <strong>${grandTotal.toLocaleString()}</strong></p>
                                        <p>Método: <strong>{paymentMethod === 'card' ? 'Tarjeta' :
                                            paymentMethod === 'nequi' ? 'Nequi' :
                                                paymentMethod === 'pse' ? 'PSE' :
                                                    paymentMethod === 'daviplata' ? 'DaviPlata' : 'Contraentrega'}</strong></p>
                                        <p>Estado: <span className="text-green-600 font-bold">Procesando</span></p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={generateInvoice}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition"
                                    >
                                        Descargar Factura PDF
                                    </button>

                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full border-2 border-orange-600 text-orange-600 py-3 rounded-xl font-bold hover:bg-orange-50 transition"
                                    >
                                        Seguir Comprando
                                    </button>
                                </div>

                                <p className="mt-6 text-gray-600 text-sm">
                                    ¿Necesitas ayuda? Contáctanos: soporte@smartstore.com
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {step < 3 && (
                    <button
                        onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
                        className="mt-8 text-gray-600 hover:text-gray-800 flex items-center gap-2"
                    >
                        ← {step > 1 ? 'Volver atrás' : 'Cancelar y volver al inicio'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default CheckoutPage;