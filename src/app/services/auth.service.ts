import { Injectable } from '@angular/core';
import { AppwriteService } from './appwrite.service';
import { BehaviorSubject, catchError, from, map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private appwrite: AppwriteService, private router: Router) {
    this.checkAuth().subscribe();
  }

  checkAuth(): Observable<boolean> {
    return from(this.appwrite.account.get()).pipe(
      map(() => true),
      catchError(() => from([false])),
      tap((isLoggedIn) => this.isLoggedInSubject.next(isLoggedIn))
    );
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await this.appwrite.account.createEmailPasswordSession(email, password);
      this.isLoggedInSubject.next(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(email: string, password: string, name: string): Promise<void> {
    try {
      await this.appwrite.account.create('unique()', email, password, name);
      await this.login(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.appwrite.account.deleteSession('current');
      this.isLoggedInSubject.next(false);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  getCurrentUser() {
    return from(this.appwrite.account.get());
  }
}
