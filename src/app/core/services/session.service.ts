import { computed, Injectable, signal } from '@angular/core';
import { User } from '../models/auth.model';

const TOKEN_KEY = 'assignment2_token';
const USER_KEY = 'assignment2_user';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly userSignal = signal<User | null>(this.readUser());

  readonly token = computed(() => this.tokenSignal());
  readonly user = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => Boolean(this.tokenSignal()));

  setSession(token: string, user: User): void {
    this.tokenSignal.set(token);
    this.userSignal.set(user);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  clearSession(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  private readUser(): User | null {
    const rawUser = localStorage.getItem(USER_KEY);
    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as User;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }
}
