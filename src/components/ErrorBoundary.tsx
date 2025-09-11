// Error boundary component for graceful error handling

import React, { Component, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors, spacing, typography, borderRadius, layout } from '../theme';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: ReactNode;
  onError?: (error: Error, errorInfo: string) => void;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorString = errorInfo.componentStack || error.toString();
    this.setState({
      errorInfo: errorString,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorString);
    }

    // Log error for debugging (in development)
    if (__DEV__) {
      console.error('Error caught by ErrorBoundary:', error);
      console.error('Error info:', errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Show custom fallback component if provided
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      // Default kid-friendly error UI
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorEmoji}>🧩❗</Text>
            <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
            <Text style={styles.errorMessage}>
              Don't worry! This happens sometimes. Let's try again!
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={this.handleRetry}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Try again"
              accessibilityHint="Attempts to reload the puzzle game"
            >
              <Text style={styles.retryButtonText}>🔄 Try Again</Text>
            </TouchableOpacity>

            {__DEV__ && (
              <View style={styles.debugInfo}>
                <Text style={styles.debugTitle}>
                  Debug Info (Development Only):
                </Text>
                <Text
                  style={styles.debugText}
                  numberOfLines={5}
                  ellipsizeMode="tail"
                >
                  {this.state.error?.toString()}
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  errorTitle: {
    fontSize: typography.xl,
    fontWeight: typography.weight.bold,
    color: colors.onBackground,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  errorMessage: {
    fontSize: typography.md,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: typography.md * typography.lineHeight.normal,
    paddingHorizontal: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    minWidth: 120,
    minHeight: layout.touchTargetLarge,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  retryButtonText: {
    fontSize: typography.lg,
    fontWeight: typography.weight.semibold,
    color: colors.onPrimary,
  },
  debugInfo: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.outline,
    width: '100%',
  },
  debugTitle: {
    fontSize: typography.sm,
    fontWeight: typography.weight.semibold,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  debugText: {
    fontSize: typography.xs,
    color: colors.secondary,
    fontFamily: 'monospace',
    lineHeight: typography.xs * 1.4,
  },
});

export default ErrorBoundary;
