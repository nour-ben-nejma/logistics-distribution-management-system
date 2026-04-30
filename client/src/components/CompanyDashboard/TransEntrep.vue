<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <!-- Page Header -->
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="w-2 h-2 rounded-full bg-premium-gold animate-pulse"></span>
          <span class="text-[10px] font-bold text-premium-gold uppercase tracking-[0.3em]">Gestion du Personnel</span>
        </div>
        <h1 class="text-4xl font-display font-black text-premium-midnight tracking-tight">Transporteurs</h1>
        <p class="text-slate-500 text-sm font-medium mt-1">Gérez votre équipe de chauffeurs et leurs disponibilités.</p>
      </div>
      
      <button @click="openAddModal" class="btn-gold !px-8 !py-3.5 !text-xs flex items-center gap-2 shrink-0">
        <Plus class="w-4 h-4" />
        Nouveau Transporteur
      </button>
    </div>

    <!-- KPI Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all duration-300">
        <div class="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:bg-premium-gold/10 transition-colors duration-500">
          <Users class="w-6 h-6 text-slate-400 group-hover:text-premium-gold transition-colors" />
        </div>
        <p class="text-4xl font-display font-black text-premium-midnight tracking-tight">{{ transporters.length }}</p>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Total Équipe</p>
      </div>

      <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all duration-300">
        <div class="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-6">
          <CheckCircle2 class="w-6 h-6 text-green-500" />
        </div>
        <p class="text-4xl font-display font-black text-premium-midnight tracking-tight">{{ availableTransportersCount }}</p>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Disponibles</p>
      </div>

      <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all duration-300">
        <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
          <Truck class="w-6 h-6 text-blue-500" />
        </div>
        <p class="text-4xl font-display font-black text-premium-midnight tracking-tight">
          {{ transporters.filter(t => t.status === 'On mission').length }}
        </p>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">En Mission</p>
      </div>

      <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all duration-300">
        <div class="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-6">
          <Calendar class="w-6 h-6 text-amber-500" />
        </div>
        <p class="text-4xl font-display font-black text-premium-midnight tracking-tight">
          {{ transporters.filter(t => t.status === 'On leave').length }}
        </p>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">En Congé</p>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col md:flex-row gap-4 shadow-sm">
      <div class="relative flex-grow">
        <Search class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Rechercher par nom, téléphone ou CIN..."
          class="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-premium-gold/5 focus:border-premium-gold/30 transition-all placeholder:text-slate-300"
          @input="resetFilters"
        />
      </div>
      
      <div class="flex gap-3">
        <select v-model="statusFilter" class="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-premium-gold/5 transition-all" @change="resetSearch">
          <option value="">Tous les statuts</option>
          <option value="Available">Disponible</option>
          <option value="On mission">En mission</option>
          <option value="On leave">En congé</option>
        </select>
        
        <select v-model="licenceFilter" class="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-premium-gold/5 transition-all" @change="resetSearch">
          <option value="">Tous les permis</option>
          <option v-for="type in ['A1', 'A', 'B', 'B+E', 'C', 'C+E', 'D', 'D1', 'D+E', 'H']" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
    </div>

    <!-- Transporters Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <div 
        v-for="transporter in filteredTransporters" 
        :key="transporter._id"
        class="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-premium-midnight/5 transition-all duration-500"
      >
        <!-- Card Header -->
        <div class="p-8 pb-4 flex items-start justify-between">
          <div class="flex items-center gap-5">
            <div class="relative">
              <div class="w-20 h-20 rounded-[2rem] overflow-hidden bg-slate-50 border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500">
                <img 
                  v-if="transporter.profilePicture" 
                  :src="transporter.profilePicture" 
                  class="w-full h-full object-cover" 
                  :alt="transporter.firstName"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-slate-50 border border-slate-100 text-premium-midnight font-display font-black text-2xl group-hover:text-premium-gold transition-colors">
                  {{ getInitials(transporter) }}
                </div>
              </div>
              <div 
                class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-sm"
                :class="[
                  transporter.status === 'Available' ? 'bg-green-500' :
                  transporter.status === 'On mission' ? 'bg-blue-500' : 'bg-amber-500'
                ]"
              ></div>
            </div>
            <div>
              <h3 class="text-xl font-display font-black text-premium-midnight leading-tight">{{ transporter.firstName }} {{ transporter.lastName }}</h3>
              <div class="flex flex-col gap-1 mt-2">
                <div class="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <Phone class="w-3 h-3" />
                  {{ transporter.phoneNumber }}
                </div>
                <div class="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <IdCard class="w-3 h-3" />
                  {{ transporter.CIN }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-1">
            <button @click="editTransporter(transporter)" class="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:bg-slate-50 hover:text-premium-midnight transition-all">
              <Pencil class="w-4 h-4" />
            </button>
            <button @click="openDeleteModal(transporter)" class="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-8 pt-4 space-y-6 flex-grow">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-slate-50/50 p-4 rounded-2xl">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Permis</p>
              <p class="text-sm font-bold text-premium-midnight">Catégorie {{ transporter.typeDrivingLicence }}</p>
            </div>
            <div class="bg-slate-50/50 p-4 rounded-2xl">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Statut</p>
              <span :class="[
                'inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest',
                transporter.status === 'Available' ? 'bg-green-50 text-green-600' :
                transporter.status === 'On mission' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
              ]">
                {{ transporter.status === 'Available' ? 'Disponible' : transporter.status === 'On mission' ? 'En Mission' : 'En Congé' }}
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
            <div class="flex items-center gap-2">
              <Calendar class="w-3.5 h-3.5" />
              Rejoint le {{ formatDate(transporter.createdAt) }}
            </div>
            <div class="flex items-center gap-1.5 text-premium-gold">
              <ShieldCheck class="w-3.5 h-3.5" />
              Vérifié
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!filteredTransporters.length && !loading" class="col-span-full py-32 flex flex-col items-center justify-center gap-6">
        <div class="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center">
          <Users class="w-12 h-12 text-slate-200" />
        </div>
        <div class="text-center">
          <p class="text-xl font-display font-black text-premium-midnight">Aucun transporteur trouvé</p>
          <p class="text-slate-400 text-sm mt-1">Élargissez vos critères de recherche ou ajoutez un nouveau membre.</p>
        </div>
        <button @click="openAddModal" class="btn-gold !px-10">Ajouter un transporteur</button>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showTransporterModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-premium-midnight/40 backdrop-blur-sm" @click="closeModals"></div>
      <div class="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-modal-in">
        <div class="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 class="text-2xl font-display font-black text-premium-midnight">{{ isEditing ? 'Modifier' : 'Ajouter' }} un Transporteur</h2>
            <p class="text-slate-500 text-xs font-medium mt-1">Remplissez les informations professionnelles du chauffeur.</p>
          </div>
          <button @click="closeModals" class="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-slate-400 transition-all shadow-sm">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="flex-grow overflow-y-auto p-8">
          <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Profile Photo Upload -->
            <div class="md:col-span-2 flex flex-col items-center py-6 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <div v-if="previewImage" class="relative group">
                <img :src="previewImage" class="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white shadow-xl" />
                <button @click="removeImage" class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                  <X class="w-4 h-4" />
                </button>
              </div>
              <div v-else class="w-32 h-32 rounded-[2.5rem] bg-white flex flex-col items-center justify-center text-slate-300 border border-slate-100">
                <User class="w-10 h-10 mb-2" />
                <span class="text-[8px] font-black uppercase tracking-widest">Photo</span>
              </div>
              
              <label class="mt-4 px-6 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-premium-midnight cursor-pointer hover:bg-slate-50 transition-all shadow-sm">
                Choisir une image
                <input type="file" @change="handleFileUpload" class="hidden" accept="image/*" />
              </label>
              <p class="text-[9px] text-slate-400 mt-2 font-medium">JPG, PNG ou WEBP (Max. 5MB)</p>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Prénom</label>
              <input v-model="transporterForm.firstName" type="text" required class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-premium-midnight focus:outline-none focus:ring-4 focus:ring-premium-gold/5 focus:border-premium-gold/30 transition-all" />
              <span class="text-[9px] text-red-500 font-bold ml-1" v-if="formErrors.firstName">{{ formErrors.firstName }}</span>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nom</label>
              <input v-model="transporterForm.lastName" type="text" required class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-premium-midnight focus:outline-none focus:ring-4 focus:ring-premium-gold/5 focus:border-premium-gold/30 transition-all" />
              <span class="text-[9px] text-red-500 font-bold ml-1" v-if="formErrors.lastName">{{ formErrors.lastName }}</span>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email</label>
              <input v-model="transporterForm.email" type="email" required class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-premium-midnight focus:outline-none focus:ring-4 focus:ring-premium-gold/5 focus:border-premium-gold/30 transition-all" />
              <span class="text-[9px] text-red-500 font-bold ml-1" v-if="formErrors.email">{{ formErrors.email }}</span>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{{ isEditing ? 'Nouveau Mot de passe (optionnel)' : 'Mot de passe' }}</label>
              <input v-model="transporterForm.password" type="password" :required="!isEditing" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-premium-midnight focus:outline-none focus:ring-4 focus:ring-premium-gold/5 focus:border-premium-gold/30 transition-all" />
              <span class="text-[9px] text-red-500 font-bold ml-1" v-if="formErrors.password">{{ formErrors.password }}</span>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Téléphone</label>
              <input v-model="transporterForm.phoneNumber" type="tel" required class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-premium-midnight focus:outline-none focus:ring-4 focus:ring-premium-gold/5 focus:border-premium-gold/30 transition-all" />
              <span class="text-[9px] text-red-500 font-bold ml-1" v-if="formErrors.phoneNumber">{{ formErrors.phoneNumber }}</span>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">CIN</label>
              <input v-model="transporterForm.CIN" type="text" required class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-premium-midnight focus:outline-none focus:ring-4 focus:ring-premium-gold/5 focus:border-premium-gold/30 transition-all" />
              <span class="text-[9px] text-red-500 font-bold ml-1" v-if="formErrors.CIN">{{ formErrors.CIN }}</span>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Type de Permis</label>
              <select v-model="transporterForm.typeDrivingLicence" required class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-premium-midnight focus:outline-none focus:ring-4 focus:ring-premium-gold/5 focus:border-premium-gold/30 transition-all">
                <option value="" disabled>Sélectionnez un permis...</option>
                <option v-for="type in ['A1', 'A', 'B', 'B+E', 'C', 'C+E', 'D', 'D1', 'D+E', 'H']" :key="type" :value="type">{{ type }}</option>
              </select>
              <span class="text-[9px] text-red-500 font-bold ml-1" v-if="formErrors.typeDrivingLicence">{{ formErrors.typeDrivingLicence }}</span>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Statut</label>
              <select v-model="transporterForm.status" required class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-premium-midnight focus:outline-none focus:ring-4 focus:ring-premium-gold/5 focus:border-premium-gold/30 transition-all">
                <option value="Available">Disponible</option>
                <option value="On mission">En mission</option>
                <option value="On leave">En congé</option>
              </select>
              <span class="text-[9px] text-red-500 font-bold ml-1" v-if="formErrors.status">{{ formErrors.status }}</span>
            </div>

            <div class="md:col-span-2 flex gap-4 pt-6 border-t border-slate-100">
              <button type="button" @click="closeModals" class="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">Annuler</button>
              <button type="submit" :disabled="isSubmitting" class="btn-gold flex-[2] py-4 !text-xs font-black uppercase tracking-widest shadow-xl shadow-premium-gold/20">
                {{ isSubmitting ? 'Traitement...' : (isEditing ? 'Mettre à jour' : 'Ajouter le chauffeur') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { Plus, Users, CheckCircle2, Truck, Calendar, Search, Phone, IdCard, Pencil, Trash2, ShieldCheck, User, X } from 'lucide-vue-next';

// State
const transporters = ref<any[]>([]);
const loading = ref(true);
const searchTerm = ref('');
const statusFilter = ref('');
const licenceFilter = ref('');
const showTransporterModal = ref(false);
const isSubmitting = ref(false);
const isEditing = ref(false);
const currentTransporterId = ref<string | null>(null);
const previewImage = ref<string | null>(null);
const selectedFile = ref<File | null>(null);
const formErrors = ref<Record<string, string>>({});

const transporterForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  CIN: '',
  phoneNumber: '',
  typeDrivingLicence: '',
  profilePicture: null,
  status: 'Available'
});

