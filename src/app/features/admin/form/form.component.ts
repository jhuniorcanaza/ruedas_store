import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../../core/services/vehicle.service';
import { SpecificationService } from '../../../core/services/specification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Vehicle, SpecificationGroup, Specification } from '../../../core/models/vehicle.model';
import { compressImage } from '../../../core/utils/image-compressor.util';
import { CATALOG_BY_CATEGORY, BrandCatalog } from '../../../core/constants/vehicle-catalog.constant';

interface ColorSwatch {
  name: string;
  hex: string;
  border?: boolean;
}

@Component({
  selector: 'app-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  template: `
    <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      <!-- Header -->
      <div class="border-b border-slate-200 dark:border-slate-800 pb-5 flex justify-between items-center">
        <div>
          <h1 class="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
            {{ isEditMode() ? 'Editar Vehículo' : 'Registrar Nuevo Vehículo' }}
          </h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Completa la ficha comercial y técnica del vehículo en el inventario</p>
        </div>
        <a routerLink="/admin" class="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg shadow-2xs transition-colors">
          Regresar
        </a>
      </div>

      <!-- Alert Banner -->
      @if (alertMessage()) {
        <div class="mt-6 rounded-2xl p-5 border shadow-lg transition-all"
             [class.bg-rose-50]="alertMessage()?.type === 'error'"
             [class.dark:bg-rose-950/30]="alertMessage()?.type === 'error'"
             [class.border-rose-200]="alertMessage()?.type === 'error'"
             [class.dark:border-rose-900/50]="alertMessage()?.type === 'error'"
             [class.bg-emerald-50]="alertMessage()?.type === 'success'"
             [class.dark:bg-emerald-950/30]="alertMessage()?.type === 'success'"
             [class.border-emerald-200]="alertMessage()?.type === 'success'"
             [class.dark:border-emerald-900/50]="alertMessage()?.type === 'success'">
          <div class="flex items-start gap-3">
            @if (alertMessage()?.type === 'error') {
              <div class="p-2 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            } @else {
              <div class="p-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            }
            <div>
              <h3 class="font-heading text-base font-bold"
                  [class.text-rose-900]="alertMessage()?.type === 'error'"
                  [class.dark:text-rose-200]="alertMessage()?.type === 'error'"
                  [class.text-emerald-900]="alertMessage()?.type === 'success'"
                  [class.dark:text-emerald-200]="alertMessage()?.type === 'success'">
                {{ alertMessage()?.title }}
              </h3>
              @if (alertMessage()?.details && alertMessage()!.details!.length > 0) {
                <ul class="mt-2 space-y-1 text-xs font-semibold text-rose-700 dark:text-rose-300 list-disc list-inside">
                  @for (detail of alertMessage()!.details; track detail) {
                    <li>{{ detail }}</li>
                  }
                </ul>
              }
            </div>
          </div>
        </div>
      }

      <!-- Form Card -->
      <div class="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        <form [formGroup]="vehicleForm" (ngSubmit)="onSubmit()" class="space-y-8">
          
          <!-- Seccion 1: Datos Básicos -->
          <div>
            <h2 class="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2.5">
              1. Información Básica y Comercial
            </h2>
            
            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase font-bold">Categoría de Vehículo *</label>
                <select formControlName="categoria" (change)="onCategoryChange()"
                        class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none shadow-2xs">
                  <option value="autos">Autos y Camionetas</option>
                  <option value="autos_electricos">Autos Eléctricos (Cero Emisiones)</option>
                  <option value="motos">Motocicletas</option>
                  <option value="motos_electricos">Motos Eléctricas</option>
                  <option value="maquinaria_agricola">Maquinaria Pesada & Agrícola</option>
                  <option value="transporte_pesado">Transporte Pesado / Camiones</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Nombre Comercial / Título del Anuncio *</label>
                <input type="text" formControlName="nombre" placeholder="Ej. Toyota Hilux 4x4 SRV o BYD Dolphin EV"
                       class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-2xs"
                       [class.border-red-400]="isFieldInvalid('nombre')" />
              </div>
            </div>

            <!-- MARCAS Y MODELOS DINÁMICOS CON OPCIÓN MANUAL -->
            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-blue-50/40 dark:bg-slate-800/40 border border-blue-100 dark:border-slate-800">
              
              <!-- MARCA -->
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Marca *</label>
                  @if (!isCustomBrand()) {
                    <button type="button" (click)="toggleCustomBrand(true)" class="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      + Otra Marca no listada
                    </button>
                  } @else {
                    <button type="button" (click)="toggleCustomBrand(false)" class="text-[11px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:underline cursor-pointer">
                      ← Volver a lista de marcas
                    </button>
                  }
                </div>

                @if (!isCustomBrand()) {
                  <select [ngModel]="selectedBrand()" (ngModelChange)="onBrandSelect($event)" [ngModelOptions]="{standalone: true}"
                          class="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none shadow-2xs"
                          [class.border-red-400]="isFieldInvalid('marca')">
                    <option value="" disabled>-- Selecciona una marca --</option>
                    @for (b of availableBrands(); track b.name) {
                      <option [value]="b.name">{{ b.name }}</option>
                    }
                    <option value="__custom_brand__">+ Otra Marca (Escribir manualmente)</option>
                  </select>
                } @else {
                  <input type="text" formControlName="marca" placeholder="Ej. Geely, Changan, Benelli, Loncin..."
                         class="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-2xs"
                         [class.border-red-400]="isFieldInvalid('marca')" />
                }
              </div>

              <!-- MODELO -->
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Modelo *</label>
                  @if (!isCustomModel() && !isCustomBrand() && selectedBrand()) {
                    <button type="button" (click)="toggleCustomModel(true)" class="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      + Otro Modelo no listado
                    </button>
                  } @else if (isCustomModel() && !isCustomBrand() && selectedBrand()) {
                    <button type="button" (click)="toggleCustomModel(false)" class="text-[11px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:underline cursor-pointer">
                      ← Volver a lista de modelos
                    </button>
                  }
                </div>

                @if (!isCustomModel() && !isCustomBrand()) {
                  <select [ngModel]="selectedModel()" (ngModelChange)="onModelSelect($event)" [ngModelOptions]="{standalone: true}"
                          [disabled]="!selectedBrand()"
                          class="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none shadow-2xs disabled:opacity-50"
                          [class.border-red-400]="isFieldInvalid('modelo')">
                    <option value="" disabled>{{ selectedBrand() ? '-- Selecciona un modelo --' : '-- Primero selecciona marca --' }}</option>
                    @for (m of availableModels(); track m) {
                      <option [value]="m">{{ m }}</option>
                    }
                    <option value="__custom_model__">+ Otro Modelo (Escribir manualmente)</option>
                  </select>
                } @else {
                  <input type="text" formControlName="modelo" placeholder="Ej. Hilux, Corolla, Pulsar NS200..."
                         class="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-2xs"
                         [class.border-red-400]="isFieldInvalid('modelo')" />
                }
              </div>

            </div>

            <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase font-bold">Año de Fabricación *</label>
                <input type="number" formControlName="anio" placeholder="2024"
                       class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-2xs"
                       [class.border-red-400]="isFieldInvalid('anio')" />
              </div>
              <div class="sm:col-span-3">
                <div class="grid grid-cols-3 gap-2">
                  <div class="col-span-2">
                    <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase font-bold">Precio de Venta *</label>
                    <input type="number" formControlName="precio" placeholder="45000"
                           class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-2xs"
                           [class.border-red-400]="isFieldInvalid('precio')" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase font-bold">Moneda</label>
                    <select formControlName="moneda"
                            class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-2.5 text-sm font-bold text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none shadow-2xs">
                      <option value="USD">USD ($)</option>
                      <option value="BOB">BOB (Bs.)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Seccion 2: Características Técnicas Generales, Color y Motor -->
          <div>
            <h2 class="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2.5">
              2. Motorización, Color y Parámetros Técnicos
            </h2>
            
            <!-- Selector Visual de Color y Tipo de Motor -->
            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              
              <!-- Color Exterior con Paleta Interactiva -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Color Exterior *
                </label>
                <div class="mt-2 flex items-center gap-2.5">
                  <div class="h-10 w-10 rounded-xl border border-slate-300 dark:border-slate-700 shrink-0 shadow-sm flex items-center justify-center transition-transform hover:scale-105"
                       [style.background-color]="getCurrentColorHex()">
                    @if (!getCurrentColorHex()) {
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    }
                  </div>
                  <input type="text" formControlName="color" placeholder="Ej. Blanco Glaciar, Gris Nardo..."
                         class="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-2xs" />
                </div>

                <!-- Paleta de colores rápidos -->
                <div class="mt-2.5 flex flex-wrap items-center gap-1.5">
                  @for (c of colorOptions; track c.name) {
                    <button type="button" (click)="selectColor(c.name)"
                            [title]="c.name"
                            class="h-6 w-6 rounded-full transition-transform hover:scale-120 focus:outline-none cursor-pointer flex items-center justify-center shadow-2xs"
                            [style.background-color]="c.hex"
                            [class.ring-2]="vehicleForm.get('color')?.value === c.name"
                            [class.ring-blue-500]="vehicleForm.get('color')?.value === c.name"
                            [class.border]="c.border"
                            [class.border-slate-300]="c.border"
                            [class.dark:border-slate-600]="c.border">
                      @if (vehicleForm.get('color')?.value === c.name) {
                        <svg class="h-3.5 w-3.5" [class.text-slate-900]="c.name === 'Blanco' || c.name === 'Blanco Perla'" [class.text-white]="c.name !== 'Blanco' && c.name !== 'Blanco Perla'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      }
                    </button>
                  }
                </div>
              </div>

              <!-- Tipo de Motor / Propulsión -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {{ isElectric() ? 'Motor Eléctrico / Potencia' : 'Configuración de Motor' }}
                </label>
                <input type="text" formControlName="motor" 
                       [placeholder]="isElectric() ? 'Ej. Motor Síncrono 150 kW (204 CV) / Dual Motor 310 kW' : 'Ej. 2.0L Turbo 250 HP, 1.6L 16V VVT-i, V6 3.5L'"
                       class="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-2xs" />
                <p class="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {{ isElectric() ? 'Especifica la potencia en kW o Caballos de fuerza (HP).' : 'Indica la cilindrada nominal y disposición de cilindros.' }}
                </p>
              </div>

            </div>

            <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Kilometraje (Km) *</label>
                <input type="number" formControlName="kilometraje" placeholder="0"
                       class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-2xs"
                       [class.border-red-400]="isFieldInvalid('kilometraje')" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Condición *</label>
                <select formControlName="condicion" 
                        class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none shadow-2xs">
                  <option value="nuevo">Nuevo de Paquete</option>
                  <option value="usado">Usado Certificado</option>
                </select>
              </div>
              
              <!-- Transmisión Adaptativa según categoría -->
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Transmisión *</label>
                <select formControlName="transmision" 
                        class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none shadow-2xs">
                  @if (isElectric()) {
                    <option value="Automática">Automática / Direct Drive (1 velocidad)</option>
                  } @else if (isMoto()) {
                    <option value="Manual">Manual</option>
                    <option value="Automática">Automática / CVT</option>
                    <option value="Semiautomática">Semiautomática</option>
                  } @else if (isMachinery()) {
                    <option value="Hidrostática">Hidrostática</option>
                    <option value="PowerShift">PowerShift</option>
                    <option value="Manual">Manual Sincronizada</option>
                  } @else {
                    <option value="Automática">Automática</option>
                    <option value="Manual">Manual</option>
                    <option value="Secuencial">Secuencial</option>
                  }
                </select>
              </div>

              <!-- Combustible Adaptativo: Si es eléctrico, se muestra badge fijo sin confusión -->
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Combustible *</label>
                @if (isElectric()) {
                  <div class="mt-1.5 flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                    <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>100% Eléctrico</span>
                  </div>
                } @else {
                  <select formControlName="tipoCombustible" 
                          class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none shadow-2xs">
                    <option value="Gasolina">Gasolina</option>
                    <option value="Diésel">Diésel</option>
                    <option value="Híbrido">Híbrido Gasolina/Eléctrico</option>
                    <option value="GNV">GNV (Gas Natural)</option>
                  </select>
                }
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Ubicación Física *</label>
                <input type="text" formControlName="ubicacion" placeholder="Ej. Santa Cruz, Av. Cristo Redentor"
                       class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-2xs"
                       [class.border-red-400]="isFieldInvalid('ubicacion')" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase font-bold">WhatsApp / Teléfono *</label>
                <input type="text" formControlName="telefonoContacto" placeholder="Ej. 59177490451"
                       class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-2xs"
                       [class.border-red-400]="isFieldInvalid('telefonoContacto')" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Estado Comercial *</label>
                <select formControlName="estado" 
                        class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none shadow-2xs">
                  <option value="disponible">Disponible</option>
                  <option value="reservado">Reservado</option>
                  <option value="vendido">Vendido</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Seccion 3: Imágenes (Subida de Archivos) -->
          <div>
            <h2 class="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2.5">
              3. Visuales y Fotografías del Vehículo
            </h2>
            
            <div class="mt-4 space-y-6">
              <!-- Imagen Principal -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Imagen Principal de Portada *</label>
                
                @if (imagenPrincipalPreview()) {
                  <div class="mt-2 h-56 w-full rounded-2xl overflow-hidden relative border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-sm">
                    <img [src]="imagenPrincipalPreview()" class="h-full w-full object-cover" />
                    <button type="button" (click)="removeImagenPrincipal()" 
                            class="absolute top-3 right-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow transition-colors flex items-center gap-1 focus:outline-none cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Cambiar Portada
                    </button>
                  </div>
                } @else {
                  <div class="mt-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer relative bg-slate-50/50 dark:bg-slate-950/40">
                    <input type="file" (change)="onMainFileSelected($event)" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" />
                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-xs text-slate-700 dark:text-slate-300 block mt-2 font-bold">Haz clic o arrastra la foto de portada aquí</span>
                    <span class="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">Soporta JPG, PNG, WEBP. Optimizada automáticamente.</span>
                  </div>
                }
              </div>

              <!-- Galería de Imágenes Adicionales -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Galería de Fotos Adicionales</label>
                
                <div class="mt-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center hover:border-blue-500 transition-colors cursor-pointer relative bg-slate-50/50 dark:bg-slate-950/40">
                  <input type="file" (change)="onGalleryFilesSelected($event)" accept="image/*" multiple class="absolute inset-0 opacity-0 cursor-pointer" />
                  <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span class="text-xs text-slate-700 dark:text-slate-300 block mt-1 font-bold">Añadir fotos a la galería (puedes seleccionar múltiples archivos)</span>
                </div>

                @if (galleryImages().length > 0) {
                  <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    @for (img of galleryImages(); track $index) {
                      <div class="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 group shadow-sm">
                        <img [src]="img" class="h-full w-full object-cover" />
                        <button type="button" (click)="removeGalleryImage($index)" 
                                class="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-500 text-white rounded-full p-1 shadow transition-colors focus:outline-none cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Seccion 4: Especificaciones Dinámicas por Categoría -->
          <div>
            <div class="border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center justify-between">
              <div>
                <h2 class="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  4. Atributos Específicos de Categoría
                </h2>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Formulario adaptado para: <strong class="text-blue-600 dark:text-blue-400">{{ getCategoryName() }}</strong>
                </p>
              </div>
            </div>
            
            <!-- CASO 1: VEHÍCULOS ELÉCTRICOS (Autos o Motos Eléctricos) -->
            @if (isElectric()) {
              <div class="mt-4 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 dark:border-emerald-900/40 space-y-4">
                <div class="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 class="text-xs font-extrabold uppercase tracking-widest">Ficha de Propulsión 100% Eléctrica (Cero Emisiones)</h3>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Autonomía Homologada (km) *</label>
                    <input type="number" 
                           [formControlName]="isMoto() ? 'motoAutonomia' : 'autoAutonomia'" 
                           placeholder="Ej. 420 (WLTP / NEDC)"
                           class="mt-1.5 w-full rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 shadow-2xs" />
                    <p class="mt-1 text-[10px] text-emerald-700 dark:text-emerald-400">Rango estimado por carga completa.</p>
                  </div>

                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Capacidad de Batería (kWh) *</label>
                    <input type="number" 
                           [formControlName]="isMoto() ? 'motoTamanoBateria' : 'autoTamanoBateria'" 
                           placeholder="Ej. 60 o 75"
                           class="mt-1.5 w-full rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 shadow-2xs" />
                    <p class="mt-1 text-[10px] text-emerald-700 dark:text-emerald-400">Capacidad neta del paquete de baterías.</p>
                  </div>
                </div>

                @if (!isMoto()) {
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-emerald-500/10">
                    <div>
                      <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Carrocería</label>
                      <input type="text" formControlName="autoCarroceria" placeholder="Ej. SUV Eléctrica, Sedán Fastback"
                             class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 shadow-2xs" />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Número de Puertas</label>
                      <input type="number" formControlName="autoPuertas"
                             class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 shadow-2xs" />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Pasajeros</label>
                      <input type="number" formControlName="autoPasajeros"
                             class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 shadow-2xs" />
                    </div>
                  </div>
                }
              </div>
            }

            <!-- CASO 2: AUTOS A COMBUSTIÓN -->
            @if (vehicleForm.get('categoria')?.value === 'autos') {
              <div class="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase font-bold">Cilindrada (cc) *</label>
                  <input type="number" formControlName="autoCilindrada" placeholder="Ej. 1600, 2000, 3000"
                         class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 shadow-2xs" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Carrocería</label>
                  <input type="text" formControlName="autoCarroceria" placeholder="Ej. Sedán, SUV, Pickup, Hatchback"
                         class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 shadow-2xs" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Número de Puertas</label>
                  <input type="number" formControlName="autoPuertas"
                         class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 shadow-2xs" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Pasajeros</label>
                  <input type="number" formControlName="autoPasajeros"
                         class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 shadow-2xs" />
                </div>
              </div>
            }

            <!-- CASO 3: MOTOCICLETAS A COMBUSTIÓN -->
            @if (vehicleForm.get('categoria')?.value === 'motos') {
              <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase font-bold">Cilindrada Moto (cc) *</label>
                  <input type="number" formControlName="motoCilindrada" placeholder="Ej. 125, 250, 650, 1000"
                         class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 shadow-2xs" />
                  <p class="mt-1 text-[11px] text-slate-400">Capacidad volumétrica del motor en centímetros cúbicos.</p>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase font-bold">Estilo de Motocicleta</label>
                  <select formControlName="motoTipoMoto"
                          class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 shadow-2xs">
                    <option value="">-- Selecciona estilo --</option>
                    <option value="Naked">Naked / Urbana</option>
                    <option value="Trail / Adventure">Trail / Adventure (Doble Propósito)</option>
                    <option value="Scooter">Scooter / Maxiscooter</option>
                    <option value="Deportiva">Deportiva / Sport</option>
                    <option value="Enduro / Cross">Enduro / Motocross</option>
                    <option value="Chopper / Custom">Chopper / Custom / Cruiser</option>
                    <option value="Cuadratrack">Cuadratrack / ATV (4x4)</option>
                  </select>
                </div>
              </div>
            }

            <!-- CASO 4: MAQUINARIA PESADA, AGRÍCOLA Y TRANSPORTE PESADO -->
            @if (vehicleForm.get('categoria')?.value === 'maquinaria_agricola' || vehicleForm.get('categoria')?.value === 'transporte_pesado') {
              <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                <div>
                  <label class="block text-xs font-semibold text-amber-900 dark:text-amber-300 uppercase font-bold">
                    {{ vehicleForm.get('categoria')?.value === 'transporte_pesado' ? 'Capacidad de Carga / Tara (kg)' : 'Peso Operativo (kg)' }}
                  </label>
                  <input type="number" formControlName="maquinariaPesoOperativo" placeholder="Ej. 18500"
                         class="mt-1.5 w-full rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-amber-500 shadow-2xs" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-amber-900 dark:text-amber-300 uppercase font-bold">Horas de Operación / Trabajo</label>
                  <input type="number" formControlName="maquinariaHorasUso" placeholder="Ej. 1800"
                         class="mt-1.5 w-full rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-amber-500 shadow-2xs" />
                </div>
              </div>
            }
          </div>

          <!-- Seccion 5: Equipamiento y Características Filtradas -->
          <div>
            <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div>
                <h2 class="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  5. Equipamiento y Características Disponibles
                </h2>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Adaptadas automáticamente para: <strong class="text-blue-600 dark:text-blue-400">{{ getCategoryName() }}</strong>
                </p>
              </div>
              <button type="button" (click)="openAddSpecModal()" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center gap-1 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                + Nueva Característica
              </button>
            </div>
            
            <div class="mt-5 space-y-6">
              @for (group of specificationGroups(); track group.id) {
                @if (shouldShowGroup(group)) {
                  <div>
                    <h3 class="text-[11px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-2.5">{{ group.nombre }}</h3>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                      @for (spec of getFilteredSpecsForGroup(group); track spec.id) {
                        <label class="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800/70 transition-colors">
                          <input type="checkbox"
                                 [checked]="selectedSpecs().includes(spec.id)"
                                 (change)="toggleSpec(spec.id)"
                                 class="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950" />
                          <span class="truncate">{{ spec.nombre }}</span>
                        </label>
                      }
                    </div>
                  </div>
                }
              }
            </div>
          </div>

          <!-- Seccion 6: Descripción Comercial y Destacado -->
          <div class="space-y-4">
            <h2 class="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2.5">
              6. Descripción Comercial y Visibilidad
            </h2>

            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Argumentos de Venta / Descripción *</label>
              <textarea formControlName="descripcion" rows="4" placeholder="Escribe los detalles atractivos del vehículo, estado mecánico y garantías..."
                        class="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-2xs"
                        [class.border-red-400]="isFieldInvalid('descripcion')"></textarea>
            </div>

            <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <input type="checkbox" formControlName="destacado" id="destacado" class="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-slate-300 dark:border-slate-700" />
              <label for="destacado" class="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                Marcar como VEHÍCULO DESTACADO (se promocionará en la página principal)
              </label>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
            <button type="submit" [disabled]="isSubmitting()"
                    class="flex-1 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer">
              @if (isSubmitting()) {
                <span class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Guardando vehículo...</span>
              } @else {
                <span>{{ isEditMode() ? 'Guardar Cambios' : 'Registrar Vehículo' }}</span>
              }
            </button>
            <a routerLink="/admin" class="text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer">
              Cancelar
            </a>
          </div>

        </form>

      </div>
      
      <!-- MODAL: Agregar Especificación (Fondo 100% transparente) -->
      @if (isAddSpecModalOpen()) {
        <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-transparent pointer-events-none">
          <div class="fixed inset-0 bg-transparent pointer-events-auto" (click)="closeAddSpecModal()"></div>
          <div class="relative z-10 pointer-events-auto w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.22)] border border-slate-200 dark:border-slate-800 animate-fade-in">
            <button type="button" (click)="closeAddSpecModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 class="font-heading text-lg font-bold text-slate-900 dark:text-white">Nueva Característica</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Crea una especificación disponible para el inventario.</p>

            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Nombre *</label>
                <input type="text" [(ngModel)]="newSpecName" placeholder="Ej. Techo Solar, ABS Doble Canal"
                       class="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-2xs" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Grupo / Categoría *</label>
                <select [(ngModel)]="newSpecGroupId"
                        class="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none shadow-2xs">
                  @for (group of specificationGroups(); track group.id) {
                    <option [value]="group.id">{{ group.nombre }}</option>
                  }
                </select>
              </div>
              
              @if (newSpecError()) {
                <p class="text-xs text-rose-500 font-semibold">{{ newSpecError() }}</p>
              }

              <button type="button" (click)="submitNewSpec()" [disabled]="!newSpecName().trim() || !newSpecGroupId()"
                      class="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-2xs cursor-pointer">
                Guardar Especificación
              </button>
            </div>
          </div>
        </div>
      }
      
    </div>
  `
})
export class AdminFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly vehicleService = inject(VehicleService);
  private readonly specService = inject(SpecificationService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isEditMode = signal(false);
  protected readonly vehicleId = signal<string | null>(null);
  protected readonly alertMessage = signal<{ type: 'error' | 'success'; title: string; details?: string[] } | null>(null);
  protected readonly isSubmitting = signal(false);

  protected readonly vehicleForm: FormGroup;

  // Marcas y Modelos Dinámicos
  protected readonly selectedBrand = signal<string>('');
  protected readonly selectedModel = signal<string>('');
  protected readonly isCustomBrand = signal<boolean>(false);
  protected readonly isCustomModel = signal<boolean>(false);

  protected readonly availableBrands = computed<BrandCatalog[]>(() => {
    const cat = this.vehicleForm?.get('categoria')?.value || 'autos';
    return CATALOG_BY_CATEGORY[cat] || [];
  });

  protected readonly availableModels = computed<string[]>(() => {
    const brandName = this.selectedBrand();
    if (!brandName) return [];
    const brandObj = this.availableBrands().find(b => b.name.toLowerCase() === brandName.toLowerCase());
    return brandObj ? brandObj.models : [];
  });

  // Paleta de colores predefinidos con códigos HEX
  protected readonly colorOptions: ColorSwatch[] = [
    { name: 'Blanco', hex: '#FFFFFF', border: true },
    { name: 'Negro', hex: '#111827' },
    { name: 'Plata', hex: '#94A3B8' },
    { name: 'Gris Grafito', hex: '#475569' },
    { name: 'Rojo', hex: '#DC2626' },
    { name: 'Azul', hex: '#2563EB' },
    { name: 'Azul Marino', hex: '#1E3A8A' },
    { name: 'Verde', hex: '#16A34A' },
    { name: 'Amarillo', hex: '#EAB308' },
    { name: 'Naranja', hex: '#EA580C' },
    { name: 'Café / Bronce', hex: '#78350F' },
    { name: 'Blanco Perla', hex: '#F1F5F9', border: true },
  ];

  // Especificaciones
  protected readonly specificationGroups = signal<SpecificationGroup[]>([]);
  protected readonly selectedSpecs = signal<number[]>([]);

  // Visuales Base64 state
  protected readonly imagenPrincipalPreview = signal<string>('');
  protected readonly galleryImages = signal<string[]>([]);

  // Modal para agregar especificación
  protected readonly isAddSpecModalOpen = signal(false);
  protected readonly newSpecName = signal('');
  protected readonly newSpecGroupId = signal<number>(0);
  protected readonly newSpecError = signal('');

  constructor() {
    this.vehicleForm = this.fb.group({
      nombre: ['', [Validators.required]],
      marca: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      anio: [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
      precio: [0, [Validators.required, Validators.min(1)]],
      moneda: ['USD', [Validators.required]],
      categoria: ['autos', [Validators.required]],
      color: ['Blanco', [Validators.required]],
      motor: [''],
      tipoCombustible: ['Gasolina', [Validators.required]],
      transmision: ['Automática', [Validators.required]],
      kilometraje: [0, [Validators.required, Validators.min(0)]],
      condicion: ['usado', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      telefonoContacto: ['59177490451', [Validators.required, Validators.pattern(/^[\+0-9\s\-]+$/)]],
      destacado: [false],
      estado: ['disponible', [Validators.required]],
      // Autos
      autoCarroceria: [''],
      autoCilindrada: [null],
      autoPuertas: [4],
      autoPasajeros: [5],
      autoAutonomia: [null],
      autoTamanoBateria: [null],
      // Motos
      motoCilindrada: [125],
      motoTipoMoto: [''],
      motoAutonomia: [null],
      motoTamanoBateria: [null],
      // Maquinaria & Transporte
      maquinariaPesoOperativo: [1000],
      maquinariaHorasUso: [0]
    });
  }

  public ngOnInit(): void {
    this.loadSpecs();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode.set(true);
        this.vehicleId.set(id);
        this.loadVehicleData(id);
      } else {
        // En creación nueva, seleccionar la primera marca por defecto
        const brands = this.availableBrands();
        if (brands.length > 0) {
          this.onBrandSelect(brands[0].name);
        }
      }
    });
  }

  // Métodos de Selección de Marca y Modelo
  protected onBrandSelect(brandName: string): void {
    if (brandName === '__custom_brand__') {
      this.isCustomBrand.set(true);
      this.isCustomModel.set(true);
      this.selectedBrand.set('');
      this.selectedModel.set('');
      this.vehicleForm.patchValue({ marca: '', modelo: '' });
    } else {
      this.isCustomBrand.set(false);
      this.selectedBrand.set(brandName);
      this.vehicleForm.patchValue({ marca: brandName });
      
      // Auto-seleccionar primer modelo de la marca o resetear
      const models = this.availableModels();
      const currentModel = this.vehicleForm.get('modelo')?.value;
      if (models.includes(currentModel)) {
        this.selectedModel.set(currentModel);
        this.isCustomModel.set(false);
      } else if (models.length > 0) {
        this.onModelSelect(models[0]);
      } else {
        this.selectedModel.set('');
        this.isCustomModel.set(false);
        this.vehicleForm.patchValue({ modelo: '' });
      }
    }
  }

  protected onModelSelect(modelName: string): void {
    if (modelName === '__custom_model__') {
      this.isCustomModel.set(true);
      this.selectedModel.set('');
      this.vehicleForm.patchValue({ modelo: '' });
    } else {
      this.isCustomModel.set(false);
      this.selectedModel.set(modelName);
      this.vehicleForm.patchValue({ modelo: modelName });
    }
  }

  protected toggleCustomBrand(custom: boolean): void {
    this.isCustomBrand.set(custom);
    if (custom) {
      this.isCustomModel.set(true);
      this.selectedBrand.set('');
      this.selectedModel.set('');
      this.vehicleForm.patchValue({ marca: '', modelo: '' });
    } else {
      const brands = this.availableBrands();
      if (brands.length > 0) {
        this.onBrandSelect(brands[0].name);
      }
    }
  }

  protected toggleCustomModel(custom: boolean): void {
    this.isCustomModel.set(custom);
    if (custom) {
      this.selectedModel.set('');
      this.vehicleForm.patchValue({ modelo: '' });
    } else {
      const models = this.availableModels();
      if (models.length > 0) {
        this.onModelSelect(models[0]);
      }
    }
  }

  // Helpers de Tipo de Vehículo
  protected isElectric(): boolean {
    const cat = this.vehicleForm.get('categoria')?.value;
    return cat === 'autos_electricos' || cat === 'motos_electricos';
  }

  protected isMoto(): boolean {
    const cat = this.vehicleForm.get('categoria')?.value;
    return cat === 'motos' || cat === 'motos_electricos';
  }

  protected isMachinery(): boolean {
    const cat = this.vehicleForm.get('categoria')?.value;
    return cat === 'maquinaria_agricola' || cat === 'transporte_pesado';
  }

  protected selectColor(colorName: string): void {
    this.vehicleForm.patchValue({ color: colorName });
  }

  protected getCurrentColorHex(): string {
    const currentColor = (this.vehicleForm.get('color')?.value || '').trim().toLowerCase();
    const match = this.colorOptions.find(c => c.name.toLowerCase() === currentColor);
    if (match) return match.hex;

    if (currentColor.includes('blanco')) return '#FFFFFF';
    if (currentColor.includes('negro')) return '#111827';
    if (currentColor.includes('rojo')) return '#DC2626';
    if (currentColor.includes('azul')) return '#2563EB';
    if (currentColor.includes('gris') || currentColor.includes('plata')) return '#94A3B8';
    if (currentColor.includes('verde')) return '#16A34A';
    if (currentColor.includes('amarillo')) return '#EAB308';
    if (currentColor.includes('naranja')) return '#EA580C';

    return '#94A3B8';
  }

  protected getCategoryName(): string {
    const cat = this.vehicleForm.get('categoria')?.value;
    switch (cat) {
      case 'autos': return 'Autos y Camionetas';
      case 'autos_electricos': return 'Autos Eléctricos';
      case 'motos': return 'Motocicletas';
      case 'motos_electricos': return 'Motos Eléctricas';
      case 'maquinaria_agricola': return 'Maquinaria Agrícola';
      case 'transporte_pesado': return 'Transporte Pesado / Camiones';
      default: return 'este vehículo';
    }
  }

  private async loadSpecs(): Promise<void> {
    const groups = await this.specService.getGroups();
    this.specificationGroups.set(groups);
    if (groups.length > 0) {
      this.newSpecGroupId.set(groups[0].id);
    }
  }

  private async loadVehicleData(id: string): Promise<void> {
    const v = await this.vehicleService.getVehicleById(id);
    if (v) {
      this.vehicleForm.patchValue({
        nombre: v.nombre,
        marca: v.marca,
        modelo: v.modelo,
        anio: v.anio,
        precio: v.precio,
        moneda: v.moneda || 'USD',
        categoria: v.categoria,
        color: v.color || 'Blanco',
        motor: v.motor || '',
        tipoCombustible: v.tipoCombustible,
        transmision: v.transmision,
        kilometraje: v.kilometraje,
        condicion: v.condicion,
        ubicacion: v.ubicacion,
        descripcion: v.descripcion,
        telefonoContacto: v.telefonoContacto || '59177490451',
        destacado: v.destacado,
        estado: v.estado,
        autoCarroceria: v.autoDetail?.carroceria || '',
        autoCilindrada: v.autoDetail?.cilindrada || null,
        autoPuertas: v.autoDetail?.puertas || 4,
        autoPasajeros: v.autoDetail?.pasajeros || 5,
        autoAutonomia: v.autoDetail?.autonomia || null,
        autoTamanoBateria: v.autoDetail?.tamanoBateria || null,
        motoCilindrada: v.motoDetail?.cilindrada || 125,
        motoTipoMoto: v.motoDetail?.tipoMoto || '',
        motoAutonomia: v.motoDetail?.autonomia || null,
        motoTamanoBateria: v.motoDetail?.tamanoBateria || null,
        maquinariaPesoOperativo: v.maquinariaDetail?.pesoOperativo || 1000,
        maquinariaHorasUso: v.maquinariaDetail?.horasUso || 0
      });

      // Sincronizar selectores de marca y modelo según catálogo
      const cat = v.categoria || 'autos';
      const catBrands = CATALOG_BY_CATEGORY[cat] || [];
      const foundBrand = catBrands.find(b => b.name.toLowerCase() === (v.marca || '').toLowerCase());

      if (foundBrand) {
        this.selectedBrand.set(foundBrand.name);
        this.isCustomBrand.set(false);
        const foundModel = foundBrand.models.find(m => m.toLowerCase() === (v.modelo || '').toLowerCase());
        if (foundModel) {
          this.selectedModel.set(foundModel);
          this.isCustomModel.set(false);
        } else {
          this.selectedModel.set('');
          this.isCustomModel.set(true);
        }
      } else {
        this.isCustomBrand.set(true);
        this.isCustomModel.set(true);
        this.selectedBrand.set('');
        this.selectedModel.set('');
      }

      if (v.imagenPrincipal) {
        this.imagenPrincipalPreview.set(v.imagenPrincipal);
      }
      if (v.imagenes && v.imagenes.length > 0) {
        this.galleryImages.set(v.imagenes);
      }

      if (v.especificaciones) {
        this.selectedSpecs.set(v.especificaciones.map(s => s.id));
      }
    } else {
      this.router.navigate(['/admin']);
    }
  }

  protected onCategoryChange(): void {
    const cat = this.vehicleForm.get('categoria')?.value;
    
    // Adaptar marcas para la nueva categoría
    const brands = this.availableBrands();
    const currentBrand = this.vehicleForm.get('marca')?.value;
    const brandExists = brands.some(b => b.name.toLowerCase() === currentBrand?.toLowerCase());
    
    if (!brandExists) {
      if (brands.length > 0) {
        this.onBrandSelect(brands[0].name);
      } else {
        this.selectedBrand.set('');
        this.selectedModel.set('');
        this.isCustomBrand.set(true);
        this.isCustomModel.set(true);
      }
    }

    // Reglas de negocio según categoría
    if (this.isElectric()) {
      this.vehicleForm.patchValue({
        tipoCombustible: 'Eléctrico',
        transmision: 'Automática'
      });
    } else if (this.isMoto()) {
      this.vehicleForm.patchValue({
        tipoCombustible: 'Gasolina',
        transmision: 'Manual'
      });
    } else if (this.isMachinery()) {
      this.vehicleForm.patchValue({
        tipoCombustible: 'Diésel',
        transmision: 'Hidrostática'
      });
    }
  }

  // Image Upload Methods
  protected removeImagenPrincipal(): void {
    this.imagenPrincipalPreview.set('');
  }

  protected async onMainFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      try {
        const file = input.files[0];
        const compressedBase64 = await compressImage(file, 1600, 900, 0.82);
        this.imagenPrincipalPreview.set(compressedBase64);
      } catch (err) {
        console.error('Error al comprimir imagen principal:', err);
      }
    }
  }

  protected async onGalleryFilesSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      try {
        const compressPromises = files.map(file => compressImage(file, 1600, 900, 0.82));
        const compressedList = await Promise.all(compressPromises);
        this.galleryImages.set([...this.galleryImages(), ...compressedList]);
      } catch (err) {
        console.error('Error al comprimir imágenes de galería:', err);
      }
    }
  }

  protected removeGalleryImage(index: number): void {
    const current = this.galleryImages();
    this.galleryImages.set(current.filter((_, i) => i !== index));
  }

  protected toggleSpec(id: number): void {
    const current = this.selectedSpecs();
    if (current.includes(id)) {
      this.selectedSpecs.set(current.filter(x => x !== id));
    } else {
      this.selectedSpecs.set([...current, id]);
    }
  }

  protected getFilteredSpecsForGroup(group: SpecificationGroup): Specification[] {
    const categoria = this.vehicleForm.get('categoria')?.value || 'autos';
    return (group.especificaciones || []).filter(spec => {
      const scope = spec.categoriaVehiculo || group.categoriaVehiculo || 'todos';
      if (scope === 'todos') return true;
      if (categoria === 'autos' || categoria === 'autos_electricos') {
        if (scope === 'autos') return true;
        if (categoria === 'autos_electricos' && scope === 'electricos') return true;
      }
      if (categoria === 'motos' || categoria === 'motos_electricos') {
        if (scope === 'motos') return true;
        if (categoria === 'motos_electricos' && scope === 'electricos') return true;
      }
      if (categoria === 'maquinaria_agricola') {
        if (scope === 'maquinaria') return true;
      }
      if (categoria === 'transporte_pesado') {
        if (scope === 'transporte' || scope === 'maquinaria') return true;
      }
      return false;
    });
  }

  protected shouldShowGroup(group: SpecificationGroup): boolean {
    return this.getFilteredSpecsForGroup(group).length > 0;
  }

  // Operaciones del Modal de especificación
  protected openAddSpecModal(): void {
    this.newSpecName.set('');
    this.newSpecError.set('');
    this.isAddSpecModalOpen.set(true);
  }

  protected closeAddSpecModal(): void {
    this.isAddSpecModalOpen.set(false);
  }

  protected async submitNewSpec(): Promise<void> {
    const name = this.newSpecName().trim();
    const groupId = Number(this.newSpecGroupId());
    
    if (name && groupId) {
      const res = await this.specService.createSpecification(name, groupId);
      if (res.success && res.spec) {
        await this.loadSpecs();
        this.selectedSpecs.set([...this.selectedSpecs(), res.spec.id]);
        this.closeAddSpecModal();
      } else {
        this.newSpecError.set(res.message || 'Error al guardar la especificación. Es posible que ya exista.');
      }
    }
  }

  protected async onSubmit(): Promise<void> {
    this.alertMessage.set(null);
    this.vehicleForm.markAllAsTouched();

    const mainImg = this.imagenPrincipalPreview();
    const missingFields: string[] = [];

    if (this.vehicleForm.get('nombre')?.invalid) missingFields.push('Nombre Comercial es requerido');
    if (this.vehicleForm.get('marca')?.invalid) missingFields.push('Marca es requerida');
    if (this.vehicleForm.get('modelo')?.invalid) missingFields.push('Modelo es requerido');
    if (this.vehicleForm.get('anio')?.invalid) missingFields.push('Año debe ser un valor válido (mínimo 1900)');
    if (this.vehicleForm.get('precio')?.invalid) missingFields.push('Precio debe ser mayor a 0');
    if (this.vehicleForm.get('color')?.invalid) missingFields.push('Color del vehículo es requerido');
    if (this.vehicleForm.get('ubicacion')?.invalid) missingFields.push('Ubicación física es requerida');
    if (this.vehicleForm.get('descripcion')?.invalid) missingFields.push('Descripción debe tener al menos 10 caracteres');
    if (this.vehicleForm.get('telefonoContacto')?.invalid) missingFields.push('Teléfono de contacto es requerido (ej. +591 77490451)');
    if (!mainImg) missingFields.push('Debe cargar la Imagen Principal del vehículo');

    if (this.vehicleForm.invalid || !mainImg) {
      this.alertMessage.set({
        type: 'error',
        title: 'Por favor completa los siguientes campos obligatorios antes de guardar:',
        details: missingFields
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.isSubmitting.set(true);

    try {
      let imagenes = this.galleryImages();
      if (imagenes.length === 0) {
        imagenes = [mainImg];
      }

      const formValue = this.vehicleForm.value;

      const vehicleData: any = {
        nombre: formValue.nombre,
        marca: formValue.marca,
        modelo: formValue.modelo,
        anio: Number(formValue.anio),
        precio: Number(formValue.precio),
        moneda: formValue.moneda,
        categoria: formValue.categoria,
        color: formValue.color || 'Blanco',
        motor: formValue.motor || null,
        tipoCombustible: formValue.tipoCombustible,
        transmision: formValue.transmision,
        kilometraje: Number(formValue.kilometraje),
        condicion: formValue.condicion,
        ubicacion: formValue.ubicacion,
        imagenPrincipal: mainImg,
        imagenes: imagenes,
        descripcion: formValue.descripcion,
        telefonoContacto: formValue.telefonoContacto,
        destacado: formValue.destacado,
        estado: formValue.estado,
        especificaciones: this.selectedSpecs()
      };

      if (formValue.categoria === 'autos' || formValue.categoria === 'autos_electricos') {
        vehicleData.autoDetail = {
          carroceria: formValue.autoCarroceria,
          cilindrada: formValue.autoCilindrada ? Number(formValue.autoCilindrada) : null,
          puertas: Number(formValue.autoPuertas),
          pasajeros: Number(formValue.autoPasajeros),
          autonomia: formValue.autoAutonomia ? Number(formValue.autoAutonomia) : null,
          tamanoBateria: formValue.autoTamanoBateria ? Number(formValue.autoTamanoBateria) : null
        };
      } else if (formValue.categoria === 'motos' || formValue.categoria === 'motos_electricos') {
        vehicleData.motoDetail = {
          cilindrada: Number(formValue.motoCilindrada),
          tipoMoto: formValue.motoTipoMoto,
          autonomia: formValue.motoAutonomia ? Number(formValue.motoAutonomia) : null,
          tamanoBateria: formValue.motoTamanoBateria ? Number(formValue.motoTamanoBateria) : null
        };
      } else if (formValue.categoria === 'maquinaria_agricola' || formValue.categoria === 'transporte_pesado') {
        vehicleData.maquinariaDetail = {
          pesoOperativo: Number(formValue.maquinariaPesoOperativo),
          horasUso: Number(formValue.maquinariaHorasUso)
        };
      }

      if (this.isEditMode() && this.vehicleId()) {
        await this.vehicleService.updateVehicle(this.vehicleId()!, vehicleData);
      } else {
        await this.vehicleService.createVehicle(vehicleData);
      }

      this.alertMessage.set({
        type: 'success',
        title: this.isEditMode() ? '¡Cambios guardados con éxito!' : '¡Vehículo registrado con éxito!'
      });

      setTimeout(() => {
        this.router.navigate(['/admin']);
      }, 1000);

    } catch (err: any) {
      console.error('Error al guardar vehículo:', err);
      this.alertMessage.set({
        type: 'error',
        title: 'Error al guardar los cambios en el servidor:',
        details: [err.message || 'Ocurrió un error inesperado al conectar con el servidor.']
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected isFieldInvalid(fieldName: string): boolean {
    const field = this.vehicleForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}
