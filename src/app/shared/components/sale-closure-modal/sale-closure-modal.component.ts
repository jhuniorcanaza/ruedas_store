import { Component, Input, Output, EventEmitter, inject, signal, computed, effect } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehicle } from '../../../core/models/vehicle.model';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-sale-closure-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  template: `
    @if (isOpen && vehicle) {
      <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-transparent pointer-events-none">
        <!-- Transparent backdrop click catcher -->
        <div class="fixed inset-0 bg-transparent pointer-events-auto" (click)="onCancel()"></div>

        <!-- Modal Dialog Box -->
        <div class="relative z-10 pointer-events-auto w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.22)] border border-slate-200 dark:border-slate-800 animate-fade-in max-h-[92vh] overflow-y-auto">
          
          <!-- Header -->
          <div class="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-base font-extrabold text-slate-900 dark:text-white font-heading">
                  Cierre de Venta y Liquidación
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  Esquema 3% Comisión (15% Concesionaria / 85% Agentes)
                </p>
              </div>
            </div>
            
            <button type="button" (click)="onCancel()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-xl cursor-pointer transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Vehicle Thumbnail & Info -->
          <div class="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
            <div class="h-12 w-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
              <img [src]="vehicle.imagenPrincipal" [alt]="vehicle.nombre" class="h-full w-full object-cover" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ vehicle.nombre }}</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ vehicle.marca }} · {{ vehicle.modelo }} ({{ vehicle.anio }}) · Publicado por: <span class="font-semibold text-slate-700 dark:text-slate-300">{{ getCaptadorName() }}</span>
              </p>
            </div>
            <div class="text-right shrink-0">
              <span class="text-[10px] uppercase font-bold text-slate-400 block">Precio Lista</span>
              <span class="text-sm font-black text-slate-900 dark:text-white">
                {{ vehicle.precio | currency:(vehicle.moneda || 'USD'):((vehicle.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.0-0' }}
              </span>
            </div>
          </div>

          <!-- Sale Form Controls -->
          <div class="mt-5 space-y-4">
            
            <!-- Final Negotiated Price -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Precio Final de Venta Concretado *
              </label>
              <div class="mt-1.5 relative">
                <input type="number" [(ngModel)]="salePrice" min="1"
                       class="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-2xs" />
                <span class="absolute right-3.5 top-2.5 text-xs font-extrabold text-slate-400">
                  {{ vehicle.moneda || 'USD' }}
                </span>
              </div>
              <p class="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                Puedes ajustar el valor si hubo una negociación de precio al cerrar la venta.
              </p>
            </div>

            <!-- Seller Assignment Mode -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Modalidad de Venta y Cierre
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label class="flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer select-none transition-all"
                       [class.border-blue-500]="!isSharedSale"
                       [class.bg-blue-50/40]="!isSharedSale"
                       [class.dark:bg-blue-950/20]="!isSharedSale"
                       [class.border-slate-200]="isSharedSale"
                       [class.dark:border-slate-800]="isSharedSale">
                  <input type="radio" [value]="false" [(ngModel)]="isSharedSale" class="mt-0.5 text-blue-600 focus:ring-blue-500" />
                  <div>
                    <span class="text-xs font-bold text-slate-900 dark:text-white block">Venta Directa Propia</span>
                    <span class="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">El captador cerró la venta. Recibe el 85% de comisión.</span>
                  </div>
                </label>

                <label class="flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer select-none transition-all"
                       [class.border-blue-500]="isSharedSale"
                       [class.bg-blue-50/40]="isSharedSale"
                       [class.dark:bg-blue-950/20]="isSharedSale"
                       [class.border-slate-200]="!isSharedSale"
                       [class.dark:border-slate-800]="!isSharedSale">
                  <input type="radio" [value]="true" [(ngModel)]="isSharedSale" class="mt-0.5 text-blue-600 focus:ring-blue-500" />
                  <div>
                    <span class="text-xs font-bold text-slate-900 dark:text-white block">Venta Compartida (Co-broker)</span>
                    <span class="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Otro agente concretó la venta. 42.5% c/u.</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Seller Selector if Shared -->
            @if (isSharedSale) {
              <div class="p-3.5 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50 animate-fade-in">
                <label class="block text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 mb-1.5">
                  Seleccionar Agente / Vendedor que Cerró el Trato *
                </label>
                <select [(ngModel)]="selectedSellerId"
                        class="w-full rounded-xl border border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 shadow-2xs">
                  <option value="" disabled>-- Elige al agente vendedor --</option>
                  @for (agent of activeAgents(); track agent.id) {
                    @if (agent.id !== vehicle.userId) {
                      <option [value]="agent.id">
                        {{ agent.nombre }} ({{ agent.email }}) · {{ agent.rol }}
                      </option>
                    }
                  }
                </select>
                @if (!selectedSellerId) {
                  <p class="mt-1.5 text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                    Selecciona al agente co-vendedor para acreditarle su 50% del fondo.
                  </p>
                }
              </div>
            }

            <!-- Live Calculation Financial Card -->
            <div class="mt-4 p-4 rounded-2xl bg-slate-900 text-white dark:bg-slate-950 dark:border dark:border-slate-800 shadow-inner space-y-3">
              <div class="flex items-center justify-between pb-2.5 border-b border-slate-800">
                <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Desglose de Liquidación</span>
                <span class="text-xs font-black text-emerald-400">
                  Comisión Bruta (3%): {{ totalCommission() | currency:(vehicle.moneda || 'USD'):((vehicle.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.2-2' }}
                </span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                
                <!-- Retención Plataforma -->
                <div class="bg-slate-800/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span class="text-[9px] uppercase font-bold text-slate-400 block">Retención Dealer (15%)</span>
                  <span class="text-sm font-black text-slate-200 block mt-0.5">
                    {{ dealerRetention() | currency:(vehicle.moneda || 'USD'):((vehicle.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.2-2' }}
                  </span>
                </div>

                <!-- Ganancia Captador -->
                <div class="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/60">
                  <span class="text-[9px] uppercase font-bold text-emerald-300 block">
                    Captador ({{ isSharedSale ? '42.5%' : '85%' }})
                  </span>
                  <span class="text-sm font-black text-emerald-400 block mt-0.5">
                    +{{ captadorShare() | currency:(vehicle.moneda || 'USD'):((vehicle.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.2-2' }}
                  </span>
                </div>

                <!-- Ganancia Vendedor -->
                <div class="bg-blue-950/60 p-2.5 rounded-xl border border-blue-800/60 col-span-2 sm:col-span-1">
                  <span class="text-[9px] uppercase font-bold text-blue-300 block">
                    Vendedor ({{ isSharedSale ? '42.5%' : '0%' }})
                  </span>
                  <span class="text-sm font-black text-blue-400 block mt-0.5">
                    +{{ vendedorShare() | currency:(vehicle.moneda || 'USD'):((vehicle.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.2-2' }}
                  </span>
                </div>

              </div>

              <p class="text-[10px] text-slate-400 leading-tight">
                * Los beneficios se acreditarán inmediatamente al saldo del agente correspondiente en su panel de comisiones.
              </p>
            </div>

            <!-- Error message if any -->
            @if (errorMessage()) {
              <div class="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 font-semibold">
                {{ errorMessage() }}
              </div>
            }

          </div>

          <!-- Action Buttons -->
          <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2.5 justify-end">
            <button type="button" (click)="onCancel()" [disabled]="isSubmitting"
                    class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50">
              Cancelar
            </button>
            <button type="button" (click)="onConfirm()" [disabled]="isSubmitting || (isSharedSale && !selectedSellerId)"
                    class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
              @if (isSubmitting) {
                <span class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Procesando Venta...</span>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Confirmar Venta y Liquidar</span>
              }
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class SaleClosureModalComponent {
  private readonly authService = inject(AuthService);

  @Input() isOpen = false;
  @Input() vehicle: Vehicle | null = null;
  @Input() isSubmitting = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<{
    vehicleId: string;
    precioVenta: number;
    vendedorId?: string;
    isShared: boolean;
  }>();

  protected salePrice = 0;
  protected isSharedSale = false;
  protected selectedSellerId = '';
  protected activeAgents = signal<User[]>([]);
  protected errorMessage = signal<string>('');

  constructor() {
    effect(async () => {
      if (this.isOpen && this.vehicle) {
        this.salePrice = Number(this.vehicle.precio || 0);
        this.isSharedSale = false;
        this.selectedSellerId = '';
        this.errorMessage.set('');
        await this.loadAgents();
      }
    });
  }

  private async loadAgents(): Promise<void> {
    try {
      const agents = await this.authService.getActiveAgents();
      this.activeAgents.set(agents);
    } catch (e) {
      console.error('Error al cargar agentes para modal de venta:', e);
    }
  }

  protected getCaptadorName(): string {
    if (!this.vehicle) return 'Agente';
    if (this.vehicle.user && this.vehicle.user.nombre) {
      return this.vehicle.user.nombre;
    }
    return 'Agente Asignado';
  }

  // Cálculos reactivos
  protected totalCommission(): number {
    const p = Number(this.salePrice || 0);
    return Math.round(p * 0.03 * 100) / 100;
  }

  protected dealerRetention(): number {
    return Math.round(this.totalCommission() * 0.15 * 100) / 100;
  }

  protected agentsPool(): number {
    return Math.round(this.totalCommission() * 0.85 * 100) / 100;
  }

  protected captadorShare(): number {
    const pool = this.agentsPool();
    if (this.isSharedSale) {
      return Math.round(pool * 0.5 * 100) / 100;
    }
    return pool;
  }

  protected vendedorShare(): number {
    if (!this.isSharedSale) return 0;
    const pool = this.agentsPool();
    const captador = this.captadorShare();
    return Math.round((pool - captador) * 100) / 100;
  }

  protected onCancel(): void {
    if (!this.isSubmitting) {
      this.cancel.emit();
    }
  }

  protected onConfirm(): void {
    if (!this.vehicle) return;
    if (this.salePrice <= 0) {
      this.errorMessage.set('El precio final de venta debe ser mayor a 0.');
      return;
    }
    if (this.isSharedSale && !this.selectedSellerId) {
      this.errorMessage.set('Por favor selecciona al agente co-vendedor.');
      return;
    }

    this.errorMessage.set('');
    this.confirmed.emit({
      vehicleId: this.vehicle.id,
      precioVenta: this.salePrice,
      vendedorId: this.isSharedSale ? this.selectedSellerId : (this.vehicle.userId || undefined),
      isShared: this.isSharedSale
    });
  }
}
