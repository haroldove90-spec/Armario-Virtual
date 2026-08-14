import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  runCompleteSupabaseDiagnostic,
  SupabaseDiagnosticReport,
  SUPABASE_COMPLETE_SQL_FIX,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL
} from '../../lib/supabase';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Copy,
  Check,
  Zap,
  ArrowUpRight,
  ShieldAlert,
  Server,
  Layers,
  Package,
  ShoppingBag,
  Users,
  Settings,
  X
} from 'lucide-react';

interface SupabaseDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseDiagnosticModal: React.FC<SupabaseDiagnosticModalProps> = ({ isOpen, onClose }) => {
  const {
    products,
    categories,
    orders,
    customersList,
    employees,
    shippingConfig,
    storeDesign,
    adminProfile,
    seedAllDataToSupabase,
    showToast
  } = useStore();

  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [report, setReport] = useState<SupabaseDiagnosticReport | null>(null);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);

  const runDiagnostic = async () => {
    setLoading(true);
    setSyncResult(null);
    try {
      const rep = await runCompleteSupabaseDiagnostic();
      setReport(rep);
    } catch (e: any) {
      console.error('Diagnostic error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runDiagnostic();
    }
  }, [isOpen]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_COMPLETE_SQL_FIX);
    setCopiedSql(true);
    showToast('📋 Script SQL copiado al portapapeles');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await seedAllDataToSupabase();
      setSyncResult(res);
      if (res.success) {
        showToast('✅ ¡Datos sincronizados exitosamente con Supabase!');
      } else {
        showToast('⚠️ Hubo problemas al sincronizar con Supabase');
      }
      // Re-run diagnostic to update table counts
      await runDiagnostic();
    } catch (e: any) {
      setSyncResult({
        success: false,
        message: `Error al sincronizar: ${e.message || String(e)}`
      });
    } finally {
      setSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">
                  SUPABASE CLOUD
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {SUPABASE_PROJECT_ID}</span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-white mt-0.5">
                Diagnóstico y Sincronización de Base de Datos
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runDiagnostic}
              disabled={loading}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700 cursor-pointer disabled:opacity-50"
              title="Volver a ejecutar prueba de conexión"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{loading ? 'Comprobando...' : 'Revisar Conexión'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {/* Status Alert Banner */}
          {report && (
            <div
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                report.overallStatus === 'ok'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : report.overallStatus === 'rls_warning'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-red-50 border-red-300 text-red-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {report.overallStatus === 'ok' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider">
                    {report.overallStatus === 'ok'
                      ? 'Conexión 100% Operativa y con Permisos de Escritura'
                      : report.overallStatus === 'rls_warning'
                      ? 'Conectado a Supabase, pero con Bloqueo de Políticas RLS'
                      : 'Atención: Tablas no encontradas o sin conexión'}
                  </h3>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    {report.overallStatus === 'ok'
                      ? `La aplicación se comunica correctamente con Supabase (Latencia: ${report.latencyMs}ms). Todos los registros se guardan y leen en la nube.`
                      : 'El frontend está conectado a tu proyecto de Supabase, pero las políticas RLS (Row Level Security) están bloqueando las inserciones anónimas o las tablas están vacías.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleSyncAll}
                  disabled={syncing}
                  className="px-4 py-2.5 bg-[#9E0D0D] hover:bg-red-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Zap className={`w-4 h-4 ${syncing ? 'animate-bounce text-amber-300' : 'text-amber-400'}`} />
                  <span>{syncing ? 'Sincronizando...' : 'Subir Todos los Datos a Supabase'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Sync Result Feedback */}
          {syncResult && (
            <div
              className={`p-4 rounded-2xl border text-xs ${
                syncResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <div className="font-bold">{syncResult.message}</div>
              {syncResult.details && (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  {Object.entries(syncResult.details).map(([key, val]: [string, any]) => (
                    <div key={key} className="bg-white/80 p-2 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-700 uppercase">{key}:</span>{' '}
                      <span className={val.success ? 'text-emerald-600 font-black' : 'text-red-600'}>
                        {val.success ? `✅ ${val.count} filas` : `❌ ${val.error}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Diagnostic Grid of Tables */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-500" />
                <span>Estado de Tablas en Supabase</span>
              </h3>
              <span className="text-[11px] text-slate-500">
                Endpoint: <code className="text-slate-800 font-mono font-semibold">{SUPABASE_URL}</code>
              </span>
            </div>

            {loading ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                <RefreshCw className="w-8 h-8 text-[#9E0D0D] animate-spin mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">Verificando tablas y permisos en Supabase...</p>
              </div>
            ) : report ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(report.tables).map(([tableName, diag]) => {
                  return (
                    <div
                      key={tableName}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            diag.canWrite && diag.canRead
                              ? 'bg-emerald-100 text-emerald-700'
                              : diag.rlsBlocked
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {diag.canWrite && diag.canRead ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : diag.rlsBlocked ? (
                            <ShieldAlert className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 font-mono">public.{tableName}</span>
                            <span
                              className={`text-[10px] font-black px-1.5 py-0.2 rounded uppercase ${
                                diag.rowCount > 0
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {diag.rowCount} en DB
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {diag.canWrite
                              ? 'Lectura y Escritura permitida'
                              : diag.rlsBlocked
                              ? '⚠️ RLS bloquea inserciones (42501)'
                              : diag.exists
                              ? 'Tabla creada (escritura restringida)'
                              : '❌ Tabla no existe'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            diag.canWrite
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : diag.rlsBlocked
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {diag.canWrite ? 'ACTIVO' : diag.rlsBlocked ? 'RLS ACTIVO' : 'SIN ACCESO'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Solution & SQL Script Box */}
          <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Solución para que Supabase guarde todo sin restricciones</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Copia y pega este script en el <strong>SQL Editor</strong> de Supabase para desactivar el bloqueo de RLS y crear todas las tablas:
                </p>
              </div>

              <button
                onClick={handleCopySql}
                className="px-4 py-2 bg-[#9E0D0D] hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md self-start sm:self-auto"
              >
                {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-300" />}
                <span>{copiedSql ? '¡Copiado!' : 'Copiar SQL Completo'}</span>
              </button>
            </div>

            <div className="relative">
              <pre className="bg-slate-950 p-4 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48 scrollbar-thin border border-slate-800">
                {SUPABASE_COMPLETE_SQL_FIX}
              </pre>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-amber-300">📌 Pasos a seguir en tu panel de Supabase:</div>
              <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-slate-300">
                <li>Abre tu panel de Supabase en la pestaña <strong>SQL Editor</strong> (ícono <code>&gt;_</code> a la izquierda).</li>
                <li>Haz clic en <strong>+ New Query</strong> y pega el código SQL copiado.</li>
                <li>Haz clic en el botón verde <strong>Run</strong> (o presiona Ctrl+Enter).</li>
                <li>Regresa aquí y presiona <strong>"Subir Todos los Datos a Supabase"</strong> para transferir tu inventario y categorías de inmediato.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            Catálogo local: <strong>{products.length} productos</strong>, <strong>{categories.length} categorías</strong>, <strong>{orders.length} pedidos</strong>.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncAll}
              disabled={syncing}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{syncing ? 'Sincronizando...' : 'Poblar Todo en Supabase'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
