"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastIcon = ({ type }: { type: Toast['type'] }) => {
  const iconClass = "w-5 h-5";
  
  switch (type) {
    case 'success':
      return <CheckCircle className={`${iconClass} text-green-500`} />;
    case 'error':
      return <AlertCircle className={`${iconClass} text-red-500`} />;
    case 'warning':
      return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
    case 'info':
      return <Info className={`${iconClass} text-blue-500`} />;
    default:
      return <Info className={`${iconClass} text-gray-500`} />;
  }
};

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);
      
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onRemove]);

  const getToastStyles = () => {
    const baseStyles = "relative flex items-start p-4 rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-300 ease-in-out transform";
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-200 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-200 text-gray-800`;
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start space-x-3 flex-1">
        <div className="flex-shrink-0">
          <ToastIcon type={toast.type} />
        </div>
        <div className="flex-1 min-w-0">
          {toast.title && (
            <h4 className="text-sm font-semibold mb-1">
              {toast.title}
            </h4>
          )}
          <p className="text-sm leading-relaxed">
            {toast.message}
          </p>
        </div>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 ml-3 p-1 rounded-full hover:bg-black/5 transition-colors duration-200"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000, // Default 5 seconds
      ...toast,
    };
    
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-in slide-in-from-right-full duration-300"
        >
          <ToastItem toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
};

// Convenience functions for different toast types
export const useToastHelpers = () => {
  const { addToast } = useToast();

  return {
    success: (message: string, title?: string, duration?: number) => 
      addToast({ type: 'success', message, title, duration }),
    error: (message: string, title?: string, duration?: number) => 
      addToast({ type: 'error', message, title, duration }),
    warning: (message: string, title?: string, duration?: number) => 
      addToast({ type: 'warning', message, title, duration }),
    info: (message: string, title?: string, duration?: number) => 
      addToast({ type: 'info', message, title, duration }),
  };
};
