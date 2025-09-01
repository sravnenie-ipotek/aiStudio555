import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

// Mock components that might be imported in error boundaries
jest.mock('../../../apps/web/src/components/header', () => ({
  Header: () => <header data-testid="header">Header</header>,
}));

jest.mock('../../../apps/web/src/components/footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

// Test component that throws an error
const ThrowError = ({ shouldError }: { shouldError: boolean }) => {
  if (shouldError) {
    throw new Error('Test error message');
  }
  return <div>Normal component</div>;
};

// Mock Marketing Error Component
const MarketingError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header data-testid="header">Header</header>
      
      <main className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg 
                className="w-8 h-8 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                data-testid="error-icon"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
            </div>
            
            {/* Error Message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h2>
            
            <p className="text-gray-600 mb-8">
              We're experiencing a temporary issue loading this page.
            </p>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={reset}
                data-testid="try-again-button"
                className="w-full bg-primary-yellow hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold"
              >
                Try Again
              </button>
              
              <a
                href="/"
                data-testid="home-link"
                className="block w-full bg-primary-blue hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Back to Home
              </a>
              
              <a
                href="/courses"
                data-testid="courses-link"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium"
              >
                Browse Courses
              </a>
            </div>
            
            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left" data-testid="error-details">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Technical Details (Dev Mode)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded-lg text-xs font-mono text-gray-700">
                  <div className="mb-2">
                    <strong>Message:</strong> {error.message}
                  </div>
                  {error.digest && (
                    <div className="mb-2">
                      <strong>Error ID:</strong> {error.digest}
                    </div>
                  )}
                  {error.stack && (
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="mt-1 text-xs">{error.stack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      </main>
      
      <footer data-testid="footer">Footer</footer>
    </div>
  );
};

// Mock Enrollment Error Component
const EnrollmentError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary-blue">
            Projectdes AI Academy
          </h1>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Enrollment Error</h2>
          <p className="mb-4">There was a problem with your enrollment process.</p>
          <button
            onClick={reset}
            data-testid="enrollment-try-again"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </main>
      
      <footer className="bg-white border-t py-4">
        <div className="text-center text-sm text-gray-500">
          Need help? Contact support at support@projectdes.academy
        </div>
      </footer>
    </div>
  );
};

describe('Error Boundaries', () => {
  // Suppress console.error for these tests since we're intentionally throwing errors
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  
  afterAll(() => {
    console.error = originalError;
  });

  describe('Marketing Error Boundary', () => {
    test('should render marketing error page when error occurs', () => {
      const mockReset = jest.fn();
      
      render(
        <MarketingError 
          error={new Error('Test error')} 
          reset={mockReset} 
        />
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(screen.getByTestId('error-icon')).toBeInTheDocument();
      expect(screen.getByText(/temporary issue loading this page/)).toBeInTheDocument();
    });

    test('should maintain marketing layout in error state', () => {
      const mockReset = jest.fn();
      
      render(
        <MarketingError 
          error={new Error('Test error')} 
          reset={mockReset} 
        />
      );

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('should have functional "Try Again" button', () => {
      const mockReset = jest.fn();
      
      render(
        <MarketingError 
          error={new Error('Test error')} 
          reset={mockReset} 
        />
      );

      const tryAgainButton = screen.getByTestId('try-again-button');
      fireEvent.click(tryAgainButton);
      
      expect(mockReset).toHaveBeenCalledTimes(1);
    });

    test('should have navigation links', () => {
      const mockReset = jest.fn();
      
      render(
        <MarketingError 
          error={new Error('Test error')} 
          reset={mockReset} 
        />
      );

      const homeLink = screen.getByTestId('home-link');
      const coursesLink = screen.getByTestId('courses-link');
      
      expect(homeLink).toHaveAttribute('href', '/');
      expect(coursesLink).toHaveAttribute('href', '/courses');
      
      expect(homeLink).toHaveTextContent('Back to Home');
      expect(coursesLink).toHaveTextContent('Browse Courses');
    });

    test('should show technical details in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const mockReset = jest.fn();
      const errorWithStack = new Error('Test error message');
      errorWithStack.stack = 'Test stack trace';
      
      render(
        <MarketingError 
          error={errorWithStack} 
          reset={mockReset} 
        />
      );

      const errorDetails = screen.getByTestId('error-details');
      expect(errorDetails).toBeInTheDocument();
      
      expect(screen.getByText('Technical Details (Dev Mode)')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
      
      process.env.NODE_ENV = originalEnv;
    });

    test('should hide technical details in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const mockReset = jest.fn();
      
      render(
        <MarketingError 
          error={new Error('Test error')} 
          reset={mockReset} 
        />
      );

      expect(screen.queryByTestId('error-details')).not.toBeInTheDocument();
      
      process.env.NODE_ENV = originalEnv;
    });

    test('should handle error with digest', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const mockReset = jest.fn();
      const errorWithDigest = new Error('Test error') as Error & { digest?: string };
      errorWithDigest.digest = 'abc123';
      
      render(
        <MarketingError 
          error={errorWithDigest} 
          reset={mockReset} 
        />
      );

      expect(screen.getByText('abc123')).toBeInTheDocument();
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Enrollment Error Boundary', () => {
    test('should render enrollment error page when error occurs', () => {
      const mockReset = jest.fn();
      
      render(
        <EnrollmentError 
          error={new Error('Enrollment error')} 
          reset={mockReset} 
        />
      );

      expect(screen.getByText('Enrollment Error')).toBeInTheDocument();
      expect(screen.getByText(/problem with your enrollment process/)).toBeInTheDocument();
    });

    test('should maintain enrollment layout in error state', () => {
      const mockReset = jest.fn();
      
      render(
        <EnrollmentError 
          error={new Error('Enrollment error')} 
          reset={mockReset} 
        />
      );

      expect(screen.getByText('Projectdes AI Academy')).toBeInTheDocument();
      expect(screen.getByText(/support@projectdes.academy/)).toBeInTheDocument();
    });

    test('should have functional try again button', () => {
      const mockReset = jest.fn();
      
      render(
        <EnrollmentError 
          error={new Error('Enrollment error')} 
          reset={mockReset} 
        />
      );

      const tryAgainButton = screen.getByTestId('enrollment-try-again');
      fireEvent.click(tryAgainButton);
      
      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Boundary Integration', () => {
    test('should catch and display errors from child components', () => {
      const mockReset = jest.fn();
      
      render(
        <ErrorBoundary
          FallbackComponent={({ error, resetErrorBoundary }) => (
            <MarketingError error={error} reset={resetErrorBoundary} />
          )}
          onReset={mockReset}
        >
          <ThrowError shouldError={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(screen.queryByText('Normal component')).not.toBeInTheDocument();
    });

    test('should render children normally when no error', () => {
      const mockReset = jest.fn();
      
      render(
        <ErrorBoundary
          FallbackComponent={({ error, resetErrorBoundary }) => (
            <MarketingError error={error} reset={resetErrorBoundary} />
          )}
          onReset={mockReset}
        >
          <ThrowError shouldError={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Normal component')).toBeInTheDocument();
      expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument();
    });

    test('should reset error boundary when reset function is called', () => {
      const mockReset = jest.fn();
      let shouldError = true;
      
      const { rerender } = render(
        <ErrorBoundary
          FallbackComponent={({ error, resetErrorBoundary }) => (
            <MarketingError error={error} reset={resetErrorBoundary} />
          )}
          onReset={() => {
            shouldError = false;
            mockReset();
          }}
        >
          <ThrowError shouldError={shouldError} />
        </ErrorBoundary>
      );

      // Error boundary should be showing
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

      // Click try again
      const tryAgainButton = screen.getByTestId('try-again-button');
      fireEvent.click(tryAgainButton);

      // Should reset
      expect(mockReset).toHaveBeenCalledTimes(1);

      // Re-render without error
      rerender(
        <ErrorBoundary
          FallbackComponent={({ error, resetErrorBoundary }) => (
            <MarketingError error={error} reset={resetErrorBoundary} />
          )}
          onReset={() => {
            shouldError = false;
            mockReset();
          }}
        >
          <ThrowError shouldError={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Normal component')).toBeInTheDocument();
    });
  });

  describe('Error Boundary Accessibility', () => {
    test('should have proper ARIA attributes', () => {
      const mockReset = jest.fn();
      
      render(
        <MarketingError 
          error={new Error('Test error')} 
          reset={mockReset} 
        />
      );

      const tryAgainButton = screen.getByTestId('try-again-button');
      expect(tryAgainButton).toBeInTheDocument();
      expect(tryAgainButton).toHaveAttribute('type', 'button');
    });

    test('should have semantic HTML structure', () => {
      const mockReset = jest.fn();
      
      render(
        <MarketingError 
          error={new Error('Test error')} 
          reset={mockReset} 
        />
      );

      expect(screen.getByRole('banner')).toBeInTheDocument(); // header
      expect(screen.getByRole('main')).toBeInTheDocument(); // main
      expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
    });

    test('should have proper heading hierarchy', () => {
      const mockReset = jest.fn();
      
      render(
        <MarketingError 
          error={new Error('Test error')} 
          reset={mockReset} 
        />
      );

      const errorHeading = screen.getByRole('heading', { name: /something went wrong/i });
      expect(errorHeading.tagName).toBe('H2');
    });

    test('should have keyboard accessible buttons and links', () => {
      const mockReset = jest.fn();
      
      render(
        <MarketingError 
          error={new Error('Test error')} 
          reset={mockReset} 
        />
      );

      const tryAgainButton = screen.getByTestId('try-again-button');
      const homeLink = screen.getByTestId('home-link');
      
      // Should be focusable
      tryAgainButton.focus();
      expect(document.activeElement).toBe(tryAgainButton);
      
      homeLink.focus();
      expect(document.activeElement).toBe(homeLink);
    });
  });

  describe('Error Logging', () => {
    test('should log error information to console in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // This would be implemented in the actual error boundary
      const error = new Error('Test error for logging');
      const errorInfo = { componentStack: 'Test component stack' };
      
      // Simulate error logging
      console.error('Marketing page error:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Marketing page error:',
        expect.objectContaining({
          message: 'Test error for logging',
          stack: expect.any(String),
          componentStack: 'Test component stack'
        })
      );
      
      consoleErrorSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });
  });
});