<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <!-- Page Header -->
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="w-2 h-2 rounded-full bg-premium-gold animate-pulse"></span>
          <span class="text-[10px] font-bold text-premium-gold uppercase tracking-[0.3em]">Gestion des Stocks</span>
        </div>
        <h1 class="text-4xl font-display font-black text-premium-midnight tracking-tight">Entrepôts</h1>
        <p class="text-slate-500 text-sm font-medium mt-1">Supervisez vos espaces de stockage et niveaux d'inventaire.</p>
      </div>
      
      <div class="flex flex-wrap items-center gap-3">
        <button @click="openExternalWarehouse" class="px-6 py-3 rounded-xl border-2 border-premium-midnight text-premium-midnight hover:bg-premium-midnight hover:text-white text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2">
          <Handshake class="w-4 h-4" />
          Louer un Entrepôt
        </button>
        <button @click="openAddModal" class="btn-gold !px-8 !py-3.5 !text-xs flex items-center gap-2 shrink-0">
          <Plus class="w-4 h-4" />
          Nouvel Entrepôt
        </button>
      </div>
    </div>

    <!-- KPI Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all duration-300">
        <div class="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:bg-premium-gold/10 transition-colors duration-500">
          <WarehouseIcon class="w-6 h-6 text-slate-400 group-hover:text-premium-gold transition-colors" />
        </div>
        <p class="text-4xl font-display font-black text-premium-midnight tracking-tight">{{ filteredWarehouses.length }}</p>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Entrepôts Actifs</p>
      </div>

      <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all duration-300">
        <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
          <Box class="w-6 h-6 text-blue-500" />
        </div>
        <p class="text-4xl font-display font-black text-premium-midnight tracking-tight">{{ storageTypesCount }}</p>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Types de Stockage</p>
      </div>

      <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all duration-300">
        <div class="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-6">
          <CheckCircle2 class="w-6 h-6 text-green-500" />
        </div>
        <p class="text-4xl font-display font-black text-premium-midnight tracking-tight">
          {{ warehouses.filter(w => w.status === 'available').length }}
        </p>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Disponibles</p>
      </div>

      <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all duration-300">
        <div class="w-12 h-12 rounded-2xl bg-premium-gold/10 flex items-center justify-center mb-6">
          <ShieldCheck class="w-6 h-6 text-premium-gold" />
        </div>
        <p class="text-4xl font-display font-black text-premium-midnight tracking-tight">100%</p>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Conformité Sécurité</p>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col md:flex-row gap-4 shadow-sm">
      <div class="relative flex-grow">
        <Search class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Rechercher par nom ou localisation..."
          class="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-premium-gold/5 focus:border-premium-gold/30 transition-all placeholder:text-slate-300"
        />
      </div>
      
      <div class="flex gap-3">
        <select v-model="statusFilter" class="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-premium-gold/5 transition-all">
          <option value="">Tous les statuts</option>
          <option value="available">Disponible</option>
          <option value="occupied">Occupé</option>
          <option value="maintenance">Maintenance</option>
        </select>
        
        <select v-model="typeFilter" class="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-premium-gold/5 transition-all">
          <option value="">Tous les types</option>
          <option value="internal">Interne</option>
          <option value="external">Externe</option>
        </select>
      </div>
    </div>

    <!-- Warehouse Grid -->
    <div v-if="!loading" class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
      <div 
        v-for="warehouse in filteredWarehouses" 
        :key="warehouse._id"
        class="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-premium-midnight/5 transition-all duration-500"
      >
        <!-- Card Header -->
        <div class="p-8 pb-0 flex items-start justify-between">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:border-premium-gold/30 transition-all duration-500">
              <WarehouseIcon class="w-7 h-7 text-premium-midnight group-hover:text-premium-gold transition-colors" />
            </div>
            <div>
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest">{{ warehouse.type === 'internal' ? 'Interne' : 'Externe' }}</span>
                <span v-if="warehouse.is_rented" class="px-2 py-0.5 rounded-md bg-premium-gold/10 text-premium-gold text-[9px] font-black uppercase tracking-widest">Loué</span>
              </div>
              <h3 class="text-xl font-display font-black text-premium-midnight leading-tight line-clamp-1">{{ warehouse.name }}</h3>
              <div class="flex items-center gap-1.5 text-slate-400 text-xs font-medium mt-1">
                <MapPin class="w-3.5 h-3.5" />
                <span class="line-clamp-1">{{ warehouse.location }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-1.5">
            <button @click="editWarehouse(warehouse)" class="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:bg-slate-50 hover:text-premium-midnight transition-all">
              <Pencil class="w-4 h-4" />
            </button>
            <button @click="openDeleteModal(warehouse._id)" class="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-8 space-y-6 flex-grow">
          <!-- Main Info Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-slate-50/50 p-4 rounded-2xl">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacité</p>
              <p class="text-sm font-bold text-premium-midnight">{{ warehouse.capacity }} <span class="text-[10px] font-medium text-slate-400">Unités</span></p>
            </div>
            <div class="bg-slate-50/50 p-4 rounded-2xl">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Type Stockage</p>
              <div class="flex items-center gap-2">
                <i :class="getStorageTypeIcon(warehouse.storage_type)" class="w-3.5 h-3.5 text-premium-gold"></i>
                <p class="text-sm font-bold text-premium-midnight capitalize">{{ warehouse.storage_type }}</p>
              </div>
            </div>
          </div>

          <!-- Status Badge -->
          <div class="flex items-center justify-between">
            <span :class="[
              'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest',
              warehouse.status === 'available' ? 'bg-green-50 text-green-600' :
              warehouse.status === 'occupied' ? 'bg-premium-gold/10 text-premium-gold' : 'bg-red-50 text-red-500'
            ]">
              <span class="w-2 h-2 rounded-full" :class="[
                warehouse.status === 'available' ? 'bg-green-500' :
                warehouse.status === 'occupied' ? 'bg-premium-gold' : 'bg-red-500'
              ]"></span>
              {{ formatStatus(warehouse.status) }}
            </span>
          </div>

          <!-- Capacity Bar (for rented) -->
          <div v-if="warehouse.is_rented" class="space-y-2">
            <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span class="text-slate-400">Utilisation Location</span>
              <span class="text-premium-midnight">{{ Math.round(((warehouse.rented_capacity || 0) / warehouse.capacity * 100)) }}%</span>
            </div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                class="h-full bg-premium-gold rounded-full transition-all duration-1000"
                :style="{ width: `${Math.round((warehouse.rented_capacity || 0) / warehouse.capacity * 100)}%` }"
              ></div>
            </div>
          </div>

          <!-- Products Section -->
          <div class="pt-6 border-t border-slate-50">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-xs font-black text-premium-midnight uppercase tracking-widest flex items-center gap-2">
                <Box class="w-4 h-4 text-slate-300" />
                Inventaire
              </h4>
              <button @click="openAddProductModal(warehouse._id)" class="text-[10px] font-black text-premium-gold uppercase tracking-widest hover:underline flex items-center gap-1">
                <Plus class="w-3 h-3" />
                Ajouter
              </button>
            </div>

            <div v-if="warehouse.products && warehouse.products.length > 0" class="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              <div v-for="product in warehouse.products" :key="getProductKey(product)" class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                <div>
                  <p class="text-xs font-bold text-premium-midnight">{{ getProductName(product) }}</p>
                  <p class="text-[9px] font-medium text-slate-400 uppercase tracking-tight">{{ getProductCategory(product) }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <div class="flex items-center bg-white border border-slate-100 rounded-lg overflow-hidden shadow-sm">
                    <button 
                      @click="updateProductQuantity(warehouse._id, getProductId(product), product.quantity - 1)"
                      :disabled="product.quantity <= 0 || updatingProduct"
                      class="px-2 py-1 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                    >
                      <Minus class="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      v-model.number="product.quantity"
                      @change="updateProductQuantity(warehouse._id, getProductId(product), product.quantity)"
                      class="w-10 text-center text-xs font-bold text-premium-midnight bg-transparent focus:outline-none"
                    />
                    <button 
                      @click="updateProductQuantity(warehouse._id, getProductId(product), product.quantity + 1)"
                      :disabled="updatingProduct"
                      class="px-2 py-1 hover:bg-slate-50 transition-colors"
                    >
                      <Plus class="w-3 h-3" />
                    </button>
                  </div>
                  <button @click="removeProduct(warehouse._id, getProductId(product))" class="text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="py-8 flex flex-col items-center justify-center gap-2 opacity-40">
              <PackageOpen class="w-8 h-8 text-slate-300" />
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Aucun produit</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="!filteredWarehouses.length && !loading" class="col-span-full py-32 flex flex-col items-center justify-center gap-6">
        <div class="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center">
          <WarehouseIcon class="w-12 h-12 text-slate-200" />
        </div>
        <div class="text-center">
          <p class="text-xl font-display font-black text-premium-midnight">Aucun entrepôt trouvé</p>
          <p class="text-slate-400 text-sm mt-1">Commencez par ajouter ou louer un espace de stockage.</p>
        </div>
        <button @click="openAddModal" class="btn-gold !px-10">Créer mon premier entrepôt</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-32 flex flex-col items-center justify-center gap-4">
      <div class="w-12 h-12 border-4 border-premium-gold/20 border-t-premium-gold rounded-full animate-spin"></div>
      <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Chargement des données...</p>
    </div>


    <Teleport to="body">
    <!-- External Warehouse Modal (Rental) -->
    <div v-if="showExternalWarehouseModal" class="modal-overlay" @click.self="closeModals">
      <div class="modal-content !max-w-4xl">
        <div class="modal-header">
          <h2 class="text-xl font-display font-bold text-premium-midnight flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-premium-gold/10 flex items-center justify-center">
              <Handshake class="w-5 h-5 text-premium-gold" />
            </div>
            Entrepôts Externes Disponibles
          </h2>
          <button @click="closeModals" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-premium-midnight transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="modal-body">
          <div v-if="externalLoading" class="py-20 flex flex-col items-center gap-4">
            <div class="w-10 h-10 border-4 border-premium-gold/20 border-t-premium-gold rounded-full animate-spin"></div>
            <span class="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Chargement des offres...</span>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
            <div v-for="warehouse in externalWarehouses" :key="warehouse._id" class="p-6 rounded-3xl border border-slate-100 bg-slate-50/30 hover:border-premium-gold/30 transition-all group">
              <div class="flex items-start justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
                    <WarehouseIcon class="w-5 h-5 text-premium-midnight" />
                  </div>
                  <div>
                    <h3 class="font-display font-black text-premium-midnight tracking-tight">{{ warehouse.name }}</h3>
                    <div class="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                      <MapPin class="w-3 h-3" />
                      {{ warehouse.location }}
                    </div>
                  </div>
                </div>
                <span class="px-2.5 py-1 rounded-lg bg-white border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ warehouse.type }}</span>
              </div>

              <div class="grid grid-cols-2 gap-3 mb-6">
                <div class="bg-white p-3 rounded-xl border border-slate-100">
                  <p class="text-[8px] font-black text-slate-400 uppercase mb-1">Capacité Dispo</p>
                  <p class="text-sm font-bold text-premium-midnight">{{ warehouse.capacity }} <span class="text-[10px] text-slate-400">Units</span></p>
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-100">
                  <p class="text-[8px] font-black text-slate-400 uppercase mb-1">Type Stockage</p>
                  <p class="text-sm font-bold text-premium-midnight capitalize">{{ warehouse.storage_type }}</p>
                </div>
              </div>
              
              <!-- Rental Form / Status -->
              <div class="pt-6 border-t border-slate-100">
                <div v-if="hasRentalRequest(warehouse)" class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">État de la demande</span>
                    <span :class="[
                      'px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest',
                      getRentalRequest(warehouse)?.status === 'approved' ? 'bg-green-50 text-green-600' :
                      getRentalRequest(warehouse)?.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                    ]">
                      {{ getRentalRequest(warehouse)?.status }}
                    </span>
                  </div>
                  <button v-if="getRentalRequest(warehouse)?.status === 'pending'" @click="cancelRentalRequest(warehouse._id, getRentalRequest(warehouse)?._id ?? '')" class="w-full py-2.5 text-[10px] font-black text-red-500 uppercase tracking-widest border border-red-100 rounded-xl hover:bg-red-50 transition-all">Annuler la demande</button>
                </div>
                
                <div v-else class="space-y-4">
                  <div class="grid grid-cols-1 gap-3">
                    <div>
                      <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Capacité souhaitée</label>
                      <input type="number" v-model.number="rentalRequests[warehouse._id]" :max="warehouse.capacity" class="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-premium-gold/30" :placeholder="'Max: ' + warehouse.capacity">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Début</label>
                        <input type="date" v-model="rentalStartDates[warehouse._id]" class="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-premium-gold/30">
                      </div>
                      <div>
                        <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Fin</label>
                        <input type="date" v-model="rentalEndDates[warehouse._id]" class="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-premium-gold/30">
                      </div>
                    </div>
                  </div>
                  <button @click="submitRentalRequest(warehouse._id)" :disabled="!isRentalFormValid(warehouse._id)" class="w-full py-3.5 bg-premium-midnight text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 disabled:opacity-20 transition-all shadow-lg shadow-premium-midnight/10">Envoyer la demande</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Warehouse Modal -->
    <div v-if="showWarehouseModal" class="modal-overlay" @click.self="closeModals">
      <div class="modal-content !max-w-2xl">
        <div class="modal-header">
          <h2 class="text-xl font-display font-bold text-premium-midnight flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-premium-gold/10 flex items-center justify-center">
              <WarehouseIcon class="w-5 h-5 text-premium-gold" />
            </div>
            {{ isEditing ? 'Modifier' : 'Ajouter' }} un Entrepôt
          </h2>
          <button @click="closeModals" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-premium-midnight transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit" id="warehouseForm" class="space-y-6">
            <div class="space-y-2 text-left">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nom</label>
              <div class="relative group">
                <WarehouseIcon class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                <input v-model="warehouseForm.name" type="text" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all" />
              </div>
            </div>
            <div class="space-y-2 text-left">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Localisation</label>
              <div class="relative group">
                <MapPin class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                <input v-model="warehouseForm.location" type="text" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all" />
              </div>
            </div>
            <div class="space-y-2 text-left">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Type de Stockage</label>
              <div class="relative group">
                <Box class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                <select v-model="warehouseForm.storage_type" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-10 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all appearance-none cursor-pointer">
                  <option value="ambient">Ambiant</option>
                  <option value="freezer">Congélateur</option>
                  <option value="refrigerated">Réfrigéré</option>
                  <option value="controlled">Contrôlé</option>
                </select>
              </div>
            </div>
            <div class="space-y-2 text-left">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Capacité (Unités)</label>
              <div class="relative group">
                <PackageOpen class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                <input v-model.number="warehouseForm.capacity" type="number" required min="1" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all" />
              </div>
            </div>
            <div class="space-y-2 text-left">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Statut</label>
              <div class="relative group">
                <ShieldCheck class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                <select v-model="warehouseForm.status" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-10 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all appearance-none cursor-pointer">
                  <option value="available">Disponible</option>
                  <option value="occupied">Occupé</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" @click="closeModals" class="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Annuler</button>
          <button type="submit" form="warehouseForm" :disabled="isSubmitting" class="flex-1 btn-gold">
            {{ isEditing ? 'Mettre à jour' : 'Ajouter l\'entrepôt' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Product Modal -->
    <div v-if="showProductModal" class="modal-overlay" @click.self="closeModals">
      <div class="modal-content !max-w-lg">
        <div class="modal-header">
          <h2 class="text-xl font-display font-bold text-premium-midnight flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-premium-gold/10 flex items-center justify-center">
              <Box class="w-5 h-5 text-premium-gold" />
            </div>
            Ajouter un Produit
          </h2>
          <button @click="closeModals" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-premium-midnight transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleProductSubmit" id="productForm" class="space-y-6">
            <div class="space-y-2 text-left">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Sélectionner le produit</label>
              <div class="relative group">
                <Box class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                <select v-model="productForm.productId" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-10 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all appearance-none cursor-pointer">
                  <option value="" disabled>Choisir un produit...</option>
                  <option v-for="product in availableProducts" :key="product._id" :value="product._id">{{ product.name }} ({{ product.category }})</option>
                </select>
              </div>
            </div>
            <div class="space-y-2 text-left">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Quantité</label>
              <div class="relative group">
                <PackageOpen class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                <input type="number" v-model.number="productForm.quantity" required min="1" :max="maxQuantityForWarehouse" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all">
              </div>
              <p class="text-[10px] font-medium text-slate-400 ml-1 mt-1">Capacité disponible : {{ maxQuantityForWarehouse }} unités</p>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" @click="closeModals" class="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Annuler</button>
          <button type="submit" form="productForm" :disabled="isSubmitting || maxQuantityForWarehouse <= 0" class="flex-1 btn-gold">Confirmer l'ajout</button>
        </div>
      </div>
    </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Warehouse as WarehouseIcon, Plus, Handshake, Box, CheckCircle2, ShieldCheck, Search, MapPin, Pencil, Trash2, Minus, PackageOpen, X } from 'lucide-vue-next'

interface Product {
  _id: string
  name: string
  category: string
  description?: string
}

interface WarehouseProduct {
  product: Product | string
  quantity: number
  _id?: string
}

interface RentalRequest {
  _id: string
  warehouse_id: string
  company_id: string
  status: 'pending' | 'approved' | 'rejected'
  requested_capacity: number
  start_date: string | Date
  end_date: string | Date
  requested_at?: string | Date
}

interface Warehouse {
  _id: string
  name: string
  type: 'internal' | 'external'
  location: string
  storage_type: string
  capacity: number
  status: string
  is_rented?: boolean
  products?: WarehouseProduct[]
  rented_capacity?: number
  rental_requests?: RentalRequest[]
  company_info?: {
    name: string
    address: string
    contact: string
  }
  updatedAt?: string
}

// State
const maxQuantityForWarehouse = ref(0);
const warehouses = ref<Warehouse[]>([])
const availableProducts = ref<Product[]>([])
const externalWarehouses = ref<Warehouse[]>([])
const loading = ref(true)
const externalLoading = ref(false)
const isSubmitting = ref(false)
const updatingProduct = ref(false)
const error = ref<string | null>(null)
const externalError = ref<string | null>(null)
const searchTerm = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const showWarehouseModal = ref(false)
const showProductModal = ref(false)
const showExternalWarehouseModal = ref(false)
const isEditing = ref(false)
const currentWarehouseId = ref<string | null>(null)
const currentCompanyId = ref('')
const rentalRequests = ref<Record<string, number>>({})
const rentalStartDates = ref<Record<string, string>>({})
const rentalEndDates = ref<Record<string, string>>({})

const warehouseForm = ref({
  name: '',
  type: 'internal' as 'internal' | 'external',
  location: '',
  storage_type: 'ambient' as 'freezer' | 'refrigerated' | 'ambient' | 'controlled',
  capacity: 1000,
  status: 'available' as 'available' | 'occupied' | 'maintenance'
})

const productForm = ref({
  warehouseId: '',
  productId: '',
  quantity: 1
})

// API Configuration
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Auth interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Computed Properties
const filteredWarehouses = computed(() => {
  let filtered = warehouses.value
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(w => 
      w.name.toLowerCase().includes(term) || 
      w.location.toLowerCase().includes(term)
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(w => w.status === statusFilter.value)
  }
  
  if (typeFilter.value) {
    filtered = filtered.filter(w => 
      typeFilter.value === 'internal' 
        ? w.type === 'internal' 
        : w.type === 'external' && w.is_rented
    )
  }
  
  return filtered
})

const storageTypesCount = computed(() => {
  const types = new Set(warehouses.value.map(wh => wh.storage_type))
  return types.size
})

// Utility Functions
const getProductKey = (product: WarehouseProduct) => {
  if (typeof product.product === 'object') {
    return product.product._id
  }
  return String(product.product)
}

const getProductId = (product: WarehouseProduct) => {
  if (typeof product.product === 'object') {
    return product.product._id
  }
  return String(product.product)
}

const getProductName = (product: WarehouseProduct): string => {
  if (typeof product.product === 'object' && product.product !== null) {
    return product.product.name;
  }
  const foundProduct = availableProducts.value.find(p => p._id === String(product.product));
  return foundProduct?.name || `Produit (${String(product.product).slice(-4)})`;
};

const getProductCategory = (product: WarehouseProduct): string => {
  if (typeof product.product === 'object' && product.product !== null) {
    return product.product.category;
  }
  const foundProduct = availableProducts.value.find(p => p._id === String(product.product));
  return foundProduct?.category || 'Sans catégorie';
};

const formatStatus = (status: string) => {
  const statuses: Record<string, string> = {
    available: 'Disponible',
    occupied: 'Occupé',
    maintenance: 'Maintenance'
  }
  return statuses[status] || status
}
  
const getStorageTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    freezer: 'fas fa-snowflake',
    refrigerated: 'fas fa-temperature-low',
    ambient: 'fas fa-thermometer-half',
    controlled: 'fas fa-sliders-h'
  }
  return icons[type] || 'fas fa-warehouse'
}

