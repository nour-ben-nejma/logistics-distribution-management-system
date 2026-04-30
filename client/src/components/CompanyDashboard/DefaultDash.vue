<template>
  <div class="space-y-8 animate-in fade-in duration-700">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="w-2 h-2 rounded-full bg-premium-gold animate-pulse"></span>
          <span class="text-[10px] font-bold text-premium-gold uppercase tracking-[0.3em]">Surveillance en Temps Réel</span>
        </div>
        <h1 class="text-3xl font-display font-black text-premium-midnight tracking-tight">Réseau Logistique</h1>
        <p class="text-slate-500 text-sm font-medium">Cartographie interactive de vos implantations stratégiques.</p>
      </div>
      
      <div class="flex items-center gap-3 p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <button 
          v-for="view in ['Map', 'List', 'Analytics']" 
          :key="view"
          class="px-5 py-2 rounded-xl text-xs font-bold transition-all"
          :class="activeView === view ? 'bg-premium-midnight text-white shadow-lg' : 'text-slate-400 hover:text-premium-midnight hover:bg-slate-50'"
          @click="activeView = view"
        >
          {{ view }}
        </button>
      </div>
    </div>

    <!-- Key Performance Indicators -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- KPI Card 1 -->
      <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
        <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16"></div>
        <div class="flex justify-between items-start mb-6">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 shadow-lg shadow-blue-500/10">
            <Store class="w-6 h-6" />
          </div>
          <span class="px-2.5 py-1 rounded-lg bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider">+12%</span>
        </div>
        <p class="text-3xl font-display font-black text-premium-midnight mb-1">{{ salePoints.length }}</p>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Points de Vente</p>
      </div>

      <!-- KPI Card 2 -->
      <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
        <div class="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl -mr-16 -mt-16"></div>
        <div class="flex justify-between items-start mb-6">
          <div class="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-500 shadow-lg shadow-red-500/10">
            <Warehouse class="w-6 h-6" />
          </div>
          <span class="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Stable</span>
        </div>
        <p class="text-3xl font-display font-black text-premium-midnight mb-1">{{ warehouses.length }}</p>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Dépôts Stratégiques</p>
      </div>

      <!-- KPI Card 3 -->
      <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
        <div class="absolute top-0 right-0 w-32 h-32 bg-premium-gold/5 blur-3xl -mr-16 -mt-16"></div>
        <div class="flex justify-between items-start mb-6">
          <div class="w-12 h-12 rounded-2xl bg-premium-gold/10 flex items-center justify-center text-premium-gold group-hover:bg-premium-gold group-hover:text-white transition-all duration-500 shadow-lg shadow-premium-gold/10">
            <Activity class="w-6 h-6" />
          </div>
          <span class="px-2.5 py-1 rounded-lg bg-premium-gold/10 text-premium-gold text-[10px] font-bold uppercase tracking-wider">98%</span>
        </div>
        <p class="text-3xl font-display font-black text-premium-midnight mb-1">Optimum</p>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Efficacité Flux</p>
      </div>

      <!-- Filters Panel -->
      <div class="bg-premium-midnight p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-premium-gold/10 blur-3xl -mr-16 -mt-16"></div>
        <h4 class="text-white text-xs font-bold uppercase tracking-widest mb-4">Contrôles</h4>
        <div class="space-y-3">
          <label class="flex items-center justify-between cursor-pointer group">
            <span class="text-[11px] font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-wider">Points de Vente</span>
            <input type="checkbox" v-model="showSalePoints" @change="updateMap" class="w-4 h-4 rounded border-white/10 bg-white/5 text-premium-gold focus:ring-premium-gold/20" />
          </label>
          <label class="flex items-center justify-between cursor-pointer group">
            <span class="text-[11px] font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-wider">Entrepôts</span>
            <input type="checkbox" v-model="showWarehouses" @change="updateMap" class="w-4 h-4 rounded border-white/10 bg-white/5 text-premium-gold focus:ring-premium-gold/20" />
          </label>
        </div>
      </div>
    </div>

    <!-- Main Map View -->
    <div class="relative">
      <!-- Status Overlay -->
      <Transition name="fade">
        <div v-if="loading" class="absolute inset-0 z-20 bg-white/40 backdrop-blur-[2px] flex items-center justify-center rounded-[2.5rem]">
          <div class="bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-4">
            <div class="w-10 h-10 border-4 border-premium-gold/20 border-t-premium-gold rounded-full animate-spin"></div>
            <span class="text-sm font-bold text-premium-midnight">Synchronisation GPS en cours...</span>
          </div>
        </div>
      </Transition>

      <div class="bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        <div id="tunisia-map" class="w-full h-[650px] rounded-[2rem] z-0 grayscale-[0.2] contrast-[1.1]"></div>
      </div>

      <!-- Errors List -->
      <Transition name="slide-up">
        <div v-if="geocodingErrors.length > 0" class="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4">
          <AlertCircle class="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p class="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Anomalies de Géo-localisation</p>
            <p class="text-xs text-red-500 font-medium leading-relaxed">
              Les adresses suivantes n'ont pas pu être projetées avec précision : {{ geocodingErrors.join(', ') }}
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { 
  Store, 
  Warehouse, 
  Activity, 
  Settings, 
  AlertCircle,
  MapPin,
  ChevronRight
} from 'lucide-vue-next';

