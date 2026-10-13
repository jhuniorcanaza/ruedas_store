import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle, getCategoryLabel } from '../../../core/models/vehicle.model';
import { SaleClosureModalComponent } from '../../../shared/components/sale-closure-modal/sale-closure-modal.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyPipe, SaleClosureModalComponent],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      <!-- Admin Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 class="font-heading text-3xl font-extrabold text-slate-900">Panel de Administración</h1>
          <p class="mt-2 text-sm text-slate-500">Gestión global de inventario, estados y visibilidad de vehículos destacados</p>
        </div>
        
        <div class="flex gap-2 shrink-0">
          <a routerLink="/admin/usuarios" 
             class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Gestionar Usuarios
          </a>
          <a routerLink="/admin/carrusel" 
             class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Gestionar Portadas
          </a>
          <a routerLink="/admin/especificaciones" 
             class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Gestionar Características
          </a>
          <a routerLink="/admin/crear" 
             class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Vehículo
          </a>
        </div>
      </div>

      <!-- Filters & Stats Cards -->
      <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span class="text-xs font-semibold text-slate-400 uppercase">Total Inventario</span>
          <p class="font-heading text-2xl font-extrabold text-slate-900 mt-1">{{ totalCount() }} unidades</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span class="text-xs font-semibold text-slate-400 uppercase">Destacados en Home</span>
          <p class="font-heading text-2xl font-extrabold text-blue-600 mt-1">{{ featuredCount() }} unidades</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span class="text-xs font-semibold text-slate-400 uppercase">Reservados / Vendidos</span>
          <p class="font-heading text-2xl font-extrabold text-amber-600 mt-1">{{ inactiveCount() }} unidades</p>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-100 p-4 rounded-xl border border-slate-200">
        <div class="relative w-full sm:max-w-xs">
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" [(ngModel)]="searchQuery" placeholder="Buscar por marca, modelo..." 
                 class="w-full bg-white rounded-lg border border-slate-200 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500" />
        </div>

        <div class="flex gap-2">
          <button (click)="clearSearch()" class="text-xs font-semibold text-slate-500 hover:text-slate-700 px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            Limpiar búsqueda
          </button>
        </div>
      </div>

      <!-- Inventory Table -->
      <div class="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100">
            <thead class="bg-slate-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehículo</th>
                <th scope="col" class="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categoría</th>
                <th scope="col" class="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precio (USD)</th>
                <th scope="col" class="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destacado</th>
                <th scope="col" class="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            
            <tbody class="divide-y divide-slate-100">
              @for (v of filteredVehicles(); track v.id) {
                <tr class="hover:bg-slate-50/50 transition-colors">
                  <!-- Product Identity -->
                  <td class="whitespace-nowrap px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="h-10 w-14 shrink-0 overflow-hidden rounded-md border border-slate-100 bg-slate-50">
                        <img [src]="v.imagenPrincipal" [alt]="v.nombre" class="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div class="text-sm font-bold text-slate-900">{{ v.nombre }}</div>
                        <div class="text-xs text-slate-400">{{ v.marca }} · {{ v.modelo }} · {{ v.anio }}</div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Category -->
                  <td class="whitespace-nowrap px-6 py-4">
                    <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {{ getCategoryLabel(v.categoria) }}
                    </span>
                  </td>
                  
                  <!-- Price -->
                  <td class="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-900">
                    {{ v.precio | currency:(v.moneda || 'USD'):((v.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.0-0' }}
                  </td>
                  
                  <!-- Featured Checkbox -->
                  <td class="whitespace-nowrap px-6 py-4">
                    <button (click)="toggleFeatured(v.id, v.destacado)" 
                            class="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:bg-slate-50"
                            [class.text-amber-500]="v.destacado"
                            [class.text-slate-300]="!v.destacado">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" [attr.fill]="v.destacado ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.77-.558-.371-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                  </td>

                  <!-- Status Select & Commission -->
                  <td class="whitespace-nowrap px-6 py-4">
                    <select [ngModel]="v.estado" (ngModelChange)="changeStatus(v.id, $event)"
                            class="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs font-semibold focus:outline-none transition-colors shadow-2xs cursor-pointer"
                            [class]="statusSelectClass(v.estado)">
                      <option value="disponible">Disponible</option>
                      <option value="reservado">Reservado</option>
                      <option value="vendido">Vendido</option>
                    </select>

                    @if (v.estado === 'vendido' && v.comisionTotal) {
                      <div class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                        Comisión 3%: {{ v.comisionTotal | currency:(v.moneda || 'USD'):((v.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.0-0' }}
                      </div>
                    }
                  </td>

                  <!-- Actions buttons -->
                  <td class="whitespace-nowrap px-6 py-4 text-right text-xs font-medium space-x-2">
                    <a [routerLink]="['/admin/editar', v.id]" class="inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800 dark:hover:text-white shadow-sm transition-colors">
                      Editar
                    </a>
                    <button (click)="deleteItem(v.id, v.nombre)" class="inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50/50 hover:border-red-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-950/20 dark:hover:border-red-900/50 shadow-sm transition-colors">
                      Eliminar
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-6 py-12 text-center text-slate-500">
                    No se encontraron vehículos en el stock.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div><!-- /fin del div fade-in -->


    <!-- Toast Feedback — fuera del contenedor fade-in para que position:fixed funcione correctamente -->
    @if (toast()) {
      <div class="fixed bottom-6 right-6 z-[10000] flex items-center gap-3 rounded-2xl px-5 py-4 shadow-2xl border"
           [class.bg-emerald-950]="toast()?.type === 'success'"
           [class.border-emerald-800]="toast()?.type === 'success'"
           [class.text-emerald-200]="toast()?.type === 'success'"
           [class.bg-rose-950]="toast()?.type === 'error'"
           [class.border-rose-800]="toast()?.type === 'error'"
           [class.text-rose-200]="toast()?.type === 'error'">
        @if (toast()?.type === 'success') {
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        } @else {
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        <span class="text-sm font-semibold">{{ toast()?.message }}</span>
      </div>
    }

    <!-- MODAL CONFIRMACIÓN ELIMINACIÓN — fuera del fade-in para que position:fixed apunte al viewport -->
    @if (deleteTarget()) {
      <div class="fixed top-1/2 left-1/2 z-[10000] w-[90vw] max-w-sm bg-white rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.2)] border border-slate-200"
           style="position:fixed;top:50vh;left:50vw;transform:translate(-50%,-50%);">
        
        <div class="flex items-start gap-3">
          <div class="h-9 w-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-bold text-slate-900">¿Eliminar vehículo del inventario?</h3>
            <p class="mt-1 text-xs text-slate-500 leading-relaxed">
              Se eliminará permanentemente <strong class="text-slate-700">"{{ deleteTarget()?.name }}"</strong>. Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        <div class="mt-4 flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button type="button" (click)="cancelDelete()" [disabled]="isDeleting()"
                  class="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50">
            Cancelar
          </button>
          <button type="button" (click)="confirmDelete()" [disabled]="isDeleting()"
                  class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-60">
            @if (isDeleting()) {
              <svg class="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Eliminando...</span>
            } @else {
              <span>Sí, Eliminar</span>
            }
          </button>
        </div>

      </div>
    }

    <!-- MODAL DE CIERRE DE VENTA Y LIQUIDACIÓN -->
    <app-sale-closure-modal
      [isOpen]="saleTarget() !== null"
      [vehicle]="saleTarget()"
      [isSubmitting]="isSaleSubmitting()"
      (cancel)="closeSaleModal()"
      (confirmed)="handleSaleConfirmed($event)">
    </app-sale-closure-modal>
  `
})
export class AdminDashboardComponent {
  private readonly vehicleService = inject(VehicleService);
  protected readonly getCategoryLabel = getCategoryLabel;

  protected readonly searchQuery = signal('');
  protected readonly deleteTarget = signal<{ id: string; name: string } | null>(null);
  protected readonly isDeleting = signal(false);
  protected readonly toast = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sale Modal state
  protected readonly saleTarget = signal<Vehicle | null>(null);
  protected readonly isSaleSubmitting = signal(false);

  protected readonly allVehicles = this.vehicleService.vehicles;

  protected readonly totalCount = computed(() => this.allVehicles().length);
  protected readonly featuredCount = computed(() => this.allVehicles().filter(v => v.destacado).length);
  protected readonly inactiveCount = computed(() => this.allVehicles().filter(v => v.estado !== 'disponible').length);

  protected readonly filteredVehicles = computed(() => {
    const list = this.allVehicles();
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return list;
    
    return list.filter(v => 
      v.nombre.toLowerCase().includes(query) ||
      v.marca.toLowerCase().includes(query) ||
      v.modelo.toLowerCase().includes(query) ||
      v.categoria.toLowerCase().includes(query)
    );
  });

  protected clearSearch(): void {
    this.searchQuery.set('');
  }

  protected async toggleFeatured(id: string, current: boolean): Promise<void> {
    try {
      await this.vehicleService.updateVehicle(id, { destacado: !current });
      this.showToast('success', 'Visibilidad destacada actualizada.');
    } catch (err: any) {
      this.showToast('error', err.message || 'Error al actualizar visibilidad.');
    }
  }

  protected async changeStatus(id: string, newStatus: 'disponible' | 'reservado' | 'vendido'): Promise<void> {
    if (newStatus === 'vendido') {
      const v = this.allVehicles().find(x => x.id === id);
      if (v && !v.beneficioEntregado) {
        this.saleTarget.set(v);
        return;
      }
    }

    try {
      await this.vehicleService.updateVehicle(id, { estado: newStatus });
      this.showToast('success', `Estado cambiado a ${newStatus}.`);
    } catch (err: any) {
      this.showToast('error', err.message || 'Error al cambiar estado.');
    }
  }

  protected closeSaleModal(): void {
    if (!this.isSaleSubmitting()) {
      this.saleTarget.set(null);
    }
  }

  protected async handleSaleConfirmed(event: {
    vehicleId: string;
    precioVenta: number;
    vendedorId?: string;
    isShared: boolean;
  }): Promise<void> {
    this.isSaleSubmitting.set(true);
    try {
      const payload: any = {
        estado: 'vendido',
        precioVenta: event.precioVenta,
      };
      if (event.vendedorId) {
        payload.vendedorId = event.vendedorId;
      }
      await this.vehicleService.updateVehicle(event.vehicleId, payload);
      this.saleTarget.set(null);
      this.showToast('success', '¡Venta registrada con éxito y comisiones liquidadas!');
    } catch (err: any) {
      console.error('Error al registrar venta:', err);
      this.showToast('error', err.message || 'Error al procesar la venta.');
    } finally {
      this.isSaleSubmitting.set(false);
    }
  }

  protected deleteItem(id: string, name: string): void {
    this.deleteTarget.set({ id, name });
  }

  protected cancelDelete(): void {
    if (!this.isDeleting()) {
      this.deleteTarget.set(null);
    }
  }

  protected async confirmDelete(): Promise<void> {
    const target = this.deleteTarget();
    if (!target) return;

    this.isDeleting.set(true);
    try {
      await this.vehicleService.deleteVehicle(target.id);
      this.deleteTarget.set(null);
      this.showToast('success', `El vehículo "${target.name}" fue eliminado correctamente.`);
    } catch (err: any) {
      console.error('Error al eliminar vehículo:', err);
      this.showToast('error', err.message || 'No se pudo eliminar el vehículo.');
    } finally {
      this.isDeleting.set(false);
    }
  }

  private showToast(type: 'success' | 'error', message: string): void {
    this.toast.set({ type, message });
    setTimeout(() => {
      this.toast.set(null);
    }, 4000);
  }

  protected statusSelectClass(status: string): string {
    if (status === 'disponible') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (status === 'reservado') return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  }
}
