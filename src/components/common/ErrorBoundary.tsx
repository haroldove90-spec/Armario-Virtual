import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  private handleClearStorage = () => {
    try {
      localStorage.clear();
      this.setState({ hasError: false, error: undefined });
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-extrabold text-white">¡Ups! Ocurrió un inconveniente</h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              La aplicación ha detectado un problema al procesar los datos. Puedes intentar recargar la página o restablecer los datos guardados en tu navegador.
            </p>

            {this.state.error && (
              <div className="bg-slate-950/80 p-3 rounded-lg text-left text-xs font-mono text-red-300 overflow-x-auto border border-red-900/50 max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-4 bg-[#9E0D0D] hover:bg-red-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                Recargar Página
              </button>
              <button
                onClick={this.handleClearStorage}
                className="py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-600"
              >
                <Trash2 className="w-4 h-4 text-amber-400" />
                Limpiar Caché
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
