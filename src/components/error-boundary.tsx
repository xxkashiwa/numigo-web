/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onError: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError(error);
  }

  public render() {
    if (this.state.hasError) {
      return null; // Render nothing, let parent handle the error display
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
