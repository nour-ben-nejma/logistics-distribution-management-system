<template>
  <section id="features" class="py-24 bg-white relative overflow-hidden">
    <!-- Sophisticated Background Pattern -->
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>

    <div class="max-w-7xl mx-auto px-6 relative z-10">
      <div class="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        <!-- Image with Architectural Frame -->
        <div class="lg:w-5/12 relative">
          <div class="absolute -top-8 -left-8 w-32 h-32 bg-premium-gold/10 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-8 -right-8 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
          
          <div class="relative group">
            <div class="absolute inset-0 bg-premium-midnight rounded-[2.5rem] rotate-2 group-hover:rotate-0 transition-transform duration-700"></div>
            <div class="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 aspect-video">
              <img src="../../assets/Images/abt.jpg" alt="Logistics Excellence" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              
              <!-- Floating Achievement Card -->
              <div class="absolute top-6 right-6 glass p-3 rounded-xl border border-white/40 shadow-xl animate-bounce-slow">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-premium-gold flex items-center justify-center text-white shadow-lg">
                    <i class="fas fa-check text-xs"></i>
                  </div>
                  <div>
                    <p class="text-[8px] text-slate-500 uppercase font-bold tracking-tighter">Certifié ISO</p>
                    <p class="text-xs font-bold text-premium-midnight">Standard Mondial</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Experience Badge -->
            <div class="absolute -bottom-8 -left-8 bg-white p-6 rounded-[1.5rem] shadow-premium-lg border border-slate-100 hidden md:block">
              <div class="flex flex-col items-center">
                <span class="text-3xl font-display font-black text-premium-gold line-height-1">20+</span>
                <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Années d'Expertise</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Professional Copy -->
        <div class="lg:w-7/12 space-y-8">
          <div class="space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-premium-gold/10 border border-premium-gold/20">
              <span class="w-1.5 h-1.5 rounded-full bg-premium-gold"></span>
              <span class="text-[9px] font-bold text-premium-gold uppercase tracking-[0.2em]">Leadership Industriel</span>
            </div>
            <h2 class="text-3xl md:text-4xl font-display font-bold text-premium-midnight leading-[1.1]">
              Redéfinir le Futur de la <br /> <span class="text-transparent bg-clip-text bg-gradient-to-r from-premium-gold to-premium-gold-light">Logistique.</span>
            </h2>
          </div>

          <p class="text-base text-slate-600 leading-relaxed font-medium">
            LogistiCo ne se contente pas de transporter des marchandises ; nous bâtissons des écosystèmes de confiance. Notre approche technocratique combine l'IA prédictive et une excellence opérationnelle sans faille.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div v-for="(feat, idx) in keyFeatures" :key="idx" class="group">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-xl bg-premium-surface border border-slate-100 flex items-center justify-center group-hover:bg-premium-midnight group-hover:border-premium-midnight transition-all duration-300">
                  <i :class="feat.icon" class="text-premium-gold text-base"></i>
                </div>
                <h4 class="text-sm font-bold text-premium-midnight">{{ feat.title }}</h4>
              </div>
              <p class="text-xs text-slate-500 leading-relaxed">{{ feat.desc }}</p>
            </div>
          </div>

          <div class="pt-2 flex items-center gap-6">
            <button class="btn-gold group !px-6 !py-3.5 !text-xs">
              Découvrir nos Valeurs
              <i class="fas fa-arrow-right ml-2 text-[10px] group-hover:translate-x-1 transition-transform"></i>
            </button>
            <a href="#" class="text-[10px] font-bold text-premium-midnight hover:text-premium-gold transition-colors border-b border-premium-gold/20 hover:border-premium-gold py-1 uppercase tracking-widest">
              Consulter les rapports
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const keyFeatures = [
  { title: 'Intelligence Artificielle', desc: 'Optimisation prédictive de vos stocks en temps réel.', icon: 'fas fa-microchip' },
  { title: 'Traçabilité Totale', desc: 'Une visibilité à 360° sur chaque colis, partout dans le monde.', icon: 'fas fa-map-location-dot' },
  { title: 'Éco-Responsable', desc: 'Engagement carbone neutre pour une logistique durable.', icon: 'fas fa-seedling' },
  { title: 'Support Premium', desc: 'Une équipe d experts dédiée à votre succès 24/7.', icon: 'fas fa-headset' },
]
</script>

<style scoped>
.shadow-premium-lg {
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.08);
}
.animate-bounce-slow {
  animation: bounce 3s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
