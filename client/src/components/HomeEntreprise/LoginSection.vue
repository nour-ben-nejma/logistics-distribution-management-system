<template>
  <div class="min-h-screen bg-premium-surface font-sans selection:bg-premium-gold/30 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-premium-gold/5 blur-[120px] rounded-full"></div>
      <div class="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-premium-midnight/5 blur-[120px] rounded-full"></div>
    </div>

    <div class="relative min-h-screen flex items-stretch">
      <div class="w-full flex flex-col lg:flex-row overflow-hidden shadow-2xl">
        
        <!-- Left Panel: Brand identity -->
        <div class="lg:w-1/2 bg-premium-midnight p-10 md:p-16 flex flex-col justify-between text-white relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-premium-gold/10 blur-[80px] -mr-32 -mt-32"></div>
          
          <div class="relative z-10">
            <router-link to="/" class="flex items-center gap-3 mb-20 group">
              <div class="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-all duration-500">
                <img src="../../assets/Images/Logo.png" alt="Logo" class="w-7 h-7 object-contain brightness-0 invert" />
              </div>
              <div class="flex flex-col -space-y-1">
                <span class="text-2xl font-display font-black tracking-tighter">Logisti<span class="text-premium-gold">Co</span></span>
                <span class="text-[8px] font-bold text-premium-gold uppercase tracking-[0.4em] ml-0.5">Excellence Hub</span>
              </div>
            </router-link>

            <div class="space-y-6">
              <h1 class="text-4xl md:text-5xl font-display font-bold leading-[1.1]">
                Ravi de vous <br />
                <span class="text-premium-gold italic">Revoir.</span>
              </h1>
              <p class="text-slate-400 text-base font-medium max-w-sm leading-relaxed">
                Reprenez le contrôle de votre chaîne logistique avec nos outils de précision.
              </p>
            </div>
          </div>

          <div class="relative z-10 space-y-8 mt-12">
            <div class="flex items-center gap-4 group">
              <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-premium-gold/20 transition-colors">
                <ShieldCheck class="w-5 h-5 text-premium-gold" />
              </div>
              <span class="text-sm font-medium text-slate-300">Sécurité de Grade Bancaire</span>
            </div>
            <div class="flex items-center gap-4 group">
              <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-premium-gold/20 transition-colors">
                <Zap class="w-5 h-5 text-premium-gold" />
              </div>
              <span class="text-sm font-medium text-slate-300">Performance Instantanée</span>
            </div>
          </div>

          <div class="relative z-10 pt-16 mt-auto">
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">LogistiCo &copy; 2026 - Tous droits réservés</p>
          </div>
        </div>

        <!-- Right Panel: Login Form -->
        <div class="lg:w-1/2 bg-white/80 backdrop-blur-md p-10 md:p-16 flex flex-col justify-center relative">
          <!-- Back Button -->
          <router-link to="/" class="absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-slate-400 hover:text-premium-gold transition-colors group">
            <div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-premium-gold/10 transition-all">
              <ChevronLeft class="w-4 h-4" />
            </div>
            <span class="text-xs font-bold uppercase tracking-widest">Retour</span>
          </router-link>

          <div class="max-w-sm mx-auto w-full">
            <div class="mb-10 text-center lg:text-left">
              <h2 class="text-2xl font-display font-bold text-premium-midnight mb-2">Authentification</h2>
              <p class="text-sm text-slate-500 font-medium">Accédez à votre espace professionnel.</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-6">
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Email ou Téléphone</label>
                <div class="relative group">
                  <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                  <input
                    v-model="loginData.identifier"
                    type="text"
                    placeholder="votre@email.com"
                    class="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-premium-gold focus:ring-4 focus:ring-premium-gold/5 transition-all font-medium text-premium-midnight placeholder:text-slate-300 text-sm"
                    required
                  />
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex justify-between items-center px-1">
                  <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Mot de passe</label>
                  <button type="button" @click="showForgotPasswordAlert" class="text-[10px] font-bold text-premium-gold hover:text-premium-gold-light transition-colors uppercase tracking-widest">Oublié ?</button>
                </div>
                <div class="relative group">
                  <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-premium-gold transition-colors" />
                  <input
                    v-model="loginData.password"
                    type="password"
                    placeholder="••••••••"
                    class="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-premium-gold focus:ring-4 focus:ring-premium-gold/5 transition-all font-medium text-premium-midnight placeholder:text-slate-300 text-sm"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                class="w-full btn-gold !py-4 flex items-center justify-center gap-3 group mt-8 shadow-lg shadow-premium-gold/20 transition-all" 
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span v-else class="text-xs font-bold uppercase tracking-widest">Se connecter</span>
                <ArrowRight v-if="!isLoading" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div class="mt-12 text-center pt-8 border-t border-slate-100">
              <p class="text-slate-400 text-xs font-medium">
                Nouveau sur LogistiCo ? 
                <button @click="goToCreateAccount" class="text-premium-gold font-bold hover:underline ml-1">Créer un compte</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  ChevronLeft 
} from 'lucide-vue-next';
import api from '../../services/Api';

interface LoginData {
  identifier: string;
  password: string;
}

const router = useRouter();
const loginData = ref<LoginData>({ identifier: '', password: '' });
const isLoading = ref(false);

const goToCreateAccount = () => {
  router.push('/create-account');
};

const handleLogin = async () => {
  if (!loginData.value.identifier || !loginData.value.password) {
    Swal.fire('Erreur', 'Veuillez remplir tous les champs.', 'error');
    return;
  }

  isLoading.value = true;

  try {
    const response = await api.post('/authCompany/login', {
      email: loginData.value.identifier,
      password: loginData.value.password
    });

    const data = response.data;

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('role', data.user.role);
    localStorage.setItem('user', JSON.stringify(data.user));

    const redirectPath = localStorage.getItem('redirectPath') ||
      (data.user.role === 'admin' ? '/AdminDashboard/DefaultDashADD' : '/dashCompany');

    router.push(redirectPath);
    localStorage.removeItem('redirectPath');

  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    Swal.fire('Échec de connexion', errorMessage, 'error');
  } finally {
    isLoading.value = false;
  }
};

const showForgotPasswordAlert = () => {
  Swal.fire({
    title: 'Mot de passe oublié ?',
    text: 'Entrez votre email pour réinitialiser votre mot de passe.',
    input: 'email',
    inputPlaceholder: 'votre@email.com',
    showCancelButton: true,
    confirmButtonText: 'Envoyer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#D4AF37',
  });
};
</script>

<style scoped>
/* Glass effect handled by Tailwind utility */
</style>