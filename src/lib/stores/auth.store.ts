import { AuthService } from '@/lib/services/auth.service';
import type { AuthUser, AuthState } from '@/types/auth';

/**
 * Simple reactive auth store using vanilla JS
 * Can be upgraded to nanostores or other state management library if needed
 */
class AuthStore {
  private state: AuthState = {
    user: null,
    loading: true,
    error: null,
  };

  private listeners: Set<(state: AuthState) => void> = new Set();
  private unsubscribeAuth?: () => void;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  /**
   * Initialize auth state listener
   */
  private initialize() {
    this.unsubscribeAuth = AuthService.onAuthStateChange((user) => {
      this.setState({ user, loading: false, error: null });
    });
  }

  /**
   * Get current auth state
   */
  getState(): AuthState {
    return { ...this.state };
  }

  /**
   * Subscribe to auth state changes
   */
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState()); // Emit initial state

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Update state and notify listeners
   */
  private setState(updates: Partial<AuthState>) {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach((listener) => listener(this.getState()));
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean) {
    this.setState({ loading });
  }

  /**
   * Set error state
   */
  setError(error: string | null) {
    this.setState({ error });
  }

  /**
   * Clear error
   */
  clearError() {
    this.setState({ error: null });
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.state.user !== null;
  }

  /**
   * Get current user
   */
  getUser(): AuthUser | null {
    return this.state.user;
  }

  /**
   * Cleanup
   */
  destroy() {
    this.unsubscribeAuth?.();
    this.listeners.clear();
  }
}

// Export singleton instance
export const authStore = new AuthStore();
