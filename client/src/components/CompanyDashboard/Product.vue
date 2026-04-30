

<template>
  <div class="p-6 md:p-8 animate-in fade-in duration-500">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-display font-bold text-premium-midnight tracking-tight">Gestion des Produits</h1>
        <p class="text-slate-500 mt-1">Gérez votre catalogue de produits et leurs exigences de stockage</p>
      </div>
      <button @click="openCreateModal" class="btn-gold group">
        <i class="fas fa-plus mr-2 group-hover:rotate-90 transition-transform"></i>
        Nouveau Produit
      </button>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 px-6 py-4 rounded-xl flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-2">
      <div class="flex items-center gap-3">
        <i class="fas fa-exclamation-circle"></i>
        <span class="font-medium">{{ error }}</span>
      </div>
      <button @click="error = null" class="text-red-600/50 hover:text-red-600 transition-colors">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-premium-gold animate-pulse">
      <i class="fas fa-circle-notch fa-spin text-4xl mb-4"></i>
      <p class="font-medium">Chargement du catalogue...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="card-premium flex flex-col items-center justify-center py-20 text-center">
      <div class="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
        <i class="fas fa-box-open text-4xl text-slate-300"></i>
      </div>
      <h3 class="text-xl font-bold text-premium-midnight mb-2">Aucun produit trouvé</h3>
      <p class="text-slate-500 max-w-md mb-8">Votre catalogue est vide. Commencez par ajouter votre premier produit pour gérer son stockage.</p>
      <button @click="openCreateModal" class="btn-outline">
        <i class="fas fa-plus mr-2"></i> Ajouter le premier produit
      </button>
    </div>

    <!-- Products Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="product in products" :key="product._id" class="card-premium group !p-0 overflow-hidden flex flex-col">
        <!-- Card Header (Color coded by category) -->
        <div class="h-24 relative overflow-hidden flex items-center justify-center" :class="'bg-category-' + product.category">
          <div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
          <i :class="['fas', categoryIcons[product.category as keyof typeof categoryIcons] || 'fa-box']" class="text-white text-4xl relative z-10 drop-shadow-md transform group-hover:scale-110 transition-transform duration-500"></i>
        </div>
        
        <!-- Card Body -->
        <div class="p-5 flex-grow flex flex-col">
          <h3 class="text-lg font-bold text-premium-midnight mb-4 line-clamp-1" :title="product.name">{{ product.name }}</h3>
          
          <div class="space-y-3 mt-auto">
            <div class="flex items-center gap-3 text-sm">
              <div class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                <i class="fas fa-tag text-slate-400"></i>
              </div>
              <span class="text-slate-600 font-medium capitalize">{{ product.category }}</span>
            </div>
            
            <div class="flex items-center gap-3 text-sm">
              <div class="w-8 h-8 rounded-lg bg-premium-gold/10 flex items-center justify-center shrink-0">
                <i :class="['fas', storageTypes.find(t => t.value === product.storage_type)?.icon || 'fa-warehouse']" class="text-premium-gold"></i>
              </div>
              <span class="text-slate-600 font-medium">{{ storageTypes.find(t => t.value === product.storage_type)?.label || product.storage_type }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-5 py-4 border-t border-slate-100 flex gap-3 bg-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <button @click="openEditModal(product)" class="flex-1 py-2 rounded-xl text-sm font-bold text-premium-midnight bg-white border border-slate-200 hover:border-premium-gold hover:text-premium-gold transition-colors shadow-sm">
            <i class="fas fa-edit mr-1"></i> Modifier
          </button>
          <button @click="deleteProduct(product._id)" class="px-4 py-2 rounded-xl text-sm font-bold text-red-500 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Product Form Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-premium-midnight/80 backdrop-blur-sm" @click="showModal = false"></div>
      
      <div class="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <!-- Modal Header -->
        <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 class="text-xl font-display font-bold text-premium-midnight flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-premium-gold/10 flex items-center justify-center">
              <i :class="['fas', editingProduct ? 'fa-edit' : 'fa-plus']" class="text-premium-gold"></i>
            </div>
            {{ editingProduct ? 'Modifier le Produit' : 'Nouveau Produit' }}
          </h2>
          <button @click="showModal = false" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-premium-midnight transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- Modal Body -->
        <div class="p-8">
          <form @submit.prevent="saveProduct" class="space-y-6">
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nom du Produit *</label>
              <div class="relative group">
                <i class="fas fa-box absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors"></i>
                <input v-model="productForm.name" type="text" required placeholder="Ex: Ordinateur Portable" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all" />
              </div>
            </div>
            
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Catégorie *</label>
              <div class="relative group">
                <i class="fas fa-tags absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors"></i>
                <select v-model="productForm.category" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-10 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all appearance-none cursor-pointer">
                  <option value="" disabled>Sélectionner une catégorie</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
                  </option>
                </select>
                <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
              </div>
            </div>
            
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Type de Stockage *</label>
              <div class="relative group">
                <i class="fas fa-warehouse absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors"></i>
                <select v-model="productForm.storage_type" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-10 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all appearance-none cursor-pointer">
                  <option v-for="type in storageTypes" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </option>
                </select>
                <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
              </div>
            </div>
            
            <div class="pt-4 flex gap-4">
              <button type="button" @click="showModal = false" class="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                Annuler
              </button>
              <button type="submit" class="flex-1 btn-gold">
                {{ editingProduct ? 'Mettre à jour' : 'Créer le produit' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});

// State
const products = ref<any[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const showModal = ref(false);
const editingProduct = ref(false);

const productForm = ref({
  _id: '',
  name: '',
  category: '',
  storage_type: ''
});

const categories = [
  'electronics',
  'clothing',
  'food',
  'furniture',
  'health',
  'beauty',
  'sports',
  'automotive',
  'home',
  'books'
];

const storageTypes = [
  { value: 'ambient', label: 'Température Ambiante', icon: 'fa-temperature-low' },
  { value: 'refrigerated', label: 'Réfrigéré (4°C)', icon: 'fa-snowflake' },
  { value: 'frozen', label: 'Congelé (-18°C)', icon: 'fa-ice-cream' },
  { value: 'controlled', label: 'Environnement Contrôlé', icon: 'fa-sliders-h' }
];

// Category icons mapping
const categoryIcons = {
  electronics: 'fa-microchip',
  clothing: 'fa-tshirt',
  food: 'fa-utensils',
  furniture: 'fa-couch',
  health: 'fa-heartbeat',
  beauty: 'fa-spa',
  sports: 'fa-running',
  automotive: 'fa-car',
  home: 'fa-home',
  books: 'fa-book'
};

// Methods
const fetchProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get('/products/get');
    products.value = response.data.data || response.data;
  } catch (err) {
    error.value = handleApiError(err, 'fetch products');
  } finally {
    loading.value = false;
  }
};