// API Configuration
const api = axios.create({
  baseURL: 'http://localhost:3000/api/users',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Computed
const filteredTransporters = computed(() => {
  let filtered = transporters.value;
  const term = searchTerm.value.toLowerCase();
  
  if (term) {
    filtered = filtered.filter(t => {
      const fullName = `${t.firstName || ''} ${t.lastName || ''}`.toLowerCase();
      return (
        fullName.includes(term) ||
        t.phoneNumber?.toLowerCase().includes(term) ||
        t.CIN?.toLowerCase().includes(term)
      );
    });
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(t => t.status === statusFilter.value);
  }
  
  if (licenceFilter.value) {
    filtered = filtered.filter(t => t.typeDrivingLicence === licenceFilter.value);
  }
  
  return filtered;
});

const availableTransportersCount = computed(() => {
  return transporters.value.filter(t => t.status === 'Available').length;
});

// Methods
const formatDate = (dateString: string) => {
  return dayjs(dateString).format('DD/MM/YYYY');
};

const getInitials = (transporter: any) => {
  const firstName = transporter.firstName || '';
  const lastName = transporter.lastName || '';
  let initials = firstName.charAt(0).toUpperCase();
  if (lastName) {
    initials += lastName.charAt(0).toUpperCase();
  }
  return initials || '?';
};

const resetSearch = () => {
  searchTerm.value = '';
};

const resetFilters = () => {
  statusFilter.value = '';
  licenceFilter.value = '';
};

const fetchTransporters = async () => {
  try {
    loading.value = true;
    const response = await api.get('/transporters');
    
    if (response.data.success && response.data.data) {
      transporters.value = response.data.data.map((t: any) => ({
        ...t,
        status: t.status || 'Unknown'
      }));
    } else {
      throw new Error(response.data.message || 'Failed to load transporters');
    }
  } catch (err: any) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: err.response?.data?.error || err.message || 'Échec du chargement des transporteurs',
      confirmButtonColor: '#dc2626'
    });
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    formErrors.value = {};

    const nameRegex = /^[A-Za-z\u00C0-\u017F\s'-]+$/;
    if (!nameRegex.test(transporterForm.value.firstName)) {
      formErrors.value.firstName = 'Format invalide';
      throw new Error('Prénom invalide');
    }
    if (!nameRegex.test(transporterForm.value.lastName)) {
      formErrors.value.lastName = 'Format invalide';
      throw new Error('Nom invalide');
    }

    const formData = new FormData();
    formData.append('firstName', transporterForm.value.firstName);
    formData.append('lastName', transporterForm.value.lastName);
    formData.append('email', transporterForm.value.email);
    formData.append('CIN', transporterForm.value.CIN);
    formData.append('phoneNumber', transporterForm.value.phoneNumber);
    formData.append('typeDrivingLicence', transporterForm.value.typeDrivingLicence);
    formData.append('status', transporterForm.value.status || 'Available');

    if (transporterForm.value.password) {
      formData.append('password', transporterForm.value.password);
    }
    if (selectedFile.value) {
      formData.append('profilePicture', selectedFile.value);
    }

    let response;
    if (isEditing.value) {
      response = await api.put(
        `/updateTransporter/${currentTransporterId.value}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    } else {
      response = await api.post('/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }

    if (!response.data.success) {
      throw new Error(response.data.error || 'Erreur lors de l\'opération');
    }

    await fetchTransporters();
    closeModals();
    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: isEditing.value ? 'Profil mis à jour' : 'Transporteur ajouté',
      confirmButtonColor: '#16a34a',
      timer: 2000
    });
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: error.response?.data?.error || error.message || 'Une erreur est survenue',
      confirmButtonColor: '#dc2626'
    });
  } finally {
    isSubmitting.value = false;
  }
};

const openDeleteModal = async (transporter: any) => {
  const result = await Swal.fire({
    title: 'Supprimer ?',
    html: `Voulez-vous vraiment supprimer <strong>${transporter.firstName} ${transporter.lastName}</strong> ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b'
  });

  if (result.isConfirmed) {
    await confirmDelete(transporter._id);
  }
};

const confirmDelete = async (id: string) => {
  try {
    const response = await api.delete(`/delete/${id}`);
    if (response.data.success) {
      transporters.value = transporters.value.filter(t => t._id !== id);
      Swal.fire({ icon: 'success', title: 'Supprimé', timer: 2000 });
    }
  } catch (err: any) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: err.response?.data?.error || 'Échec de la suppression',
      confirmButtonColor: '#dc2626'
    });
  }
};

