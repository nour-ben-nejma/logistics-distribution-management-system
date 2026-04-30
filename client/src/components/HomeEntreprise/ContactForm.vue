<template>
  <section id="contact" class="py-24 bg-white relative overflow-hidden">
    <!-- Decorative Glow -->
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-premium-gold/5 rounded-full blur-[120px]"></div>

    <div class="max-w-7xl mx-auto px-6">
      <div class="bg-premium-midnight rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        
        <!-- Info Side -->
        <div class="lg:w-2/5 p-10 md:p-14 bg-gradient-to-br from-premium-midnight to-slate-900 text-white relative">
          <div class="absolute top-0 right-0 p-8 opacity-10">
            <i class="fas fa-paper-plane text-8xl -rotate-12"></i>
          </div>
          
          <div class="relative z-10 space-y-10">
            <div>
              <h2 class="text-2xl font-display font-bold mb-3 leading-tight">Prêt à Transformer votre Logistique ?</h2>
              <p class="text-slate-400 text-xs leading-relaxed font-medium">Nos experts sont à votre disposition pour analyser vos besoins et concevoir une solution sur mesure.</p>
            </div>

            <div class="space-y-6">
              <div class="flex items-start gap-5">
                <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <i class="fas fa-phone-alt text-premium-gold text-sm"></i>
                </div>
                <div>
                  <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Appelez-nous</p>
                  <p class="text-base font-medium">+216 31 550 533</p>
                </div>
              </div>

              <div class="flex items-start gap-5">
                <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <i class="fas fa-envelope text-premium-gold text-sm"></i>
                </div>
                <div>
                  <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Email</p>
                  <p class="text-base font-medium">contact@logistico.com</p>
                </div>
              </div>

              <div class="flex items-start gap-5">
                <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <i class="fas fa-location-dot text-premium-gold text-sm"></i>
                </div>
                <div>
                  <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Siège Social</p>
                  <p class="text-base font-medium">Les Berges du Lac, Tunis</p>
                </div>
              </div>
            </div>

            <!-- Social -->
            <div class="pt-6 border-t border-white/10 flex gap-3">
              <a href="#" class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-premium-gold transition-colors duration-300 text-xs">
                <i class="fab fa-linkedin-in"></i>
              </a>
              <a href="#" class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-premium-gold transition-colors duration-300 text-xs">
                <i class="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- Form Side -->
        <div class="lg:w-3/5 p-10 md:p-14 bg-white">
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nom Complet</label>
                <input type="text" placeholder="Jean Dupont" class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all text-sm font-medium" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Entreprise</label>
                <input type="text" placeholder="Nom de votre société" class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all text-sm font-medium" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Professionnel</label>
              <input type="email" placeholder="contact@entreprise.com" class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all text-sm font-medium" />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
              <textarea rows="3" placeholder="Comment pouvons-nous vous aider ?" class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all resize-none text-sm font-medium"></textarea>
            </div>

            <button type="submit" class="w-full btn-gold !py-4 !text-sm shadow-lg shadow-premium-gold/10">
              Envoyer la demande
            </button>
            <p class="text-center text-[10px] text-slate-400 font-medium">En envoyant ce formulaire, vous acceptez notre politique de confidentialité.</p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2';

const handleSubmit = () => {
  Swal.fire({
    title: 'Message Envoyé !',
    text: 'Notre équipe vous contactera dans les plus brefs délais.',
    icon: 'success',
    confirmButtonColor: '#D4AF37'
  });
};
</script>

<style scoped>
</style>
