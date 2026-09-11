import React from "react";

type State = { hasError: boolean; error?: Error };

type Props = React.PropsWithChildren<{}>;

class ErrorBoundary extends React.Component<Props, State> {
  errorInfo?: React.ErrorInfo | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.errorInfo = info;
    // Log to console for debugging
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught an error:", error, info.componentStack);
  }

  handleRetry = () => {
    this.errorInfo = null;
    this.setState({ hasError: false, error: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleCopy = async () => {
    const payload = {
      error: this.state.error ? String(this.state.error) : "",
      stack: this.state.error?.stack || this.errorInfo?.componentStack || "",
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      // eslint-disable-next-line no-console
      console.info("Error copied to clipboard");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Copy failed", e);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center text-red-300">
          <h2 className="mb-4 text-xl font-bold text-[#f8d7da]">Ocurrió un error.</h2>
          <div className="mb-4 text-sm text-[#f8d7da]">Lo sentimos — intenta recargar o volver atrás.</div>
          <pre className="max-h-[240px] overflow-auto whitespace-pre-wrap rounded-md bg-[#0b0b0b] p-3 text-left text-sm text-[#ffdede]">{this.state.error?.stack || this.errorInfo?.componentStack || String(this.state.error)}</pre>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button onClick={this.handleRetry} className="rounded bg-[#d4af37] px-3 py-2 text-black">Reintentar</button>
            <button onClick={this.handleReload} className="rounded border border-[#d4af37] px-3 py-2 text-[#d4af37]">Recargar</button>
            <button onClick={this.handleCopy} className="rounded bg-transparent border px-3 py-2 text-[#d4af37]">Copiar error</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
