<template>
  <div class="min-h-screen bg-premium-surface font-sans selection:bg-premium-gold/30">
    <!-- Background Decor -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-premium-gold/5 blur-[120px] rounded-full"></div>
      <div class="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-premium-midnight/5 blur-[120px] rounded-full"></div>
    </div>

    <div class="relative min-h-screen flex items-center justify-center p-6 md:p-12">
      <div class="w-full max-w-6xl flex flex-col lg:flex-row glass rounded-[2.5rem] overflow-hidden shadow-2xl border-white/40">
        
        <!-- Left Panel: Brand & Info -->
        <div class="lg:w-2/5 bg-premium-midnight p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div class="absolute top-0 right-0 w-48 h-48 bg-premium-gold/10 blur-[60px] -mr-24 -mt-24"></div>
          
          <div class="relative z-10">
            <router-link to="/" class="flex items-center gap-3 mb-12 group">
              <div class="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-all duration-500">
                <img src="../../assets/Images/Logo.png" alt="Logo" class="w-6 h-6 object-contain brightness-0 invert" />
              </div>
              <div class="flex flex-col -space-y-1">
                <span class="text-xl font-display font-black tracking-tighter">Logisti<span class="text-premium-gold">Co</span></span>
                <span class="text-[7px] font-bold text-premium-gold uppercase tracking-[0.4em] ml-0.5">Excellence Hub</span>
              </div>
            </router-link>

            <h1 class="text-3xl md:text-4xl font-display font-bold leading-[1.1] mb-5">
              Rejoignez <br />
              <span class="text-premium-gold italic">L'Élite Logistique.</span>
            </h1>
            <p class="text-slate-400 text-sm mb-10 font-medium max-w-xs leading-relaxed">
              Optimisez votre chaîne d'approvisionnement avec une précision chirurgicale.
            </p>

            <div class="space-y-5">
              <div v-for="(feat, i) in features" :key="i" class="flex items-center gap-4 group cursor-default">
                <div class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-premium-gold/20 group-hover:border-premium-gold/30 transition-all duration-300">
                  <component :is="feat.icon" class="w-4 h-4 text-premium-gold" />
                </div>
                <span class="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{{ feat.text }}</span>
              </div>
            </div>
          </div>

          <div class="relative z-10 pt-12 mt-auto">
            <div class="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p class="text-xs text-slate-400 italic">"L'innovation est le moteur de notre excellence opérationnelle."</p>
              <div class="mt-4 flex items-center gap-3">
                <div class="w-7 h-7 rounded-full bg-premium-gold/20 border border-premium-gold/30"></div>
                <div>
                  <p class="text-[10px] font-bold text-white uppercase tracking-wider">Direction LogistiCo</p>
                  <p class="text-[9px] text-premium-gold font-medium uppercase tracking-widest">Vision 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: Registration Form -->
        <div class="lg:w-3/5 bg-white/80 backdrop-blur-md p-8 md:p-14 overflow-y-auto max-h-[90vh] lg:max-h-none relative">
          <!-- Back Button -->
          <router-link to="/" class="absolute top-6 left-6 md:left-10 flex items-center gap-2 text-slate-400 hover:text-premium-gold transition-colors group">
            <div class="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-premium-gold/10 transition-all">
              <ChevronLeft class="w-3.5 h-3.5" />
            </div>
            <span class="text-[10px] font-bold uppercase tracking-widest">Retour</span>
          </router-link>

          <div class="max-w-2xl mx-auto">
            <div class="mb-10">
              <h2 class="text-2xl font-display font-bold text-premium-midnight mb-1">Inscription Entreprise</h2>
              <p class="text-sm text-slate-500 font-medium">Veuillez remplir les informations de votre société.</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Logo Upload -->
              <div class="flex flex-col items-center mb-10">
                <div class="relative group">
                  <input
                    type="file"
                    ref="logoInput"
                    @change="handleFileUpload"
                    accept="image/*"
                    class="hidden"
                    id="logo-upload"
                  />
                  <label for="logo-upload" class="cursor-pointer block">
                    <div class="w-24 h-24 rounded-full border-2 border-dashed border-premium-gold/30 bg-premium-surface flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-premium-gold group-hover:bg-premium-gold/5 group-hover:scale-[1.02] shadow-inner">
                      <template v-if="logoPreview">
                        <img :src="logoPreview" alt="Preview" class="w-full h-full object-cover" />
                      </template>
                      <template v-else>
                        <div class="flex flex-col items-center gap-1.5 text-premium-gold/60">
                          <Upload class="w-6 h-6" />
                          <span class="text-[9px] font-bold uppercase tracking-widest">Logo</span>
                        </div>
                      </template>
                    </div>
                  </label>
                  <button
                    v-if="logoPreview"
                    type="button"
                    @click="removeImage"
                    class="absolute -top-1 -right-1 w-7 h-7 bg-white text-red-500 rounded-full shadow-lg border border-slate-100 flex items-center justify-center hover:bg-red-50 transition-colors"
                  >
                    <X class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <!-- Form Fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Company Name -->
                <div class="space-y-2">
                  <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Nom de l'entreprise</label>
                  <div class="relative group">
                    <Building2 class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                    <input
                      type="text"
                      v-model="formData.companyName"
                      placeholder="Ex: LogistiCo Corp"
                      class="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-premium-gold focus:ring-4 focus:ring-premium-gold/5 transition-all font-medium text-premium-midnight placeholder:text-slate-300 text-sm"
                      required
                    />
                  </div>
                </div>

                <!-- Phone -->
                <div class="space-y-2">
                  <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Téléphone</label>
                  <div class="relative group">
                    <Phone class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                    <input
                      type="tel"
                      v-model="formData.phoneNumber"
                      placeholder="+33 X XX XX XX XX"
                      class="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-premium-gold focus:ring-4 focus:ring-premium-gold/5 transition-all font-medium text-premium-midnight placeholder:text-slate-300 text-sm"
                      required
                    />
                  </div>
                </div>

                <!-- Tax Registration -->
                <div class="space-y-2">
                  <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Numéro SIRET / Taxe</label>
                  <div class="relative group">
                    <FileText class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                    <input
                      type="text"
                      v-model="formData.taxRegistrationNumber"
                      placeholder="123 456 789 00012"
                      class="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-premium-gold focus:ring-4 focus:ring-premium-gold/5 transition-all font-medium text-premium-midnight placeholder:text-slate-300 text-sm"
                      required
                    />
                  </div>
                </div>

                <!-- Legal Status -->
                <div class="space-y-2">
                  <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Statut Juridique</label>
                  <div class="relative group">
                    <Gavel class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-premium-gold transition-colors pointer-events-none" />
                    <select
                      v-model="formData.legalStatus"
                      class="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-premium-gold focus:ring-4 focus:ring-premium-gold/5 transition-all font-medium text-premium-midnight appearance-none cursor-pointer text-sm"
                      required
                    >
                      <option value="" disabled>Sélectionner un statut</option>
                      <option value="SA">Société Anonyme (SA)</option>
                      <option value="SARL">SARL</option>
                      <option value="SAS">SAS</option>
                      <option value="SNC">SNC</option>
                    </select>
                  </div>
                </div>

                <!-- Address -->
                <div class="space-y-2 md:col-span-2">
                  <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Siège Social</label>
                  <div class="relative group">
                    <MapPin class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                    <input
                      type="text"
                      v-model="formData.registeredOfficeAddress"
                      placeholder="Adresse complète du siège"
                      class="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-premium-gold focus:ring-4 focus:ring-premium-gold/5 transition-all font-medium text-premium-midnight placeholder:text-slate-300 text-sm"
                      required
                    />
                  </div>
                </div>

                <!-- Email -->
                <div class="space-y-2 md:col-span-2">
                  <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Email Professionnel</label>
                  <div class="relative group">
                    <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                    <input
                      type="email"
                      v-model="formData.email"
                      placeholder="contact@entreprise.com"
                      class="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-premium-gold focus:ring-4 focus:ring-premium-gold/5 transition-all font-medium text-premium-midnight placeholder:text-slate-300 text-sm"
                      required
                    />
                  </div>
                </div>

                <!-- Password -->
                <div class="space-y-2">
                  <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Mot de passe</label>
                  <div class="relative group">
                    <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                    <input
                      type="password"
                      v-model="formData.password"
                      placeholder="********"
                      class="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-premium-gold focus:ring-4 focus:ring-premium-gold/5 transition-all font-medium text-premium-midnight placeholder:text-slate-300 text-sm"
                      required
                    />
                  </div>
                </div>

                <!-- Confirm Password -->
                <div class="space-y-2">
                  <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Confirmation</label>
                  <div class="relative group">
                    <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                    <input
                      type="password"
                      v-model="formData.confirmPassword"
                      placeholder="********"
                      class="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-premium-gold focus:ring-4 focus:ring-premium-gold/5 transition-all font-medium text-premium-midnight placeholder:text-slate-300 text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              <!-- Terms -->
              <div class="flex items-center gap-3 p-3 bg-premium-surface rounded-2xl border border-slate-100">
                <input
                  type="checkbox"
                  id="terms"
                  v-model="formData.acceptedTerms"
                  class="w-4 h-4 rounded border-slate-300 text-premium-gold focus:ring-premium-gold"
                  required
                />
                <label for="terms" class="text-xs text-slate-500 font-medium">
                  J'accepte les <a href="#" class="text-premium-midnight font-bold hover:text-premium-gold transition-colors underline underline-offset-4 decoration-premium-gold/30">Conditions d'Utilisation</a>
                </label>
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="flex-1 btn-gold !py-4 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-premium-gold/20"
                >
                  <CheckCircle v-if="!isSubmitting" class="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <RotateCcw v-else class="w-4 h-4 animate-spin" />
                  <span class="uppercase tracking-widest text-[10px] font-bold">{{ isSubmitting ? 'Finalisation...' : 'Valider l\'inscription' }}</span>
                </button>
                <button
                  type="button"
                  @click="resetForm"
                  class="px-8 py-4 rounded-premium border-2 border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all text-[10px] font-bold uppercase tracking-widest"
                >
                  Réinitialiser
                </button>
              </div>
            </form>

            <!-- Success/Error Messages -->
            <Transition name="fade">
              <div v-if="errorMessage" class="mt-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div class="flex items-center gap-3">
                  <X class="w-5 h-5" />
                  <p class="text-sm font-medium">{{ errorMessage }}</p>
                </div>
                <button @click="errorMessage = ''" class="hover:rotate-90 transition-transform">
                  <X class="w-4 h-4" />
                </button>
              </div>
            </Transition>

            <Transition name="fade">
              <div v-if="successMessage" class="mt-8 p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div class="flex items-center gap-3">
                  <CheckCircle class="w-5 h-5" />
                  <p class="text-sm font-medium">{{ successMessage }}</p>
                </div>
                <button @click="successMessage = ''" class="hover:rotate-90 transition-transform">
                  <X class="w-4 h-4" />
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';
import { 
  CheckCircle, 
  RotateCcw, 
  X, 
  Upload, 
  Building2, 
  Phone, 
  FileText, 
  Gavel, 
  MapPin, 
  Mail, 
  Lock,
  Truck,
  Warehouse,
  Route,
  Clock,
  ChevronLeft
} from 'lucide-vue-next';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

