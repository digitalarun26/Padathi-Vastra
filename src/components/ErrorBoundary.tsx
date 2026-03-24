import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isFirebasePermissionError = this.state.error?.message.includes('insufficient permissions') || 
                                       this.state.error?.message.includes('authInfo');

      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-accent p-6">
          <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl text-center space-y-6">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-red-600">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-brand-primary">Something went wrong</h2>
            <p className="text-gray-600 leading-relaxed">
              {isFirebasePermissionError 
                ? "You don't have permission to perform this action. Please check your account role."
                : "We encountered an unexpected error. Our team has been notified."}
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <RefreshCcw size={18} /> Refresh Page
              </button>
              <Link to="/" className="btn-secondary flex items-center justify-center gap-2">
                <Home size={18} /> Go to Home
              </Link>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-8 p-4 bg-gray-50 rounded-xl text-left text-xs text-red-500 overflow-x-auto">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
