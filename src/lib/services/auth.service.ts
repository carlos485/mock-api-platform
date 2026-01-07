import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import type { LoginCredentials, SignupCredentials, AuthUser } from '@/types/auth';
import { mapFirebaseUser } from '@/types/auth';

export class AuthService {
  /**
   * Sign in with email and password
   */
  static async login({ email, password }: LoginCredentials): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return mapFirebaseUser(userCredential.user);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Create a new user account
   */
  static async signup({ email, password, displayName }: SignupCredentials): Promise<AuthUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      return mapFirebaseUser(userCredential.user);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out current user
   */
  static async logout(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Subscribe to auth state changes
   */
  static onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (user: User | null) => {
      callback(user ? mapFirebaseUser(user) : null);
    });
  }

  /**
   * Get current authenticated user
   */
  static getCurrentUser(): AuthUser | null {
    const user = auth.currentUser;
    return user ? mapFirebaseUser(user) : null;
  }

  /**
   * Handle Firebase auth errors
   */
  private static handleAuthError(error: unknown): Error {
    if (error instanceof Error) {
      const errorCode = (error as any).code;

      switch (errorCode) {
        case 'auth/user-not-found':
          return new Error('Usuario no encontrado');
        case 'auth/wrong-password':
          return new Error('Contraseña incorrecta');
        case 'auth/email-already-in-use':
          return new Error('El correo ya está registrado');
        case 'auth/weak-password':
          return new Error('La contraseña debe tener al menos 6 caracteres');
        case 'auth/invalid-email':
          return new Error('Correo electrónico inválido');
        case 'auth/too-many-requests':
          return new Error('Demasiados intentos. Intenta más tarde');
        default:
          return new Error('Error de autenticación. Intenta nuevamente');
      }
    }

    return new Error('Error desconocido');
  }
}
