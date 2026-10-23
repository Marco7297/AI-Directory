import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { reportAppError, subscribeToAppErrors, type ReportedAppError } from '../utils/errorReporting';

export const GlobalErrorNotifications = () => {
  const [errors, setErrors] = useState<ReportedAppError[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToAppErrors((error) => {
      setErrors((current) => [...current, error].slice(-3));
    });
    const handleRuntimeError = (event: ErrorEvent) => {
      reportAppError('Unhandled runtime error', event.error ?? event.message ?? 'An unknown runtime error occurred.');
    };
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      reportAppError('Unhandled promise rejection', event.reason);
    };

    window.addEventListener('error', handleRuntimeError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      unsubscribe();
      window.removeEventListener('error', handleRuntimeError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (errors.length === 0) return null;

  return (
    <aside className="fixed right-4 top-4 z-[100] flex w-[min(28rem,calc(100vw-2rem))] flex-col gap-2" aria-label="Application errors">
      {errors.map((error) => (
        <section
          key={error.id}
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-500/50 bg-[#0e1018]/95 p-4 text-sm text-neutral-100 shadow-2xl backdrop-blur-md"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-wider text-red-300">{error.context}</p>
            <p className="mt-1 break-words text-neutral-200">{error.message}</p>
          </div>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setErrors((current) => current.filter(({ id }) => id !== error.id))}
            className="rounded p-1 text-neutral-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </section>
      ))}
    </aside>
  );
};
