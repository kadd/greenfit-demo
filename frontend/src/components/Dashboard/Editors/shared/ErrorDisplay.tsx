// frontend/src/components/Dashboard/Editors/shared/ErrorDisplay.tsx

interface ErrorDisplayProps {
  error: string | Error | null;
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'inline' | 'card' | 'banner' | 'fullpage';
  className?: string;
}

export function ErrorDisplay({
  error,
  title = "Es ist ein Fehler aufgetreten",
  actionLabel = "Erneut versuchen",
  onAction,
  onRetry,
  onDismiss,
  variant = 'card',
  className = ""
}: ErrorDisplayProps) {
  
  if (!error) return null;
  
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  const baseClasses = "flex items-start space-x-3";
  
  const variantClasses = {
    inline: "p-3 bg-red-50 border border-red-200 rounded-md",
    card: "p-6 bg-white border border-red-200 rounded-lg shadow-sm",
    banner: "p-4 bg-red-50 border-l-4 border-red-400",
    fullpage: "min-h-screen flex items-center justify-center bg-gray-50"
  };

  const iconClasses = {
    inline: "h-4 w-4 text-red-400 mt-0.5",
    card: "h-5 w-5 text-red-400 mt-0.5", 
    banner: "h-5 w-5 text-red-400",
    fullpage: "h-6 w-6 text-red-400"
  };

  const ErrorIcon = () => (
    <svg
      className={iconClasses[variant]}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  );

  const ErrorContent = () => (
    <div className="flex-1 min-w-0">
      <h3 className={`font-medium ${
        variant === 'fullpage' ? 'text-lg text-gray-900' : 'text-sm text-red-800'
      }`}>
        {title}
      </h3>
      <p className={`mt-1 ${
        variant === 'fullpage' ? 'text-base text-gray-600' : 'text-sm text-red-700'
      }`}>
        {errorMessage}
      </p>
      
      {/* Action Buttons */}
      {(onAction || onRetry || onDismiss) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {(onAction || onRetry) && (
            <button
              onClick={onAction || onRetry}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                variant === 'fullpage' 
                  ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                  : 'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500'
              } focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {actionLabel}
            </button>
          )}
          
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Schließen
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (variant === 'fullpage') {
    return (
      <div className={variantClasses[variant]}>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className={baseClasses}>
            <ErrorIcon />
            <ErrorContent />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      <div className={baseClasses}>
        <ErrorIcon />
        <ErrorContent />
      </div>
    </div>
  );
}

// Specialized Error Components
export function InlineError({ error, onDismiss }: { error: string | null; onDismiss?: () => void }) {
  return (
    <ErrorDisplay 
      error={error} 
      variant="inline" 
      title="Fehler"
      onDismiss={onDismiss}
    />
  );
}

export function ErrorBanner({ error, onRetry }: { error: string | null; onRetry?: () => void }) {
  return (
    <ErrorDisplay 
      error={error} 
      variant="banner" 
      title="Warnung"
      onRetry={onRetry}
    />
  );
}

export function FullPageError({ error, onRetry }: { error: string | Error | null; onRetry?: () => void }) {
  return (
    <ErrorDisplay 
      error={error} 
      variant="fullpage" 
      title="Seite konnte nicht geladen werden"
      actionLabel="Seite neu laden"
      onAction={onRetry || (() => window.location.reload())}
    />
  );
}