const activeView = ref('Map');
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

const map = ref<L.Map | null>(null);
const markers = ref<L.Marker[]>([]);
const showSalePoints = ref(true);
const showWarehouses = ref(true);
const loading = ref(false);
const geocodingErrors = ref<string[]>([]);

const salePoints = ref<any[]>([]);
const warehouses = ref<any[]>([]);

const preciseLocations: Record<string, [number, number]> = {
  'Avenue Habib Bourguiba, Monastir': [35.7780, 10.8262],
  'Rue de l\'Indépendance, Monastir': [35.7765, 10.8289],
  'Port de Monastir': [35.7746, 10.8349],
  'Avenue Habib Bourguiba, Tunis': [36.7985, 10.1765],
  'Rue de Marseille, Tunis': [36.8002, 10.1814],
  'Avenue Taïeb Mhiri, Sousse': [35.8250, 10.6347],
};

// Create custom icons with more premium SVG style if possible, or just better markers
const createCustomMarker = (type: 'sale' | 'warehouse') => {
  const color = type === 'sale' ? '#3B82F6' : '#EF4444';
  const svgIcon = `
    <div class="relative flex items-center justify-center">
      <div class="absolute inset-0 scale-150 blur-sm bg-white/20 rounded-full"></div>
      <div class="w-8 h-8 rounded-full bg-white border-4 border-[${color}] shadow-xl flex items-center justify-center">
        <div class="w-2 h-2 rounded-full bg-[${color}] animate-pulse"></div>
      </div>
      <div class="absolute -bottom-1 w-2 h-2 bg-[${color}] rotate-45 transform -translate-x-1/2 left-1/2"></div>
    </div>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const salePointIcon = createCustomMarker('sale');
const warehouseIcon = createCustomMarker('warehouse');

const initMap = () => {
  map.value = L.map('tunisia-map', {
    zoomControl: false,
    preferCanvas: true,
  }).setView([34.0, 9.0], 6);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© CartoDB',
    maxZoom: 18,
    minZoom: 6,
  }).addTo(map.value!);
};

const loadData = async () => {
  loading.value = true;
  geocodingErrors.value = [];

  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    const [salePointsRes, warehousesRes] = await Promise.all([
      api.get('/salePoints/getSalePoints'),
      api.get('/warehouses/getInternalDepots'),
    ]);

    salePoints.value = await processLocations(salePointsRes.data.data, 'salePoint');
    warehouses.value = await processLocations(warehousesRes.data.data, 'warehouse');

    updateMap();
  } catch (error) {
    console.error('Loading error:', error);
  } finally {
    loading.value = false;
  }
};

const processLocations = async (locations: any[], type: string) => {
  if (!locations) return [];
  return Promise.all(locations.map(async loc => {
    if (!loc.position || !loc.position.coordinates || loc.position.coordinates.length !== 2) {
      try {
        const coords = await getExactCoordinates(loc.address || loc.location || '', loc.name);
        loc.position = { type: 'Point', coordinates: coords };
      } catch (error) {
        geocodingErrors.value.push(loc.name);
        return null;
      }
    }
    return { ...loc, type };
  })).then(results => results.filter(loc => loc !== null));
};

const getExactCoordinates = async (address: string, name: string): Promise<[number, number]> => {
  const cleanAddress = address.trim().toLowerCase();
  for (const [key, coords] of Object.entries(preciseLocations)) {
    if (cleanAddress.includes(key.toLowerCase())) return coords;
  }

  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=tn&limit=1`);
  const data = await response.json();
  if (!data || data.length === 0) throw new Error('Not found');
  const result = data[0];
  return [parseFloat(result.lat), parseFloat(result.lon)];
};

