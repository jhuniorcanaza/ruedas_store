import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/auth';
  private readonly sessionKey = 'concesionaria_session';
  private readonly tokenKey = 'concesionaria_token';
  
  private readonly currentUserSignal = signal<User | null>(null);
  public readonly currentUser = this.currentUserSignal.asReadonly();

  constructor() {
    this.checkSession();
  }

  private async checkSession(): Promise<void> {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(this.tokenKey);
      const storedUser = localStorage.getItem(this.sessionKey);
      
      if (token && storedUser) {
        try {
          this.currentUserSignal.set(JSON.parse(storedUser));
          const freshUser = await firstValueFrom(this.http.get<User>(`${this.apiUrl}/me`));
          this.currentUserSignal.set(freshUser);
          localStorage.setItem(this.sessionKey, JSON.stringify(freshUser));
        } catch (e) {
          console.error('Error al restaurar sesión activa:', e);
          this.logout();
        }
      }
    }
  }

  public async login(email: string, contrasenia: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ token: string; user: User }>(`${this.apiUrl}/login`, { email, contrasenia })
      );

      if (response && response.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.sessionKey, JSON.stringify(response.user));
        }
        this.currentUserSignal.set(response.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error en login:', err);
      return false;
    }
  }

  public async register(nombre: string, email: string, contrasenia: string, rol: 'administrador' | 'concesionaria' | 'agente', concesionariaId: string | null, recibeDolares: boolean, recibeBolivianos: boolean): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ token: string; user: User }>(`${this.apiUrl}/register`, { nombre, email, contrasenia, rol, concesionariaId, recibeDolares, recibeBolivianos })
      );

      if (response && response.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.sessionKey, JSON.stringify(response.user));
        }
        this.currentUserSignal.set(response.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error en registro:', err);
      return false;
    }
  }

  public async refreshProfile(): Promise<void> {
    try {
      const freshUser = await firstValueFrom(this.http.get<User>(`${this.apiUrl}/me`));
      this.currentUserSignal.set(freshUser);
      localStorage.setItem(this.sessionKey, JSON.stringify(freshUser));
    } catch (e) {
      console.error('Error al restaurar sesión activa:', e);
    }
  }

  public async getConcesionarias(): Promise<User[]> {
    try {
      return await firstValueFrom(this.http.get<User[]>(`${this.apiUrl}/concesionarias`));
    } catch (err) {
      console.error('Error al obtener concesionarias:', err);
      return [];
    }
  }

  public async getActiveAgents(): Promise<User[]> {
    try {
      return await firstValueFrom(this.http.get<User[]>(`${this.apiUrl}/agents`));
    } catch (err) {
      console.error('Error al obtener agentes activos:', err);
      return [];
    }
  }

  public async getUsers(): Promise<User[]> {
    try {
      return await firstValueFrom(this.http.get<User[]>(`${this.apiUrl}/users`));
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      return [];
    }
  }

  public async adminUpdateUser(userId: string, updateData: any): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.patch<{ success: boolean }>(`${this.apiUrl}/users/${userId}/admin-update`, updateData)
      );
      return response && response.success;
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      return false;
    }
  }

  public async adminCreateUser(userData: {
    nombre: string;
    email: string;
    contrasenia: string;
    rol: 'admin' | 'administrador' | 'concesionaria' | 'agente' | 'cliente';
    concesionariaId?: string;
    recibeDolares?: boolean;
    recibeBolivianos?: boolean;
  }): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ success: boolean; message?: string; user?: User }>(
          `${this.apiUrl}/users/create`,
          userData
        )
      );
      return response;
    } catch (err: any) {
      console.error('Error al crear usuario por admin:', err);
      const msg = err?.error?.message || 'Error al crear el usuario en el servidor.';
      return {
        success: false,
        message: Array.isArray(msg) ? msg.join(', ') : msg,
      };
    }
  }

  public async adminDeleteUser(userId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await firstValueFrom(
        this.http.delete<{ success: boolean; message?: string }>(`${this.apiUrl}/users/${userId}`)
      );
      return response;
    } catch (err: any) {
      console.error('Error al eliminar usuario por admin:', err);
      const msg = err?.error?.message || 'Error al eliminar el usuario.';
      return {
        success: false,
        message: Array.isArray(msg) ? msg.join(', ') : msg,
      };
    }
  }

  public async getBeneficioSetting(): Promise<number> {
    try {
      const response = await firstValueFrom(this.http.get<{ valor: number }>(`${this.apiUrl}/settings/beneficio`));
      return response ? response.valor : 100;
    } catch (err) {
      console.error('Error al obtener beneficio:', err);
      return 100;
    }
  }

  public async updateBeneficioSetting(valor: number): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.patch<{ success: boolean }>(`${this.apiUrl}/settings/beneficio`, { valor }));
      return response && response.success;
    } catch (err) {
      console.error('Error al actualizar beneficio:', err);
      return false;
    }
  }

  public logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.sessionKey);
    }
    this.currentUserSignal.set(null);
  }

  public isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  public isAdmin(): boolean {
    const user = this.currentUser();
    return user !== null && user.rol === 'administrador';
  }
}
