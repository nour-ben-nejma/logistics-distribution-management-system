<template>
  <aside 
    class="fixed left-0 top-0 bottom-0 z-50 transition-all duration-500 ease-in-out bg-premium-midnight/95 backdrop-blur-xl border-r border-white/5 flex flex-col overflow-hidden"
    :class="[isCollapsed ? 'w-20' : 'w-72']"
  >
    <!-- Logo Section -->
    <div class="h-20 flex items-center px-5 border-b border-white/5">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-9 h-9 bg-premium-gold rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-premium-gold/20">
          <Box class="w-5 h-5 text-white" />
        </div>
        <Transition name="fade">
          <span v-if="!isCollapsed" class="text-xl font-display font-black text-white tracking-tighter whitespace-nowrap">
            Logisti<span class="text-premium-gold">Co</span>
          </span>
        </Transition>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-grow px-4 overflow-y-auto custom-scrollbar py-4">
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.name">
          <router-link 
            :to="item.route" 
            class="group relative flex items-center h-11 px-4 rounded-xl transition-all duration-300"
            :class="[isActive(item.route) ? 'bg-premium-gold/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5']"
          >
            <!-- Active Indicator -->
            <div 
              v-if="isActive(item.route)" 
              class="absolute left-0 top-2 bottom-2 w-1 bg-premium-gold rounded-r-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"
            ></div>
            
            <component 
              :is="item.icon" 
              class="w-5 h-5 shrink-0 transition-colors"
              :class="[isActive(item.route) ? 'text-premium-gold' : 'group-hover:text-premium-gold']"
            />
            
            <Transition name="fade">
              <span v-if="!isCollapsed" class="ml-4 text-sm font-medium tracking-wide whitespace-nowrap">
                {{ item.name }}
              </span>
            </Transition>

            <!-- Tooltip for collapsed state -->
            <div v-if="isCollapsed" class="fixed left-24 px-3 py-2 bg-premium-midnight text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl border border-white/10 whitespace-nowrap z-[100]">
              {{ item.name }}
            </div>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="p-4 mt-auto border-t border-white/5">
      <button 
        @click="logout"
        class="w-full flex items-center h-11 px-4 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
        :class="{'justify-center': isCollapsed}"
      >
        <LogOut class="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform" />
        <Transition name="fade">
          <span v-if="!isCollapsed" class="ml-4 text-sm font-medium">Déconnexion</span>
        </Transition>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { 
  Box, 
  LayoutDashboard, 
  User, 
  Truck, 
  Warehouse, 
  MapPin, 
  Handshake, 
  Package, 
  Route, 
  Ship, 
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings
} from 'lucide-vue-next';

const props = defineProps<{
  isCollapsed: boolean
}>();

const emit = defineEmits(['toggle']);

const route = useRoute();
const router = useRouter();
const companyInfo = computed(() => {
  const stored = localStorage.getItem('companyInfo');
  return stored ? JSON.parse(stored) : {};
});


const isActive = (path: string) => {
  return route.path === path;
};

const menuItems = [
  { name: 'Dashboard', route: '/dashCompany', icon: LayoutDashboard },
  { name: 'Mon Profil', route: '/profile', icon: User },
  { name: 'Véhicules', route: '/dashCompany/trucks', icon: Truck },
  { name: 'Entrepôts', route: '/dashCompany/WareHouse', icon: Warehouse },
  { name: 'Transporteurs', route: '/dashCompany/TransEntrep', icon: Ship },
  { name: 'Plan de Distrib.', route: '/dashCompany/distributionPlan', icon: Route },
  { name: 'Points de Vente', route: '/dashCompany/Salepoint', icon: MapPin },
  { name: 'Fournisseurs', route: '/dashCompany/Fourniss', icon: Handshake },
  { name: 'Produits', route: '/dashCompany/products', icon: Package },
];

const logout = async () => {
  try {
    await axios.post('http://localhost:3000/api/auth/logout', {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    router.push('/');
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 0px;
}
.custom-scrollbar:hover::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.2);
  border-radius: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
