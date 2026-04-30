<template>
  <section class="relative h-screen w-full flex items-center justify-center overflow-hidden">
    <!-- Background Video with Advanced Overlay -->
    <video autoplay loop muted playsinline class="absolute inset-0 w-full h-full object-cover">
      <source src="../../assets/Video/background.mp4" type="video/mp4" />
    </video>
    
    <!-- Multi-layer Gradient Overlay for Depth -->
    <div class="absolute inset-0 bg-premium-midnight/60"></div>
    <div class="absolute inset-0 bg-gradient-to-b from-premium-midnight/40 via-transparent to-premium-surface"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-premium-midnight/20 to-premium-midnight/80"></div>

    <!-- Content -->
    <div class="relative z-10 max-w-7xl mx-auto px-6 text-center">
      <h1 class="text-4xl md:text-6xl font-display font-black text-white mb-6 leading-[0.9] tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
        L'EXCELLENCE <br />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-premium-gold via-premium-gold-light to-premium-gold">OPÉRATIONNELLE.</span>
      </h1>

      <p class="text-base md:text-lg text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
        Optimisez chaque maillon de votre chaîne d'approvisionnement avec une plateforme conçue pour la performance et la précision.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
        <button @click="scrollToContent" class="btn-gold !text-sm !px-10 !py-4 group shadow-xl shadow-premium-gold/20">
          Démarrer maintenant
          <i class="fas fa-arrow-right ml-3 text-xs group-hover:translate-x-1 transition-transform"></i>
        </button>
        <button class="px-8 py-4 rounded-premium border-2 border-white/20 text-white text-sm font-bold hover:bg-white hover:text-premium-midnight transition-all backdrop-blur-sm">
          Voir la démo
        </button>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer group" @click="scrollToContent">
      <span class="text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Explorer</span>
      <div class="w-[1px] h-12 bg-gradient-to-b from-premium-gold to-transparent"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
const scrollToContent = () => {
  const nextSection = document.getElementById('features')
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.animate-in {
  animation-fill-mode: forwards;
}
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes slide-in-from-bottom-4 { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.fade-in { animation-name: fade-in; }
.slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
.delay-100 { animation-delay: 100ms; }
.delay-300 { animation-delay: 300ms; }
.delay-500 { animation-delay: 500ms; }
</style>
