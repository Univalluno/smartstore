import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const {
    user,
    updateProfile,
    updateEmail,
    updatePassword,
    deleteAccount,
    loading,
  } = useAuth();

  const navigate = useNavigate();

  // Estados
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Cargar datos usuario
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Cargar órdenes
  useEffect(() => {
    const loadOrders = async () => {
      if (activeTab === 'orders' && user) {
        setLoadingOrders(true);
        try {
          // Simulación de órdenes - en producción hacer fetch al backend
          const mockOrders = [
            {
              id: 1,
              orderNumber: 'ORD-56444127-64P2',
              date: new Date().toLocaleDateString('es-CO'),
              total: 5299900,
              status: 'Pagado',
              items: 2,
              products: ['iPhone 15 Pro Max 256GB', 'Funda Protectora'],
              customerName: user.displayName || user.email,
              shippingAddress: 'Calle 123, Ciudad'
            }
          ];
          setOrders(mockOrders);
        } catch (error) {
          console.error('Error cargando órdenes:', error);
        } finally {
          setLoadingOrders(false);
        }
      }
    };
    loadOrders();
  }, [activeTab, user]);

  // Notificaciones
  const notify = (msg, type = 'success') => {
    const color = type === 'success' ? 'bg-green-600' : 
                  type === 'warning' ? 'bg-yellow-500' : 'bg-red-600';
    const el = document.createElement('div');
    el.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${color} text-white`;
    el.innerText = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  };

  // Ver detalles del pedido
  const handleViewOrderDetails = (orderNumber) => {
    fetch(`http://localhost:5000/api/orders/number/${orderNumber}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.order) {
          const order = data.order;
          const items = data.items || [];
          
          const details = `
📦 ORDEN: ${order.orderNumber}
📅 Fecha: ${new Date(order.created_at).toLocaleDateString('es-CO')}
💳 Estado: ${order.payment_status || 'Pagado'}
💰 Total: $${order.total_amount?.toLocaleString() || '0'}

👤 Cliente: ${order.customer_name}
📧 Email: ${order.customer_email}
📞 Teléfono: ${order.customer_phone}
📍 Envío: ${order.shipping_address}, ${order.city}

🧾 FACTURA: ${order.invoice_number || 'FAC-' + orderNumber.slice(4)}

PRODUCTOS:
${items.map(item => `• ${item.product_name} x${item.quantity} - $${item.subtotal?.toLocaleString() || '0'}`).join('\n')}
          `;
          
          alert(details);
        } else {
          // Mostrar datos de simulación si no hay backend
          const mockDetails = `
📦 ORDEN: ${orderNumber}
📅 Fecha: ${new Date().toLocaleDateString('es-CO')}
💳 Estado: Pagado
💰 Total: $5.299.900

👤 Cliente: ${user?.displayName || user?.email || 'Cliente'}
📧 Email: ${user?.email || 'No especificado'}
📞 Teléfono: 3001234567
📍 Envío: Calle 123, Ciudad, Colombia

🧾 FACTURA: FAC-${orderNumber.slice(4)}

PRODUCTOS:
• iPhone 15 Pro Max 256GB x1 - $5.299.900
• Funda Protectora x1 - $0 (regalo)
          `;
          alert(mockDetails);
        }
      })
      .catch(err => {
        console.error('Error:', err);
        // Mostrar simulación si falla el fetch
        const mockDetails = `
📦 ORDEN: ${orderNumber}
📅 Fecha: ${new Date().toLocaleDateString('es-CO')}
💳 Estado: Pagado
💰 Total: $5.299.900

PRODUCTOS:
• iPhone 15 Pro Max 256GB x1 - $5.299.900
        `;
        alert(mockDetails);
      });
  };

  // Descargar factura
  const handleDownloadInvoice = (orderNumber) => {
    const invoiceNumber = `FAC-${orderNumber.slice(4)}`;
    const invoiceContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Factura ${invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 3px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
    .company { background: #fffbeb; padding: 20px; border-radius: 10px; margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background: #f97316; color: white; }
    .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
    .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>SmartStore</h1>
    <h2>FACTURA ELECTRÓNICA #${invoiceNumber}</h2>
    <p><strong>Orden:</strong> ${orderNumber} | <strong>Fecha:</strong> ${new Date().toLocaleDateString('es-CO')}</p>
  </div>
  
  <div class="company">
    <h3>SmartStore SAS</h3>
    <p><strong>NIT:</strong> 901.234.567-8</p>
    <p><strong>Dirección:</strong> Calle 10 #45-67, Cali, Colombia</p>
    <p><strong>Teléfono:</strong> +57 602 123 4567 | <strong>Email:</strong> facturacion@smartstore.com</p>
  </div>
  
  <h3>Información del Cliente</h3>
  <p><strong>Nombre:</strong> ${user?.displayName || user?.email || 'Cliente'}</p>
  <p><strong>Email:</strong> ${user?.email || 'No especificado'}</p>
  
  <h3>Detalles de la Factura</h3>
  <table>
    <thead>
      <tr>
        <th>Descripción</th>
        <th>Cantidad</th>
        <th>Precio Unitario</th>
        <th>Subtotal</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>iPhone 15 Pro Max 256GB</td>
        <td>1</td>
        <td>$5.299.900</td>
        <td>$5.299.900</td>
      </tr>
      <tr>
        <td>Funda Protectora Premium</td>
        <td>1</td>
        <td>$0</td>
        <td>$0</td>
      </tr>
    </tbody>
  </table>
  
  <div class="total">
    <p>Subtotal: $5.299.900</p>
    <p>IVA (19%): $1.006.981</p>
    <p><strong>TOTAL A PAGAR: $6.306.881</strong></p>
  </div>
  
  <div class="footer">
    <p>¡Gracias por tu compra en SmartStore!</p>
    <p>Esta factura es un comprobante electrónico válido para efectos tributarios</p>
    <p>Resolución DIAN 187640098756 | Factura generada electrónicamente</p>
  </div>
</body>
</html>
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factura-${invoiceNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    notify(`Factura ${invoiceNumber} descargada exitosamente`);
  };

  // Manejo de formularios
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    if (!firstName || !lastName || !displayName || !email) {
      return setError('Todos los campos son obligatorios');
    }
    try {
      await updateProfile({ firstName, lastName, displayName });
      await updateEmail(currentPassword, email);
      notify('Perfil actualizado correctamente');
      setCurrentPassword('');
    } catch (err) {
      setError('Error al actualizar el perfil');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) return setError('Mínimo 6 caracteres');
    if (newPassword !== confirmPassword) return setError('Las contraseñas no coinciden');
    try {
      await updatePassword(currentPassword, newPassword);
      notify('Contraseña actualizada');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Error al cambiar contraseña');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('¿Eliminar cuenta permanentemente?')) return;
    try {
      setIsDeleting(true);
      await deleteAccount();
      notify('Cuenta eliminada');
      navigate('/');
    } catch (err) {
      setError('Error al eliminar cuenta');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900">Mi Cuenta</h1>
          <p className="text-gray-600 mt-2">Bienvenido, {user?.displayName || user?.email}</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Pestañas */}
        <div className="flex border-b border-gray-200 mb-8">
          <button onClick={() => setActiveTab('profile')} className={`px-6 py-3 font-medium ${activeTab === 'profile' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>
            👤 Mi Perfil
          </button>
          <button onClick={() => setActiveTab('orders')} className={`px-6 py-3 font-medium ${activeTab === 'orders' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>
            📦 Mis Pedidos
          </button>
          <button onClick={() => setActiveTab('security')} className={`px-6 py-3 font-medium ${activeTab === 'security' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>
            🔐 Seguridad
          </button>
        </div>

        {/* Contenido según pestaña */}
        {activeTab === 'orders' ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Historial de Pedidos</h2>
            
            {loadingOrders ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando pedidos...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No has realizado ningún pedido aún</p>
                <button onClick={() => navigate('/')} className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
                  Comenzar a Comprar
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">Orden #{order.orderNumber}</h3>
                        <p className="text-gray-600">Fecha: {order.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Pagado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-700">{order.items} producto(s)</p>
                        <p className="text-2xl font-bold text-orange-600">${order.total.toLocaleString()}</p>
                        <p className="text-gray-600 text-sm">{order.products.join(', ')}</p>
                      </div>
                      
                      <div className="flex gap-3">
                        <button onClick={() => handleViewOrderDetails(order.orderNumber)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                          Ver Detalles
                        </button>
                        <button onClick={() => handleDownloadInvoice(order.orderNumber)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Descargar Factura
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'security' ? (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold mb-6">Seguridad</h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <input type="password" placeholder="Contraseña actual" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="password" placeholder="Nueva contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="password" placeholder="Confirmar nueva contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
                <button type="submit" className="w-full bg-yellow-600 text-white py-3 rounded-lg font-medium hover:bg-yellow-700">
                  Cambiar Contraseña
                </button>
              </form>
            </div>
            <div className="bg-red-50 border border-red-300 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-red-700 mb-4">⚠️ Zona de Peligro</h2>
              <button onClick={handleDeleteAccount} disabled={isDeleting} className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400">
                {isDeleting ? 'Eliminando...' : 'Eliminar Cuenta'}
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Información Personal</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" placeholder="Nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
              </div>
              <input type="text" placeholder="Nombre de usuario" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
              <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
              <input type="password" placeholder="Contraseña actual (para confirmar)" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" required />
              <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-400">
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 