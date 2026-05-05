<template>
  <div class="space-y-8 animate-in fade-in duration-500">
    <!-- Status Messages -->
    <div v-if="loading" class="flex items-center justify-center py-32">
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-premium-gold/20 border-t-premium-gold rounded-full animate-spin"></div>
        <span class="text-sm font-medium text-slate-400 uppercase tracking-widest">Mise à jour du profil...</span>
      </div>
    </div>

    <div v-else-if="error" class="flex items-center gap-4 p-6 bg-red-50 border border-red-100 rounded-2xl">
      <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
        <AlertCircle class="w-5 h-5 text-red-500" />
      </div>
      <div class="flex-1">
        <p class="text-sm font-bold text-red-600">Erreur lors de la modification</p>
        <p class="text-xs text-red-400 mt-0.5">{{ error }}</p>
      </div>
      <button @click="error = ''" class="text-red-400 hover:text-red-600 transition-colors">
        <X class="w-4 h-4" />
      </button>
    </div>

    <div v-else class="space-y-8">
      <!-- Page Header -->
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2 h-2 rounded-full bg-premium-gold"></span>
            <span class="text-[10px] font-bold text-premium-gold uppercase tracking-[0.3em]">Configuration</span>
          </div>
          <h1 class="text-3xl font-display font-black text-premium-midnight tracking-tight">Modifier le Profil</h1>
          <p class="text-slate-500 text-sm font-medium mt-1">Mettez à jour les informations de votre entreprise.</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="resetForm" class="px-6 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-white transition-all">
            Annuler
          </button>
          <button @click="saveChanges" class="btn-gold !px-8 !py-3 !text-xs flex items-center gap-2 shadow-premium">
            <Save class="w-4 h-4" />
            Enregistrer les modifications
          </button>
        </div>
      </div>

      <!-- Hero Header Card -->
      <div class="relative bg-premium-midnight rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div class="absolute top-0 right-0 w-80 h-80 bg-premium-gold/10 blur-[80px] -mr-20 -mt-20"></div>
        <div class="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/5 blur-[60px] -ml-10 -mb-10"></div>

        <div class="relative z-10 p-10 flex flex-col sm:flex-row items-center gap-10 text-center sm:text-left">
          <div class="relative group cursor-pointer">
            <div class="w-32 h-32 rounded-[2rem] overflow-hidden bg-white border-2 border-slate-100 shadow-xl transition-all group-hover:scale-105 group-hover:border-premium-gold/50 flex items-center justify-center p-3">
              <img v-if="company.Logo" :src="company.Logo" :alt="company.companyName" class="w-full h-full object-contain" />
              <div v-else class="w-full h-full flex items-center justify-center text-4xl font-black text-premium-gold">
                {{ company.companyName?.[0]?.toUpperCase() || 'C' }}
              </div>
            </div>
            <div class="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-premium-gold flex items-center justify-center shadow-lg border-4 border-premium-midnight group-hover:scale-110 transition-all">
              <Camera class="w-4 h-4 text-white" />
            </div>
          </div>
          <div class="sm:ml-2">
            <h2 class="text-3xl font-display font-black text-white tracking-tight mb-2">{{ company.companyName || 'Votre Entreprise' }}</h2>
            <p class="text-premium-gold text-xs font-bold uppercase tracking-[0.2em]">{{ company.legalStatus || 'Statut Légal' }}</p>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Info -->
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-10">
            <h3 class="text-sm font-black text-premium-midnight uppercase tracking-wider mb-8 flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-premium-gold/10 flex items-center justify-center">
                <Building2 class="w-5 h-5 text-premium-gold" />
              </div>
              Informations Entreprise
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom de la Société</label>
                <div class="relative group">
                  <Building class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                  <input v-model="company.companyName" type="text" class="input-premium pl-12" placeholder="Nom complet" />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Statut Juridique</label>
                <div class="relative group">
                  <Scale class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                  <select v-model="company.legalStatus" class="input-premium pl-12 appearance-none bg-white">
                    <option value="" disabled>Sélectionner un statut</option>
                    <option value="SARL">SARL</option>
                    <option value="SNC">SNC</option>
                    <option value="SUARL">SUARL</option>
                    <option value="SA">SA</option>
                  </select>
                  <ChevronDown class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">N° Registre Fiscal</label>
                <div class="relative group">
                  <Hash class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                  <input v-model="company.taxRegistrationNumber" type="text" class="input-premium pl-12 font-mono" placeholder="MF-XXXX-XXXX" />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone</label>
                <div class="relative group">
                  <Phone class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                  <input v-model="company.phoneNumber" type="tel" readonly class="input-premium pl-12 opacity-60 cursor-not-allowed" />
                </div>
              </div>

              <div class="md:col-span-2 space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Siège Social</label>
                <div class="relative group">
                  <MapPin class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                  <input v-model="company.registeredOfficeAddress" type="text" class="input-premium pl-12" placeholder="Adresse complète" />
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-10">
            <h3 class="text-sm font-black text-premium-midnight uppercase tracking-wider mb-8 flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-premium-gold/10 flex items-center justify-center">
                <Key class="w-5 h-5 text-premium-gold" />
              </div>
              Modifier le Mot de Passe
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2 space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe actuel</label>
                <div class="relative group">
                  <Lock class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                  <input v-model="oldPassword" :type="showOldPassword ? 'text' : 'password'" class="input-premium pl-12" placeholder="••••••••" />
                  <button @click="showOldPassword = !showOldPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-premium-gold transition-colors">
                    <component :is="showOldPassword ? EyeOff : Eye" class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                <div class="relative group">
                  <ShieldCheck class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                  <input v-model="newPassword" :type="showNewPassword ? 'text' : 'password'" class="input-premium pl-12" placeholder="Minimum 8 caractères" />
                  <button @click="showNewPassword = !showNewPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-premium-gold transition-colors">
                    <component :is="showNewPassword ? EyeOff : Eye" class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmer nouveau</label>
                <div class="relative group">
                  <ShieldCheck class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                  <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" class="input-premium pl-12" placeholder="Confirmer" />
                  <button @click="showConfirmPassword = !showConfirmPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-premium-gold transition-colors">
                    <component :is="showConfirmPassword ? EyeOff : Eye" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Actions -->
        <div class="space-y-6">
          <div class="bg-premium-midnight rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-premium-gold/10 rounded-full blur-3xl"></div>
            
            <h4 class="text-xs font-black uppercase tracking-[0.2em] text-premium-gold mb-4">Statut du Compte</h4>
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-lg">
                <Mail class="w-5 h-5 text-premium-gold" />
              </div>
              <div class="overflow-hidden">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Contact</p>
                <p class="text-xs font-bold text-white truncate">{{ company.email }}</p>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vérification</span>
                <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-wider">Certifié</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</span>
                <span class="text-[10px] font-bold text-premium-gold uppercase tracking-wider">{{ company.legalStatus }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
            <p class="text-xs text-slate-400 font-medium leading-relaxed mb-6">
              Toutes vos données sont chiffrées et sécurisées. La modification du mot de passe entraînera une déconnexion de tous vos appareils.
            </p>
            <div class="space-y-3">
              <button @click="saveChanges" class="w-full btn-gold py-4 shadow-premium !px-0">
                <Save class="w-4 h-4 mr-2" />
                Mettre à jour
              </button>
              <button @click="resetForm" class="w-full py-4 rounded-2xl border border-slate-100 text-xs font-bold text-slate-400 hover:bg-slate-50 transition-all">
                Annuler les modifs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import api from '../../services/Api';
import { 
  AlertCircle, Building2, Building, Scale, Hash, Phone, MapPin, 
  Key, Lock, Eye, EyeOff, ShieldCheck, Save, X, Camera, ChevronDown, Mail 
} from 'lucide-vue-next';

// Company data
const company = ref({
  Logo: '',
  companyName: '',
  email: '',
  phoneNumber: '',
  registeredOfficeAddress: '',
  legalStatus: '',
  taxRegistrationNumber: '',
});

// Password change data
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// UI states
const error = ref('');
const loading = ref(false);
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// API configuration
// Local API instance removed in favor of shared service

// Fetch company profile
const fetchCompanyProfile = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const response = await api.get('/users/me');
    if (!response.data.company) {
      throw new Error('Company data not found');
    }
    
    company.value = response.data.company;
  } catch (err) {
    handleError(err);
  } finally {
    loading.value = false;
  }
};

