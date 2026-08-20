import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Customer } from '../../types';
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Plus,
  Trash2,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  MapPin,
  X,
  Check,
  DollarSign,
  RefreshCw,
  Database,
  UploadCloud
} from 'lucide-react';

export const CustomersModule: React.FC = () => {
  const {
    customersList,
    toggleCustomerStatus,
    addCustomerAccount,
    deleteCustomerAccount,
    reloadFromSupabase,
    seedAllDataToSupabase,
    showToast
  } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'activo' | 'suspendido' | 'inactivo'>('todos');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await reloadFromSupabase();
      showToast('🔄 Lista de clientes recargada desde Supabase');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSyncToSupabase = async () => {
    setIsSyncing(true);
    try {
      await seedAllDataToSupabase();
      showToast('☁️ Clientes y catálogo sincronizados con Supabase');
    } catch (e: any) {
      showToast(`⚠️ Error al sincronizar: ${e.message || e}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // New Customer Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [favoriteStore, setFavoriteStore] = useState('Tienda en Línea Principal');

  const filteredCustomers = customersList.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);

    if (filterStatus === 'todos') return matchesSearch;
    return matchesSearch && (c.status || 'activo') === filterStatus;
  });

  const totalRegistered = customersList.length;
  const totalActive = customersList.filter(c => (c.status || 'activo') === 'activo').length;
  const totalSpentAll = customersList.reduce((acc, curr) => acc + (curr.totalSpent || 0), 0);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    await addCustomerAccount({
      name,
      email,
      phone,
      favoriteStore,
      status: 'activo',
      totalOrders: 0,
      totalSpent: 0,
      addresses: [],
      wishlistProductIds: [],
      registeredAt: new Date().toISOString().split('T')[0]
    });

    setName('');
    setEmail('');
    setPhone('');
    setIsAddingCustomer(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Metrics Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#9E0D0D]" />
              Módulo de Usuarios Registrados en la Tienda
            </h3>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Database className="w-3 h-3 text-emerald-600" />
              Supabase Conectado
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Administra el directorio de clientes registrados, su historial de compras y estado de cuenta.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSyncToSupabase}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
            title="Subir todos los clientes locales a Supabase"
          >
            <UploadCloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
            <span>{isSyncing ? 'Subiendo...' : 'Subir a Supabase'}</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            title="Recargar clientes desde Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#9E0D0D]' : ''}`} />
            <span>{isRefreshing ? 'Sincronizando...' : 'Actualizar'}</span>
          </button>

          <button
            onClick={() => setIsAddingCustomer(!isAddingCustomer)}
            className="flex items-center gap-2 bg-[#9E0D0D] hover:bg-red-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#E05A1B]" />
            <span>{isAddingCustomer ? 'Cancelar' : 'Registrar Nuevo Cliente'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-red-50 text-[#9E0D0D] rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Clientes</span>
            <p className="text-2xl font-black text-slate-900">{totalRegistered}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cuentas Activas</span>
            <p className="text-2xl font-black text-slate-900">{totalActive}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ventas Acumuladas</span>
            <p className="text-2xl font-black text-slate-900">${totalSpentAll.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Form: Register New Customer */}
      {isAddingCustomer && (
        <form onSubmit={handleCreateCustomer} className="bg-white p-6 rounded-3xl border border-red-200 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#E05A1B]" />
              Alta Manual de Cliente
            </h4>
            <button type="button" onClick={() => setIsAddingCustomer(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nombre Completo *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Ana Lucía Domínguez"
                className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-[#9E0D0D] outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Correo Electrónico *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ana.lucia@example.com"
                className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-[#9E0D0D] outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Teléfono</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="55 1234 5678"
                className="w-full p-3 border border-slate-200 rounded-xl text-slate-900 focus:border-[#9E0D0D] outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Sucursal Favorita / Origen</label>
              <input
                type="text"
                value={favoriteStore}
                onChange={e => setFavoriteStore(e.target.value)}
                placeholder="Tienda en Línea / Perisur / Polanco"
                className="w-full p-3 border border-slate-200 rounded-xl text-slate-900 focus:border-[#9E0D0D] outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingCustomer(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#9E0D0D] text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-red-800"
            >
              Guardar Usuario
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, correo o teléfono..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-[#9E0D0D] outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="font-bold text-slate-500 text-[11px]">Estado:</span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {(['todos', 'activo', 'suspendido'] as const).map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st as any)}
                className={`px-3 py-1 rounded-lg font-bold uppercase text-[10px] transition-all ${
                  filterStatus === st
                    ? 'bg-[#9E0D0D] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <th className="p-4">Usuario / Cliente</th>
                <th className="p-4">Contacto</th>
                <th className="p-4 text-center">Pedidos</th>
                <th className="p-4 text-right">Monto Total</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-sans">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-slate-400 italic">
                    No se encontraron usuarios registrados con el criterio especificado.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(cust => {
                  const status = cust.status || 'activo';
                  const isActive = status === 'activo';

                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={cust.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'}
                            alt={cust.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-extrabold text-slate-900 text-sm">{cust.name}</p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Reg: {cust.registeredAt || '2026-01-01'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 space-y-0.5">
                        <div className="flex items-center gap-1 text-slate-700 font-bold">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cust.email}</span>
                        </div>
                        {cust.phone && (
                          <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{cust.phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-purple-50 text-[#9E0D0D] font-extrabold text-xs px-2.5 py-1 rounded-lg border border-purple-100">
                          <ShoppingBag className="w-3.5 h-3.5" />
                          {cust.totalOrders || (cust.addresses ? cust.addresses.length : 1)}
                        </span>
                      </td>

                      <td className="p-4 text-right font-black text-slate-900 text-sm">
                        ${(cust.totalSpent || 988.00).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}
                        >
                          {isActive ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                          {isActive ? 'Activo' : 'Suspendido'}
                        </span>
                      </td>

                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-all"
                          title="Ver Detalle / Direcciones"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => toggleCustomerStatus(cust.id)}
                          className={`px-2.5 py-1.5 font-bold rounded-xl transition-all text-white ${
                            isActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                          }`}
                          title={isActive ? 'Suspender Acceso' : 'Activar Cuenta'}
                        >
                          {isActive ? 'Suspender' : 'Activar'}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar usuario "${cust.name}"?`)) {
                              deleteCustomerAccount(cust.id);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                          title="Eliminar Cliente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-[#9E0D0D]" />
                Detalles del Cliente
              </h4>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <img
                src={selectedCustomer.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'}
                alt={selectedCustomer.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#9E0D0D]"
              />
              <div>
                <h5 className="font-extrabold text-slate-900 text-base">{selectedCustomer.name}</h5>
                <p className="text-xs text-slate-500">{selectedCustomer.email}</p>
                <p className="text-xs text-[#9E0D0D] font-bold mt-1">
                  Sucursal de Preferencia: {selectedCustomer.favoriteStore}
                </p>
              </div>
            </div>

            {/* Addresses list */}
            <div className="space-y-2">
              <h6 className="font-extrabold text-xs text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E05A1B]" />
                Direcciones de Envío Registradas
              </h6>

              {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 ? (
                selectedCustomer.addresses.map(addr => (
                  <div key={addr.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <p className="font-extrabold text-slate-900">{addr.recipientName}</p>
                    <p className="text-slate-600">
                      {addr.street} #{addr.exteriorNumber} {addr.interiorNumber ? `Int ${addr.interiorNumber}` : ''}, {addr.neighborhood}
                    </p>
                    <p className="text-slate-500">
                      {addr.city}, {addr.state} C.P. {addr.postalCode} | Tel: {addr.phone}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No ha guardado direcciones aún.</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