const handleApiError = (error: any, context: string): string => {
  if (error.response) {
    switch (error.response.status) {
      case 401: return 'Authentification requise';
      case 403: return 'Vous n\'êtes pas autorisé';
      case 404: return `Produits introuvables`;
      case 422: return error.response.data.message || 'Erreur de validation';
      default: return `Erreur ${error.response.status}: ${error.response.data.message || 'Erreur inconnue'}`;
    }
  }
  return `Erreur réseau : échec de l'opération`;
};

const openCreateModal = () => {
  productForm.value = {
    _id: '',
    name: '',
    category: '',
    storage_type: 'ambient'
  };
  editingProduct.value = false;
  showModal.value = true;
};

const openEditModal = (product: any) => {
  productForm.value = { ...product };
  editingProduct.value = true;
  showModal.value = true;
};

const saveProduct = async () => {
  try {
    // Validate all required fields
    if (!productForm.value.name || !productForm.value.category || !productForm.value.storage_type) {
      error.value = 'Tous les champs sont requis';
      return;
    }

    const payload = {
      name: productForm.value.name,
      category: productForm.value.category,
      storage_type: productForm.value.storage_type
    };

    if (editingProduct.value) {
      await api.put(`/products/${productForm.value._id}`, payload);
    } else {
      await api.post('/products/add', payload);
    }

    showModal.value = false;
    await fetchProducts();
  } catch (err) {
    error.value = handleApiError(err, 'save product');
    if (err instanceof Error) {
      console.error('API Error:', (err as any).response?.data || err.message);
    } else {
      console.error('API Error:', err);
    }
  }
};

const deleteProduct = async (id: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) return;
  
  try {
    await api.delete(`/products/${id}`);
    await fetchProducts();
  } catch (err) {
    error.value = handleApiError(err, 'delete product');
  }
};

// Lifecycle
onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.animate-in {
  animation-fill-mode: forwards;
}
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes slide-in-from-top-2 { from { transform: translateY(-0.5rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes zoom-in-95 { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.fade-in { animation-name: fade-in; }
.slide-in-from-top-2 { animation-name: slide-in-from-top-2; }
.zoom-in-95 { animation-name: zoom-in-95; }

/* Category Colors */
.bg-category-electronics { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.bg-category-clothing { background: linear-gradient(135deg, #ec4899, #db2777); }
.bg-category-food { background: linear-gradient(135deg, #f59e0b, #d97706); }
.bg-category-furniture { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.bg-category-health { background: linear-gradient(135deg, #ef4444, #dc2626); }
.bg-category-beauty { background: linear-gradient(135deg, #10b981, #059669); }
.bg-category-sports { background: linear-gradient(135deg, #6366f1, #4f46e5); }
.bg-category-automotive { background: linear-gradient(135deg, #64748b, #475569); }
.bg-category-home { background: linear-gradient(135deg, #f97316, #ea580c); }
.bg-category-books { background: linear-gradient(135deg, #14b8a6, #0d9488); }
</style>