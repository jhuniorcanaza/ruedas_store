import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { User } from '../../../core/models/user.model';
import { Vehicle } from '../../../core/models/vehicle.model';

type AccountTab = 'todos' | 'agente' | 'concesionaria' | 'cliente' | 'administrador';
type MainView = 'cuentas' | 'liquidaciones';

interface ConfirmModalConfig {
  action: 'toggle-status' | 'delete-user' | 'toggle-payment';
  user?: User;
  vehicle?: Vehicle;
  title: string;
  description: string;
  confirmBtnText: string;
  confirmBtnClass: string;
  iconType: 'warning' | 'danger' | 'success';
}

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <span class="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Directorio Corporativo</span>
          <h1 class="font-heading text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Gestión de Cuentas y Comisiones
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Administra accesos, roles y el control contable de pagos y liquidaciones comerciales.
          </p>
        </div>
        <div class="flex items-center gap-3">
          @if (mainView() === 'cuentas') {
            <button (click)="openCreateModal()" 
                    class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors shadow-sm gap-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Nueva Cuenta / Vendedor
            </button>
          }
          <a routerLink="/admin" class="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
            Volver al Panel
          </a>
        </div>
      </div>

      <!-- Toast Feedback Message -->
      @if (toastMessage()) {
        <div class="mt-4 p-4 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in"
             [class.bg-emerald-50]="toastType() === 'success'"
             [class.border-emerald-200]="toastType() === 'success'"
             [class.text-emerald-800]="toastType() === 'success'"
             [class.dark:bg-emerald-950/40]="toastType() === 'success'"
             [class.dark:border-emerald-800/60]="toastType() === 'success'"
             [class.dark:text-emerald-300]="toastType() === 'success'"
             [class.bg-rose-50]="toastType() === 'error'"
             [class.border-rose-200]="toastType() === 'error'"
             [class.text-rose-800]="toastType() === 'error'">
          <div class="flex items-center gap-2.5">
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
          <button (click)="toastMessage.set('')" class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }

      <!-- Pestañas Principales del Módulo: Cuentas vs Liquidaciones -->
      <div class="mt-6 flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button (click)="setMainView('cuentas')"
                class="px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer"
                [class.bg-blue-600]="mainView() === 'cuentas'"
                [class.text-white]="mainView() === 'cuentas'"
                [class.shadow-md]="mainView() === 'cuentas'"
                [class.bg-slate-100]="mainView() !== 'cuentas'"
                [class.dark:bg-slate-800]="mainView() !== 'cuentas'"
                [class.text-slate-600]="mainView() !== 'cuentas'"
                [class.dark:text-slate-300]="mainView() !== 'cuentas'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Directorio de Cuentas ({{ usersList().length }})</span>
        </button>

        <button (click)="setMainView('liquidaciones')"
                class="px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer"
                [class.bg-emerald-600]="mainView() === 'liquidaciones'"
                [class.text-white]="mainView() === 'liquidaciones'"
                [class.shadow-md]="mainView() === 'liquidaciones'"
                [class.bg-slate-100]="mainView() !== 'liquidaciones'"
                [class.dark:bg-slate-800]="mainView() !== 'liquidaciones'"
                [class.text-slate-600]="mainView() !== 'liquidaciones'"
                [class.dark:text-slate-300]="mainView() !== 'liquidaciones'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Control de Liquidaciones y Pagos</span>
          @if (pendingCount() > 0) {
            <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-900 animate-pulse">
              {{ pendingCount() }} Pendientes
            </span>
          }
        </button>
      </div>

      <!-- VISTA 1: DIRECTORIO DE CUENTAS -->
      @if (mainView() === 'cuentas') {
        
        <!-- Tarjeta Informativa de la Regla Comercial Activa -->
        <div class="mt-6 bg-gradient-to-r from-blue-900/10 via-blue-900/5 to-transparent dark:from-blue-950/40 dark:via-blue-950/20 border border-blue-200/80 dark:border-blue-900/60 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div>
            <div class="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <span class="h-2 w-2 rounded-full bg-blue-600 animate-ping"></span>
              <span class="text-[10px] uppercase font-extrabold tracking-widest">Esquema Oficial Vigente</span>
            </div>
            <h2 class="text-base font-extrabold text-slate-900 dark:text-white mt-1 font-heading">
              Comisión de Venta: 3.0% del Precio Concretado
            </h2>
            <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              <strong>15%</strong> Retención Concesionaria/Plataforma · <strong>85%</strong> Fondo de Asesores (100% venta propia / 50%-50% venta compartida). Los beneficios se liquidan por vehículo vendido en el cierre comercial.
            </p>
          </div>
          <button (click)="setMainView('liquidaciones')" 
                  class="rounded-xl border border-blue-300 dark:border-blue-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-blue-700 dark:text-blue-300 shadow-2xs hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shrink-0">
            <span>Ver Registro de Liquidaciones</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Quick Filter Tabs por Rol -->
        <div class="mt-6 flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button (click)="activeTab.set('todos')"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  [class.bg-blue-600]="activeTab() === 'todos'"
                  [class.text-white]="activeTab() === 'todos'"
                  [class.bg-slate-100]="activeTab() !== 'todos'"
                  [class.dark:bg-slate-800]="activeTab() !== 'todos'"
                  [class.text-slate-600]="activeTab() !== 'todos'"
                  [class.dark:text-slate-300]="activeTab() !== 'todos'">
            <span>Todas las Cuentas</span>
            <span class="px-1.5 py-0.5 rounded-full text-[10px]"
                  [class.bg-blue-700]="activeTab() === 'todos'"
                  [class.bg-slate-200]="activeTab() !== 'todos'"
                  [class.dark:bg-slate-700]="activeTab() !== 'todos'">
              {{ usersList().length }}
            </span>
          </button>

          <button (click)="activeTab.set('agente')"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  [class.bg-blue-600]="activeTab() === 'agente'"
                  [class.text-white]="activeTab() === 'agente'"
                  [class.bg-slate-100]="activeTab() !== 'agente'"
                  [class.dark:bg-slate-800]="activeTab() !== 'agente'"
                  [class.text-slate-600]="activeTab() !== 'agente'"
                  [class.dark:text-slate-300]="activeTab() !== 'agente'">
            <span>Agentes / Vendedores</span>
            <span class="px-1.5 py-0.5 rounded-full text-[10px]"
                  [class.bg-blue-700]="activeTab() === 'agente'"
                  [class.bg-slate-200]="activeTab() !== 'agente'"
                  [class.dark:bg-slate-700]="activeTab() !== 'agente'">
              {{ countByRole('agente') }}
            </span>
          </button>

          <button (click)="activeTab.set('concesionaria')"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  [class.bg-blue-600]="activeTab() === 'concesionaria'"
                  [class.text-white]="activeTab() === 'concesionaria'"
                  [class.bg-slate-100]="activeTab() !== 'concesionaria'"
                  [class.dark:bg-slate-800]="activeTab() !== 'concesionaria'"
                  [class.text-slate-600]="activeTab() !== 'concesionaria'"
                  [class.dark:text-slate-300]="activeTab() !== 'concesionaria'">
            <span>Concesionarias</span>
            <span class="px-1.5 py-0.5 rounded-full text-[10px]"
                  [class.bg-blue-700]="activeTab() === 'concesionaria'"
                  [class.bg-slate-200]="activeTab() !== 'concesionaria'"
                  [class.dark:bg-slate-700]="activeTab() !== 'concesionaria'">
              {{ countByRole('concesionaria') }}
            </span>
          </button>

          <button (click)="activeTab.set('cliente')"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  [class.bg-blue-600]="activeTab() === 'cliente'"
                  [class.text-white]="activeTab() === 'cliente'"
                  [class.bg-slate-100]="activeTab() !== 'cliente'"
                  [class.dark:bg-slate-800]="activeTab() !== 'cliente'"
                  [class.text-slate-600]="activeTab() !== 'cliente'"
                  [class.dark:text-slate-300]="activeTab() !== 'cliente'">
            <span>Clientes</span>
            <span class="px-1.5 py-0.5 rounded-full text-[10px]"
                  [class.bg-blue-700]="activeTab() === 'cliente'"
                  [class.bg-slate-200]="activeTab() !== 'cliente'"
                  [class.dark:bg-slate-700]="activeTab() !== 'cliente'">
              {{ countByRole('cliente') }}
            </span>
          </button>

          <button (click)="activeTab.set('administrador')"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  [class.bg-blue-600]="activeTab() === 'administrador'"
                  [class.text-white]="activeTab() === 'administrador'"
                  [class.bg-slate-100]="activeTab() !== 'administrador'"
                  [class.dark:bg-slate-800]="activeTab() !== 'administrador'"
                  [class.text-slate-600]="activeTab() !== 'administrador'"
                  [class.dark:text-slate-300]="activeTab() !== 'administrador'">
            <span>Administradores</span>
            <span class="px-1.5 py-0.5 rounded-full text-[10px]"
                  [class.bg-blue-700]="activeTab() === 'administrador'"
                  [class.bg-slate-200]="activeTab() !== 'administrador'"
                  [class.dark:bg-slate-700]="activeTab() !== 'administrador'">
              {{ countByRole('administrador') }}
            </span>
          </button>
        </div>

        <!-- Search Bar -->
        <div class="mt-4 flex items-center justify-between gap-4">
          <div class="relative flex-1 max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" [(ngModel)]="searchQuery" placeholder="Buscar por nombre o correo..." 
                   class="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs" />
          </div>
          <span class="text-xs text-slate-400">Mostrando {{ filteredUsers().length }} cuentas registradas</span>
        </div>

        <!-- Accounts Table -->
        <div class="mt-4">
          @if (loading()) {
            <div class="py-16 flex flex-col items-center justify-center gap-3">
              <span class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></span>
              <span class="text-xs text-slate-400">Cargando directorio de cuentas...</span>
            </div>
          } @else {
            <div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                  <thead class="bg-slate-50 dark:bg-slate-950/60">
                    <tr>
                      <th class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre / Contacto</th>
                      <th class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rol de Cuenta</th>
                      <th class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Concesionaria Asociada</th>
                      <th class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Beneficios Acumulados</th>
                      <th class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado de Acceso</th>
                      <th class="px-6 py-3.5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operaciones</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    @for (user of filteredUsers(); track user.id) {
                      <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td class="whitespace-nowrap px-6 py-4">
                          <div class="flex items-center gap-3">
                            <div class="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs"
                                 [class.bg-blue-100]="user.rol === 'agente'"
                                 [class.text-blue-700]="user.rol === 'agente'"
                                 [class.dark:bg-blue-950]="user.rol === 'agente'"
                                 [class.dark:text-blue-300]="user.rol === 'agente'"
                                 [class.bg-indigo-100]="user.rol === 'concesionaria'"
                                 [class.text-indigo-700]="user.rol === 'concesionaria'"
                                 [class.dark:bg-indigo-950]="user.rol === 'concesionaria'"
                                 [class.dark:text-indigo-300]="user.rol === 'concesionaria'"
                                 [class.bg-amber-100]="user.rol === 'admin' || user.rol === 'administrador'"
                                 [class.text-amber-800]="user.rol === 'admin' || user.rol === 'administrador'"
                                 [class.dark:bg-amber-950]="user.rol === 'admin' || user.rol === 'administrador'"
                                 [class.dark:text-amber-300]="user.rol === 'admin' || user.rol === 'administrador'"
                                 [class.bg-slate-100]="user.rol === 'cliente'"
                                 [class.text-slate-700]="user.rol === 'cliente'"
                                 [class.dark:bg-slate-800]="user.rol === 'cliente'"
                                 [class.dark:text-slate-300]="user.rol === 'cliente'">
                              {{ user.nombre.charAt(0).toUpperCase() }}
                            </div>
                            <div class="min-w-0">
                              <div class="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                                {{ user.nombre }}
                              </div>
                              <div class="text-[11px] text-slate-400 dark:text-slate-500 truncate">{{ user.email }}</div>
                            </div>
                          </div>
                        </td>

                        <td class="whitespace-nowrap px-6 py-4">
                          <span class="inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-bold capitalize"
                                [class.bg-blue-50]="user.rol === 'agente'"
                                [class.text-blue-700]="user.rol === 'agente'"
                                [class.dark:bg-blue-950/40]="user.rol === 'agente'"
                                [class.dark:text-blue-300]="user.rol === 'agente'"
                                [class.bg-indigo-50]="user.rol === 'concesionaria'"
                                [class.text-indigo-700]="user.rol === 'concesionaria'"
                                [class.dark:bg-indigo-950/40]="user.rol === 'concesionaria'"
                                [class.dark:text-indigo-300]="user.rol === 'concesionaria'"
                                [class.bg-purple-50]="user.rol === 'admin' || user.rol === 'administrador'"
                                [class.text-purple-700]="user.rol === 'admin' || user.rol === 'administrador'"
                                [class.dark:bg-purple-950/40]="user.rol === 'admin' || user.rol === 'administrador'"
                                [class.dark:text-purple-300]="user.rol === 'admin' || user.rol === 'administrador'"
                                [class.bg-slate-100]="user.rol === 'cliente'"
                                [class.text-slate-700]="user.rol === 'cliente'"
                                [class.dark:bg-slate-800]="user.rol === 'cliente'"
                                [class.dark:text-slate-300]="user.rol === 'cliente'">
                            {{ getRoleLabel(user.rol) }}
                          </span>
                        </td>

                        <td class="whitespace-nowrap px-6 py-4 text-xs">
                          @if (user.rol === 'agente') {
                            @if (user.concesionaria) {
                              <span class="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {{ user.concesionaria.nombre }}
                              </span>
                            } @else {
                              <span class="inline-flex items-center rounded-md bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                                Sin asignar
                              </span>
                            }
                          } @else {
                            <span class="text-slate-400 text-xs italic">No aplica</span>
                          }
                        </td>

                        <td class="whitespace-nowrap px-6 py-4 text-xs font-black">
                          @if (user.rol === 'agente') {
                            <span class="text-emerald-600 dark:text-emerald-400 font-bold">
                              {{ (user.beneficios || 0) | currency:'USD':'$':'1.2-2' }}
                            </span>
                          } @else {
                            <span class="text-slate-400 text-xs italic">No aplica</span>
                          }
                        </td>

                        <td class="whitespace-nowrap px-6 py-4">
                          <button (click)="promptToggleUserStatus(user)"
                                  [disabled]="updatingUserId() === user.id"
                                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition-all border cursor-pointer"
                                  [class.bg-emerald-50]="user.activo !== false"
                                  [class.text-emerald-700]="user.activo !== false"
                                  [class.border-emerald-200]="user.activo !== false"
                                  [class.dark:bg-emerald-950/40]="user.activo !== false"
                                  [class.dark:text-emerald-300]="user.activo !== false"
                                  [class.dark:border-emerald-900]="user.activo !== false"
                                  [class.bg-rose-50]="user.activo === false"
                                  [class.text-rose-700]="user.activo === false"
                                  [class.border-rose-200]="user.activo === false"
                                  [class.dark:bg-rose-950/40]="user.activo === false"
                                  [class.dark:text-rose-300]="user.activo === false"
                                  [class.dark:border-rose-900]="user.activo === false">
                            <span class="h-1.5 w-1.5 rounded-full"
                                  [class.bg-emerald-500]="user.activo !== false"
                                  [class.bg-rose-500]="user.activo === false"></span>
                            {{ user.activo !== false ? 'Activo' : 'Suspendido' }}
                          </button>
                        </td>

                        <td class="whitespace-nowrap px-6 py-4 text-right space-x-1.5">
                          <button (click)="openEditModal(user)"
                                  class="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                                  title="Editar perfil">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>

                          <button (click)="promptDeleteUser(user)"
                                  class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                                  title="Eliminar cuenta">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>

      }

      <!-- VISTA 2: BANDEJA DE LIQUIDACIONES Y CONTROL DE PAGOS -->
      @if (mainView() === 'liquidaciones') {
        
        <!-- KPI Metrics Grid -->
        <div class="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Volumen de Ventas</span>
            <span class="text-2xl font-black text-slate-900 dark:text-white block mt-1">
              {{ totalSalesVolume() | currency:'USD':'$':'1.0-0' }}
            </span>
            <span class="text-[11px] text-slate-500 mt-1 block">{{ liquidationsList().length }} vehículos vendidos</span>
          </div>

          <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Comisión Total (3%)</span>
            <span class="text-2xl font-black text-blue-600 dark:text-blue-400 block mt-1">
              {{ totalCommissions() | currency:'USD':'$':'1.2-2' }}
            </span>
            <span class="text-[11px] text-slate-500 mt-1 block">3% bruto generado</span>
          </div>

          <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Retención Empresa (15%)</span>
            <span class="text-2xl font-black text-purple-600 dark:text-purple-400 block mt-1">
              {{ totalCompanyRetention() | currency:'USD':'$':'1.2-2' }}
            </span>
            <span class="text-[11px] text-slate-500 mt-1 block">Margen plataforma</span>
          </div>

          <div class="p-5 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 shadow-sm">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block tracking-wider">Fondo Agentes (85%)</span>
              <span class="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                {{ pendingAmount() | currency:'USD':'$':'1.0-0' }} pendiente
              </span>
            </div>
            <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">
              {{ totalAgentsPool() | currency:'USD':'$':'1.2-2' }}
            </span>
            <span class="text-[11px] text-emerald-700 dark:text-emerald-500 mt-1 block">
              {{ paidCount() }} pagadas · {{ pendingCount() }} por pagar
            </span>
          </div>

        </div>

        <!-- Table of Liquidations -->
        <div class="mt-6">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Historial de Ventas y Liquidaciones Comerciales
            </h3>
            <span class="text-xs text-slate-400">{{ liquidationsList().length }} operaciones registradas</span>
          </div>

          @if (loadingLiquidations()) {
            <div class="py-16 flex flex-col items-center justify-center gap-3">
              <span class="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full"></span>
              <span class="text-xs text-slate-400">Cargando liquidaciones contables...</span>
            </div>
          } @else if (liquidationsList().length === 0) {
            <div class="p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h4 class="mt-3 text-sm font-bold text-slate-800 dark:text-white">Aún no hay ventas cerradas</h4>
              <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Cuando tú o los agentes marquen un vehículo como "Vendido" desde el panel o "Mis Publicaciones", aparecerá automáticamente el desglose contable aquí.
              </p>
            </div>
          } @else {
            
            <div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                  <thead class="bg-slate-50 dark:bg-slate-950/60">
                    <tr>
                      <th class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehículo / Venta</th>
                      <th class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precio Cierre</th>
                      <th class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">3% Comisión</th>
                      <th class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">15% Plataforma</th>
                      <th class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Agentes Asignados</th>
                      <th class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado de Pago</th>
                      <th class="px-6 py-3.5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operación Contable</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    @for (v of liquidationsList(); track v.id) {
                      <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        
                        <!-- Vehículo -->
                        <td class="whitespace-nowrap px-6 py-4">
                          <div class="flex items-center gap-3">
                            <div class="h-10 w-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                              <img [src]="v.imagenPrincipal" [alt]="v.nombre" class="h-full w-full object-cover" />
                            </div>
                            <div>
                              <div class="text-xs font-bold text-slate-900 dark:text-white">{{ v.nombre }}</div>
                              <div class="text-[11px] text-slate-400">Vendido el {{ v.fechaVenta || v.fechaIngreso }}</div>
                            </div>
                          </div>
                        </td>

                        <!-- Precio -->
                        <td class="whitespace-nowrap px-6 py-4 text-xs font-black text-slate-900 dark:text-white">
                          {{ v.precio | currency:(v.moneda || 'USD'):((v.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.0-0' }}
                        </td>

                        <!-- 3% Comisión -->
                        <td class="whitespace-nowrap px-6 py-4 text-xs font-black text-blue-600 dark:text-blue-400">
                          {{ v.comisionTotal | currency:(v.moneda || 'USD'):((v.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.2-2' }}
                        </td>

                        <!-- 15% Dealer -->
                        <td class="whitespace-nowrap px-6 py-4 text-xs font-black text-purple-600 dark:text-purple-400">
                          {{ v.comisionRetencion | currency:(v.moneda || 'USD'):((v.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.2-2' }}
                        </td>

                        <!-- Agentes Asignados -->
                        <td class="whitespace-nowrap px-6 py-4">
                          <div class="space-y-1">
                            <!-- Captador -->
                            <div class="text-xs flex items-center gap-1.5">
                              <span class="text-[10px] font-bold text-slate-400 uppercase">Captador:</span>
                              <span class="font-bold text-slate-800 dark:text-slate-200">{{ v.user?.nombre || 'Empresa' }}</span>
                              <span class="text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px]">
                                (+{{ v.comisionCaptador | currency:(v.moneda || 'USD'):((v.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.2-2' }})
                              </span>
                            </div>

                            <!-- Vendedor -->
                            @if (v.vendedorId && v.vendedorId !== v.userId) {
                              <div class="text-xs flex items-center gap-1.5">
                                <span class="text-[10px] font-bold text-slate-400 uppercase">Vendedor:</span>
                                <span class="font-bold text-slate-800 dark:text-slate-200">{{ v.vendedor?.nombre || 'Co-vendedor' }}</span>
                                <span class="text-blue-600 dark:text-blue-400 font-extrabold text-[11px]">
                                  (+{{ v.comisionVendedor | currency:(v.moneda || 'USD'):((v.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.2-2' }})
                                </span>
                              </div>
                            } @else {
                              <span class="text-[10px] font-bold text-slate-400 italic">Venta directa propia (100% fondo)</span>
                            }
                          </div>
                        </td>

                        <!-- Estado de Pago al Agente -->
                        <td class="whitespace-nowrap px-6 py-4">
                          @if (v.comisionPagada) {
                            <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                              </svg>
                              Pagado al Asesor
                            </span>
                            @if (v.fechaPagoComision) {
                              <span class="block text-[10px] text-slate-400 mt-0.5">Liq: {{ v.fechaPagoComision }}</span>
                            }
                          } @else {
                            <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse">
                              <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                              Pendiente de Pago
                            </span>
                          }
                        </td>

                        <!-- Operación Contable -->
                        <td class="whitespace-nowrap px-6 py-4 text-right">
                          <div class="flex items-center justify-end gap-2">
                            <button (click)="promptToggleCommissionPayment(v)"
                                    [disabled]="updatingPaymentId() === v.id"
                                    class="rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                    [class.bg-emerald-600]="!v.comisionPagada"
                                    [class.hover:bg-emerald-500]="!v.comisionPagada"
                                    [class.text-white]="!v.comisionPagada"
                                    [class.bg-slate-100]="v.comisionPagada"
                                    [class.dark:bg-slate-800]="v.comisionPagada"
                                    [class.text-slate-600]="v.comisionPagada"
                                    [class.dark:text-slate-300]="v.comisionPagada">
                              @if (updatingPaymentId() === v.id) {
                                <span class="animate-spin h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full"></span>
                              } @else if (!v.comisionPagada) {
                                <span>Marcar como Pagado</span>
                              } @else {
                                <span>Revertir a Pendiente</span>
                              }
                            </button>

                            <button (click)="openReceiptModal(v)" 
                                    class="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                    title="Ver Comprobante de Liquidación">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
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

      }

    </div>

    <!-- MODAL DE RECIBO / COMPROBANTE DE LIQUIDACIÓN -->
    @if (receiptTarget()) {
      <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-transparent pointer-events-none">
        <div class="fixed inset-0 bg-transparent pointer-events-auto" (click)="closeReceiptModal()"></div>
        <div class="relative z-10 pointer-events-auto w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 animate-fade-in">
          
          <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Comprobante Oficial</span>
              <h3 class="text-base font-extrabold text-slate-900 dark:text-white font-heading">
                Liquidación Contable de Comisión
              </h3>
            </div>
            <button (click)="closeReceiptModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs">
            <div class="flex justify-between">
              <span class="text-slate-500">Vehículo:</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ receiptTarget()!.nombre }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Precio de Cierre:</span>
              <span class="font-black text-slate-900 dark:text-white">
                {{ receiptTarget()!.precio | currency:(receiptTarget()!.moneda || 'USD'):((receiptTarget()!.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.0-0' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Fecha de Cierre:</span>
              <span class="font-bold text-slate-700 dark:text-slate-300">{{ receiptTarget()!.fechaVenta }}</span>
            </div>
            <div class="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
              <span class="text-slate-500 font-bold">Comisión Total (3%):</span>
              <span class="font-black text-blue-600 dark:text-blue-400">
                {{ receiptTarget()!.comisionTotal | currency:(receiptTarget()!.moneda || 'USD'):((receiptTarget()!.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.2-2' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Retención Plataforma (15%):</span>
              <span class="font-black text-purple-600 dark:text-purple-400">
                {{ receiptTarget()!.comisionRetencion | currency:(receiptTarget()!.moneda || 'USD'):((receiptTarget()!.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.2-2' }}
              </span>
            </div>
            <div class="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
              <span class="text-slate-500">Ganancia Captador ({{ receiptTarget()!.user?.nombre }}):</span>
              <span class="font-black text-emerald-600 dark:text-emerald-400">
                {{ receiptTarget()!.comisionCaptador | currency:(receiptTarget()!.moneda || 'USD'):((receiptTarget()!.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.2-2' }}
              </span>
            </div>
            @if (receiptTarget()!.vendedorId && receiptTarget()!.vendedorId !== receiptTarget()!.userId) {
              <div class="flex justify-between">
                <span class="text-slate-500">Ganancia Vendedor ({{ receiptTarget()!.vendedor?.nombre }}):</span>
                <span class="font-black text-blue-600 dark:text-blue-400">
                  {{ receiptTarget()!.comisionVendedor | currency:(receiptTarget()!.moneda || 'USD'):((receiptTarget()!.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.2-2' }}
                </span>
              </div>
            }
            <div class="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 items-center">
              <span class="text-slate-500 font-bold">Estado del Pago:</span>
              <span class="font-black text-xs" [class.text-emerald-600]="receiptTarget()!.comisionPagada" [class.text-amber-600]="!receiptTarget()!.comisionPagada">
                {{ receiptTarget()!.comisionPagada ? 'PAGADO AL ASESOR' : 'PENDIENTE DE PAGO' }}
              </span>
            </div>
          </div>

          <div class="mt-5 flex justify-end">
            <button (click)="closeReceiptModal()" 
                    class="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 text-xs font-bold shadow transition-colors cursor-pointer">
              Cerrar Comprobante
            </button>
          </div>

        </div>
      </div>
    }

    <!-- MODAL CONFIRMACIÓN (Cambio Estado / Eliminación / Pago) -->
    @if (isConfirmModalOpen() && confirmModalConfig()) {
      <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-transparent pointer-events-none">
        <div class="fixed inset-0 bg-transparent pointer-events-auto" (click)="closeConfirmModal()"></div>

        <div class="relative z-10 pointer-events-auto w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-slate-800 animate-fade-in">
          
          <div class="flex items-start gap-4">
            <div class="h-11 w-11 rounded-2xl flex items-center justify-center shrink-0"
                 [class.bg-amber-50]="confirmModalConfig()!.iconType === 'warning'"
                 [class.dark:bg-amber-950/40]="confirmModalConfig()!.iconType === 'warning'"
                 [class.text-amber-600]="confirmModalConfig()!.iconType === 'warning'"
                 [class.dark:text-amber-400]="confirmModalConfig()!.iconType === 'warning'"
                 [class.bg-rose-50]="confirmModalConfig()!.iconType === 'danger'"
                 [class.dark:bg-rose-950/40]="confirmModalConfig()!.iconType === 'danger'"
                 [class.text-rose-600]="confirmModalConfig()!.iconType === 'danger'"
                 [class.dark:text-rose-400]="confirmModalConfig()!.iconType === 'danger'"
                 [class.bg-emerald-50]="confirmModalConfig()!.iconType === 'success'"
                 [class.dark:bg-emerald-950/40]="confirmModalConfig()!.iconType === 'success'"
                 [class.text-emerald-600]="confirmModalConfig()!.iconType === 'success'"
                 [class.dark:text-emerald-400]="confirmModalConfig()!.iconType === 'success'">
              @if (confirmModalConfig()!.iconType === 'warning') {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              } @else if (confirmModalConfig()!.iconType === 'danger') {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            </div>

            <div>
              <h3 class="font-heading text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {{ confirmModalConfig()!.title }}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {{ confirmModalConfig()!.description }}
              </p>
            </div>
          </div>

          <div class="mt-6 flex gap-3">
            <button type="button" 
                    (click)="onExecuteConfirmAction()" 
                    [disabled]="processingConfirm()"
                    class="flex-1 rounded-xl py-3 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    [class]="confirmModalConfig()!.confirmBtnClass">
              @if (processingConfirm()) {
                <span class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Procesando...</span>
              } @else {
                <span>{{ confirmModalConfig()!.confirmBtnText }}</span>
              }
            </button>
            <button type="button" 
                    (click)="closeConfirmModal()" 
                    [disabled]="processingConfirm()"
                    class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer">
              Cancelar
            </button>
          </div>

        </div>
      </div>
    }

    <!-- MODAL: Crear Usuario -->
    @if (isCreateModalOpen()) {
      <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-transparent pointer-events-none">
        <div class="fixed inset-0 bg-transparent pointer-events-auto" (click)="closeCreateModal()"></div>

        <div class="relative z-10 pointer-events-auto w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-slate-800 animate-fade-in">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 class="font-heading text-lg font-bold text-slate-900 dark:text-white">Nueva Cuenta de Usuario</h3>
              <p class="text-xs text-slate-400 mt-0.5">Registra un nuevo agente, concesionaria o administrador</p>
            </div>
            <button type="button" (click)="closeCreateModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          @if (createError()) {
            <div class="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ createError() }}</span>
            </div>
          }

          <form (ngSubmit)="onCreateUserSubmit()" class="mt-6 space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Nombre Completo *</label>
              <input type="text" [ngModel]="newName()" (ngModelChange)="newName.set($event)" name="newName" placeholder="Ej. Carlos Méndez o AutoCorp SRL" required
                     class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-sm" />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Correo Electrónico *</label>
              <input type="email" [ngModel]="newEmail()" (ngModelChange)="newEmail.set($event)" name="newEmail" placeholder="Ej. carlos@concesionaria.com" required
                     class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-sm" />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Contraseña Inicial *</label>
              <input type="password" [ngModel]="newPassword()" (ngModelChange)="newPassword.set($event)" name="newPassword" placeholder="Mínimo 6 caracteres" required minlength="6"
                     class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-sm" />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Rol de Cuenta *</label>
              <select [ngModel]="newRole()" (ngModelChange)="newRole.set($event)" name="newRole"
                      class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white font-semibold focus:border-blue-500 focus:outline-none shadow-sm">
                <option value="agente">Agente / Vendedor (recibe comisiones de venta)</option>
                <option value="concesionaria">Concesionaria (asigna y administra sus agentes)</option>
                <option value="administrador">Administrador (control total de la plataforma)</option>
                <option value="cliente">Cliente (usuario particular)</option>
              </select>
            </div>

            @if (newRole() === 'agente') {
              <div class="rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-4 space-y-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">Concesionaria Asociada</label>
                <select [ngModel]="newConcesionariaId()" (ngModelChange)="newConcesionariaId.set($event)" name="newConcesionariaId"
                        class="w-full rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white font-semibold focus:border-blue-500 focus:outline-none shadow-sm">
                  <option value="">(Sin asignar / Independiente)</option>
                  @for (c of concesionariasList(); track c.id) {
                    <option [value]="c.id">{{ c.nombre }}</option>
                  }
                </select>
                <p class="text-[11px] text-blue-700 dark:text-blue-400">Permite vincular este agente a una concesionaria para centralizar sus ventas e inventario.</p>
              </div>
            }

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <button type="submit" [disabled]="creatingUser()"
                      class="flex-1 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-500 transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                @if (creatingUser()) {
                  <span class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>Creando cuenta...</span>
                } @else {
                  <span>Registrar Cuenta</span>
                }
              </button>
              <button type="button" (click)="closeCreateModal()" [disabled]="creatingUser()"
                      class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- MODAL: Editar Cuenta -->
    @if (isEditModalOpen()) {
      <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-transparent pointer-events-none">
        <div class="fixed inset-0 bg-transparent pointer-events-auto" (click)="closeEditModal()"></div>

        <div class="relative z-10 pointer-events-auto w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-slate-800 animate-fade-in max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 class="font-heading text-lg font-bold text-slate-900 dark:text-white">Editar Cuenta</h3>
              <p class="text-xs text-slate-400 mt-0.5">{{ editEmail() }}</p>
            </div>
            <button type="button" (click)="closeEditModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          @if (editError()) {
            <div class="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ editError() }}</span>
            </div>
          }

          <form (ngSubmit)="onEditUserSubmit()" class="mt-6 space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Nombre Completo *</label>
              <input type="text" [ngModel]="editName()" (ngModelChange)="editName.set($event)" name="editName" required
                     class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none shadow-sm" />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Rol de Cuenta *</label>
              <select [ngModel]="editRole()" (ngModelChange)="editRole.set($event)" name="editRole"
                      class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white font-semibold focus:border-blue-500 focus:outline-none shadow-sm">
                <option value="agente">Agente / Vendedor</option>
                <option value="concesionaria">Concesionaria</option>
                <option value="administrador">Administrador</option>
                <option value="cliente">Cliente</option>
              </select>
            </div>

            @if (editRole() === 'agente') {
              <div class="rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-4 space-y-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">Concesionaria Asociada</label>
                <select [ngModel]="editConcesionariaId()" (ngModelChange)="editConcesionariaId.set($event)" name="editConcesionariaId"
                        class="w-full rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white font-semibold focus:border-blue-500 focus:outline-none shadow-sm">
                  <option value="">(Sin asignar / Independiente)</option>
                  @for (c of concesionariasList(); track c.id) {
                    <option [value]="c.id">{{ c.nombre }}</option>
                  }
                </select>
              </div>
            }

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Saldo de Beneficios (USD)</label>
              <input type="number" [ngModel]="editBeneficios()" (ngModelChange)="editBeneficios.set($event)" name="editBeneficios"
                     class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white font-bold focus:border-blue-500 focus:outline-none shadow-sm" />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Nueva Contraseña (Opcional)</label>
              <input type="password" [ngModel]="editNewPassword()" (ngModelChange)="editNewPassword.set($event)" name="editNewPassword" placeholder="Dejar en blanco para mantener actual"
                     class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none shadow-sm" />
            </div>

            <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Estado de Cuenta</span>
              <button type="button" (click)="editActivo.set(!editActivo())"
                      class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer"
                      [class.bg-emerald-600]="editActivo()"
                      [class.text-white]="editActivo()"
                      [class.border-emerald-600]="editActivo()"
                      [class.bg-slate-700]="!editActivo()"
                      [class.text-white]="!editActivo()"
                      [class.border-slate-700]="!editActivo()">
                {{ editActivo() ? 'Cuenta Activa' : 'Cuenta Suspendida' }}
              </button>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <button type="submit" [disabled]="savingEdit()"
                      class="flex-1 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-500 transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                @if (savingEdit()) {
                  <span class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>Guardando...</span>
                } @else {
                  <span>Guardar Cambios</span>
                }
              </button>
              <button type="button" (click)="closeEditModal()" [disabled]="savingEdit()"
                      class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    }

  `
})
export class UsersAdminComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly vehicleService = inject(VehicleService);

  // Main view switcher: 'cuentas' | 'liquidaciones'
  protected readonly mainView = signal<MainView>('cuentas');

  // Cuentas state
  protected readonly usersList = signal<User[]>([]);
  protected readonly concesionariasList = signal<User[]>([]);
  protected readonly loading = signal(true);
  protected readonly updatingUserId = signal<string | null>(null);

  // Liquidaciones state
  protected readonly liquidationsList = signal<Vehicle[]>([]);
  protected readonly loadingLiquidations = signal(false);
  protected readonly updatingPaymentId = signal<string | null>(null);
  protected readonly receiptTarget = signal<Vehicle | null>(null);

  // Toasts
  protected readonly toastMessage = signal('');
  protected readonly toastType = signal<'success' | 'error'>('success');

  // Pestañas de filtro por rol
  protected readonly activeTab = signal<AccountTab>('todos');
  protected searchQuery = '';

  // Pop-up Modal de Confirmación Elegante
  protected readonly isConfirmModalOpen = signal(false);
  protected readonly confirmModalConfig = signal<ConfirmModalConfig | null>(null);
  protected readonly processingConfirm = signal(false);

  // Modal de Creación
  protected readonly isCreateModalOpen = signal(false);
  protected readonly creatingUser = signal(false);
  protected readonly createError = signal('');
  protected readonly newName = signal('');
  protected readonly newEmail = signal('');
  protected readonly newPassword = signal('');
  protected readonly newRole = signal<'agente' | 'concesionaria' | 'administrador' | 'cliente'>('agente');
  protected readonly newConcesionariaId = signal('');

  // Modal de Edición
  protected readonly isEditModalOpen = signal(false);
  protected readonly savingEdit = signal(false);
  protected readonly editError = signal('');
  protected readonly editingUserId = signal<string | null>(null);
  protected readonly editName = signal('');
  protected readonly editEmail = signal('');
  protected readonly editRole = signal<'agente' | 'concesionaria' | 'administrador' | 'cliente'>('agente');
  protected readonly editConcesionariaId = signal('');
  protected readonly editBeneficios = signal(0);
  protected readonly editNewPassword = signal('');
  protected readonly editActivo = signal(true);

  // Computed metrics para Liquidaciones
  protected readonly totalSalesVolume = computed(() => {
    return this.liquidationsList().reduce((acc, v) => acc + Number(v.precio || 0), 0);
  });

  protected readonly totalCommissions = computed(() => {
    return this.liquidationsList().reduce((acc, v) => acc + Number(v.comisionTotal || 0), 0);
  });

  protected readonly totalCompanyRetention = computed(() => {
    return this.liquidationsList().reduce((acc, v) => acc + Number(v.comisionRetencion || 0), 0);
  });

  protected readonly totalAgentsPool = computed(() => {
    return this.liquidationsList().reduce((acc, v) => acc + Number((v.comisionCaptador || 0) + (v.comisionVendedor || 0)), 0);
  });

  protected readonly pendingAmount = computed(() => {
    return this.liquidationsList()
      .filter(v => !v.comisionPagada)
      .reduce((acc, v) => acc + Number((v.comisionCaptador || 0) + (v.comisionVendedor || 0)), 0);
  });

  protected readonly pendingCount = computed(() => {
    return this.liquidationsList().filter(v => !v.comisionPagada).length;
  });

  protected readonly paidCount = computed(() => {
    return this.liquidationsList().filter(v => v.comisionPagada).length;
  });

  // Lista filtrada de usuarios
  protected readonly filteredUsers = computed(() => {
    let list = this.usersList();
    const tab = this.activeTab();

    if (tab !== 'todos') {
      if (tab === 'administrador') {
        list = list.filter(u => u.rol === 'admin' || u.rol === 'administrador');
      } else {
        list = list.filter(u => u.rol === tab);
      }
    }

    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return list;

    return list.filter(u => 
      u.nombre.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query) ||
      (u.concesionaria && u.concesionaria.nombre.toLowerCase().includes(query))
    );
  });

  public ngOnInit(): void {
    this.loadUsers();
    this.loadConcesionarias();
    this.loadLiquidations();
  }

  protected setMainView(view: MainView): void {
    this.mainView.set(view);
    if (view === 'liquidaciones') {
      this.loadLiquidations();
    }
  }

  private async loadUsers(): Promise<void> {
    this.loading.set(true);
    try {
      const users = await this.authService.getUsers();
      this.usersList.set(users);
    } catch (e) {
      console.error('Error al cargar usuarios:', e);
      this.showToast('error', 'Error al cargar usuarios desde el servidor.');
    } finally {
      this.loading.set(false);
    }
  }

  private async loadConcesionarias(): Promise<void> {
    const list = await this.authService.getConcesionarias();
    this.concesionariasList.set(list);
  }

  private async loadLiquidations(): Promise<void> {
    this.loadingLiquidations.set(true);
    try {
      const list = await this.vehicleService.getLiquidations();
      this.liquidationsList.set(list);
    } catch (e) {
      console.error('Error al cargar liquidaciones:', e);
    } finally {
      this.loadingLiquidations.set(false);
    }
  }

  protected countByRole(role: string): number {
    if (role === 'administrador') {
      return this.usersList().filter(u => u.rol === 'admin' || u.rol === 'administrador').length;
    }
    return this.usersList().filter(u => u.rol === role).length;
  }

  protected getRoleLabel(role: string): string {
    switch (role) {
      case 'admin':
      case 'administrador': return 'Administrador';
      case 'concesionaria': return 'Concesionaria';
      case 'agente': return 'Agente Comercial';
      case 'cliente': return 'Cliente';
      default: return role;
    }
  }

  // Liquidaciones methods
  protected promptToggleCommissionPayment(vehicle: Vehicle): void {
    const willBePaid = !vehicle.comisionPagada;
    this.confirmModalConfig.set({
      action: 'toggle-payment',
      vehicle,
      title: willBePaid ? '¿Confirmar Pago de Comisión?' : '¿Revertir a Pendiente de Pago?',
      description: willBePaid
        ? `Se registrará que la comisión de ${vehicle.comisionTotal} USD por la venta de "${vehicle.nombre}" ya fue entregada / transferida al asesor.`
        : `El estado del pago para "${vehicle.nombre}" volverá a quedar como pendiente.`,
      confirmBtnText: willBePaid ? 'Sí, Registrar como Pagado' : 'Sí, Marcar Pendiente',
      confirmBtnClass: willBePaid ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white',
      iconType: willBePaid ? 'success' : 'warning'
    });
    this.isConfirmModalOpen.set(true);
  }

  protected openReceiptModal(vehicle: Vehicle): void {
    this.receiptTarget.set(vehicle);
  }

  protected closeReceiptModal(): void {
    this.receiptTarget.set(null);
  }

  // Modales de Confirmación
  protected promptToggleUserStatus(user: User): void {
    const willActivate = user.activo === false;
    this.confirmModalConfig.set({
      action: 'toggle-status',
      user,
      title: willActivate ? '¿Reactivar cuenta de usuario?' : '¿Suspender temporalmente la cuenta?',
      description: willActivate 
        ? `Al reactivar a ${user.nombre}, podrá volver a iniciar sesión y gestionar sus publicaciones.`
        : `Al suspender a ${user.nombre}, se le impedirá el acceso inmediatamente hasta que sea reactivado.`,
      confirmBtnText: willActivate ? 'Sí, Reactivar Cuenta' : 'Sí, Suspender Cuenta',
      confirmBtnClass: willActivate ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white',
      iconType: 'warning'
    });
    this.isConfirmModalOpen.set(true);
  }

  protected promptDeleteUser(user: User): void {
    this.confirmModalConfig.set({
      action: 'delete-user',
      user,
      title: '¿Eliminar permanentemente la cuenta?',
      description: `Esta acción no se puede deshacer. Se eliminarán los datos de acceso de "${user.nombre}" (${user.email}).`,
      confirmBtnText: 'Sí, Eliminar Permanentemente',
      confirmBtnClass: 'bg-rose-600 hover:bg-rose-500 text-white',
      iconType: 'danger'
    });
    this.isConfirmModalOpen.set(true);
  }

  protected closeConfirmModal(): void {
    if (!this.processingConfirm()) {
      this.isConfirmModalOpen.set(false);
      this.confirmModalConfig.set(null);
    }
  }

  protected async onExecuteConfirmAction(): Promise<void> {
    const config = this.confirmModalConfig();
    if (!config) return;

    this.processingConfirm.set(true);

    try {
      if (config.action === 'toggle-payment' && config.vehicle) {
        const v = config.vehicle;
        const willBePaid = !v.comisionPagada;
        await this.vehicleService.updateCommissionPayment(v.id, willBePaid);
        await this.loadLiquidations();
        this.showToast('success', willBePaid ? 'Comisión registrada como Pagada con éxito.' : 'Comisión revertida a Pendiente.');
      } else if (config.action === 'toggle-status' && config.user) {
        const user = config.user;
        const newStatus = user.activo === false;
        await this.authService.adminUpdateUser(user.id, { activo: newStatus });
        await this.loadUsers();
        this.showToast('success', `La cuenta de ${user.nombre} ahora está ${newStatus ? 'Activa' : 'Suspendida'}.`);
      } else if (config.action === 'delete-user' && config.user) {
        const user = config.user;
        await this.authService.adminDeleteUser(user.id);
        await this.loadUsers();
        this.showToast('success', `Cuenta de ${user.nombre} eliminada correctamente.`);
      }
    } catch (e: any) {
      console.error('Error al ejecutar acción:', e);
      this.showToast('error', e.message || 'Error al procesar la solicitud.');
    } finally {
      this.processingConfirm.set(false);
      this.closeConfirmModal();
    }
  }

  // Modal de Creación
  protected openCreateModal(): void {
    this.createError.set('');
    this.newName.set('');
    this.newEmail.set('');
    this.newPassword.set('');
    this.newRole.set('agente');
    this.newConcesionariaId.set('');
    this.isCreateModalOpen.set(true);
  }

  protected closeCreateModal(): void {
    if (!this.creatingUser()) {
      this.isCreateModalOpen.set(false);
    }
  }

  protected async onCreateUserSubmit(): Promise<void> {
    this.createError.set('');
    if (!this.newName().trim()) {
      this.createError.set('El nombre completo es obligatorio.');
      return;
    }
    if (!this.newEmail().trim()) {
      this.createError.set('El correo electrónico es obligatorio.');
      return;
    }
    if (!this.newPassword() || this.newPassword().length < 6) {
      this.createError.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    this.creatingUser.set(true);
    try {
      const res = await this.authService.adminCreateUser({
        nombre: this.newName().trim(),
        email: this.newEmail().trim(),
        contrasenia: this.newPassword(),
        rol: this.newRole(),
        concesionariaId: this.newRole() === 'agente' ? (this.newConcesionariaId() || undefined) : undefined,
      });

      if (res && res.success) {
        await this.loadUsers();
        this.closeCreateModal();
        this.showToast('success', `Cuenta de ${this.newName()} creada exitosamente.`);
      } else {
        this.createError.set(res.message || 'Error al crear usuario.');
      }
    } catch (err: any) {
      this.createError.set(err.message || 'Error de conexión con el servidor.');
    } finally {
      this.creatingUser.set(false);
    }
  }

  // Modal de Edición
  protected openEditModal(user: User): void {
    this.editError.set('');
    this.editingUserId.set(user.id);
    this.editName.set(user.nombre);
    this.editEmail.set(user.email);
    this.editRole.set(user.rol as any);
    this.editConcesionariaId.set(user.concesionariaId || '');
    this.editBeneficios.set(user.beneficios || 0);
    this.editNewPassword.set('');
    this.editActivo.set(user.activo !== false);
    this.isEditModalOpen.set(true);
  }

  protected closeEditModal(): void {
    if (!this.savingEdit()) {
      this.isEditModalOpen.set(false);
      this.editingUserId.set(null);
    }
  }

  protected async onEditUserSubmit(): Promise<void> {
    const id = this.editingUserId();
    if (!id) return;

    this.editError.set('');
    if (!this.editName().trim()) {
      this.editError.set('El nombre es obligatorio.');
      return;
    }

    this.savingEdit.set(true);
    try {
      const payload: any = {
        nombre: this.editName().trim(),
        rol: this.editRole(),
        concesionariaId: this.editRole() === 'agente' ? (this.editConcesionariaId() || null) : null,
        beneficios: Number(this.editBeneficios() || 0),
        activo: this.editActivo()
      };
      if (this.editNewPassword() && this.editNewPassword().length >= 6) {
        payload.contrasenia = this.editNewPassword();
      }

      const ok = await this.authService.adminUpdateUser(id, payload);
      if (ok) {
        await this.loadUsers();
        this.closeEditModal();
        this.showToast('success', 'Cambios guardados exitosamente.');
      } else {
        this.editError.set('No se pudo guardar la información del usuario.');
      }
    } catch (err: any) {
      this.editError.set(err.message || 'Error de conexión con el servidor.');
    } finally {
      this.savingEdit.set(false);
    }
  }

  private showToast(type: 'success' | 'error', message: string): void {
    this.toastType.set(type);
    this.toastMessage.set(message);
    setTimeout(() => {
      this.toastMessage.set('');
    }, 4000);
  }
}
