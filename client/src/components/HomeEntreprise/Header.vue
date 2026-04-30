<template>
  <header 
    class="header fixed top-0 left-0 w-full z-[1000] transition-all duration-500 border-b" 
    :class="{ 
      'py-4 bg-white/40 backdrop-blur-md border-transparent': !isScrolled, 
      'py-2 bg-white/90 backdrop-blur-xl shadow-premium border-premium-gold/10': isScrolled 
    }"
  >
    <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="group flex items-center gap-3">
        <div class="w-10 h-10 bg-premium-midnight rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-premium-midnight/10 border border-white/10">
           <img src="../../assets/Images/Logo.png" alt="Logo" class="w-6 h-6 object-contain" />
        </div>
        <div class="flex flex-col -space-y-1">
          <span class="text-xl font-display font-black tracking-tighter text-premium-midnight">
            Logisti<span class="text-premium-gold">Co</span>
          </span>
          <span class="text-[7px] font-bold text-premium-gold uppercase tracking-[0.4em] ml-0.5">Excellence Hub</span>
        </div>
      </router-link>

      <!-- Navigation -->
      <nav class="hidden md:flex items-center gap-10">
        <router-link 
          v-for="link in navLinks" 
          :key="link.name" 
          :to="link.path" 
          class="text-[10px] font-bold uppercase tracking-widest text-premium-midnight hover:text-premium-gold transition-colors relative group"
        >
          {{ link.name }}
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-premium-gold transition-all group-hover:w-full"></span>
        </router-link>
      </nav>

      <!-- Auth & Social -->
      <div class="flex items-center gap-6">
        <button @click="goToLogin" class="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-premium-midnight hover:text-premium-gold transition-colors">
          Espace Client
        </button>
        <button @click="goToSignup" class="btn-gold !text-[10px] !py-2 !px-5 shadow-lg shadow-premium-gold/20">
          Rejoindre l'élite
        </button>
        
        <!-- Mobile Toggle -->
        <button class="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5" @click="toggleMenu">
          <span class="w-6 h-0.5 bg-premium-midnight transition-all" :class="{ 'rotate-45 translate-y-2': isMenuOpen }"></span>
          <span class="w-6 h-0.5 bg-premium-midnight transition-all" :class="{ 'opacity-0': isMenuOpen }"></span>
          <span class="w-6 h-0.5 bg-premium-midnight transition-all" :class="{ '-rotate-45 -translate-y-2': isMenuOpen }"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="md:hidden fixed inset-0 top-[72px] bg-white/98 backdrop-blur-2xl z-50 p-8 animate-in fade-in slide-in-from-top-4">
      <nav class="flex flex-col gap-8">
        <router-link v-for="link in navLinks" :key="link.name" :to="link.path" @click="closeMenu" class="text-3xl font-display font-bold text-premium-midnight flex items-center justify-between group">
          {{ link.name }}
          <i class="fas fa-chevron-right text-sm text-premium-gold opacity-0 group-hover:opacity-100 transition-all"></i>
        </router-link>
        <div class="h-[1px] bg-slate-100 my-4"></div>
        <div class="space-y-4">
          <button @click="goToLogin" class="w-full py-4 rounded-2xl border-2 border-slate-100 font-bold text-premium-midnight">Connexion Client</button>
          <button @click="goToSignup" class="w-full btn-gold !py-4">Commencer l'expérience</button>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMenuOpen = ref(false)
const isScrolled = ref(false)

const navLinks = [
  { name: 'Accueil', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'À Propos', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }
const closeMenu = () => { isMenuOpen.value = false }
const goToLogin = () => { closeMenu(); router.push('/login') }
const goToSignup = () => { closeMenu(); router.push('/create-account') }

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.header {
  will-change: padding, background-color, backdrop-filter;
}
</style>