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
  UploadCloud,
  Shield,
  ShieldCheck,
  Crown,
  UserCog,
  User,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export interface RoleConfig {
  id: string;
  name: string;
  badgeName: string;
  icon: any;
  badgeClass: string;
  borderClass: string;
  description: string;
  scope: string;
}

export const USER_ROLES: RoleConfig[] = [
  {
    id: 'cliente',
    name: 'Cliente (Comprador)',
    badgeName: 'Cliente',
    icon: User,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    borderClass: 'border-slate-200 hover:border-slate-400',
    description: 'Acceso a compras, catálogo, carrito, seguimiento de pedidos y direcciones.',
    scope: 'Público / Compras'
  },
  {
    id: 'admin',
    name: 'Administrador General',
    badgeName: 'Admin',
    icon: Crown,
    badgeClass: 'bg-red-100 text-red-800 border-red-300',
    borderClass: 'border-red-200 hover:border-red-400',
    description: 'Acceso TOTAL: Catálogo, pedidos, clientes, guías de medidas, diseño, métricas y Supabase.',
    scope: 'Control Maestro'
  },
  {
    id: 'gerente',
    name: 'Gerente de Tienda',
    badgeName: 'Gerente',
    icon: ShieldCheck,
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    borderClass: 'border-indigo-200 hover:border-indigo-400',
    description: 'Gestión de pedidos, inventario, alta de productos, stock y revisión de clientes.',
    scope: 'Administración'
  },
  {
    id: 'empleado',
    name: 'Ventas / Mostrador',
    badgeName: 'Vendedor',
    icon: UserCheck,
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    borderClass: 'border-amber-200 hover:border-amber-400',
    description: 'Consulta de pedidos, cambio de estatus de empaque y consulta de inventario.',
    scope: 'Operaciones'
  },
  {
    id: 'soporte',
    name: 'Atención al Cliente',
    badgeName: 'Soporte',
    icon: Shield,
    badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    borderClass: 'border-cyan-200 hover:border-cyan-400',
    description: 'Atención a usuarios, rastreo de paqueterías y resolución de dudas.',
    scope: 'Servicio'
  }
];

