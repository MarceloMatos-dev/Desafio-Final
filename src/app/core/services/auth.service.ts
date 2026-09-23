import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { User, UserRole } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usersKey = 'rf_users_v3';
  private readonly sessionKey = 'rf_session_v3';

  constructor(private storage: StorageService, private router: Router) {
    const users = this.storage.get<User[]>(this.usersKey, []);
    if (!users.some(user => user.role === 'admin')) {
      users.push({
        id: 1,
        name: 'Administrador ReliefFlow',
        email: 'admin@reliefflow.org',
        password: 'admin123',
        role: 'admin',
        lgpd: true
      });
      this.storage.set(this.usersKey, users);
    }
  }

  current(): User | null {
    return this.storage.get<User | null>(this.sessionKey, null);
  }

  login(email: string, password: string): boolean {
    const users = this.storage.get<User[]>(this.usersKey, []);
    const user = users.find(item => item.email === email && item.password === password);
    if (!user) return false;
    this.storage.set(this.sessionKey, user);
    return true;
  }

  register(
    name: string,
    email: string,
    password: string,
    lgpd: boolean,
    role: UserRole = 'user',
    cnpj?: string
  ): User | null {
    const users = this.storage.get<User[]>(this.usersKey, []);
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCnpj = cnpj ? this.normalizeCnpj(cnpj) : undefined;

    if (users.some(user => user.email.trim().toLowerCase() === normalizedEmail)) {
      return null;
    }

    if (normalizedCnpj && users.some(user => this.normalizeCnpj(user.cnpj ?? '') === normalizedCnpj)) {
      return null;
    }

    const user: User = {
      id: Date.now(),
      name,
      email: normalizedEmail,
      password,
      role,
      lgpd,
      cnpj: normalizedCnpj
    };

    users.push(user);
    this.storage.set(this.usersKey, users);
    this.storage.set(this.sessionKey, user);
    return user;
  }

  normalizeCnpj(cnpj: string): string {
    return cnpj.replace(/\D/g, '');
  }

  cnpjExists(cnpj: string): boolean {
    const normalized = this.normalizeCnpj(cnpj);
    if (!normalized) return false;
    const users = this.storage.get<User[]>(this.usersKey, []);
    return users.some(user => this.normalizeCnpj(user.cnpj ?? '') === normalized);
  }

  isValidCnpj(cnpj: string): boolean {
    const value = this.normalizeCnpj(cnpj);
    if (value.length !== 14 || /^(\d)\1{13}$/.test(value)) return false;

    const calculateDigit = (base: string, weights: number[]): number => {
      const sum = base.split('').reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const first = calculateDigit(value.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    const second = calculateDigit(value.slice(0, 12) + first, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    return value.endsWith(`${first}${second}`);
  }

  attachCenterToCurrentUser(centerId: number): void {
    const current = this.current();
    if (!current) return;
    const users = this.storage.get<User[]>(this.usersKey, []);
    const user = users.find(item => item.id === current.id);
    if (!user) return;
    user.centerId = centerId;
    this.storage.set(this.usersKey, users);
    this.storage.set(this.sessionKey, user);
  }

  logout(): void {
    this.storage.remove(this.sessionKey);
    this.router.navigateByUrl('/home');
  }

  isAdmin(): boolean { return this.current()?.role === 'admin'; }
  isUser(): boolean { return this.current()?.role === 'user'; }
  isOng(): boolean { return this.current()?.role === 'ong'; }
}