const features = [
  { icon: Truck, text: 'Logistique Globale' },
  { icon: Warehouse, text: 'Entreposage Sécurisé' },
  { icon: Route, text: 'Planification Intelligente' },
  { icon: Clock, text: 'Support Élite 24/7' }
];

interface FormData {
  companyName: string;
  phoneNumber: string;
  taxRegistrationNumber: string;
  legalStatus: string;
  registeredOfficeAddress: string;
  email: string;
  password: string;
  confirmPassword: string;
  logo?: File;
  acceptedTerms: boolean;
}

const formData = ref<FormData>({
  companyName: '',
  phoneNumber: '',
  taxRegistrationNumber: '',
  legalStatus: '',
  registeredOfficeAddress: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false
});

const logoPreview = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const logoInput = ref<HTMLInputElement | null>(null);

const passwordMismatch = computed(() => {
  return formData.value.password !== formData.value.confirmPassword && 
         formData.value.confirmPassword.length > 0;
});

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email));
const phoneValid = computed(() => /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(formData.value.phoneNumber));
const taxNumberValid = computed(() => /^[a-zA-Z0-9\s]+$/.test(formData.value.taxRegistrationNumber));
const passwordValid = computed(() => formData.value.password.length >= 8);

const isFormValid = computed(() => {
  return (
    formData.value.companyName.trim() !== '' &&
    phoneValid.value &&
    taxNumberValid.value &&
    formData.value.legalStatus !== '' &&
    formData.value.registeredOfficeAddress.trim() !== '' &&
    emailValid.value &&
    passwordValid.value &&
    !passwordMismatch.value &&
    formData.value.acceptedTerms
  );
});

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    formData.value.logo = file;
    logoPreview.value = URL.createObjectURL(file);
  }
};