export const CustomersModule: React.FC = () => {
  const {
    customersList,
    toggleCustomerStatus,
    addCustomerAccount,
    deleteCustomerAccount,
    updateCustomerRole,
    syncCustomerToSupabase,
    reloadFromSupabase,
    seedAllDataToSupabase,
    showToast
  } = useStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncingCustId, setSyncingCustId] = useState<string | null>(null);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'activo' | 'suspendido' | 'inactivo'>('todos');
  const [filterRole, setFilterRole] = useState<string>('todos');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [roleModalCustomer, setRoleModalCustomer] = useState<Customer | null>(null);
  const [selectedRoleToApply, setSelectedRoleToApply] = useState<string>('cliente');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await reloadFromSupabase();
      showToast('🔄 Lista de clientes y roles recargados desde Supabase');
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

  const handleChangeRole = async (customerId: string, newRole: string) => {
    setUpdatingRoleId(customerId);
    try {
      const res = await updateCustomerRole(customerId, newRole);
      if (res.success) {
        if (selectedCustomer && selectedCustomer.id === customerId) {
          setSelectedCustomer(prev => prev ? { ...prev, role: newRole } : null);
        }
      }
    } finally {
      setUpdatingRoleId(null);
      setRoleModalCustomer(null);
    }
  };

  // New Customer Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newCustRole, setNewCustRole] = useState('cliente');
  const [favoriteStore, setFavoriteStore] = useState('Tienda en Línea Principal');

  const filteredCustomers = customersList.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);

    const matchesStatus = filterStatus === 'todos' || (c.status || 'activo') === filterStatus;
    const custRole = c.role || 'cliente';
    const matchesRole = filterRole === 'todos' || custRole === filterRole;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const totalRegistered = customersList.length;
  const totalActive = customersList.filter(c => (c.status || 'activo') === 'activo').length;
  const totalAdmins = customersList.filter(c => c.role === 'admin' || c.role === 'gerente').length;
  const totalSpentAll = customersList.reduce((acc, c) => acc + (Number(c.totalSpent) || 0), 0);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Nombre y Correo son requeridos');
      return;
    }

    addCustomerAccount({
      name,
      email,
      phone,
      favoriteStore,
      status: 'activo',
      role: newCustRole,
      totalOrders: 0,
      totalSpent: 0,
      registeredAt: new Date().toISOString().split('T')[0],
      addresses: [],
      wishlistProductIds: []
    });

    setName('');
    setEmail('');
    setPhone('');
    setNewCustRole('cliente');
    setFavoriteStore('Tienda en Línea Principal');
    setIsAddingCustomer(false);
  };

  const getRoleConfig = (roleId?: string): RoleConfig => {
    const found = USER_ROLES.find(r => r.id === (roleId || 'cliente'));
    return found || USER_ROLES[0];
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Gestión de Usuarios y Clientes</h3>
            <span className="bg-purple-100 text-[#9E0D0D] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              {customersList.length} registrados
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Administra cuentas registradas, cambia roles y permisos en tiempo real con Supabase.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-200 cursor-pointer disabled:opacity-50"
            title="Recargar usuarios desde Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#9E0D0D]' : ''}`} />
            <span>{isRefreshing ? 'Cargando...' : 'Recargar'}</span>
          </button>

          <button
            onClick={handleSyncToSupabase}
            disabled={isSyncing}
            className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
            title="Sincronizar base de datos completa con Supabase"
          >
            <UploadCloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
            <span>{isSyncing ? 'Subiendo...' : 'Sincronizar Supabase'}</span>
          </button>

          <button
            onClick={() => setIsAddingCustomer(true)}
            className="px-4 py-2.5 bg-[#9E0D0D] hover:bg-red-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-[#9E0D0D] rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Usuarios</span>
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
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Admins / Staff</span>
            <p className="text-2xl font-black text-slate-900">{totalAdmins}</p>
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
        <form onSubmit={handleCreateCustomer} className="bg-white p-6 rounded-3xl border border-red-200 shadow-lg space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#E05A1B]" />
              Alta Manual de Usuario / Cliente
            </h4>
            <button type="button" onClick={() => setIsAddingCustomer(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
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
              <label className="block font-bold text-slate-700 mb-1">Rol / Nivel de Acceso</label>
              <select
                value={newCustRole}
                onChange={e => setNewCustRole(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-900 bg-white focus:border-[#9E0D0D] outline-hidden"
              >
                {USER_ROLES.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.scope})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
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
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#9E0D0D] hover:bg-red-800 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Guardar Usuario y Sincronizar en Supabase
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, correo o teléfono..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-[#9E0D0D] outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500 text-[11px]">Rol:</span>
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus:border-[#9E0D0D] outline-hidden"
            >
              <option value="todos">Todos los Roles</option>
              {USER_ROLES.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500 text-[11px]">Estado:</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              {(['todos', 'activo', 'suspendido'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st as any)}
                  className={`px-3 py-1 rounded-lg font-bold uppercase text-[10px] transition-all cursor-pointer ${
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
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <th className="p-4">Usuario / Cuenta</th>
                <th className="p-4 text-center">Rol en Supabase</th>
                <th className="p-4">Contacto</th>
                <th className="p-4 text-center">Pedidos</th>
                <th className="p-4 text-right">Total Comprado</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-sans">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-slate-400 italic">
                    No se encontraron usuarios registrados con el criterio especificado.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(cust => {
                  const status = cust.status || 'activo';
                  const isActive = status === 'activo';
                  const roleCfg = getRoleConfig(cust.role);
                  const RoleIcon = roleCfg.icon;
                  const isUpdating = updatingRoleId === cust.id;

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

                      {/* Rol en Supabase interactivo */}
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedRoleToApply(cust.role || 'cliente');
                              setRoleModalCustomer(cust);
                            }}
                            disabled={isUpdating}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase border transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${roleCfg.badgeClass}`}
                            title="Haz clic para cambiar el rol de este usuario en Supabase"
                          >
                            <RoleIcon className="w-3.5 h-3.5" />
                            <span>{isUpdating ? 'Guardando...' : roleCfg.badgeName}</span>
                            <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
                          </button>
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
                          {cust.totalOrders || (cust.addresses ? cust.addresses.length : 0)}
                        </span>
                      </td>

                      <td className="p-4 text-right font-black text-slate-900 text-sm">
                        ${(cust.totalSpent || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
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

                      <td className="p-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedRoleToApply(cust.role || 'cliente');
                            setRoleModalCustomer(cust);
                          }}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-[#9E0D0D] hover:text-white text-[#9E0D0D] font-bold rounded-xl transition-all border border-red-200 cursor-pointer"
                          title="Cambiar Rol de este usuario (Admin, Gerente, Empleado, etc.)"
                        >
                          <UserCog className="w-3.5 h-3.5 inline mr-1" />
                          <span>Rol</span>
                        </button>
                        <button
                          onClick={async () => {
                            setSyncingCustId(cust.id);
                            const res = await syncCustomerToSupabase(cust);
                            setSyncingCustId(null);
                            if (res.success) {
                              showToast(`☁️ Usuario "${cust.name}" sincronizado en Supabase`);
                            } else {
                              showToast(`⚠️ Error al sincronizar: ${res.error || 'Verifica RLS'}`);
                            }
                          }}
                          disabled={syncingCustId === cust.id}
                          className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl transition-all border border-purple-200 cursor-pointer"
                          title="Sincronizar este usuario con Supabase"
                        >
                          <UploadCloud className={`w-3.5 h-3.5 inline mr-1 ${syncingCustId === cust.id ? 'animate-bounce' : ''}`} />
                          {syncingCustId === cust.id ? '...' : 'Nube'}
                        </button>
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-all cursor-pointer"
                          title="Ver Detalle / Direcciones"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => toggleCustomerStatus(cust.id)}
                          className={`px-2.5 py-1.5 font-bold rounded-xl transition-all text-white cursor-pointer ${
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
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                          title="Eliminar Usuario"
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

      {/* Modal: Cambiar Rol de Usuario en Supabase */}
      {roleModalCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-100 text-[#9E0D0D] rounded-xl">
                  <UserCog className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-base">Cambiar Rol en Supabase</h4>
                  <p className="text-xs text-slate-500">Asigna privilegios y nivel de acceso para este usuario</p>
                </div>
              </div>
              <button
                onClick={() => setRoleModalCustomer(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User header */}
            <div className="flex items-center gap-3.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <img
                src={roleModalCustomer.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'}
                alt={roleModalCustomer.name}
                className="w-12 h-12 rounded-full object-cover border border-slate-300"
              />
              <div className="min-w-0 flex-1">
                <p className="font-black text-slate-900 text-sm truncate">{roleModalCustomer.name}</p>
                <p className="text-xs text-slate-500 truncate">{roleModalCustomer.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400">Rol actual:</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${getRoleConfig(roleModalCustomer.role).badgeClass}`}>
                    {getRoleConfig(roleModalCustomer.role).name}
                  </span>
                </div>
              </div>
            </div>

            {/* Role Options */}
            <div className="space-y-2.5">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Selecciona el Nuevo Rol:
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
                {USER_ROLES.map(r => {
                  const Icon = r.icon;
                  const isSelected = selectedRoleToApply === r.id;

                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRoleToApply(r.id)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'border-[#9E0D0D] bg-red-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`p-2 rounded-xl border mt-0.5 ${r.badgeClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-slate-900">{r.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">{r.scope}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{r.description}</p>
                      </div>
                      <div className="pt-0.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#9E0D0D] bg-[#9E0D0D]' : 'border-slate-300'}`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note */}
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-2xl text-[11px] flex items-start gap-2">
              <Database className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Al confirmar, el rol se actualizará de inmediato en la tabla <strong>customers</strong> de Supabase. Si seleccionas Administrador o Staff, se sincronizará también en el panel de colaboradores.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRoleModalCustomer(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleChangeRole(roleModalCustomer.id, selectedRoleToApply)}
                disabled={updatingRoleId === roleModalCustomer.id}
                className="px-6 py-2.5 bg-[#9E0D0D] hover:bg-red-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {updatingRoleId === roleModalCustomer.id ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Check className="w-4 h-4 text-white" />
                )}
                <span>{updatingRoleId === roleModalCustomer.id ? 'Guardando en Supabase...' : 'Aplicar Rol en Supabase'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-[#9E0D0D]" />
                Detalles del Usuario
              </h4>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <img
                src={selectedCustomer.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'}
                alt={selectedCustomer.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#9E0D0D]"
              />
              <div className="flex-1 min-w-0">
                <h5 className="font-extrabold text-slate-900 text-base truncate">{selectedCustomer.name}</h5>
                <p className="text-xs text-slate-500 truncate">{selectedCustomer.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${getRoleConfig(selectedCustomer.role).badgeClass}`}>
                    Rol: {getRoleConfig(selectedCustomer.role).name}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedRoleToApply(selectedCustomer.role || 'cliente');
                      setRoleModalCustomer(selectedCustomer);
                    }}
                    className="text-[11px] text-[#9E0D0D] font-bold hover:underline cursor-pointer"
                  >
                    Cambiar Rol
                  </button>
                </div>
                <p className="text-xs text-[#9E0D0D] font-bold mt-1">
                  Sucursal de Preferencia: {selectedCustomer.favoriteStore || 'Tienda en Línea'}
                </p>
              </div>
            </div>

            {/* Addresses list */}
            <div className="space-y-2">
              <h6 className="font-extrabold text-xs text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E05A1B]" />
                Direcciones de Envío Registradas ({selectedCustomer.addresses?.length || 0})
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

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedRoleToApply(selectedCustomer.role || 'cliente');
                  setRoleModalCustomer(selectedCustomer);
                }}
                className="px-4 py-2 bg-red-50 hover:bg-[#9E0D0D] hover:text-white text-[#9E0D0D] font-bold text-xs rounded-xl border border-red-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <UserCog className="w-3.5 h-3.5" />
                <span>Cambiar Rol</span>
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
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