const updateMap = () => {
  if (!map.value) return;

  markers.value.forEach(marker => map.value?.removeLayer(marker));
  markers.value = [];

  const locationsToShow = [
    ...(showSalePoints.value ? salePoints.value : []),
    ...(showWarehouses.value ? warehouses.value : []),
  ];

  locationsToShow.forEach(loc => {
    const icon = loc.type === 'salePoint' ? salePointIcon : warehouseIcon;
    const [lng, lat] = loc.position.coordinates;
    
    const marker = L.marker([lat, lng], { icon })
      .addTo(map.value!)
      .bindPopup(`
        <div class="map-popup-premium">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl ${loc.type === 'salePoint' ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'} flex items-center justify-center">
              ${loc.type === 'salePoint' ? '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' : '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M3 7v1a3 3 0 0 0 6 0V7m6 1V7a3 3 0 0 0-6 0v1m12-1v1a3 3 0 0 1-6 0V7"/><path d="M4 21V10"/><path d="M20 21V10"/><path d="M9 21V10"/><path d="M15 21V10"/><path d="M3 7l9-4 9 4"/></svg>'}
            </div>
            <div>
              <h4 class="font-display font-black text-premium-midnight leading-tight">${loc.name}</h4>
              <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">${loc.type === 'salePoint' ? 'Point de Vente' : 'Entrepôt Logistique'}</p>
            </div>
          </div>
          <p class="text-[11px] text-slate-600 font-medium mb-4 leading-relaxed">${loc.address || loc.location}</p>
          <button class="w-full py-2 bg-slate-50 hover:bg-premium-gold hover:text-white transition-all rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            Voir les Détails <ChevronRight class="w-3 h-3" />
          </button>
        </div>
      `);
    markers.value.push(marker);
  });

  if (markers.value.length > 0) {
    const group = new L.FeatureGroup(markers.value);
    map.value.fitBounds(group.getBounds().pad(0.2), { maxZoom: 10 });
  }
};

onMounted(async () => {
  initMap();
  await loadData();
});

onBeforeUnmount(() => {
  if (map.value) map.value.remove();
});
</script>

<style>
/* Custom Div Icon Reset */
.custom-div-icon {
  background: transparent !important;
  border: none !important;
}

.leaflet-popup-content-wrapper {
  border-radius: 1.5rem !important;
  padding: 0 !important;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25) !important;
  border: 1px solid rgba(15, 23, 42, 0.05) !important;
}

.leaflet-popup-content {
  margin: 0 !important;
  padding: 1.5rem !important;
  width: 260px !important;
}

.leaflet-popup-tip {
  background: white !important;
}

.map-popup-premium {
  font-family: 'Inter', sans-serif;
}
</style>

<style scoped>
.animate-in {
  animation-fill-mode: forwards;
}
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.fade-in { animation-name: fade-in; }

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>