// Rental Request Functions
const hasRentalRequest = (warehouse: Warehouse) => {
  return warehouse.rental_requests?.some(req => req.company_id === currentCompanyId.value)
}

const getRentalRequest = (warehouse: Warehouse) => {
  return warehouse.rental_requests?.find(req => req.company_id === currentCompanyId.value)
}

const isRentalFormValid = (warehouseId: string) => {
  return (
    rentalRequests.value[warehouseId] > 0 &&
    rentalStartDates.value[warehouseId] &&
    rentalEndDates.value[warehouseId] &&
    new Date(rentalEndDates.value[warehouseId]) > new Date(rentalStartDates.value[warehouseId])
  )
}

const submitRentalRequest = async (warehouseId: string) => {
  try {
    externalLoading.value = true
    const capacity = Number(rentalRequests.value[warehouseId])
    const startDate = rentalStartDates.value[warehouseId]
    const endDate = rentalEndDates.value[warehouseId]

    await api.post('/request/send', {
      warehouse_id: warehouseId,
      requested_capacity: capacity,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString()
    })

    await Swal.fire({
      icon: 'success',
      title: 'Demande envoyée',
      text: 'Votre demande de location a été transmise.'
    })

    await loadExternalWarehouses()
    
  } catch (err: any) {
    Swal.fire({ icon: 'error', title: 'Erreur', text: err.response?.data?.message || err.message })
  } finally {
    externalLoading.value = false
  }
}

