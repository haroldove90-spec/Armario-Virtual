import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Employee } from '../../types';
import { UserCheck, UserX, Plus, Edit2, Trash2, Key, ShieldCheck, Mail, Lock, User, Check, X, Sparkles, ShieldAlert, Eye, EyeOff } from 'lucide-react';

export const EmployeesModule: React.FC = () => {
  const { employees, addEmployee, updateEmployee, toggleEmployeeStatus, deleteEmployee } = useStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  // New Employee Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Encargado de Inventario & Categorías');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'productos',
    'categorias',
    'ventas'
  ]);

  const allAvailablePermissions = [
    { id: 'metricas', label: '📊 Métricas y Ventas' },
    { id: 'productos', label: '📦 Catálogo de Productos' },
    { id: 'categorias', label: '🏷️ Categorías y Subcategorías' },
    { id: 'ventas', label: '📋 Gestión de Pedidos' },
    { id: 'envio', label: '🚚 Guías y Envíos (API)' },
    { id: 'diseno', label: '🎨 Banners y Diseño' }
  ];

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password.trim()) return;

    addEmployee({
      name,
      email: email || `${username}@armariovirtual.com`,
      username: username.toLowerCase().trim(),
      password,
      role,
      status: 'activo',
      permissions: selectedPermissions,
      createdAt: new Date().toISOString().split('T')[0],
      lastAccess: 'Nuevo usuario registrado',
      avatarUrl: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000) + 1500000000000}?w=200&q=80`
    });

    setName('');
    setEmail('');
    setUsername('');
    setPassword('');
    setIsAdding(false);
  };

  const handleUpdateEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    updateEmployee(editingEmployee.id, editingEmployee);
    setEditingEmployee(null);
  };

  const togglePermission = (permId: string, isEdit: boolean = false) => {
    if (isEdit && editingEmployee) {
      const current = editingEmployee.permissions || [];
      const updated = current.includes(permId)
        ? current.filter(p => p !== permId)
        : [...current, permId];
      setEditingEmployee({ ...editingEmployee, permissions: updated });
    } else {
      setSelectedPermissions(prev =>
        prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
      );
    }
  };

  const togglePassVisibility = (id: string) => {
    setShowPasswordMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#9E0D0D]" />
            Módulo de Empleados y Control de Accesos
          </h3>
          <p className="text-xs text-slate-500">
            Da de alta empleados, asigna usuario y contraseña, edita datos y suspende o reactiva su acceso al panel.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingEmployee(null);
          }}
          className="flex items-center gap-2 bg-[#9E0D0D] hover:bg-red-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#E05A1B]" />
          <span>{isAdding ? 'Cancelar Alta' : 'Dar de Alta Empleado'}</span>
        </button>
      </div>

      {/* Form: Register New Employee */}
      {isAdding && (
        <form onSubmit={handleCreateEmployee} className="bg-white p-6 rounded-3xl border border-red-200 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E05A1B]" />
              Alta de Nuevo Empleado y Credenciales
            </h4>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#9E0D0D]" />
                Nombre del Empleado *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Sofía Castro Morales"
                className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-[#9E0D0D] outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#9E0D0D]" />
                Correo Institucional / Personal
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="sofia.castro@armariovirtual.com"
                className="w-full p-3 border border-slate-200 rounded-xl text-slate-900 focus:border-[#9E0D0D] outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-[#9E0D0D]" />
                Usuario de Acceso (Username) *
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="sofia.castro"
                className="w-full p-3 border border-slate-200 rounded-xl font-mono text-slate-900 font-bold focus:border-[#9E0D0D] outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#9E0D0D]" />
                Contraseña de Asignación *
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 pr-10 border border-slate-200 rounded-xl font-mono text-slate-900 font-bold focus:border-[#9E0D0D] outline-hidden"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 p-0.5 transition-colors cursor-pointer"
                  title={showNewPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Puesto / Rol Asignado
              </label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="Ej. Gerente de Almacén, Soporte de Pedidos, Ejecutivo de Ventas"
                className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-[#9E0D0D] outline-hidden"
              />
            </div>
          </div>

          {/* Permissions Selection */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block font-extrabold text-xs text-slate-900">
              Permisos Módulos Autorizados en Dashboard:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allAvailablePermissions.map(p => {
                const isSelected = selectedPermissions.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePermission(p.id)}
                    className={`p-2.5 rounded-xl border text-left font-bold text-xs flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-red-50 border-[#9E0D0D] text-[#9E0D0D]'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                      isSelected ? 'bg-[#9E0D0D] text-white border-red-700' : 'bg-white border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#9E0D0D] text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-red-800"
            >
              Crear Credenciales & Empleado
            </button>
          </div>
        </form>
      )}

      {/* Employees Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(emp => {
          const isActive = emp.status === 'activo';
          const isPassShown = showPasswordMap[emp.id] || false;

          return (
            <div
              key={emp.id}
              className={`bg-white rounded-3xl border transition-all p-6 space-y-4 flex flex-col justify-between ${
                isActive
                  ? 'border-slate-200 shadow-xs hover:shadow-md'
                  : 'border-red-300 bg-red-50/20 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'}
                      alt={emp.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{emp.name}</h4>
                      <p className="text-[11px] font-bold text-[#9E0D0D]">{emp.role}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shrink-0 ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                  >
                    {isActive ? <UserCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                    {isActive ? 'Activo' : 'Acceso Suspendido'}
                  </span>
                </div>

                {/* Credentials Card */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1 font-sans">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-bold text-[10px] uppercase text-slate-400">Usuario:</span>
                    <span className="font-mono font-bold text-slate-900">{emp.username}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                    <span className="font-bold text-[10px] uppercase text-slate-400">Contraseña:</span>
                    <div className="flex items-center gap-1 font-mono font-bold text-slate-900">
                      <span>{isPassShown ? (emp.password || 'password123') : '••••••••'}</span>
                      <button
                        type="button"
                        onClick={() => togglePassVisibility(emp.id)}
                        className="p-1 text-slate-400 hover:text-slate-700"
                        title={isPassShown ? 'Ocultar' : 'Ver contraseña'}
                      >
                        {isPassShown ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 text-[10px] pt-1">
                    <span>Correo: {emp.email}</span>
                  </div>
                </div>

                {/* Module Permissions */}
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                    Módulos Dashboard Autorizados:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {emp.permissions && emp.permissions.length > 0 ? (
                      emp.permissions.map(p => (
                        <span key={p} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Sin permisos especiales</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleEmployeeStatus(emp.id)}
                  className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-xs text-white transition-all shadow-xs ${
                    isActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isActive ? 'Suspender Acceso' : 'Activar Acceso'}
                </button>

                <button
                  onClick={() => setEditingEmployee(emp)}
                  className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                  title="Editar Empleado"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar al empleado "${emp.name}"?`)) {
                      deleteEmployee(emp.id);
                    }
                  }}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                  title="Eliminar Empleado"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateEmployeeSubmit}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#9E0D0D]" />
                Editar Empleado: {editingEmployee.name}
              </h4>
              <button type="button" onClick={() => setEditingEmployee(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={editingEmployee.name}
                  onChange={e => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Puesto / Rol</label>
                <input
                  type="text"
                  value={editingEmployee.role}
                  onChange={e => setEditingEmployee({ ...editingEmployee, role: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Usuario</label>
                <input
                  type="text"
                  value={editingEmployee.username}
                  onChange={e => setEditingEmployee({ ...editingEmployee, username: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contraseña</label>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editingEmployee.password || ''}
                    onChange={e => setEditingEmployee({ ...editingEmployee, password: e.target.value })}
                    className="w-full p-2.5 pr-10 border border-slate-200 rounded-xl font-mono font-bold"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 p-0.5 transition-colors cursor-pointer"
                    title={showEditPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Permissions list */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <label className="block font-extrabold text-slate-800">Módulos dashboard permitidos:</label>
              <div className="grid grid-cols-2 gap-2">
                {allAvailablePermissions.map(p => {
                  const isSelected = (editingEmployee.permissions || []).includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePermission(p.id, true)}
                      className={`p-2 rounded-xl border text-left font-bold text-xs flex items-center gap-2 ${
                        isSelected
                          ? 'bg-red-50 border-[#9E0D0D] text-[#9E0D0D]'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                        isSelected ? 'bg-[#9E0D0D] text-white border-red-700' : 'bg-white border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setEditingEmployee(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#9E0D0D] text-white font-extrabold text-xs rounded-xl hover:bg-red-800"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
