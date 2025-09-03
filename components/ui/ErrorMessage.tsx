import React from 'react';
import { Button } from './Button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
  showIcon?: boolean;
  className?: string;
}

export function ErrorMessage({
  title = 'Erro',
  message,
  onRetry,
  onBack,
  showIcon = true,
  className = '',
}: ErrorMessageProps) {
  return (
    <div className={`text-center ${className}`}>
      {showIcon && (
        <div className="text-red-600 text-lg mb-4">❌</div>
      )}
      <h1 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h1>
      <p className="text-gray-600 mb-4">{message}</p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            Tentar novamente
          </Button>
        )}
        {onBack && (
          <Button onClick={onBack} variant="secondary">
            Voltar
          </Button>
        )}
      </div>
    </div>
  );
}

// Componente de erro para página inteira
export function PageError({
  title,
  message,
  onRetry,
  onBack,
}: Omit<ErrorMessageProps, 'className' | 'showIcon'>) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <ErrorMessage
          title={title}
          message={message}
          onRetry={onRetry}
          onBack={onBack}
          showIcon={true}
        />
      </div>
    </div>
  );
}

// Componente de erro inline
export function InlineError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="text-red-400 text-sm">⚠️</div>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-700">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-1 text-sm text-red-600 hover:text-red-500 underline"
            >
              Tentar novamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