const openAddModal = () => {
  isEditing.value = false;
  currentTransporterId.value = null;
  transporterForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    CIN: '',
    phoneNumber: '',
    typeDrivingLicence: '',
    profilePicture: null,
    status: 'Available'
  };
  previewImage.value = null;
  selectedFile.value = null;
  formErrors.value = {};
  showTransporterModal.value = true;
};

const editTransporter = (transporter: any) => {
  isEditing.value = true;
  currentTransporterId.value = transporter._id;
  transporterForm.value = {
    firstName: transporter.firstName || '',
    lastName: transporter.lastName || '',
    email: transporter.email || '',
    password: '',
    CIN: transporter.CIN || '',
    phoneNumber: transporter.phoneNumber || '',
    typeDrivingLicence: transporter.typeDrivingLicence || '',
    profilePicture: transporter.profilePicture || null,
    status: transporter.status || 'Available'
  };
  previewImage.value = transporter.profilePicture || null;
  selectedFile.value = null;
  formErrors.value = {};
  showTransporterModal.value = true;
};

const handleFileUpload = (event: any) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ icon: 'error', title: 'Fichier trop lourd', text: 'Max 5MB' });
      return;
    }
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e: any) => previewImage.value = e.target.result;
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  previewImage.value = null;
  selectedFile.value = null;
  transporterForm.value.profilePicture = null;
};

const closeModals = () => {
  showTransporterModal.value = false;
  formErrors.value = {};
};

onMounted(fetchTransporters);
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