const cancelRentalRequest = async (warehouseId: string, requestId: string) => {
  try {
    const result = await Swal.fire({
      title: 'Annuler la demande ?',
      text: "Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, annuler'
    })

    if (!result.isConfirmed) return

    externalLoading.value = true
    await api.delete(`/rental-requests/${requestId}`)

    await Swal.fire('Annulée', 'La demande a été annulée.', 'success')
    await loadExternalWarehouses()
  } catch (err: any) {
    Swal.fire({ icon: 'error', title: 'Erreur', text: err.response?.data?.message || err.message })
  } finally {
    externalLoading.value = false
  }
}

// Warehouse CRUD
const fetchWarehouses = async () => {
  try {
    loading.value = true
    const { data } = await api.get('/warehouses/getCompanyWarehouses?populate=products.product')

    if (data.success && data.data) {
      warehouses.value = [
        ...(data.data.internal || []).map((w: any) => ({ ...w, type: 'internal' })),
        ...(data.data.external || []).map((w: any) => ({ ...w, type: 'external', is_rented: true }))
      ]
    }
  } catch (err: any) {
    console.error('Error fetching warehouses:', err)
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  isEditing.value = false
  currentWarehouseId.value = null
  warehouseForm.value = {
    name: '',
    type: 'internal',
    location: '',
    storage_type: 'ambient',
    capacity: 1000,
    status: 'available'
  }
  showWarehouseModal.value = true
}

const editWarehouse = (warehouse: Warehouse) => {
  isEditing.value = true
  currentWarehouseId.value = warehouse._id
  warehouseForm.value = { 
    name: warehouse.name,
    type: warehouse.type,
    location: warehouse.location,
    storage_type: warehouse.storage_type as any,
    capacity: warehouse.capacity,
    status: warehouse.status as any
  }
  showWarehouseModal.value = true
}

const openDeleteModal = async (id: string) => {
  const result = await Swal.fire({
    title: 'Supprimer ?',
    text: "L'entrepôt sera définitivement supprimé.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626'
  })

  if (result.isConfirmed) {
    try {
      await api.delete(`/warehouses/deleteInternalDepot/${id}`)
      warehouses.value = warehouses.value.filter(w => w._id !== id)
      Swal.fire('Supprimé', '', 'success')
    } catch (err: any) {
      Swal.fire('Erreur', err.response?.data?.message || err.message, 'error')
    }
  }
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    if (isEditing.value) {
      const { data } = await api.put(`/warehouses/updateInternalDepot/${currentWarehouseId.value}`, warehouseForm.value)
      const index = warehouses.value.findIndex(w => w._id === currentWarehouseId.value)
      if (index !== -1) warehouses.value[index] = { ...data.data, type: 'internal' }
    } else {
      const { data } = await api.post('/warehouses/addInternalDepot', { ...warehouseForm.value, companyId: currentCompanyId.value })
      warehouses.value.unshift({ ...data.data, type: 'internal' })
    }
    showWarehouseModal.value = false
    Swal.fire('Succès', '', 'success')
  } catch (err: any) {
    Swal.fire('Erreur', err.response?.data?.message || err.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}

// Product Management
const openAddProductModal = async (warehouseId: string) => {
  currentWarehouseId.value = warehouseId
  const warehouse = warehouses.value.find(w => w._id === warehouseId)
  if (warehouse) {
    const used = warehouse.products?.reduce((sum, p) => sum + p.quantity, 0) || 0
    const total = warehouse.type === 'internal' ? warehouse.capacity : (warehouse.rented_capacity || 0)
    maxQuantityForWarehouse.value = total - used
  }
  productForm.value = { warehouseId, productId: '', quantity: 1 }
  showProductModal.value = true
}

const handleProductSubmit = async () => {
  try {
    isSubmitting.value = true
    await api.post(`/warehouses/${productForm.value.warehouseId}/products`, {
      productId: productForm.value.productId,
      quantity: productForm.value.quantity
    })
    await fetchWarehouses()
    showProductModal.value = false
    Swal.fire('Succès', 'Produit ajouté', 'success')
  } catch (err: any) {
    Swal.fire('Erreur', err.response?.data?.error || err.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}

const updateProductQuantity = async (warehouseId: string, productId: string, newQuantity: number) => {
  if (newQuantity < 0) return
  try {
    updatingProduct.value = true
    await api.put(`/warehouses/${warehouseId}/products/${productId}`, { quantity: newQuantity })
    const wh = warehouses.value.find(w => w._id === warehouseId)
    if (wh?.products) {
      const p = wh.products.find(p => getProductId(p) === productId)
      if (p) p.quantity = newQuantity
    }
  } catch (err: any) {
    Swal.fire('Erreur', err.response?.data?.message || err.message, 'error')
  } finally {
    updatingProduct.value = false
  }
}

const removeProduct = async (warehouseId: string, productId: string) => {
  const result = await Swal.fire({ title: 'Retirer le produit ?', icon: 'warning', showCancelButton: true })
  if (!result.isConfirmed) return
  try {
    await api.delete(`/warehouses/${warehouseId}/products/${productId}`)
    const wh = warehouses.value.find(w => w._id === warehouseId)
    if (wh) wh.products = wh.products?.filter(p => getProductId(p) !== productId)
  } catch (err: any) {
    Swal.fire('Erreur', err.response?.data?.message || err.message, 'error')
  }
}

const loadExternalWarehouses = async () => {
  try {
    externalLoading.value = true
    const { data } = await api.get('/warehouses/external')
    externalWarehouses.value = (data.data || []).map((wh: any) => ({ ...wh, type: 'external' }))
  } catch (err) {
    console.error(err)
  } finally {
    externalLoading.value = false
  }
}

const openExternalWarehouse = async () => {
  await loadExternalWarehouses()
  showExternalWarehouseModal.value = true
}

const closeModals = () => {
  showWarehouseModal.value = false
  showProductModal.value = false
  showExternalWarehouseModal.value = false
}

onMounted(async () => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    try {
      const { data: userData } = await api.get('/users/meCompany')
      currentCompanyId.value = userData.companyId
      
      const { data: productsData } = await api.get('/products/get')
      availableProducts.value = productsData.data || productsData
      
      await fetchWarehouses()
    } catch (err) {
      console.error('Initialization error:', err)
    }
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-modal-in {
  animation: modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95) translateY(30px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #C4A484;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>
