import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { UserCheck, Mail, Phone, ShieldCheck, Building, Key, Check, Sparkles, Camera } from 'lucide-react';

export const AdminProfileModule: React.FC = () => {
  const { adminProfile, updateAdminProfile, showToast } = useStore();

  const [name, setName] = useState(adminProfile.name);
  const [email, setEmail] = useState(adminProfile.email);
  const [phone, setPhone] = useState(adminProfile.phone);
  const [roleTitle, setRoleTitle] = useState(adminProfile.roleTitle);
  const [storeName, setStoreName] = useState(adminProfile.storeName);
  const [avatarUrl, setAvatarUrl] = useState(adminProfile.avatarUrl || '');

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile({
      name,
      email,
      phone,
      roleTitle,
      storeName,
      avatarUrl
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.length < 6) {
      showToast('⚠️ La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setPassSuccess(true);
    setCurrentPass('');
    setNewPass('');
    showToast('🔑 ¡Contraseña de administrador actualizada con éxito!');
    setTimeout(() => setPassSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Title */}
      <div>
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#9E0D0D]" />
          Perfil de Administrador
        </h3>
        <p className="text-xs text-slate-500">
          Consulta y modifica tus datos personales, cargo, nombre de la tienda y seguridad de acceso.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar Card & Status */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-center">
          <div className="relative w-28 h-28 mx-auto">
            <img
              src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80'}
              alt={name}
              className="w-full h-full object-cover rounded-full border-4 border-[#9E0D0D] shadow-md"
            />
            <div className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full border-2 border-white shadow-xs">
              <Camera className="w-3.5 h-3.5 text-[#E05A1B]" />
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-base text-slate-900">{name}</h4>
            <p className="text-xs text-[#9E0D0D] font-bold">{roleTitle}</p>
            <p className="text-[11px] text-slate-500 mt-1">{storeName}</p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-emerald-600 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Súper Administrador Activo</span>
          </div>
        </div>

        {/* Right Column: Profile Edit Form & Security */}
        <div className="md:col-span-2 space-y-6">
          {/* Main Info Form */}
          <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-[#E05A1B]" />
              Datos Personales & Tienda
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#9E0D0D]" />
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-[#9E0D0D] outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#9E0D0D]" />
                  Correo Electrónico (Login)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-[#9E0D0D] outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#9E0D0D]" />
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-[#9E0D0D] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-[#9E0D0D]" />
                  Nombre Comercial de la Tienda
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-[#9E0D0D] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9E0D0D]" />
                  Cargo / Título Oficial
                </label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={e => setRoleTitle(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-[#9E0D0D] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  URL de Imagen de Fotografía (Avatar)
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-slate-800 focus:border-[#9E0D0D] outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-[#9E0D0D] hover:bg-red-800 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95"
              >
                Guardar Datos de Perfil
              </button>
            </div>
          </form>

          {/* Change Password Card */}
          <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <Key className="w-4 h-4 text-[#E05A1B]" />
              Cambio de Contraseña de Acceso
            </h4>

            {passSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Contraseña cambiada exitosamente.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Contraseña Actual</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={e => setCurrentPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-[#9E0D0D] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nueva Contraseña</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-[#9E0D0D] outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95"
              >
                Actualizar Contraseña
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
