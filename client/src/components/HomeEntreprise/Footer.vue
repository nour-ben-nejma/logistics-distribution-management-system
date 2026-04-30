<template>
  <footer id="footer" class="bg-premium-midnight text-slate-300 py-16 relative overflow-hidden border-t border-premium-gold/10">
    <!-- Premium glow effect -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-premium-gold/30 to-transparent"></div>
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-premium-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-6 max-w-7xl">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        
        <!-- About Column -->
        <div class="flex flex-col">
          <h3 class="text-sm font-display font-bold text-white mb-6 relative inline-block tracking-widest">
            ABOUT US
            <span class="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-premium-gold to-transparent rounded-full"></span>
          </h3>
          <p class="text-xs leading-relaxed text-slate-400 mb-8 font-medium">
            Depuis 2025, LogistiCo révolutionne la logistique à travers des solutions innovantes. Nous simplifions le stockage et la distribution pour une gestion sans effort. 
          </p>
          <div class="flex gap-3 mt-auto">
            <a href="#" class="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-premium-gold hover:bg-premium-gold hover:text-premium-midnight hover:-translate-y-1 transition-all duration-300 text-xs" aria-label="LinkedIn">
              <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="#" class="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-premium-gold hover:bg-premium-gold hover:text-premium-midnight hover:-translate-y-1 transition-all duration-300 text-xs" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-premium-gold hover:bg-premium-gold hover:text-premium-midnight hover:-translate-y-1 transition-all duration-300 text-xs" aria-label="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
          </div>
        </div>

        <!-- Navigation Column -->
        <div class="flex flex-col">
          <h3 class="text-sm font-display font-bold text-white mb-6 relative inline-block tracking-widest">
            NAVIGATION
            <span class="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-premium-gold to-transparent rounded-full"></span>
          </h3>
          <ul class="space-y-3">
            <li>
              <a href="#" class="group flex items-center text-xs text-slate-400 hover:text-premium-gold transition-colors duration-300 font-medium">
                <i class="fas fa-chevron-right text-[8px] mr-3 text-premium-gold/50 group-hover:text-premium-gold transition-colors duration-300"></i>
                Accueil
              </a>
            </li>
            <li>
              <a href="#" class="group flex items-center text-xs text-slate-400 hover:text-premium-gold transition-colors duration-300 font-medium">
                <i class="fas fa-chevron-right text-[8px] mr-3 text-premium-gold/50 group-hover:text-premium-gold transition-colors duration-300"></i>
                À propos
              </a>
            </li>
            <li>
              <a href="#" class="group flex items-center text-xs text-slate-400 hover:text-premium-gold transition-colors duration-300 font-medium">
                <i class="fas fa-chevron-right text-[8px] mr-3 text-premium-gold/50 group-hover:text-premium-gold transition-colors duration-300"></i>
                Nos services
              </a>
            </li>
            <li>
              <a href="#" class="group flex items-center text-xs text-slate-400 hover:text-premium-gold transition-colors duration-300 font-medium">
                <i class="fas fa-chevron-right text-[8px] mr-3 text-premium-gold/50 group-hover:text-premium-gold transition-colors duration-300"></i>
                Logistique
              </a>
            </li>
            <li>
              <a href="#" class="group flex items-center text-xs text-slate-400 hover:text-premium-gold transition-colors duration-300 font-medium">
                <i class="fas fa-chevron-right text-[8px] mr-3 text-premium-gold/50 group-hover:text-premium-gold transition-colors duration-300"></i>
                Devis
              </a>
            </li>
            <li>
              <a href="#" class="group flex items-center text-xs text-slate-400 hover:text-premium-gold transition-colors duration-300 font-medium">
                <i class="fas fa-chevron-right text-[8px] mr-3 text-premium-gold/50 group-hover:text-premium-gold transition-colors duration-300"></i>
                Contact
              </a>
            </li>
          </ul>
        </div>

        <!-- Services Column -->
        <div class="flex flex-col">
          <h3 class="text-sm font-display font-bold text-white mb-6 relative inline-block tracking-widest">
            SERVICES
            <span class="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-premium-gold to-transparent rounded-full"></span>
          </h3>
          <ul class="space-y-3">
            <li class="flex items-center text-xs text-slate-400 group cursor-default font-medium">
              <div class="w-7 h-7 rounded bg-white/5 border border-white/10 flex items-center justify-center mr-3 group-hover:border-premium-gold/50 transition-colors">
                <i class="fas fa-box text-premium-gold text-[10px]"></i>
              </div>
              <span class="group-hover:text-white transition-colors">Solutions d'Entreposage</span>
            </li>
            <li class="flex items-center text-xs text-slate-400 group cursor-default font-medium">
              <div class="w-7 h-7 rounded bg-white/5 border border-white/10 flex items-center justify-center mr-3 group-hover:border-premium-gold/50 transition-colors">
                <i class="fas fa-truck text-premium-gold text-[10px]"></i>
              </div>
              <span class="group-hover:text-white transition-colors">Réseau de Distribution</span>
            </li>
            <li class="flex items-center text-xs text-slate-400 group cursor-default font-medium">
              <div class="w-7 h-7 rounded bg-white/5 border border-white/10 flex items-center justify-center mr-3 group-hover:border-premium-gold/50 transition-colors">
                <i class="fas fa-chart-line text-premium-gold text-[10px]"></i>
              </div>
              <span class="group-hover:text-white transition-colors">Gestion des Stocks</span>
            </li>
            <li class="flex items-center text-xs text-slate-400 group cursor-default font-medium">
              <div class="w-7 h-7 rounded bg-white/5 border border-white/10 flex items-center justify-center mr-3 group-hover:border-premium-gold/50 transition-colors">
                <i class="fas fa-globe text-premium-gold text-[10px]"></i>
              </div>
              <span class="group-hover:text-white transition-colors">Logistique Globale</span>
            </li>
          </ul>
        </div>

        <!-- Contact Column -->
        <div class="flex flex-col">
          <h3 class="text-sm font-display font-bold text-white mb-6 relative inline-block tracking-widest">
            CONTACT DETAILS
            <span class="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-premium-gold to-transparent rounded-full"></span>
          </h3>
          <ul class="space-y-5">
            <li class="flex items-start">
              <div class="w-9 h-9 rounded-xl bg-premium-gold/10 flex items-center justify-center mr-4 shrink-0">
                <i class="fas fa-map-marker-alt text-premium-gold text-base"></i>
              </div>
              <div class="pt-1.5">
                <span class="block text-white font-bold text-xs mb-1">Siège Social LogistiCo</span>
                <span class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tunis, Tunisie</span>
              </div>
            </li>
            <li class="flex items-start">
              <div class="w-9 h-9 rounded-xl bg-premium-gold/10 flex items-center justify-center mr-4 shrink-0">
                <i class="fas fa-envelope text-premium-gold text-base"></i>
              </div>
              <div class="flex flex-col gap-1 pt-1">
                <a href="mailto:sales@LogistiCo.com" class="text-xs text-slate-400 hover:text-premium-gold transition-colors duration-300 font-medium">sales@LogistiCo.com</a>
                <a href="mailto:contact@logistiCO.com" class="text-xs text-slate-400 hover:text-premium-gold transition-colors duration-300 font-medium">contact@logistiCO.com</a>
              </div>
            </li>
            <li class="flex items-start">
              <div class="w-9 h-9 rounded-xl bg-premium-gold/10 flex items-center justify-center mr-4 shrink-0">
                <i class="fas fa-phone-alt text-premium-gold text-base"></i>
              </div>
              <div class="flex flex-col gap-1 pt-1">
                <a href="tel:+21631550533" class="text-xs text-slate-400 hover:text-premium-gold transition-colors duration-300 font-medium">+216 31 550 533</a>
                <a href="tel:+21672512800" class="text-xs text-slate-400 hover:text-premium-gold transition-colors duration-300 font-medium">+216 72 512 800</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Footer Bottom -->
    <div class="mt-16 border-t border-white/5 bg-black/20">
      <div class="container mx-auto px-6 max-w-7xl py-6 flex flex-col md:flex-row justify-between items-center">
        <p class="text-slate-500 text-sm mb-4 md:mb-0">
          &copy; {{ new Date().getFullYear() }} LogistiCo. Tous droits réservés.
        </p>
        <div class="flex gap-6 text-sm text-slate-500">
          <a href="#" class="hover:text-premium-gold transition-colors">Politique de Confidentialité</a>
          <a href="#" class="hover:text-premium-gold transition-colors">Conditions Générales</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
export default {
  name: 'FooterSection',
}
</script>

<style scoped>
/* Scoped styles replaced by Tailwind utilities */
</style>