// Save changes
const saveChanges = async () => {
  try {
    loading.value = true;
    error.value = '';

    const data: any = {
      companyName: company.value.companyName,
      registeredOfficeAddress: company.value.registeredOfficeAddress,
      legalStatus: company.value.legalStatus,
      taxRegistrationNumber: company.value.taxRegistrationNumber
    };

    if (oldPassword.value || newPassword.value || confirmPassword.value) {
      if (!validatePasswordChange()) return;
      
      data.oldPassword = oldPassword.value;
      data.newPassword = newPassword.value;
    }

    await api.put('/Profile/modify/me', data);
    alert('Profil mis à jour avec succès !');
    resetForm();
    
  } catch (err) {
    handleError(err);
  } finally {
    loading.value = false;
  }
};

// Validate password change
const validatePasswordChange = () => {
  if (!oldPassword.value) {
    error.value = 'Veuillez entrer votre mot de passe actuel';
    return false;
  }
  if (newPassword.value.length < 8) {
    error.value = 'Le nouveau mot de passe doit faire au moins 8 caractères';
    return false;
  }
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas';
    return false;
  }
  return true;
};

// Reset form
const resetForm = () => {
  oldPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
  fetchCompanyProfile();
};

// Error handling
const handleError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    error.value = err.response?.data?.error || err.message;
    if (err.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
  } else if (err instanceof Error) {
    error.value = err.message;
  } else {
    error.value = 'Une erreur inconnue est survenue';
  }
  console.error('Error:', err);
};

// Initialize
onMounted(fetchCompanyProfile);
</script>

<style scoped>
@reference "../../index.css";

.input-premium {
  @apply w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-bold text-premium-midnight focus:outline-none focus:ring-4 focus:ring-premium-gold/5 focus:border-premium-gold transition-all duration-300;
}

.shadow-premium {
  box-shadow: 0 10px 25px -5px rgba(212, 175, 55, 0.2), 0 8px 10px -6px rgba(212, 175, 55, 0.1);
}

.btn-gold {
  @apply bg-premium-gold text-white font-bold rounded-2xl hover:bg-premium-gold/90 transition-all flex items-center justify-center;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>