import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SpecificationService } from '../../../core/services/specification.service';
import { SpecificationGroup, Specification } from '../../../core/models/vehicle.model';

type VehicleCategoryTab = 'todos' | 'autos' | 'motos' | 'electricos' | 'maquinaria' | 'transporte';

interface ConfirmDeleteConfig {
  type: 'group' | 'spec';
  id: number;
  name: string;
  count?: number;
}

@Component({
  selector: 'app-specifications-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <span class="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Configuración de Ficha Técnica</span>
          <h1 class="font-heading text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Gestión de Características</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Administra grupos y especificaciones técnicas categorizadas según el tipo de vehículo (Autos, Motos, Maquinaria, Eléctricos).
          </p>
        </div>
        <div class="flex items-center gap-3">
          <a routerLink="/admin" class="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs">
            Volver al Panel
          </a>
        </div>
      </div>

      <!-- Toast Feedback -->
      @if (toastMessage()) {
        <div class="mt-4 p-4 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-2xs animate-fade-in"
             [class.bg-emerald-50]="toastType() === 'success'"
             [class.border-emerald-200]="toastType() === 'success'"
             [class.text-emerald-800]="toastType() === 'success'"
             [class.dark:bg-emerald-950/40]="toastType() === 'success'"
             [class.dark:border-emerald-800/60]="toastType() === 'success'"
             [class.dark:text-emerald-300]="toastType() === 'success'"
             [class.bg-rose-50]="toastType() === 'error'"
             [class.border-rose-200]="toastType() === 'error'"
             [class.text-rose-800]="toastType() === 'error'"
             [class.dark:bg-rose-950/40]="toastType() === 'error'"
             [class.dark:border-rose-800/60]="toastType() === 'error'"
             [class.dark:text-rose-300]="toastType() === 'error'">
          <div class="flex items-center gap-2">
            @if (toastType() === 'success') {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            <span>{{ toastMessage() }}</span>
          </div>
          <button (click)="toastMessage.set('')" class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }

      <!-- Pestañas de Filtro por Tipo de Vehículo -->
      <div class="mt-8 flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button (click)="activeTab.set('todos')"
                class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                [class.bg-blue-600]="activeTab() === 'todos'"
                [class.text-white]="activeTab() === 'todos'"
                [class.bg-slate-100]="activeTab() !== 'todos'"
                [class.dark:bg-slate-800]="activeTab() !== 'todos'"
                [class.text-slate-600]="activeTab() !== 'todos'"
                [class.dark:text-slate-300]="activeTab() !== 'todos'"
                [class.hover:bg-slate-200]="activeTab() !== 'todos'"
                [class.dark:hover:bg-slate-700]="activeTab() !== 'todos'">
          <span>Todas las Características</span>
          <span class="px-1.5 py-0.5 rounded-full text-[10px]"
                [class.bg-blue-700]="activeTab() === 'todos'"
                [class.bg-slate-200]="activeTab() !== 'todos'"
                [class.dark:bg-slate-700]="activeTab() !== 'todos'">
            {{ totalSpecsCount() }}
          </span>
        </button>

        <button (click)="activeTab.set('autos')"
                class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                [class.bg-blue-600]="activeTab() === 'autos'"
                [class.text-white]="activeTab() === 'autos'"
                [class.bg-slate-100]="activeTab() !== 'autos'"
                [class.dark:bg-slate-800]="activeTab() !== 'autos'"
                [class.text-slate-600]="activeTab() !== 'autos'"
                [class.dark:text-slate-300]="activeTab() !== 'autos'"
                [class.hover:bg-slate-200]="activeTab() !== 'autos'"
                [class.dark:hover:bg-slate-700]="activeTab() !== 'autos'">
          <span>Autos y Camionetas</span>
        </button>

        <button (click)="activeTab.set('motos')"
                class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                [class.bg-blue-600]="activeTab() === 'motos'"
                [class.text-white]="activeTab() === 'motos'"
                [class.bg-slate-100]="activeTab() !== 'motos'"
                [class.dark:bg-slate-800]="activeTab() !== 'motos'"
                [class.text-slate-600]="activeTab() !== 'motos'"
                [class.dark:text-slate-300]="activeTab() !== 'motos'"
                [class.hover:bg-slate-200]="activeTab() !== 'motos'"
                [class.dark:hover:bg-slate-700]="activeTab() !== 'motos'">
          <span>Motocicletas</span>
        </button>

        <button (click)="activeTab.set('electricos')"
                class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                [class.bg-blue-600]="activeTab() === 'electricos'"
                [class.text-white]="activeTab() === 'electricos'"
                [class.bg-slate-100]="activeTab() !== 'electricos'"
                [class.dark:bg-slate-800]="activeTab() !== 'electricos'"
                [class.text-slate-600]="activeTab() !== 'electricos'"
                [class.dark:text-slate-300]="activeTab() !== 'electricos'"
                [class.hover:bg-slate-200]="activeTab() !== 'electricos'"
                [class.dark:hover:bg-slate-700]="activeTab() !== 'electricos'">
          <span>Vehículos Eléctricos</span>
        </button>

        <button (click)="activeTab.set('maquinaria')"
                class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                [class.bg-blue-600]="activeTab() === 'maquinaria'"
                [class.text-white]="activeTab() === 'maquinaria'"
                [class.bg-slate-100]="activeTab() !== 'maquinaria'"
                [class.dark:bg-slate-800]="activeTab() !== 'maquinaria'"
                [class.text-slate-600]="activeTab() !== 'maquinaria'"
                [class.dark:text-slate-300]="activeTab() !== 'maquinaria'"
                [class.hover:bg-slate-200]="activeTab() !== 'maquinaria'"
                [class.dark:hover:bg-slate-700]="activeTab() !== 'maquinaria'">
          <span>Maquinaria Pesada & Agrícola</span>
        </button>

        <button (click)="activeTab.set('transporte')"
                class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                [class.bg-blue-600]="activeTab() === 'transporte'"
                [class.text-white]="activeTab() === 'transporte'"
                [class.bg-slate-100]="activeTab() !== 'transporte'"
                [class.dark:bg-slate-800]="activeTab() !== 'transporte'"
                [class.text-slate-600]="activeTab() !== 'transporte'"
                [class.dark:text-slate-300]="activeTab() !== 'transporte'"
                [class.hover:bg-slate-200]="activeTab() !== 'transporte'"
                [class.dark:hover:bg-slate-700]="activeTab() !== 'transporte'">
          <span>Transporte Pesado / Camiones</span>
        </button>
      </div>

      <!-- Buscador y estadísticas rápidas -->
      <div class="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="relative w-full sm:max-w-xs">
          <input type="text" [(ngModel)]="searchQuery" placeholder="Buscar característica o grupo..."
                 class="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none shadow-2xs" />
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Mostrando {{ filteredGroups().length }} categorías / grupos de ficha técnica
        </div>
      </div>

      <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Formularios de Creación (Columna Izquierda) -->
        <div class="space-y-6">
          
          <!-- Crear Grupo -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span class="text-[10px] font-bold uppercase tracking-wider">Nuevo Grupo</span>
            </div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white">Crear Categoría / Grupo</h2>
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Ej. Seguridad, Confort, Batería & Carga, Operación Hidráulica.</p>
            
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Nombre del Grupo *</label>
                <input type="text" [(ngModel)]="newGroupName" placeholder="Ej. Seguridad y Frenos"
                       class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-2xs" />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Tipo de Vehículo Destino</label>
                <select [(ngModel)]="newGroupCategory"
                        class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none shadow-2xs">
                  <option value="todos">Todos los Vehículos (Universal)</option>
                  <option value="autos">Autos y Camionetas</option>
                  <option value="motos">Motocicletas</option>
                  <option value="electricos">Vehículos Eléctricos</option>
                  <option value="maquinaria">Maquinaria Pesada & Agrícola</option>
                  <option value="transporte">Transporte Pesado / Camiones</option>
                </select>
              </div>
              
              <button (click)="onCreateGroup()" [disabled]="!newGroupName().trim() || creatingGroup()"
                      class="w-full rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white py-2.5 text-xs font-bold transition-all disabled:opacity-50 shadow-2xs flex items-center justify-center gap-2 cursor-pointer">
                @if (creatingGroup()) {
                  <span class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>Guardando...</span>
                } @else {
                  <span>Crear Grupo</span>
                }
              </button>
            </div>
          </div>

          <!-- Crear Característica -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span class="text-[10px] font-bold uppercase tracking-wider">Nueva Especificación</span>
            </div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white">Crear Característica</h2>
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Agrega una especificación individual asignándola a un grupo.</p>
            
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Nombre de Característica *</label>
                <input type="text" [(ngModel)]="newSpecName" placeholder="Ej. Cámara 360°, Frenos ABS, Batería Blade"
                       class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-2xs" />
              </div>
              
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Grupo Asociado *</label>
                <select [(ngModel)]="newSpecGroupId"
                        class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none shadow-2xs">
                  <option [value]="0" disabled>-- Selecciona un grupo --</option>
                  @for (group of groups(); track group.id) {
                    <option [value]="group.id">{{ group.nombre }}</option>
                  }
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Ámbito de Vehículo</label>
                <select [(ngModel)]="newSpecCategory"
                        class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none shadow-2xs">
                  <option value="todos">Todos los Vehículos (Universal)</option>
                  <option value="autos">Autos y Camionetas</option>
                  <option value="motos">Motocicletas</option>
                  <option value="electricos">Vehículos Eléctricos</option>
                  <option value="maquinaria">Maquinaria Pesada & Agrícola</option>
                  <option value="transporte">Transporte Pesado / Camiones</option>
                </select>
              </div>

              <button (click)="onCreateSpec()" [disabled]="!newSpecName().trim() || !newSpecGroupId() || creatingSpec()"
                      class="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-2.5 text-xs font-bold transition-all disabled:opacity-50 shadow-2xs flex items-center justify-center gap-2 cursor-pointer">
                @if (creatingSpec()) {
                  <span class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>Guardando...</span>
                } @else {
                  <span>Crear Característica</span>
                }
              </button>
            </div>
          </div>

        </div>

        <!-- Listado de Grupos y Características (Columna Derecha) -->
        <div class="lg:col-span-2 space-y-6">
          
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-lg font-extrabold text-slate-900 dark:text-white">Estructura de la Ficha Técnica</h2>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Haz clic en los iconos para editar el texto o eliminar elementos.</p>
              </div>
              <button (click)="fetchData()" class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs" title="Recargar">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            @if (loading()) {
              <div class="py-16 flex justify-center">
                <span class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></span>
              </div>
            } @else {
              <div class="space-y-6">
                @for (group of filteredGroups(); track group.id) {
                  <div class="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/60 p-5 transition-all hover:border-slate-300 dark:hover:border-slate-700">
                    
                    <!-- Cabecera del Grupo -->
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800/80 pb-3 mb-4">
                      <div class="flex items-center gap-2.5">
                        <span class="h-2 w-2 rounded-full bg-blue-600"></span>
                        <h3 class="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                          {{ group.nombre }}
                        </h3>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                          {{ getCategoryBadge(group.categoriaVehiculo) }}
                        </span>
                        <span class="text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                          {{ group.especificaciones?.length || 0 }} specs
                        </span>
                      </div>

                      <div class="flex items-center gap-1.5 self-end sm:self-auto">
                        <!-- Editar Grupo -->
                        <button (click)="openEditGroupModal(group)" 
                                title="Editar nombre o categoría de este grupo"
                                class="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-2xs cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>

                        <!-- Eliminar Grupo -->
                        <button (click)="openDeleteGroupModal(group)" 
                                title="Eliminar este grupo y sus características"
                                class="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shadow-2xs cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Tags de Características -->
                    <div class="flex flex-wrap gap-2">
                      @for (spec of getSpecsForGroup(group); track spec.id) {
                        <div class="group inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
                          <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                          <span>{{ spec.nombre }}</span>
                          
                          @if (spec.categoriaVehiculo && spec.categoriaVehiculo !== 'todos' && spec.categoriaVehiculo !== group.categoriaVehiculo) {
                            <span class="text-[9px] px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-normal">
                              {{ spec.categoriaVehiculo }}
                            </span>
                          }

                          <div class="flex items-center gap-0.5 ml-1 border-l border-slate-100 dark:border-slate-800 pl-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <!-- Editar Spec -->
                            <button (click)="openEditSpecModal(spec)" 
                                    title="Editar característica"
                                    class="p-0.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors cursor-pointer">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>

                            <!-- Eliminar Spec -->
                            <button (click)="openDeleteSpecModal(spec)" 
                                    title="Eliminar característica"
                                    class="p-0.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors cursor-pointer">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      } @empty {
                        <span class="text-xs text-slate-400 dark:text-slate-500 italic py-1">No hay características registradas en este grupo para el filtro actual.</span>
                      }
                    </div>

                  </div>
                } @empty {
                  <div class="text-center py-16">
                    <p class="text-sm font-semibold text-slate-400 dark:text-slate-500">No se encontraron características que coincidan con la búsqueda o el filtro.</p>
                  </div>
                }
              </div>
            }

          </div>

        </div>

      </div>

    </div>

    <!-- MODAL EDITAR GRUPO (Fondo 100% transparente) -->
    @if (isEditGroupModalOpen()) {
      <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-transparent pointer-events-none">
        <div class="fixed inset-0 bg-transparent pointer-events-auto" (click)="closeEditGroupModal()"></div>

        <div class="relative z-10 pointer-events-auto w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-slate-800 animate-fade-in">
          
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="font-heading text-lg font-extrabold text-slate-900 dark:text-white">Editar Grupo de Ficha Técnica</h3>
            <button (click)="closeEditGroupModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mt-4 space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Nombre del Grupo *</label>
              <input type="text" [(ngModel)]="editGroupName" 
                     class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none shadow-2xs" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Tipo de Vehículo Destino</label>
              <select [(ngModel)]="editGroupCategory"
                      class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none shadow-2xs">
                <option value="todos">Todos los Vehículos (Universal)</option>
                <option value="autos">Autos y Camionetas</option>
                <option value="motos">Motocicletas</option>
                <option value="electricos">Vehículos Eléctricos</option>
                <option value="maquinaria">Maquinaria Pesada & Agrícola</option>
                <option value="transporte">Transporte Pesado / Camiones</option>
              </select>
            </div>

            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <button (click)="onSaveEditGroup()" [disabled]="savingGroup() || !editGroupName().trim()"
                      class="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-2.5 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer">
                @if (savingGroup()) {
                  <span class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>Guardando...</span>
                } @else {
                  <span>Guardar Cambios</span>
                }
              </button>
              <button (click)="closeEditGroupModal()" class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer">
                Cancelar
              </button>
            </div>
          </div>

        </div>
      </div>
    }

    <!-- MODAL EDITAR CARACTERÍSTICA (Fondo 100% transparente) -->
    @if (isEditSpecModalOpen()) {
      <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-transparent pointer-events-none">
        <div class="fixed inset-0 bg-transparent pointer-events-auto" (click)="closeEditSpecModal()"></div>

        <div class="relative z-10 pointer-events-auto w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-slate-800 animate-fade-in">
          
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="font-heading text-lg font-extrabold text-slate-900 dark:text-white">Editar Característica</h3>
            <button (click)="closeEditSpecModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mt-4 space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Nombre de Característica *</label>
              <input type="text" [(ngModel)]="editSpecName" 
                     class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none shadow-2xs" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Grupo Asociado *</label>
              <select [(ngModel)]="editSpecGroupId"
                      class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none shadow-2xs">
                @for (group of groups(); track group.id) {
                  <option [value]="group.id">{{ group.nombre }}</option>
                }
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Ámbito de Vehículo</label>
              <select [(ngModel)]="editSpecCategory"
                      class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none shadow-2xs">
                <option value="todos">Todos los Vehículos (Universal)</option>
                <option value="autos">Autos y Camionetas</option>
                <option value="motos">Motocicletas</option>
                <option value="electricos">Vehículos Eléctricos</option>
                <option value="maquinaria">Maquinaria Pesada & Agrícola</option>
                <option value="transporte">Transporte Pesado / Camiones</option>
              </select>
            </div>

            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <button (click)="onSaveEditSpec()" [disabled]="savingSpec() || !editSpecName().trim()"
                      class="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-2.5 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer">
                @if (savingSpec()) {
                  <span class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>Guardando...</span>
                } @else {
                  <span>Guardar Cambios</span>
                }
              </button>
              <button (click)="closeEditSpecModal()" class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer">
                Cancelar
              </button>
            </div>
          </div>

        </div>
      </div>
    }

    <!-- MODAL CONFIRMAR ELIMINACIÓN (Fondo 100% transparente) -->
    @if (isDeleteModalOpen() && deleteConfig()) {
      <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-transparent pointer-events-none">
        <div class="fixed inset-0 bg-transparent pointer-events-auto" (click)="closeDeleteModal()"></div>

        <div class="relative z-10 pointer-events-auto w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-slate-800 animate-fade-in">
          
          <div class="flex items-start gap-4">
            <div class="h-11 w-11 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <div>
              <h3 class="font-heading text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {{ deleteConfig()!.type === 'group' ? '¿Eliminar Grupo de Especificaciones?' : '¿Eliminar Característica?' }}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                @if (deleteConfig()!.type === 'group') {
                  Esta acción eliminará el grupo <strong>"{{ deleteConfig()!.name }}"</strong> y todas sus {{ deleteConfig()!.count || 0 }} características asociadas. Se desvinculará de los vehículos del catálogo de forma segura.
                } @else {
                  ¿Estás seguro de que deseas eliminar la característica <strong>"{{ deleteConfig()!.name }}"</strong>? Se desvinculará de cualquier vehículo que la tenga seleccionada.
                }
              </p>
            </div>
          </div>

          <div class="mt-6 flex gap-3">
            <button (click)="onExecuteDelete()" [disabled]="processingDelete()"
                    class="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white py-2.5 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
              @if (processingDelete()) {
                <span class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Eliminando...</span>
              } @else {
                <span>Confirmar Eliminación</span>
              }
            </button>

            <button (click)="closeDeleteModal()" [disabled]="processingDelete()"
                    class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer">
              Cancelar
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class SpecificationsAdminComponent implements OnInit {
  private readonly specService = inject(SpecificationService);

  protected readonly groups = signal<SpecificationGroup[]>([]);
  protected readonly loading = signal(true);

  // Filtros
  protected readonly activeTab = signal<VehicleCategoryTab>('todos');
  protected searchQuery = '';

  // Toasts
  protected readonly toastMessage = signal('');
  protected readonly toastType = signal<'success' | 'error'>('success');

  // Crear Grupo
  protected readonly newGroupName = signal('');
  protected readonly newGroupCategory = signal('todos');
  protected readonly creatingGroup = signal(false);

  // Crear Especificación
  protected readonly newSpecName = signal('');
  protected readonly newSpecGroupId = signal<number>(0);
  protected readonly newSpecCategory = signal('todos');
  protected readonly creatingSpec = signal(false);

  // Modal Editar Grupo
  protected readonly isEditGroupModalOpen = signal(false);
  protected readonly editingGroupId = signal<number | null>(null);
  protected readonly editGroupName = signal('');
  protected readonly editGroupCategory = signal('todos');
  protected readonly savingGroup = signal(false);

  // Modal Editar Característica
  protected readonly isEditSpecModalOpen = signal(false);
  protected readonly editingSpecId = signal<number | null>(null);
  protected readonly editSpecName = signal('');
  protected readonly editSpecGroupId = signal<number>(0);
  protected readonly editSpecCategory = signal('todos');
  protected readonly savingSpec = signal(false);

  // Modal Eliminar
  protected readonly isDeleteModalOpen = signal(false);
  protected readonly deleteConfig = signal<ConfirmDeleteConfig | null>(null);
  protected readonly processingDelete = signal(false);

  // Estadísticas y filtros computados
  protected readonly totalSpecsCount = computed(() => {
    return this.groups().reduce((acc, g) => acc + (g.especificaciones?.length || 0), 0);
  });

  protected readonly filteredGroups = computed(() => {
    const tab = this.activeTab();
    const query = this.searchQuery.trim().toLowerCase();
    const allGroups = this.groups();

    return allGroups
      .map(group => {
        const filteredSpecs = (group.especificaciones || []).filter(spec => {
          const matchTab = (tab === 'todos') ||
            (spec.categoriaVehiculo === 'todos' || !spec.categoriaVehiculo) ||
            (spec.categoriaVehiculo === tab) ||
            (group.categoriaVehiculo === tab);

          const matchQuery = !query || 
            spec.nombre.toLowerCase().includes(query) || 
            group.nombre.toLowerCase().includes(query);

          return matchTab && matchQuery;
        });

        return {
          ...group,
          filteredSpecs,
        };
      })
      .filter(group => {
        if (!this.searchQuery.trim() && tab === 'todos') return true;
        const groupMatchesQuery = !query || group.nombre.toLowerCase().includes(query);
        const groupMatchesTab = (tab === 'todos') || (group.categoriaVehiculo === 'todos' || !group.categoriaVehiculo || group.categoriaVehiculo === tab);
        return group.filteredSpecs.length > 0 || (groupMatchesQuery && groupMatchesTab);
      });
  });

  public ngOnInit(): void {
    this.fetchData();
  }

  protected async fetchData(): Promise<void> {
    this.loading.set(true);
    const groups = await this.specService.getGroups();
    this.groups.set(groups);
    if (groups.length > 0 && this.newSpecGroupId() === 0) {
      this.newSpecGroupId.set(groups[0].id);
    }
    this.loading.set(false);
  }

  protected getSpecsForGroup(group: any): Specification[] {
    return group.filteredSpecs !== undefined ? group.filteredSpecs : (group.especificaciones || []);
  }

  protected getCategoryBadge(categoria?: string): string {
    switch (categoria) {
      case 'autos': return 'Autos';
      case 'motos': return 'Motos';
      case 'electricos': return 'Eléctricos';
      case 'maquinaria': return 'Maquinaria';
      case 'transporte': return 'Transporte';
      default: return 'Universal';
    }
  }

  private showToast(msg: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage.set(msg);
    this.toastType.set(type);
    setTimeout(() => {
      if (this.toastMessage() === msg) {
        this.toastMessage.set('');
      }
    }, 4500);
  }

  // --- CREAR GRUPO ---
  protected async onCreateGroup(): Promise<void> {
    const nombre = this.newGroupName().trim();
    if (!nombre) return;

    this.creatingGroup.set(true);
    const res = await this.specService.createGroup(nombre, this.newGroupCategory());
    this.creatingGroup.set(false);

    if (res.success) {
      this.newGroupName.set('');
      this.showToast(`Grupo "${nombre}" creado exitosamente.`);
      await this.fetchData();
    } else {
      this.showToast(res.message || 'Error al crear el grupo.', 'error');
    }
  }

  // --- CREAR ESPECIFICACIÓN ---
  protected async onCreateSpec(): Promise<void> {
    const nombre = this.newSpecName().trim();
    const grupoId = this.newSpecGroupId();
    if (!nombre || !grupoId) return;

    this.creatingSpec.set(true);
    const res = await this.specService.createSpecification(nombre, grupoId, this.newSpecCategory());
    this.creatingSpec.set(false);

    if (res.success) {
      this.newSpecName.set('');
      this.showToast(`Característica "${nombre}" agregada exitosamente.`);
      await this.fetchData();
    } else {
      this.showToast(res.message || 'Error al crear la característica.', 'error');
    }
  }

  // --- EDITAR GRUPO ---
  protected openEditGroupModal(group: SpecificationGroup): void {
    this.editingGroupId.set(group.id);
    this.editGroupName.set(group.nombre);
    this.editGroupCategory.set(group.categoriaVehiculo || 'todos');
    this.isEditGroupModalOpen.set(true);
  }

  protected closeEditGroupModal(): void {
    this.isEditGroupModalOpen.set(false);
    this.editingGroupId.set(null);
  }

  protected async onSaveEditGroup(): Promise<void> {
    const id = this.editingGroupId();
    const nombre = this.editGroupName().trim();
    if (!id || !nombre) return;

    this.savingGroup.set(true);
    const res = await this.specService.updateGroup(id, {
      nombre,
      categoriaVehiculo: this.editGroupCategory(),
    });
    this.savingGroup.set(false);

    if (res.success) {
      this.closeEditGroupModal();
      this.showToast(`Grupo "${nombre}" actualizado.`);
      await this.fetchData();
    } else {
      this.showToast(res.message || 'Error al actualizar grupo.', 'error');
    }
  }

  // --- EDITAR ESPECIFICACIÓN ---
  protected openEditSpecModal(spec: Specification): void {
    this.editingSpecId.set(spec.id);
    this.editSpecName.set(spec.nombre);
    this.editSpecGroupId.set(spec.grupoId);
    this.editSpecCategory.set(spec.categoriaVehiculo || 'todos');
    this.isEditSpecModalOpen.set(true);
  }

  protected closeEditSpecModal(): void {
    this.isEditSpecModalOpen.set(false);
    this.editingSpecId.set(null);
  }

  protected async onSaveEditSpec(): Promise<void> {
    const id = this.editingSpecId();
    const nombre = this.editSpecName().trim();
    if (!id || !nombre) return;

    this.savingSpec.set(true);
    const res = await this.specService.updateSpec(id, {
      nombre,
      grupoId: this.editSpecGroupId(),
      categoriaVehiculo: this.editSpecCategory(),
    });
    this.savingSpec.set(false);

    if (res.success) {
      this.closeEditSpecModal();
      this.showToast(`Característica "${nombre}" actualizada.`);
      await this.fetchData();
    } else {
      this.showToast(res.message || 'Error al actualizar característica.', 'error');
    }
  }

  // --- ELIMINAR ---
  protected openDeleteGroupModal(group: SpecificationGroup): void {
    this.deleteConfig.set({
      type: 'group',
      id: group.id,
      name: group.nombre,
      count: group.especificaciones?.length || 0,
    });
    this.isDeleteModalOpen.set(true);
  }

  protected openDeleteSpecModal(spec: Specification): void {
    this.deleteConfig.set({
      type: 'spec',
      id: spec.id,
      name: spec.nombre,
    });
    this.isDeleteModalOpen.set(true);
  }

  protected closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.deleteConfig.set(null);
  }

  protected async onExecuteDelete(): Promise<void> {
    const config = this.deleteConfig();
    if (!config) return;

    this.processingDelete.set(true);
    if (config.type === 'group') {
      const res = await this.specService.deleteGroup(config.id);
      this.processingDelete.set(false);
      this.closeDeleteModal();
      if (res.success) {
        this.showToast(res.message || 'Grupo eliminado.');
        await this.fetchData();
      } else {
        this.showToast(res.message || 'Error al eliminar grupo.', 'error');
      }
    } else {
      const res = await this.specService.deleteSpec(config.id);
      this.processingDelete.set(false);
      this.closeDeleteModal();
      if (res.success) {
        this.showToast(res.message || 'Característica eliminada.');
        await this.fetchData();
      } else {
        this.showToast(res.message || 'Error al eliminar característica.', 'error');
      }
    }
  }
}
