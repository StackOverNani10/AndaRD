import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType, duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = { id, message, type, duration };

    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "flex items-start gap-3 p-4 rounded-lg shadow-lg backdrop-blur-sm border transform transition-all duration-300 ease-in-out";

    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-50/95 border-green-200 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50/95 border-red-200 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50/95 border-yellow-200 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-50/95 border-blue-200 text-blue-800`;
    }
  };

  return (
    <div
      className={`${getStyles()} ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}`}
    >
      {getIcon()}
      <div className="flex-1">
        <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={handleClose}
        className="p-1 hover:bg-black/10 rounded-full transition-colors flex-shrink-0 mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
