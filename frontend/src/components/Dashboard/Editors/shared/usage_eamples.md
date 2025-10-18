// Verschiedene Loading States:
<LoadingSpinner />                           // Standard
<LoadingSpinner message="Speichere..." />    // Mit Message
<LoadingSpinner size="sm" />                 // Klein
<FullPageLoadingSpinner />                   // Vollbild
<InlineLoadingSpinner />                     // Inline (für Buttons)

// Verschiedene Error States:
<ErrorDisplay error="Fehler beim Laden" />                    // Standard Card
<ErrorDisplay error={error} variant="banner" />               // Banner
<ErrorDisplay error={error} variant="fullpage" />             // Vollbild
<InlineError error="Validierungsfehler" />                    // Inline
<ErrorBanner error="Warnung!" onRetry={handleRetry} />        // Banner mit Retry
<FullPageError error={error} onRetry={handleRetry} />         // Vollbild mit Retry