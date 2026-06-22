
import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Bug, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showReportButton?: boolean;
  context?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId: string;
  retryCount: number;
}

class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: '',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(36)
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.logError(error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  logError = (error: Error, errorInfo: React.ErrorInfo) => {
    const errorLog = {
      timestamp: new Date().toISOString(),
      context: this.props.context || 'Unknown',
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount
    };

    const existingLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
    existingLogs.push(errorLog);
    
    if (existingLogs.length > 10) {
      existingLogs.splice(0, existingLogs.length - 10);
    }
    
    localStorage.setItem('error_logs', JSON.stringify(existingLogs));
  };

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorId: '',
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReportError = () => {
    const errorDetails = {
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      context: this.props.context,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    const mailtoLink = `mailto:support@example.com?subject=App Error Report&body=${encodeURIComponent(
      `Error ID: ${this.state.errorId}\n\nError Details:\n${JSON.stringify(errorDetails, null, 2)}`
    )}`;

    window.open(mailtoLink);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto mt-8"
        >
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <AlertTriangle size={20} />
                <span>Something went wrong</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We're sorry, but an unexpected error occurred in the {this.props.context || 'application'}. 
                This error has been logged for review.
              </p>
              
              {import.meta.env.DEV && this.state.error && (
                <details className="text-xs bg-muted p-2 rounded">
                  <summary className="cursor-pointer font-medium flex items-center">
                    <Bug size={14} className="mr-1" />
                    Error Details
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap text-xs">
                    {this.state.error.message}
                    {this.state.error.stack && (
                      <div className="mt-2 opacity-70">
                        Stack trace:
                        <br />
                        {this.state.error.stack}
                      </div>
                    )}
                  </pre>
                </details>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={this.handleRetry} size="sm" className="flex-1">
                  <RefreshCw size={16} className="mr-2" />
                  Try Again {this.state.retryCount > 0 && `(${this.state.retryCount})`}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Reload Page
                </Button>
              </div>

              {this.props.showReportButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={this.handleReportError}
                  className="w-full"
                >
                  <Mail size={16} className="mr-2" />
                  Report this error
                </Button>
              )}
              
              <p className="text-xs text-muted-foreground text-center">
                Error ID: {this.state.errorId}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
