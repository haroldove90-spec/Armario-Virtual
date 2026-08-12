import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Truck, RotateCcw, CreditCard, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { storeDesign, setSelectedCategory, setActiveRole } = useStore();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-xs mt-16 font-sans">
      {/* Value props strip */}
      <div className="bg-[#9E0D0D] text-white py-5 px-6 uppercase tracking-wider font-semibold text-xs border-b border-red-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Truck className="w-5 h-5 text-[#E05A1B] shrink-0 animate-pulse" />
            <div>
              <h4 className="font-extrabold text-xs">Envío Gratis desde $499</h4>
              <p className="text-[10px] text-red-100 normal-case font-normal">En miles de prendas y marcas</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <RotateCcw className="w-5 h-5 text-[#E05A1B] shrink-0" />
            <div>
              <h4 className="font-extrabold text-xs">Devoluciones Sin Costo</h4>
              <p className="text-[10px] text-red-100 normal-case font-normal">En cualquier tienda o sucursal</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <CreditCard className="w-5 h-5 text-[#E05A1B] shrink-0" />
            <div>
              <h4 className="font-extrabold text-xs">Hasta 12 Meses Sin Intereses</h4>
              <p className="text-[10px] text-red-100 normal-case font-normal">Con Tarjetas Participantes</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <ShieldCheck className="w-5 h-5 text-[#E05A1B] shrink-0" />
            <div>
              <h4 className="font-extrabold text-xs">Compra 100% Segura</h4>
              <p className="text-[10px] text-red-100 normal-case font-normal">Encriptación de grado bancario</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2.5">
            <img
              src={storeDesign.logoUrl || 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/armariovirtual.jpeg'}
              alt={storeDesign.storeName || 'Armario Virtual'}
              className="h-10 w-auto object-contain rounded-md"
            />
            <div className="flex flex-col">
              <span className="text-xl font-black text-red-400 tracking-tight uppercase leading-none font-sans">
                {storeDesign.logoText || 'ARMARIO VIRTUAL'}
              </span>
              <span className="text-[10px] font-extrabold text-[#E05A1B] tracking-wider uppercase leading-none mt-1 font-sans">
                {storeDesign.logoSubtext || 'TU ESTILO LIBRE'}
              </span>
            </div>
          </div>
          <p className="mt-3 text-slate-400 leading-relaxed text-[11px]">
            Todo para vestir a tu familia con la mejor moda y estilo libre al mejor precio.
          </p>

          <div className="mt-4 space-y-1.5 text-slate-400">
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#E05A1B] shrink-0" />
              <span className="font-semibold text-slate-200">{storeDesign.storeAddress || 'Los Reyes Iztacala, Tlalnepantla'}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Atención al Cliente: 55 5555 8800</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>contacto@ropaenlinea.com.mx</span>
            </p>
          </div>
        </div>

        {/* Departamentos */}
        <div>
          <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Departamentos</h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => { setSelectedCategory('mujer'); setActiveRole('cliente'); }} className="hover:text-purple-300">
                Moda Mujer
              </button>
            </li>
            <li>
              <button onClick={() => { setSelectedCategory('hombre'); setActiveRole('cliente'); }} className="hover:text-purple-300">
                Moda Hombre
              </button>
            </li>
            <li>
              <button onClick={() => { setSelectedCategory('ninos'); setActiveRole('cliente'); }} className="hover:text-purple-300">
                Niños y Bebés
              </button>
            </li>
            <li>
              <button onClick={() => { setSelectedCategory('calzado'); setActiveRole('cliente'); }} className="hover:text-purple-300">
                Calzado
              </button>
            </li>
            <li>
              <button onClick={() => { setSelectedCategory('hogar'); setActiveRole('cliente'); }} className="hover:text-purple-300">
                Hogar y Blancos
              </button>
            </li>
            <li>
              <button onClick={() => { setSelectedCategory('ofertas'); setActiveRole('cliente'); }} className="text-pink-400 font-bold hover:text-pink-300">
                Gran Barata ⚡
              </button>
            </li>
          </ul>
        </div>

        {/* Servicio al Cliente */}
        <div>
          <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Servicio al Cliente</h4>
          <ul className="space-y-2 text-slate-400">
            <li className="hover:text-white cursor-pointer">Seguimiento de Pedido</li>
            <li className="hover:text-white cursor-pointer">Preguntas Frecuentes</li>
            <li className="hover:text-white cursor-pointer">Políticas de Devolución</li>
            <li className="hover:text-white cursor-pointer">Ubicación de Tiendas</li>
            <li className="hover:text-white cursor-pointer">Términos y Condiciones</li>
          </ul>
        </div>

        {/* Formas de Pago */}
        <div>
          <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Formas de Pago Aceptadas</h4>
          <div className="flex flex-wrap gap-2 text-[10px] text-slate-300">
            {['Visa', 'Mastercard', 'American Express', 'PayPal', 'Mercado Pago', 'OXXO Pay', 'Tarjeta de Crédito'].map(method => (
              <span key={method} className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded font-semibold">
                {method}
              </span>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveRole('admin')}
              className="text-purple-400 hover:text-purple-300 font-bold text-xs underline"
            >
              Acceso al Panel de Administración
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-slate-500 text-[11px]">
        © {new Date().getFullYear()} Ropa en Línea. Todos los derechos reservados.
      </div>
    </footer>
  );
};
