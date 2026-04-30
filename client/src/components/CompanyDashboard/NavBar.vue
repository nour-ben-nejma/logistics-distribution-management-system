<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Sliders, 
  LogOut,
  ChevronDown,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-vue-next'

const props = defineProps<{
  isSidebarCollapsed: boolean
}>()

const emit = defineEmits(['toggleSidebar'])



interface CompanyInfo {
  companyName: string
  Logo: string
}

const router = useRouter()
const notifications = ref(3)
const isProfileDropdownOpen = ref(false)
const companyInfo = ref<CompanyInfo>({
  companyName: '',
  Logo: ''
})

const fetchCompanyInfo = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    const response = await axios.get('http://localhost:3000/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.data.company) {
      companyInfo.value = {
        companyName: response.data.company.companyName,
        Logo: response.data.company.Logo
      }
    }
  } catch (error) {
    console.error('Error fetching company info:', error)
  }
}

const toggleProfileDropdown = (e: Event) => {
  e.stopPropagation()
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value
}

const logout = async () => {
  try {
    await axios.post('http://localhost:3000/api/auth/logout', {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
  } catch (error) {
    console.error('Error during logout:', error)
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/')
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const dropdown = document.querySelector('.profile-dropdown')
  if (dropdown && !dropdown.contains(event.target as Node)) {
    isProfileDropdownOpen.value = false
  }
}

onMounted(() => {
  fetchCompanyInfo()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <nav 
    class="fixed top-0 right-0 z-40 transition-all duration-500 ease-in-out h-20 px-8 flex items-center justify-between"
    :class="[isSidebarCollapsed ? 'left-20' : 'left-72']"
  >
    <!-- Background Glass -->
    <div class="absolute inset-0 bg-white/60 backdrop-blur-md border-b border-slate-100"></div>

    <!-- Left: Toggle + Search -->
    <div class="relative z-10 flex items-center gap-4">
      <!-- Sidebar Toggle Button -->
      <button
        @click="emit('toggleSidebar')"
        class="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-premium-midnight transition-all"
        title="Toggle Sidebar"
      >
        <PanelLeftClose v-if="!isSidebarCollapsed" class="w-5 h-5" />
        <PanelLeftOpen v-else class="w-5 h-5" />
      </button>

      <div class="search-box relative w-64 group">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
        <input 
          type="text" 
          placeholder="Rechercher..." 
          class="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-premium-gold/5 focus:border-premium-gold/30 transition-all placeholder:text-slate-400 font-medium"
        />
      </div>
      
      <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-premium-gold/10 border border-premium-gold/20">
        <Sparkles class="w-3 h-3 text-premium-gold" />
        <span class="text-[9px] font-bold text-premium-gold uppercase tracking-widest">Premium Active</span>
      </div>
    </div>
    
    <!-- Right: Actions -->
    <div class="relative z-10 flex items-center gap-3">
      <!-- Notifications -->
      <button class="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-all group">
        <Bell class="w-5 h-5 text-slate-500 group-hover:text-premium-gold transition-colors" />
        <span class="absolute top-2 right-2 w-2 h-2 bg-premium-gold rounded-full border-2 border-white"></span>
      </button>
      
      <!-- Settings -->
      <button class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-all group">
        <Settings class="w-5 h-5 text-slate-500 group-hover:text-premium-gold transition-colors" />
      </button>

      <div class="h-6 w-[1px] bg-slate-200 mx-3"></div>
      
      <!-- Profile -->
      <div class="relative profile-dropdown">
        <button 
          @click="toggleProfileDropdown"
          class="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-all group"
        >
          <div class="flex flex-col items-end mr-1 hidden sm:flex">
            <span class="text-sm font-bold text-premium-midnight truncate max-w-[120px]">{{ companyInfo.companyName || 'Compte' }}</span>
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Entreprise</span>
          </div>

          <div class="relative">
            <div class="w-10 h-10 rounded-xl bg-premium-midnight overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
              <img 
                v-if="companyInfo.Logo" 
                :src="companyInfo.Logo" 
                class="w-full h-full object-cover" 
              />
              <div v-else class="w-full h-full flex items-center justify-center text-premium-gold font-bold text-lg">
                {{ companyInfo.companyName?.[0] || 'L' }}
              </div>
            </div>
            <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          
          <ChevronDown class="w-3.5 h-3.5 text-slate-400 group-hover:text-premium-gold transition-colors" />
        </button>
        
        <!-- Dropdown -->
        <Transition name="dropdown">
          <div v-if="isProfileDropdownOpen" class="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50">
            <div class="px-5 py-3 border-b border-slate-50 mb-2">
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Session active</p>
              <p class="text-sm font-black text-premium-midnight truncate">{{ companyInfo.companyName }}</p>
            </div>
            
            <div class="px-2 space-y-1">
              <button @click="router.push('/profile')" class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-600 hover:bg-premium-gold/5 hover:text-premium-gold rounded-xl transition-all">
                <User class="w-4 h-4" />
                <span class="font-medium">Profil Directeur</span>
              </button>
              
              <button @click="router.push('/edit')" class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-600 hover:bg-premium-gold/5 hover:text-premium-gold rounded-xl transition-all">
                <Settings class="w-4 h-4" />
                <span class="font-medium">Paramètres Système</span>
              </button>
            </div>
            
            <div class="h-[1px] bg-slate-50 my-2 mx-4"></div>
            
            <div class="px-2">
              <button @click="logout" class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <LogOut class="w-4 h-4" />
                <span class="font-medium">Déconnexion sécurisée</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>