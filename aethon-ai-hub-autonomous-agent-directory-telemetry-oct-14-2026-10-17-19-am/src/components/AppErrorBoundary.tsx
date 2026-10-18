import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[React render error]', error, errorInfo.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#050608] px-6 text-neutral-100">
          <section className="max-w-xl rounded-2xl border border-red-500/40 bg-[#0e1018] p-8 shadow-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-red-400">Application error</p>
            <h1 className="mt-3 text-2xl font-semibold">This page could not be displayed.</h1>
            <p className="mt-3 break-words text-sm text-neutral-300">{this.state.error.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg border border-red-400/50 px-4 py-2 font-mono text-xs uppercase tracking-wider text-red-200 hover:bg-red-500/10"
            >
              Reload page
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
