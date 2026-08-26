import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { pingSupabase, translatePostgresError } from '../../lib/supabase';
import { Database, RefreshCw, Zap, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { SupabaseDiagnosticModal } from '../admin/SupabaseDiagnosticModal';

interface SupabaseSmartButtonProps {
  variant?: 'compact' | 'full' | 'badge' | 'header';
  className?: string;
  showAlwaysForDev?: boolean;
}

export const SupabaseSmartButton: React.FC<SupabaseSmartButtonProps> = ({
  variant = 'compact',
  className = '',
  showAlwaysForDev = false
}) => {
  const {
    activeRole,
    isAdminLoggedIn,
    customer,
    adminProfile,
    products,
    categories,
    orders,
    customersList,
    employees,
    showToast
  } = useStore();

  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [latencyMs, setLatencyMs] = useState<number | null>(28);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date>(new Date());
  const [lastError, setLastError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // RBAC Filter: Only show for Admin, Supervisor, Guardia/Empleado, Auditor or Admin Logged In.
  // Hidden for regular Resident / Tenant / Customer roles to keep their UI clean.
  const isAuthorizedRole = React.useMemo(() => {
    if (showAlwaysForDev) return true;
    if (isAdminLoggedIn || activeRole === 'admin') return true;

    // Check customer / employee role if available
    const userRole = (customer?.role || '').toLowerCase();
    const adminRole = (adminProfile?.roleTitle || '').toLowerCase();

    const allowedRoles = ['admin', 'administrador', 'gerente', 'supervisor', 'empleado', 'guardia', 'auditor', 'soporte'];
    
    const hasAuthorizedRole = allowedRoles.some(r => userRole.includes(r) || adminRole.includes(r));
    return hasAuthorizedRole;
  }, [isAdminLoggedIn, activeRole, customer, adminProfile, showAlwaysForDev]);

  // Heartbeat function: Checks connection without blocking UI
  const performHeartbeat = useCallback(async (manual = false) => {
    setIsPinging(true);
    try {
      const result = await pingSupabase();
      setIsConnected(result.ok);
      setLatencyMs(result.latencyMs);
      setLastCheckTime(new Date());

      if (!result.ok) {
        setLastError(result.error || 'Fallo de respuesta');
        if (manual) {
          const trans = translatePostgresError({ code: result.code, message: result.error });
          showToast(`🔴 Supabase: ${trans.title}`);
        }
      } else {
        setLastError(null);
        if (manual) {
          showToast(`🟢 Supabase en vivo: Conectado (${result.latencyMs} ms)`);
        }
      }
    } catch (err: any) {
      setIsConnected(false);
      setLastError(err.message || 'Error de conexión');
      if (manual) {
        showToast('🔴 Supabase Desconectado o Error de Red');
      }
    } finally {
      setIsPinging(false);
    }
  }, [showToast]);

  // Periodic Heartbeat every 25 seconds (Item 4 of Checklist)
  useEffect(() => {
    // Initial check
    performHeartbeat(false);

    const interval = setInterval(() => {
      performHeartbeat(false);
    }, 25000); // 25s background heartbeat

    return () => clearInterval(interval);
  }, [performHeartbeat]);

  // Do not render anything if role is unauthorized (e.g. resident/customer)
  if (!isAuthorizedRole) {
    return null;
  }

  // Render variant styles
  if (variant === 'header') {
    return (
      <>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className={`group relative inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all shadow-2xs active:scale-95 cursor-pointer font-sans select-none ${
            isConnected
              ? 'bg-slate-900/90 hover:bg-slate-900 text-emerald-400 border-emerald-500/40 hover:border-emerald-400'
              : 'bg-red-950/90 hover:bg-red-900 text-red-300 border-red-500/60 animate-pulse'
          } ${className}`}
          title={`Supabase ${isConnected ? '🟢 Conectado' : '🔴 Desconectado'} • Latencia: ${latencyMs ?? '--'}ms • Clic para Diagnóstico`}
        >
          {/* Live 2-State Traffic Light (Item 2) */}
          <span className="relative flex h-2.5 w-2.5">
            {isConnected ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </>
            ) : (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-90" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
              </>
            )}
          </span>

          {/* Database Icon & Latency in ms (Item 3) */}
          <Database className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-amber-400' : isConnected ? 'text-emerald-400' : 'text-red-400'}`} />
          
          <span className="text-[11px] font-black tracking-wider uppercase font-mono">
            {isConnected ? `${latencyMs ?? 0}ms` : 'OFFLINE'}
          </span>

          <span className="hidden md:inline text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 group-hover:text-white uppercase">
            Supabase
          </span>
        </button>

        {/* Complete Diagnostic & Sync Modal */}
        <SupabaseDiagnosticModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  if (variant === 'badge') {
    return (
      <>
        <div
          onClick={() => setModalOpen(true)}
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer border transition-all ${
            isConnected
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/80'
              : 'bg-red-950/80 text-red-300 border-red-700/60 animate-pulse hover:bg-red-900'
          } ${className}`}
        >
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
          <span>DB: {isConnected ? `${latencyMs}ms` : 'FAIL'}</span>
        </div>
        <SupabaseDiagnosticModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  // Default 'compact' or 'full' variant
  return (
    <>
      <div className={`flex items-center gap-1.5 ${className}`}>
        {/* Main Smart Button */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 border cursor-pointer ${
            isConnected
              ? 'bg-slate-900/95 hover:bg-slate-900 text-emerald-400 border-emerald-500/40 hover:border-emerald-300'
              : 'bg-red-950 hover:bg-red-900 text-red-200 border-red-500/70 animate-pulse'
          }`}
          title="Abrir Panel Inteligente de Supabase"
        >
          {/* Traffic Light 2-State (🟢 / 🔴) */}
          <span className="relative flex h-2.5 w-2.5">
            {isConnected ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              </>
            ) : (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-90" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 shadow-[0_0_6px_#ef4444]" />
              </>
            )}
          </span>

          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Supabase</span>
          <span className="text-[10px] font-mono bg-slate-800/90 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700">
            {isConnected ? `${latencyMs} ms` : 'OFFLINE'}
          </span>
        </button>

        {/* 1-Click Verification Trigger Button (Item 1) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            performHeartbeat(true);
          }}
          disabled={isPinging}
          className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 rounded-xl border border-slate-700/80 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          title="Verificar Conexión en 1 Clic"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-amber-400' : ''}`} />
        </button>
      </div>

      <SupabaseDiagnosticModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
