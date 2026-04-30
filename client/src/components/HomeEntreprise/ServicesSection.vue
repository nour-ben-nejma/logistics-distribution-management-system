<template>
  <section id="services" class="py-24 bg-premium-surface relative">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
        <div class="max-w-xl space-y-3">
          <span class="text-premium-gold font-bold uppercase tracking-[0.3em] text-[10px]">Solutions Avancées</span>
          <h2 class="text-3xl md:text-4xl font-display font-bold text-premium-midnight">
            Une Maîtrise Totale de votre <br /> <span class="text-premium-gold">Chaîne Logistique.</span>
          </h2>
        </div>
        <p class="text-slate-500 max-w-[280px] text-xs leading-relaxed font-medium">
          Découvrez une suite d'outils intelligents conçus pour transformer vos défis opérationnels.
        </p>
      </div>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[190px]">
        
        <!-- Large Card: PDF Treatment -->
        <div class="md:col-span-8 md:row-span-2 group relative overflow-hidden rounded-3xl bg-premium-midnight border border-white/5 shadow-2xl transition-all duration-500 hover:shadow-premium-gold/10">
          <img src="../../assets/Images/res4.jpg" alt="Traitement PDF" class="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" />
          <div class="absolute inset-0 bg-gradient-to-t from-premium-midnight via-premium-midnight/60 to-transparent"></div>
          
          <div class="absolute bottom-8 left-8 right-8 space-y-3">
            <div class="w-8 h-8 rounded-lg bg-premium-gold/20 backdrop-blur-md flex items-center justify-center border border-premium-gold/30">
              <i class="fas fa-file-pdf text-premium-gold text-sm"></i>
            </div>
            <h3 class="text-xl font-display font-bold text-white">Analyse Intelligente</h3>
            <p class="text-slate-400 text-xs max-w-xs leading-relaxed font-medium">Extraction automatisée de données par IA pour vos contrats, réduisant les erreurs de 99%.</p>
            <button class="flex items-center gap-2 text-premium-gold font-bold text-[10px] group/btn uppercase tracking-widest">
              Détails <i class="fas fa-arrow-right text-[8px] group-hover/btn:translate-x-1 transition-transform"></i>
            </button>
          </div>
        </div>

        <!-- Square Card: Distribution Plan -->
        <div class="md:col-span-4 md:row-span-2 group relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-xl transition-all duration-500 hover:-translate-y-2">
          <img src="../../assets/Images/dept.jpg" alt="Plan Distribution" class="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:scale-110 transition-transform duration-1000" />
          <div class="relative h-full p-6 flex flex-col justify-between z-10">
            <div class="w-10 h-10 rounded-xl bg-premium-midnight flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
              <i class="fas fa-map-marked-alt text-premium-gold text-lg"></i>
            </div>
            <div>
              <h3 class="text-lg font-display font-bold text-premium-midnight mb-2">Itinéraires</h3>
              <p class="text-[10px] text-slate-500 leading-relaxed mb-4 font-medium">Algorithmes de pointe pour des tournées optimisées, réduisant les coûts de 15%.</p>
              <div class="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div class="w-2/3 h-full bg-premium-gold"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Medium Card: Resource Management -->
        <div class="md:col-span-4 md:row-span-1 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-premium-midnight to-slate-900 p-6 flex items-center gap-4 shadow-lg border border-white/5">
          <div class="w-10 h-10 rounded-xl bg-premium-gold/10 flex items-center justify-center shrink-0 border border-premium-gold/20">
            <i class="fas fa-cogs text-premium-gold text-lg"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-white tracking-wide">Gestion Pro</h3>
            <p class="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Ressources & Dépôts</p>
          </div>
          <i class="fas fa-chevron-right absolute right-6 text-white/20 text-[10px]"></i>
        </div>

        <!-- Wide Card: Advanced Reporting -->
        <div class="md:col-span-8 md:row-span-1 group relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-xl p-6 flex items-center justify-between">
          <div class="flex gap-4 items-center">
            <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-premium-midnight transition-colors duration-500">
              <i class="fas fa-chart-line text-premium-gold text-lg group-hover:text-white transition-colors"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-premium-midnight">Analytique</h3>
              <p class="text-[10px] text-slate-500 font-medium">Tableaux de bord prédictifs en temps réel.</p>
            </div>
          </div>
          <img src="../../assets/Images/res1.jpg" alt="Reporting" class="w-20 h-12 object-cover rounded-lg shadow-sm group-hover:rotate-3 transition-transform opacity-80" />
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
