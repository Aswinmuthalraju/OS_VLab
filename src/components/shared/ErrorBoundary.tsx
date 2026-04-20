import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center p-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm font-bold font-mono tracking-tight text-red-500 uppercase">Module failed to load</p>
            <p className="text-xs text-text-muted max-w-xs">{this.state.message}</p>
            <button
              className="text-xs font-mono font-bold text-accent hover:underline"
              onClick={() => this.setState({ hasError: false, message: '' })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
