import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Specification, SpecificationGroup } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class SpecificationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/specifications';

  public async getGroups(): Promise<SpecificationGroup[]> {
    try {
      return await firstValueFrom(this.http.get<SpecificationGroup[]>(`${this.apiUrl}/groups`));
    } catch (err) {
      console.error('Error al obtener grupos de especificaciones:', err);
      return [];
    }
  }

  public async getSpecifications(): Promise<Specification[]> {
    try {
      return await firstValueFrom(this.http.get<Specification[]>(this.apiUrl));
    } catch (err) {
      console.error('Error al obtener especificaciones:', err);
      return [];
    }
  }

  public async createGroup(nombre: string, categoriaVehiculo: string = 'todos'): Promise<{ success: boolean; message?: string; group?: SpecificationGroup }> {
    try {
      const group = await firstValueFrom(this.http.post<SpecificationGroup>(`${this.apiUrl}/groups`, { nombre, categoriaVehiculo }));
      return { success: true, group };
    } catch (err: any) {
      console.error('Error al crear grupo:', err);
      const msg = err.error?.message || 'No se pudo crear el grupo.';
      return { success: false, message: Array.isArray(msg) ? msg.join(', ') : msg };
    }
  }

  public async updateGroup(id: number, data: { nombre?: string; categoriaVehiculo?: string }): Promise<{ success: boolean; message?: string; group?: SpecificationGroup }> {
    try {
      const group = await firstValueFrom(this.http.patch<SpecificationGroup>(`${this.apiUrl}/groups/${id}`, data));
      return { success: true, group };
    } catch (err: any) {
      console.error('Error al actualizar grupo:', err);
      const msg = err.error?.message || 'No se pudo actualizar el grupo.';
      return { success: false, message: Array.isArray(msg) ? msg.join(', ') : msg };
    }
  }

  public async deleteGroup(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await firstValueFrom(this.http.delete<{ success: boolean; message?: string }>(`${this.apiUrl}/groups/${id}`));
      return { success: true, message: res.message || 'Grupo eliminado exitosamente' };
    } catch (err: any) {
      console.error('Error al eliminar grupo:', err);
      const msg = err.error?.message || 'No se pudo eliminar el grupo.';
      return { success: false, message: Array.isArray(msg) ? msg.join(', ') : msg };
    }
  }

  public async createSpecification(nombre: string, grupoId: number, categoriaVehiculo: string = 'todos'): Promise<{ success: boolean; message?: string; spec?: Specification }> {
    try {
      const spec = await firstValueFrom(this.http.post<Specification>(this.apiUrl, { nombre, grupoId, categoriaVehiculo }));
      return { success: true, spec };
    } catch (err: any) {
      console.error('Error al crear especificación:', err);
      const msg = err.error?.message || 'No se pudo crear la especificación.';
      return { success: false, message: Array.isArray(msg) ? msg.join(', ') : msg };
    }
  }

  public async updateSpec(id: number, data: { nombre?: string; grupoId?: number; categoriaVehiculo?: string }): Promise<{ success: boolean; message?: string; spec?: Specification }> {
    try {
      const spec = await firstValueFrom(this.http.patch<Specification>(`${this.apiUrl}/${id}`, data));
      return { success: true, spec };
    } catch (err: any) {
      console.error('Error al actualizar especificación:', err);
      const msg = err.error?.message || 'No se pudo actualizar la especificación.';
      return { success: false, message: Array.isArray(msg) ? msg.join(', ') : msg };
    }
  }

  public async deleteSpec(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await firstValueFrom(this.http.delete<{ success: boolean; message?: string }>(`${this.apiUrl}/${id}`));
      return { success: true, message: res.message || 'Especificación eliminada exitosamente' };
    } catch (err: any) {
      console.error('Error al eliminar especificación:', err);
      const msg = err.error?.message || 'No se pudo eliminar la especificación.';
      return { success: false, message: Array.isArray(msg) ? msg.join(', ') : msg };
    }
  }
}
