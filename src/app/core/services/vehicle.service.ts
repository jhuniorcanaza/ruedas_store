import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../models/vehicle.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/vehicles';

  private readonly vehiclesSignal = signal<Vehicle[]>([]);
  public readonly vehicles = this.vehiclesSignal.asReadonly();

  constructor() {
    this.initVehicles();
  }

  private async initVehicles(): Promise<void> {
    await this.refreshVehicles();
  }

  public async refreshVehicles(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<Vehicle[]>(this.apiUrl));
      this.vehiclesSignal.set(data);
    } catch (err) {
      console.error('Error al cargar vehículos desde la API:', err);
    }
  }

  public getVehicles(): Vehicle[] {
    return this.vehicles();
  }

  public async getVehicleById(id: string): Promise<Vehicle | undefined> {
    try {
      return await firstValueFrom(this.http.get<Vehicle>(`${this.apiUrl}/${id}`));
    } catch (err) {
      console.error('Error al obtener vehículo:', err);
      return undefined;
    }
  }

  public async getMyListings(): Promise<Vehicle[]> {
    try {
      return await firstValueFrom(this.http.get<Vehicle[]>(`${this.apiUrl}/my-listings`));
    } catch (err) {
      console.error('Error al obtener mis publicaciones:', err);
      return [];
    }
  }

  public async createVehicle(vehicle: Omit<Vehicle, 'id' | 'fechaIngreso'>): Promise<boolean> {
    try {
      await firstValueFrom(this.http.post<Vehicle>(this.apiUrl, vehicle));
      await this.refreshVehicles();
      return true;
    } catch (err: any) {
      console.error('Error al crear vehículo:', err);
      const message = err.error?.message ? (Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message) : (err.message || 'Error del servidor');
      throw new Error(message);
    }
  }

  public async updateVehicle(id: string, vehicle: Partial<Vehicle>): Promise<boolean> {
    try {
      await firstValueFrom(this.http.patch<Vehicle>(`${this.apiUrl}/${id}`, vehicle));
      await this.refreshVehicles();
      return true;
    } catch (err: any) {
      console.error('Error al actualizar vehículo:', err);
      const message = err.error?.message ? (Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message) : (err.message || 'Error del servidor');
      throw new Error(message);
    }
  }

  public async deleteVehicle(id: string): Promise<boolean> {
    try {
      await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
      await this.refreshVehicles();
      return true;
    } catch (err: any) {
      console.error('Error al eliminar vehículo:', err);
      const message = err.error?.message ? (Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message) : (err.message || 'Error del servidor');
      throw new Error(message);
    }
  }

  public async getLiquidations(): Promise<Vehicle[]> {
    try {
      return await firstValueFrom(this.http.get<Vehicle[]>(`${this.apiUrl}/admin/liquidations`));
    } catch (err) {
      console.error('Error al obtener liquidaciones:', err);
      return [];
    }
  }

  public async updateCommissionPayment(id: string, comisionPagada: boolean, notasLiquidacion?: string): Promise<boolean> {
    try {
      await firstValueFrom(this.http.patch<Vehicle>(`${this.apiUrl}/${id}/pago-comision`, {
        comisionPagada,
        notasLiquidacion
      }));
      await this.refreshVehicles();
      return true;
    } catch (err) {
      console.error('Error al actualizar estado de pago de comisión:', err);
      return false;
    }
  }
}