const removeImage = () => {
  formData.value.logo = undefined;
  logoPreview.value = '';
  if (logoInput.value) logoInput.value.value = '';
};

const handleSubmit = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Veuillez remplir correctement tous les champs obligatoires';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const formPayload = new FormData();
    formPayload.append('companyName', formData.value.companyName);
    formPayload.append('phoneNumber', formData.value.phoneNumber);
    formPayload.append('taxRegistrationNumber', formData.value.taxRegistrationNumber);
    formPayload.append('legalStatus', formData.value.legalStatus);
    formPayload.append('registeredOfficeAddress', formData.value.registeredOfficeAddress);
    formPayload.append('email', formData.value.email);
    formPayload.append('password', formData.value.password);
    
    if (formData.value.logo) {
      formPayload.append('Logo', formData.value.logo);
    }
    
    const response = await api.post('/users/company', formPayload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    successMessage.value = response.data.message || 'Inscription réussie !';
    setTimeout(() => resetForm(), 2000);
    
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Une erreur est survenue lors de l\'inscription';
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    companyName: '',
    phoneNumber: '',
    taxRegistrationNumber: '',
    legalStatus: '',
    registeredOfficeAddress: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false
  };
  removeImage();
  errorMessage.value = '';
  successMessage.value = '';
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom Scrollbar for the form panel */
.lg\:w-3\/5::-webkit-scrollbar {
  width: 6px;
}
.lg\:w-3\/5::-webkit-scrollbar-track {
  background: transparent;
}
.lg\:w-3\/5::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
.lg\:w-3\/5::-webkit-scrollbar-thumb:hover {
  background: #CBD5E1;
}
</style>