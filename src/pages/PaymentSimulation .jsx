// src/pages/PaymentSimulation.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function PaymentSimulation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { method } = useParams();
    const { orderNumber, total, customerEmail } = location.state || {};

    const [countdown, setCountdown] = useState(10);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentCompleted, setPaymentCompleted] = useState(false);

    // Métodos de pago 
    const paymentMethods = {
        nequi: {
            name: 'Nequi',
            icon: '💸',
            instructions: [
                '1. Abre la app Nequi',
                '2. Ve a "Pagar" → "Pagar con QR"',
                '3. Escanea el código QR abajo',
                '4. O transfiere al número: 3101234567',
                '5. Referencia: ' + orderNumber
            ],
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=NequiPayment-' + orderNumber,
            phoneNumber: '3215451714'
        },
        pse: {
            name: 'PSE',
            icon: '🏦',
            instructions: [
                '1. Selecciona tu banco',
                '2. Serás redirigido al portal bancario',
                '3. Inicia sesión con tus credenciales',
                '4. Confirma el pago de $' + total?.toLocaleString(),
                '5. Referencia: ' + orderNumber
            ],
            banks: ['Bancolombia', 'Davivienda', 'BBVA', 'Banco de Bogotá', 'Davivienda', 'Banco Popular']
        },
        card: {
            name: 'Tarjeta',
            icon: '💳',
            instructions: [
                '1. Ingresa los datos de tu tarjeta',
                '2. Confirma el pago de $' + total?.toLocaleString(),
                '3. Recibirás un SMS de confirmación',
                '4. Referencia: ' + orderNumber
            ]
        },
        daviplata: {
            name: 'DaviPlata',
            icon: '📱',
            instructions: [
                '1. Abre la app DaviPlata',
                '2. Ve a "Pagar servicios"',
                '3. Busca "SmartStore"',
                '4. Ingresa el monto: $' + total?.toLocaleString(),
                '5. Referencia: ' + orderNumber
            ],
            phoneNumber: '310 987 6543'
        }
    };

    const currentMethod = paymentMethods[method] || paymentMethods.nequi;

    useEffect(() => {
        if (!orderNumber) {
            navigate('/checkout');
        }
    }, [orderNumber, navigate]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleSimulatePayment = async () => {
        setIsProcessing(true);

        // Simular procesamiento
        setTimeout(() => {
            setIsProcessing(false);
            setPaymentCompleted(true);

        
            fetch(`/api/orders/${orderNumber}/status`, {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentStatus: 'paid',
                    paymentReference: 'PAY-' + Date.now().toString().slice(-8)
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('✅ Orden actualizada:', data);
                })
                .catch(error => {
                    console.error('❌ Error actualizando orden:', error);
                });

            // Simular email
            console.log('📧 Email enviado a:', customerEmail);
            console.log('🧾 Factura generada para:', orderNumber);

        }, 2000);
    };

    const handleDownloadInvoice = () => {
        // Generar factura HTML para descargar
        const invoiceContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Factura ${orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .details { margin: 20px 0; }
          .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
          .footer { margin-top: 40px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SmartStore</h1>
          <h2>FACTURA #${orderNumber}</h2>
          <p>Fecha: ${new Date().toLocaleDateString('es-ES')}</p>
        </div>
        
        <div class="details">
          <h3>Detalles del Pago</h3>
          <p><strong>Método:</strong> ${currentMethod.name}</p>
          <p><strong>Total:</strong> $${total?.toLocaleString()}</p>
          <p><strong>Referencia:</strong> ${orderNumber}</p>
          <p><strong>Estado:</strong> PAGADO</p>
        </div>
        
        <div class="footer">
          <p>Gracias por tu compra en SmartStore</p>
          <p>Contacto: soporte@smartstore.com</p>
        </div>
      </body>
      </html>
    `;

        const blob = new Blob([invoiceContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura-${orderNumber}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert(`Factura ${orderNumber} descargada`);
    };

    if (paymentCompleted) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
                <div className="max-w-md mx-auto text-center">
                    <div className="text-green-600 text-6xl mb-6">✅</div>
                    <h1 className="text-3xl font-bold mb-4">¡Pago Completado!</h1>

                    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                        <p className="text-lg mb-2">
                            <strong>Orden:</strong> {orderNumber}
                        </p>
                        <p className="mb-2">
                            <strong>Monto:</strong> ${total?.toLocaleString()}
                        </p>
                        <p className="mb-4">
                            <strong>Método:</strong> {currentMethod.name}
                        </p>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <p className="text-green-700">
                                ✅ Recibimos tu pago exitosamente
                            </p>
                            <p className="text-sm text-green-600 mt-2">
                                Se ha enviado un comprobante a: {customerEmail}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleDownloadInvoice}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
                            >
                                📥 Descargar Factura
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
                            >
                                🏠 Volver al Inicio
                            </button>

                            <button
                                onClick={() => navigate('/profile')}
                                className="w-full border-2 border-orange-600 text-orange-600 py-3 rounded-lg font-medium hover:bg-orange-50"
                            >
                                📋 Ver Mis Pedidos
                            </button>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm">
                        ¿Necesitas ayuda? Contacta a soporte@smartstore.com
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">{currentMethod.icon}</div>
                    <h1 className="text-3xl font-bold">realizar pago con {currentMethod.name}</h1>
                    <p className="text-gray-600 mt-2">
                        Completa el pago para finalizar tu orden
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
                        <div className="space-y-2">
                            <p><strong>Orden:</strong> {orderNumber}</p>
                            <p><strong>Total a pagar:</strong> ${total?.toLocaleString()}</p>
                            <p><strong>Email:</strong> {customerEmail}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-4">Instrucciones</h2>
                        <ul className="space-y-2">
                            {currentMethod.instructions.map((step, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                                        {index + 1}
                                    </span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {method === 'nequi' && (
                        <div className="mb-6 text-center">
                            <h3 className="font-bold mb-2">Escanea el QR</h3>
                            <img
                                src={currentMethod.qrCode}
                                alt="QR Code"
                                className="mx-auto border-2 border-gray-200 rounded-lg"
                            />
                            <p className="mt-2 text-gray-600">
                                O envía al: <strong>{currentMethod.phoneNumber}</strong>
                            </p>
                        </div>
                    )}

                    {method === 'pse' && (
                        <div className="mb-6">
                            <h3 className="font-bold mb-2">Selecciona tu banco</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {currentMethod.banks.map((bank) => (
                                    <button
                                        key={bank}
                                        className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                                    >
                                        {bank}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-yellow-800 text-sm">
                            ⏱️ Este es un pago real, seras redirigido a {currentMethod.name}.
                            El pago se realizara automáticamente en {countdown} segundos.
                        </p>
                    </div>

                    <button
                        onClick={handleSimulatePayment}
                        disabled={isProcessing}
                        className={`w-full py-4 rounded-xl font-bold text-lg ${isProcessing ? 'bg-gray-400' : 'bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90'} text-white transition`}
                    >
                        {isProcessing ? 'Procesando pago...' : `Realizar pago con ${currentMethod.name}`}
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="w-full mt-4 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
                    >
                        ← Cancelar y volver
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentSimulation;