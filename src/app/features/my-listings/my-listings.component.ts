import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { AuthService } from '../../core/services/auth.service';
import { Vehicle, getCategoryLabel } from '../../core/models/vehicle.model';
import { SaleClosureModalComponent } from '../../shared/components/sale-closure-modal/sale-closure-modal.component';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, SaleClosureModalComponent],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      <!-- Upper Section: Profile Info -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Mi Cuenta Comercial</span>
          <h1 class="font-heading text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Mis Publicaciones</h1>
          
          <div class="mt-4 flex flex-wrap gap-3 items-center">
            <span class="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 capitalize ring-1 ring-inset ring-blue-700/20">
              Rol: {{ userRole() }}
            </span>
            @if (userConcesionaria()) {
              <span class="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-700/20">
                Concesionaria: {{ userConcesionaria() }}
              </span>
            }
            @if (userRole() === 'agente') {
              <span class="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-600/20">
                Comisiones Ganadas: {{ userBenefits() | currency:'USD':'$':'1.2-2' }}
              </span>
            }
          </div>
        </div>

        <div class="flex gap-2">
          <a routerLink="/admin/crear" 
             class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Publicar Vehículo
          </a>
        </div>
      </div>

      <!-- Listings Stock list -->
      <div class="mt-8">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Inventario Asignado</h2>

        @if (loading()) {
          <div class="py-12 flex justify-center">
            <span class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></span>
          </div>
        } @else {
          
          <div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                <thead class="bg-slate-50 dark:bg-slate-950/50">
                  <tr>
                    <th scope="col" class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehículo</th>
                    <th scope="col" class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categoría</th>
                    <th scope="col" class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precio</th>
                    <th scope="col" class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Condición</th>
                    <th scope="col" class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado / Comisión</th>
                    <th scope="col" class="relative px-6 py-3.5">
                      <span class="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  @for (v of myListings(); track v.id) {
                    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      
                      <!-- Vehículo -->
                      <td class="whitespace-nowrap px-6 py-4">
                        <div class="flex items-center gap-3">
                          <div class="h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                            <img [src]="v.imagenPrincipal" [alt]="v.nombre" class="h-full w-full object-cover" />
                          </div>
                          <div>
                            <div class="text-sm font-bold text-slate-900 dark:text-white">{{ v.nombre }}</div>
                            <div class="text-xs text-slate-400 dark:text-slate-500">{{ v.marca }} · {{ v.modelo }} · {{ v.anio }}</div>
                          </div>
                        </div>
                      </td>
                      
                      <!-- Categoría -->
                      <td class="whitespace-nowrap px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {{ getCategoryLabel(v.categoria) }}
                      </td>
                      
                      <!-- Precio -->
                      <td class="whitespace-nowrap px-6 py-4 text-sm font-black text-slate-900 dark:text-white">
                        {{ v.precio | currency:(v.moneda || 'USD'):((v.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.0-0' }}
                      </td>
                      
                      <!-- Condición -->
                      <td class="whitespace-nowrap px-6 py-4 text-xs capitalize font-semibold text-slate-700 dark:text-slate-300">
                        {{ v.condicion }}
                      </td>

                      <!-- Estado & Comisión -->
                      <td class="whitespace-nowrap px-6 py-4">
                        <div class="flex flex-col gap-1 items-start">
                          <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize"
                                [class]="v.estado === 'disponible' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20' : (v.estado === 'vendido' ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-400/20' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-600/20')">
                            {{ v.estado }}
                          </span>
                          
                          @if (v.estado === 'vendido' && v.comisionTotal) {
                            <span class="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                              +{{ v.comisionCaptador | currency:(v.moneda || 'USD'):((v.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.2-2' }} captador
                            </span>
                          }
                        </div>
                      </td>

                      <!-- Acciones -->
                      <td class="whitespace-nowrap px-6 py-4 text-right text-xs font-medium space-x-2">
                        @if (userRole() === 'agente' && v.estado === 'disponible') {
                          <button (click)="openSaleModal(v)" 
                                  class="inline-flex items-center rounded-xl bg-emerald-600 px-3 py-1.5 font-bold text-white hover:bg-emerald-500 shadow-sm transition-all cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mr-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            Marcar Vendido (Liquidación 3%)
                          </button>
                        }
                        <a [routerLink]="['/admin/editar', v.id]" 
                           class="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition-colors">
                          Editar
                        </a>
                        <button (click)="openDeleteModal(v)" 
                                class="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50/50 hover:border-red-200 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-950/20 dark:hover:border-red-900/50 shadow-2xs transition-colors cursor-pointer">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="6" class="px-6 py-12 text-center">
                        <div class="max-w-md mx-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                          </svg>
                          <h3 class="mt-4 text-sm font-bold text-slate-900 dark:text-white">No tienes vehículos publicados</h3>
                          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Comienza publicando tu primer vehículo para que otros usuarios puedan verlo y reservarlo.</p>
                          <div class="mt-6">
                            <a routerLink="/admin/crear" class="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-blue-500 transition-colors">
                              Publicar Vehículo
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
          
        }
      </div>

      <!-- MODAL DE CIERRE DE VENTA Y LIQUIDACIÓN -->
      <app-sale-closure-modal
        [isOpen]="saleTarget() !== null"
        [vehicle]="saleTarget()"
        [isSubmitting]="isSaleSubmitting()"
        (cancel)="closeSaleModal()"
        (confirmed)="handleSaleConfirmed($event)">
      </app-sale-closure-modal>

      <!-- MODAL CONFIRMACIÓN ELIMINACIÓN -->
      @if (deleteTarget()) {
        <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-transparent pointer-events-none">
          <div class="fixed inset-0 bg-transparent pointer-events-auto" (click)="cancelDelete()"></div>
          <div class="relative z-10 pointer-events-auto w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-slate-800">
            <div class="flex items-start gap-3">
              <div class="h-9 w-9 rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">¿Eliminar publicación?</h3>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Se eliminará permanentemente <strong class="text-slate-700 dark:text-slate-300">"{{ deleteTarget()?.nombre }}"</strong>.
                </p>
              </div>
            </div>

            <div class="mt-4 flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button type="button" (click)="cancelDelete()" [disabled]="isDeleting()"
                      class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer">
                Cancelar
              </button>
              <button type="button" (click)="confirmDelete()" [disabled]="isDeleting()"
                      class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-60 cursor-pointer">
                @if (isDeleting()) {
                  <span class="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>Eliminando...</span>
                } @else {
                  <span>Sí, Eliminar</span>
                }
              </button>
            </div>
          </div>
        </div>
      }

      <!-- TOAST FEEDBACK -->
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

    </div>
  `
})
export class MyListingsComponent implements OnInit {
  private readonly vehicleService = inject(VehicleService);
  private readonly authService = inject(AuthService);
  protected readonly getCategoryLabel = getCategoryLabel;
 
  protected readonly myListings = signal<Vehicle[]>([]);
  protected readonly loading = signal(true);
 
  // Sale Modal state
  protected readonly saleTarget = signal<Vehicle | null>(null);
  protected readonly isSaleSubmitting = signal(false);

  // Delete state
  protected readonly deleteTarget = signal<Vehicle | null>(null);
  protected readonly isDeleting = signal(false);

  // Toast
  protected readonly toast = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  protected readonly userRole = computed(() => {
    const user = this.authService.currentUser();
    return user ? user.rol : 'agente';
  });

  protected readonly userConcesionaria = computed(() => {
    const user = this.authService.currentUser();
    return user && user.concesionaria ? user.concesionaria.nombre : null;
  });

  protected readonly userBenefits = computed(() => {
    const user = this.authService.currentUser();
    return user ? user.beneficios || 0 : 0;
  });
 
  public ngOnInit(): void {
    this.fetchListings();
  }
 
  private async fetchListings(): Promise<void> {
    this.loading.set(true);
    const data = await this.vehicleService.getMyListings();
    this.myListings.set(data);
    this.loading.set(false);
  }

  protected openSaleModal(vehicle: Vehicle): void {
    this.saleTarget.set(vehicle);
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
      await this.authService.refreshProfile();
      await this.fetchListings();
      this.saleTarget.set(null);
      this.showToast('success', '¡Venta registrada exitosamente! Comisiones acreditadas.');
    } catch (err: any) {
      console.error('Error al registrar venta:', err);
      this.showToast('error', err.message || 'Error al procesar la venta.');
    } finally {
      this.isSaleSubmitting.set(false);
    }
  }

  protected openDeleteModal(vehicle: Vehicle): void {
    this.deleteTarget.set(vehicle);
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
      await this.fetchListings();
      this.showToast('success', 'Publicación eliminada correctamente.');
    } catch (err: any) {
      this.showToast('error', err.message || 'Error al eliminar publicación.');
    } finally {
      this.isDeleting.set(false);
    }
  }

  private showToast(type: 'success' | 'error', message: string): void {
    this.toast.set({ type, message });
    setTimeout(() => {
      this.toast.set(null);
    }, 3500);
  }
}
