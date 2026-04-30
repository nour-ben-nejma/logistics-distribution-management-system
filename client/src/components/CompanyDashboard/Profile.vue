<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-32">
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-premium-gold/20 border-t-premium-gold rounded-full animate-spin"></div>
        <span class="text-sm font-medium text-slate-400 uppercase tracking-widest">Chargement du profil...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center gap-4 p-6 bg-red-50 border border-red-100 rounded-2xl">
      <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
        <AlertCircle class="w-5 h-5 text-red-500" />
      </div>
      <div>
        <p class="text-sm font-bold text-red-600">Erreur de chargement</p>
        <p class="text-xs text-red-400 mt-0.5">{{ error }}</p>
      </div>
    </div>

    <template v-else-if="company.companyName">
      <!-- Page Header -->
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2 h-2 rounded-full bg-premium-gold"></span>
            <span class="text-[10px] font-bold text-premium-gold uppercase tracking-[0.3em]">Compte Entreprise</span>
          </div>
          <h1 class="text-3xl font-display font-black text-premium-midnight tracking-tight">Profil Entreprise</h1>
          <p class="text-slate-500 text-sm font-medium mt-1">Informations légales et coordonnées de votre société.</p>
        </div>
        <button @click="goToEdit" class="btn-gold !px-6 !py-3 !text-xs flex items-center gap-2">
          <Pencil class="w-4 h-4" />
          Modifier le Profil
        </button>
      </div>

      <!-- Hero Card -->
      <div class="relative bg-premium-midnight rounded-[2rem] overflow-hidden shadow-2xl">
        <div class="absolute top-0 right-0 w-80 h-80 bg-premium-gold/10 blur-[80px] -mr-20 -mt-20"></div>
        <div class="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/5 blur-[60px] -ml-10 -mb-10"></div>

        <div class="relative z-10 p-10 flex flex-col sm:flex-row items-center sm:items-start gap-10">
          <!-- Logo -->
          <div class="relative shrink-0">
            <div class="w-28 h-28 rounded-2xl overflow-hidden bg-white border-2 border-slate-100 shadow-xl flex items-center justify-center p-2">
              <img v-if="company.Logo" :src="company.Logo" :alt="company.companyName" class="w-full h-full object-contain" />
              <div v-else class="w-full h-full flex items-center justify-center text-4xl font-black text-premium-gold">
                {{ company.companyName?.[0]?.toUpperCase() || 'C' }}
              </div>
            </div>
            <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-premium-gold flex items-center justify-center shadow-lg">
              <Building2 class="w-4 h-4 text-white" />
            </div>
          </div>

          <!-- Identity -->
          <div class="text-center sm:text-left sm:ml-2">
            <h2 class="text-3xl font-display font-black text-white tracking-tight mb-1">{{ company.companyName }}</h2>
            <div class="flex flex-wrap items-center gap-3 justify-center sm:justify-start mt-3">
              <span class="px-3 py-1 rounded-full bg-premium-gold/20 border border-premium-gold/30 text-premium-gold text-[10px] font-bold uppercase tracking-widest">
                {{ company.legalStatus }}
              </span>
              <span class="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                <div class="w-2 h-2 rounded-full bg-green-400"></div>
                Compte Actif
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Contact Card -->
        <div class="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 space-y-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Phone class="w-5 h-5 text-blue-500" />
            </div>
            <h3 class="text-sm font-black text-premium-midnight uppercase tracking-wider">Coordonnées</h3>
          </div>

          <div class="space-y-5">
            <div class="flex items-start gap-4">
              <div class="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                <Mail class="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                <p class="text-sm font-semibold text-premium-midnight">{{ company.email }}</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                <Phone class="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Téléphone</p>
                <p class="text-sm font-semibold text-premium-midnight">{{ company.phoneNumber }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Legal Card -->
        <div class="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 space-y-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-premium-gold/10 flex items-center justify-center">
              <FileText class="w-5 h-5 text-premium-gold" />
            </div>
            <h3 class="text-sm font-black text-premium-midnight uppercase tracking-wider">Données Légales</h3>
          </div>

          <div class="space-y-5">
            <div class="flex items-start gap-4">
              <div class="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                <Hash class="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">N° Registre Fiscal</p>
                <p class="text-sm font-semibold text-premium-midnight font-mono">{{ company.taxRegistrationNumber }}</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin class="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Siège Social</p>
                <p class="text-sm font-semibold text-premium-midnight">{{ company.registeredOfficeAddress }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { AlertCircle, Building2, Phone, Mail, FileText, MapPin, Hash, Pencil } from 'lucide-vue-next'

const router = useRouter()

interface Company {
  Logo?: string
  companyName?: string
  legalStatus?: string
  email?: string
  phoneNumber?: string
  taxRegistrationNumber?: string
  registeredOfficeAddress?: string
}

const company = ref<Company>({})
const loading = ref(true)
const error = ref<string | null>(null)

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true
})

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const { data } = await api.post('/refresh-token')
        localStorage.setItem('accessToken', data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        router.push('/login')
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

const fetchCompanyProfile = async () => {
  try {
    loading.value = true
    error.value = null
    const token = localStorage.getItem('accessToken')
    if (!token) throw new Error('Authentication required')
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    const userResponse = await api.get('/users/me')
    if (!userResponse.data.company?._id) throw new Error('Company data not found')
    const profileResponse = await api.get(`/users/profile/${userResponse.data.company._id}`)
    company.value = profileResponse.data.company
  } catch (err) {
    handleError(err)
  } finally {
    loading.value = false
  }
}

const handleError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    error.value = err.response?.data?.error || err.message
    if (err.response?.status === 401) router.push('/login')
  } else if (err instanceof Error) {
    error.value = err.message
  } else {
    error.value = 'An unknown error occurred'
  }
}

const goToEdit = () => router.push('/edit')

onMounted(fetchCompanyProfile)
</script>