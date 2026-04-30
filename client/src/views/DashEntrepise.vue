<template>
  <div class="min-h-screen bg-premium-surface overflow-x-hidden">
    <!-- Sidebar -->
    <Sidebar :isCollapsed="isCollapsed" @toggle="isCollapsed = !isCollapsed" />

    <!-- Main Content Area -->
    <div 
      class="main-content flex flex-col min-h-screen transition-all duration-500 ease-in-out"
      :class="[isCollapsed ? 'pl-20' : 'pl-72']"
    >
      <!-- NavBar -->
      <NavBar :isSidebarCollapsed="isCollapsed" @toggleSidebar="isCollapsed = !isCollapsed" />

      <!-- Content Wrapper -->
      <main class="flex-grow p-6 pt-24 md:p-8 md:pt-28">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Footer -->
      <footer class="py-8 px-8 flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] border-t border-slate-100 mt-auto">
        <span>&copy; 2026 LogistiCo Platinum Edition</span>
        <div class="flex gap-6">
          <a href="#" class="hover:text-premium-gold transition-colors">Privacy</a>
          <a href="#" class="hover:text-premium-gold transition-colors">Terms</a>
          <a href="#" class="hover:text-premium-gold transition-colors">Support</a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from '../components/CompanyDashboard/SideBar.vue';
import NavBar from '../components/CompanyDashboard/NavBar.vue';

const isCollapsed = ref(false);
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(1.02);
}
</style>