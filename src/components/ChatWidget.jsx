import { useState } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: '¡Hola! Soy tu asistente de SmartStore. ¿En qué puedo ayudarte?' }
  ]);

    const handleSend = () => {
    if (!message.trim()) return;
    
    // Agregar mensaje del usuario
    setMessages([...messages, { role: 'user', text: message }]);
    
    // Simular respuesta de IA
    setTimeout(() => {
      const userMessageLower = message.toLowerCase();
      let aiResponse;
      
      // 1. SOPORTE TÉCNICO
      if (userMessageLower.includes('soporte') || userMessageLower.includes('ayuda') || 
          userMessageLower.includes('problema') || userMessageLower.includes('reclamo')) {
        const whatsappNumber = '573016669490'; 
        const whatsappText = `Hola, vengo desde SmartStore. Necesito ayuda con: "${message}"`;
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
        
        aiResponse = {
          role: 'ai',
          text: `Entiendo que necesitas soporte personalizado. Para ayudarte mejor, te conecto con nuestro equipo especializado por WhatsApp. Ellos pueden ayudarte con: \n• Problemas con pedidos\n• Devoluciones o cambios\n• Garantías\n• Consultas técnicas\n• Reclamos`,
          whatsappLink: whatsappLink
        };
      
      // 2. COMPRAS
      } else if (userMessageLower.includes('comprar') || userMessageLower.includes('quiero comprar') || 
                 userMessageLower.includes('producto') || userMessageLower.includes('artículo')) {
        aiResponse = {
          role: 'ai',
          text: `¡Excelente! En SmartStore tenemos: \n\n📱 **TECNOLOGÍA**: iPhone, Samsung, TV, laptops\n🛒 **MERCADO**: Alimentos, bebidas, abarrotes\n🏠 **ELECTRODOMÉSTICOS**: Neveras, lavadoras\n👗 **MODA**: Ropa para mujer y hombre\n🎮 **JUGUETES**: Lego, consolas, muñecas\n\n¿Qué categoría te interesa? O dime el producto específico que buscas.`
        };
      
      // 3. PRECIOS
      } else if (userMessageLower.includes('precio') || userMessageLower.includes('cuánto') || 
                 userMessageLower.includes('cuesta') || userMessageLower.includes('barato')) {
        aiResponse = {
          role: 'ai',
          text: `En SmartStore tenemos precios increíbles: \n• Descuentos hasta el 60%\n• Ofertas Black Days 2025\n• Precios más bajos garantizados\n\n¿Qué producto te interesa? Por ejemplo: "iPhone 15", "TV Samsung", "nevera", etc.`
        };
      
      // 4. ENVÍOS
      } else if (userMessageLower.includes('envío') || userMessageLower.includes('entrega') || 
                 userMessageLower.includes('llegar') || userMessageLower.includes('domicilio')) {
        aiResponse = {
          role: 'ai',
          text: `🚚 **ENVÍOS SMARTSTORE**: \n• 📦 ENVÍO GRATIS en todos los pedidos\n• ⏱️ Entrega en 3-5 días hábiles\n• 🏠 Llevamos hasta la puerta de tu casa\n• 📍 Cobertura en toda la ciudad\n• 🔒 Seguimiento en tiempo real\n\n¿De qué ciudad eres?`
        };
      
      // 5. MÉTODOS DE PAGO
      } else if (userMessageLower.includes('pago') || userMessageLower.includes('tarjeta') || 
                 userMessageLower.includes('efectivo') || userMessageLower.includes('transferencia')) {
        aiResponse = {
          role: 'ai',
          text: `💳 **MÉTODOS DE PAGO**: \n• Tarjeta de crédito/débito (Visa, MasterCard)\n• Pago contra entrega en efectivo\n• Transferencia bancaria\n• PSE\n• Nequi y Daviplata\n\nTodos los pagos son 100% seguros.`
        };
      
      // 6. PROMOCIONES
      } else if (userMessageLower.includes('oferta') || userMessageLower.includes('descuento') || 
                 userMessageLower.includes('promo') || userMessageLower.includes('black days')) {
        aiResponse = {
          role: 'ai',
          text: `🎉 **OFERTAS ACTUALES**: \n\n🔥 BLACK DAYS 2025 (Hasta 60% OFF)\n• Tecnología: iPhone, Samsung, TV QLED\n• Electrodomésticos: Neveras, lavadoras\n• Moda: Ropa con 50% descuento\n• Mercado: Descuentos en alimentos\n\n¡Es la mejor época para comprar!`
        };
      
      // 7. CATEGORÍAS
      } else if (userMessageLower.includes('tecnología') || userMessageLower.includes('celular') || 
                 userMessageLower.includes('tv') || userMessageLower.includes('electrodoméstico') ||
                 userMessageLower.includes('mercado') || userMessageLower.includes('moda') ||
                 userMessageLower.includes('ropa') || userMessageLower.includes('juguete')) {
        aiResponse = {
          role: 'ai',
          text: `Te recomiendo explorar:\n\n1. **Tecnología**: iPhone 15 Pro Max, Samsung S24 Ultra, TV QLED 65"\n2. **Electrodomésticos**: Neveras No Frost, lavadoras LG\n3. **Mercado**: Alimentos, bebidas, aseo\n4. **Moda**: Ropa para mujer/hombre\n5. **Juguetes**: Lego, Nintendo Switch\n\n¿Qué te gustaría ver?`
        };
      
      // 8. SALUDOS
      } else if (userMessageLower.includes('hola') || userMessageLower.includes('buenas') || 
                 userMessageLower.includes('qué tal') || userMessageLower.includes('saludos')) {
        aiResponse = {
          role: 'ai',
          text: `¡Hola! 👋 Soy tu asistente de SmartStore. Puedo ayudarte con:\n• Encontrar productos y precios\n• Información de envíos y pagos\n• Soporte técnico (conectar con WhatsApp)\n• Promociones y descuentos\n\n¿En qué te ayudo hoy?`
        };
      
      // 9. AGRADECIMIENTOS
      } else if (userMessageLower.includes('gracias') || userMessageLower.includes('ok') || 
                 userMessageLower.includes('vale') || userMessageLower.includes('listo')) {
        aiResponse = {
          role: 'ai',
          text: `¡Con gusto! 😊 Recuerda que si necesitas ayuda personalizada, solo dime "soporte" y te conecto con nuestro equipo por WhatsApp.\n\n¿Hay algo más en lo que pueda ayudarte?`
        };
      
      // 10. RESPUESTA POR DEFECTO (mejorada)
      } else {
        aiResponse = {
          role: 'ai',
          text: `Entiendo tu consulta sobre "${message}". Puedo ayudarte con:\n\n• 🛒 **Compras**: Productos y categorías\n• 💰 **Precios**: Ofertas y descuentos\n• 🚚 **Envíos**: Tiempos y costos\n• 💳 **Pagos**: Métodos disponibles\n• 🆘 **Soporte**: Problemas o consultas\n\n¿En cuál de estos temas te puedo ayudar? O dime "soporte" para atención personalizada.`
        };
      }
      
      setMessages(prev => [...prev, aiResponse]);
    }, 500);
    
    setMessage('');
  };

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '70px',
          height: '70px',
          background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
          color: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          fontWeight: 'bold',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          zIndex: 99999,
          cursor: 'pointer',
          border: '3px solid white',
          transition: 'transform 0.3s',
          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = isOpen ? 'rotate(90deg) scale(1.1)' : 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = isOpen ? 'rotate(90deg)' : 'scale(1)'}
      >
        {isOpen ? '✕' : '💬'}
      </div>

      {/* VENTANA DEL CHAT */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '120px',
          right: '30px',
          width: '380px',
          height: '550px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          zIndex: 99998,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '2px solid #e5e7eb'
        }}>
          {/* HEADER */}
          <div style={{
            background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
            color: 'white',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Asistente SmartStore</div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>Responde al instante</div>
            </div>
            <div style={{ fontSize: '14px', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px' }}>
              Online
            </div>
          </div>

          {/* MENSAJES */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            background: '#f9fafb'
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: '15px',
                  textAlign: msg.role === 'user' ? 'right' : 'left'
                }}
              >
                <div style={{
                  display: 'inline-block',
                  maxWidth: '85%',
                  padding: '12px 18px',
                  borderRadius: '20px',
                  background: msg.role === 'user' ? '#3b82f6' : 'white',
                  color: msg.role === 'user' ? 'white' : '#1f2937',
                  border: msg.role === 'user' ? 'none' : '1px solid #e5e7eb',
                  boxShadow: msg.role === 'user' ? '0 2px 5px rgba(59,130,246,0.3)' : '0 2px 5px rgba(0,0,0,0.05)',
                  borderBottomRightRadius: msg.role === 'user' ? '5px' : '20px',
                  borderBottomLeftRadius: msg.role === 'user' ? '20px' : '5px'
                }}>
                  {msg.text}
                  
                  {msg.whatsappLink && (
                    <a
                      href={msg.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        marginTop: '15px',
                        background: '#22c55e',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        transition: 'background 0.3s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#16a34a'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#22c55e'}
                    >
                      📱 Contactar por WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div style={{
            padding: '20px',
            borderTop: '1px solid #e5e7eb',
            background: 'white'
          }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu pregunta..."
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  outline: 'none',
                  fontSize: '15px',
                  background: '#f9fafb'
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 25px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '15px',
                  transition: 'opacity 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                Enviar
              </button>
            </div>
            <div style={{
              fontSize: '12px',
              color: '#6b7280',
              textAlign: 'center'
            }}>
              Escribe <strong>"soporte"</strong> para ayuda personalizada por WhatsApp
            </div>
          </div>
        </div>
      )}
    </>
  );
}