<template>
  <div class="space-y-8 animate-in fade-in duration-500">
    <!-- Page Header -->
    <div class="mb-10">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2 h-2 rounded-full bg-premium-gold animate-pulse"></span>
            <span class="text-[10px] font-bold text-premium-gold uppercase tracking-[0.3em]">Réseau de Vente</span>
          </div>
          <h1 class="text-4xl font-display font-black text-premium-midnight tracking-tight">Points de Vente</h1>
          <p class="text-slate-500 text-sm font-medium mt-1">Gérez vos magasins, relais et centres de distribution</p>
        </div>
        
        <div class="flex items-center gap-2">
          <button @click="loadData" class="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-premium-gold transition-all shadow-sm" title="Rafraîchir">
            <i class="fas fa-sync-alt text-xs" :class="{'animate-spin': loading}"></i>
          </button>
          <button @click="handleAddSalePoint" class="btn-gold ml-2">
            <i class="fas fa-plus mr-2"></i> Nouveau Point
          </button>
        </div>
      </div>
    </div>

    <!-- Toolbar: Search & Filter -->
    <div class="flex flex-col md:flex-row gap-4 mb-8">
      <div class="relative flex-1 max-w-md">
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input 
          type="text" 
          v-model="searchTerm" 
          @input="applyFilters"
          placeholder="Rechercher par nom, adresse ou type..." 
          class="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-premium-gold focus:ring-1 focus:ring-premium-gold transition-colors shadow-sm"
        />
      </div>
    </div>

    <!-- Error/Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-premium-gold animate-pulse">
      <i class="fas fa-circle-notch fa-spin text-4xl mb-4"></i>
      <p class="font-medium">Chargement des points de vente...</p>
    </div>

    <div v-else-if="filteredSalePoints.length === 0" class="card-premium flex flex-col items-center justify-center py-20 text-center">
      <div class="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
        <i class="fas fa-store-slash text-4xl text-slate-300"></i>
      </div>
      <h3 class="text-xl font-bold text-premium-midnight mb-2">Aucun point de vente trouvé</h3>
      <p class="text-slate-500 max-w-md mb-8">Commencez par ajouter votre premier point de vente ou modifiez vos critères de recherche.</p>
      <button @click="handleAddSalePoint" class="btn-outline !py-2.5 !px-5">
        <i class="fas fa-plus mr-2"></i> Ajouter un point
      </button>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="point in paginatedSalePoints" :key="point._id" class="card-premium flex flex-col group transition-all duration-300 hover:-translate-y-1">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-premium-midnight shadow-sm shrink-0 group-hover:border-premium-gold/30 transition-all">
              <i v-if="point.type === 'Store'" class="fas fa-store text-xl group-hover:text-premium-gold transition-colors"></i>
              <i v-else-if="point.type === 'Pickup Point'" class="fas fa-box text-xl group-hover:text-premium-gold transition-colors"></i>
              <i v-else class="fas fa-building text-xl group-hover:text-premium-gold transition-colors"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-premium-midnight line-clamp-1" :title="point.name">{{ point.name }}</h3>
              <span class="inline-block px-2.5 py-1 rounded-lg text-xs font-bold mt-1" 
                :class="{
                  'bg-blue-50 text-blue-600 border border-blue-100': point.type === 'Store',
                  'bg-emerald-50 text-emerald-600 border border-emerald-100': point.type === 'Pickup Point',
                  'bg-orange-50 text-orange-600 border border-orange-100': point.type === 'Distribution Center',
                  'bg-slate-50 text-slate-600 border border-slate-100': !['Store', 'Pickup Point', 'Distribution Center'].includes(point.type)
                }">
                {{ point.type }}
              </span>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex gap-1">
            <button @click="toggleMap(point)" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Voir sur la carte">
              <i class="fas" :class="activeMapId === point._id ? 'fa-map-marked-alt' : 'fa-map-marker-alt'"></i>
            </button>
            <button @click="handleEditSalePoint(point)" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors" title="Modifier">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="deleteSalePoint(point._id)" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Supprimer">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>

        <div class="text-sm text-slate-500 flex items-start gap-2 mb-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
          <i class="fas fa-map-pin mt-1 text-slate-400"></i>
          <span class="line-clamp-2 leading-relaxed">{{ point.address }}</span>
        </div>

        <!-- Map Container -->
        <div v-show="activeMapId === point._id" class="mt-auto pt-4 border-t border-slate-100">
          <div :id="'map-container-'+point._id" class="w-full h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative z-0">
            <div v-if="isLoadingMap && activeMapId === point._id" class="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
              <i class="fas fa-circle-notch fa-spin text-premium-gold text-2xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredSalePoints.length > 0" class="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
      <div class="text-sm text-slate-500 font-medium">
        Affichage de {{ (currentPage - 1) * itemsPerPage + 1 }} à {{ Math.min(currentPage * itemsPerPage, filteredSalePoints.length) }} sur {{ filteredSalePoints.length }}
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <span class="text-sm font-bold text-premium-midnight px-4">
          Page {{ currentPage }} sur {{ totalPages }}
        </span>
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <Teleport to="body">
    <!-- Sale Point Form Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content !max-w-lg">
        <!-- Modal Header -->
        <div class="modal-header">
          <h2 class="text-xl font-display font-bold text-premium-midnight flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-premium-gold/10 flex items-center justify-center">
              <i :class="['fas', isEditing ? 'fa-edit' : 'fa-plus']" class="text-premium-gold"></i>
            </div>
            {{ isEditing ? 'Modifier le Point de Vente' : 'Nouveau Point de Vente' }}
          </h2>
          <button @click="closeModal" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-premium-midnight transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- Modal Body -->
        <div class="modal-body">
          <form @submit.prevent="submitForm" id="salePointForm" class="space-y-6">
            <div class="space-y-2 text-left">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nom du Point *</label>
              <div class="relative group">
                <i class="fas fa-store absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors"></i>
                <input v-model="salePointForm.name" type="text" required placeholder="Ex: Boutique Paris" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all" />
              </div>
            </div>
            
            <div class="space-y-2 text-left">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Type de Point *</label>
              <div class="relative group">
                <i class="fas fa-tags absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors"></i>
                <select v-model="salePointForm.type" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-10 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all appearance-none cursor-pointer">
                  <option value="" disabled>Sélectionner un type</option>
                  <option value="Store">Magasin (Store)</option>
                  <option value="Pickup Point">Point Relais (Pickup Point)</option>
                  <option value="Distribution Center">Centre de Distribution</option>
                </select>
                <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
              </div>
            </div>
            
            <div class="space-y-2 text-left">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Adresse *</label>
              <div class="relative group">
                <i class="fas fa-map-marker-alt absolute left-4 top-4 text-slate-400 group-focus-within:text-premium-gold transition-colors"></i>
                <textarea v-model="salePointForm.address" required placeholder="Saisir l'adresse complète" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all resize-none"></textarea>
              </div>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button type="button" @click="closeModal" class="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
            Annuler
          </button>
          <button type="submit" form="salePointForm" :disabled="isSubmitting" class="flex-1 btn-gold">
            <i v-if="isSubmitting" class="fas fa-circle-notch fa-spin mr-2"></i>
            {{ isEditing ? 'Mettre à jour' : 'Ajouter le point' }}
          </button>
        </div>
      </div>
    </div>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import axios from 'axios'
import api from '../../services/Api';
import Swal from 'sweetalert2'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
interface SalePoint {
  _id: string
  companyId: string
  name: string
  type: string
  address: string
  status: string
}
interface MapInstance {
  map: L.Map
  resizeObserver: ResizeObserver
}
const salePoints = ref<SalePoint[]>([])
const filteredSalePoints = ref<SalePoint[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchTerm = ref('')
const selectedStatus = ref('')
const selectedSalePoints = ref<string[]>([])
const selectAll = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const isSubmitting = ref(false)
const activeMapId = ref<string | null>(null)
const mapInstances = ref<Record<string, MapInstance>>({})
const isLoadingMap = ref(false)

const showModal = ref(false)
const isEditing = ref(false)
const salePointForm = ref({
  _id: '',
  name: '',
  type: '',
  address: ''
})

// Local API instance removed in favor of shared service
const getCoordinatesFromAddress = async (address: string): Promise<[number, number]> => {
  try {
    const encoded = encodeURIComponent(address)
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encoded}`)
    
    if (!res.ok) throw new Error('Network error')
    
    const data = await res.json()
    if (!data || data.length === 0) throw new Error('Address not found')
    
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
  } catch (error) {
    console.error("Geocoding error:", error)
    throw new Error('Geocoding service unavailable')
  }
}
const initMap = async (point: SalePoint) => {
  const containerId = `map-container-${point._id}`
  const container = document.getElementById(containerId)
  
  if (!container) throw new Error('Map container not found')

  container.innerHTML = '<div class="map-loading">Loading map...</div>'

  try {
    const coords = await getCoordinatesFromAddress(point.address)

    if (!document.getElementById(containerId)) {
      throw new Error('Map container removed')
    }

    container.innerHTML = ''

    const map = L.map(container, {
      preferCanvas: true,
      zoomControl: true,
      fadeAnimation: true
    }).setView(coords, 15)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 10
    }).addTo(map)

    const customIcon = L.icon({
      iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    })

    const marker = L.marker(coords, { icon: customIcon })
      .addTo(map)
      .bindPopup(`<b>${point.name}</b><br>${point.address}<br>
        <small>Lat: ${coords[0].toFixed(4)}, Lng: ${coords[1].toFixed(4)}</small>`)
    
    marker.openPopup()

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize()
    })
    resizeObserver.observe(container)

    mapInstances.value[point._id] = {
      map,
      resizeObserver
    }

    setTimeout(() => {
      map.invalidateSize()
      map.setView(coords, 15)
    }, 100)

  } catch (error) {
    container.innerHTML = '<div class="map-error">Error loading map</div>'
    throw error
  }
}

const destroyMap = (id: string) => {
  if (mapInstances.value[id]) {
    const { map, resizeObserver } = mapInstances.value[id]
    resizeObserver.disconnect()
    map.remove()
    delete mapInstances.value[id]
  }
}

const toggleMap = async (point: SalePoint) => {
  try {
    if (isLoadingMap.value) return
    isLoadingMap.value = true

    if (activeMapId.value === point._id) {
      destroyMap(point._id)
      activeMapId.value = null
      isLoadingMap.value = false
      return
    }

    if (activeMapId.value) {
      destroyMap(activeMapId.value)
    }

    activeMapId.value = point._id

    await nextTick()

    await Promise.race([
      initMap(point),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
    ])

  } catch (error) {
    console.error("Map error:", error)
    activeMapId.value = null
  } finally {
    isLoadingMap.value = false
  }
}

const paginatedSalePoints = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredSalePoints.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredSalePoints.value.length / itemsPerPage.value)
})

const applyFilters = () => {
  filteredSalePoints.value = salePoints.value.filter(point => {
    const matchesSearch = searchTerm.value === '' || 
      point.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      point.address.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      point.type.toLowerCase().includes(searchTerm.value.toLowerCase()) 
    
    return matchesSearch
  })
  
  currentPage.value = 1
}

const resetFilters = () => {
  searchTerm.value = ''
  selectedStatus.value = ''
  applyFilters()
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedSalePoints.value = paginatedSalePoints.value.map(p => p._id)
  } else {
    selectedSalePoints.value = []
  }
}

const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
  })
}

const loadData = async () => {
  try {
    loading.value = true
    error.value = null

    const token = localStorage.getItem('accessToken')
    if (!token) {
      throw new Error('Authentication required - Please login again')
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`

    const userData = await Promise.race([
      api.get('/users/meCompany'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
    ]) as { data: { companyId: string } }
    
    const companyId = userData.data.companyId
    if (!companyId) {
      throw new Error('Company not found - Please complete your company profile')
    }

    const params = {
      companyId,
      search: searchTerm.value || undefined,
      ...(selectedStatus.value && { status: selectedStatus.value })
    }

    const { data } = await api.get('/salePoints/getSalePoints', { params })

    if (!data?.success) {
      throw new Error(data?.message || 'Invalid response format')
    }

    if (!Array.isArray(data.data)) {
      throw new Error('Invalid data format - Expected array')
    }

    salePoints.value = data.data.map((point: SalePoint) => ({
      ...point,
    }))

    applyFilters()

  } catch (err: any) {
    console.error('Error loading sale points:', err)
    error.value = err.response?.data?.message || err.message || 'Error loading sale points'
    
    let errorMessage = error.value
    if (err.message.includes('timeout')) {
      errorMessage = 'Request timeout - Please check your connection'
    } else if (err.response?.status === 401) {
      errorMessage = 'Session expired - Please login again'
    }

    if (err.response?.status === 401 || err.message.includes('Authentication')) {
      localStorage.removeItem('accessToken')
    }
  } finally {
    loading.value = false
  }
}
const closeModal = () => {
  showModal.value = false;
  setTimeout(() => {
    salePointForm.value = {
      _id: '',
      name: '',
      type: '',
      address: ''
    };
    isEditing.value = false;
  }, 200);
}

const handleAddSalePoint = () => {
  salePointForm.value = {
    _id: '',
    name: '',
    type: '',
    address: ''
  };
  isEditing.value = false;
  showModal.value = true;
};

const handleEditSalePoint = (salePoint: SalePoint) => {
  salePointForm.value = { 
    _id: salePoint._id,
    name: salePoint.name,
    type: salePoint.type,
    address: salePoint.address
  };
  isEditing.value = true;
  showModal.value = true;
};

const submitForm = async () => {
  try {
    isSubmitting.value = true;
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Authentication required');
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    if (isEditing.value) {
      const response = await api.put(`/salePoints/update/${salePointForm.value._id}`, salePointForm.value);
      if (response.data.success) {
        await Swal.fire({
          title: 'Success!',
          text: 'Point de vente mis à jour',
          icon: 'success'
        });
        closeModal();
        await loadData();
      }
    } else {
      const response = await api.post('/salePoints/addSalePoint', salePointForm.value);
      if (response.data.success) {
        await Swal.fire({
          title: 'Success!',
          text: 'Point de vente ajouté',
          icon: 'success'
        });
        closeModal();
        await loadData();
      }
    }
  } catch (error) {
    console.error("Sale point submit error:", error);
    let errorMessage = (error as any)?.response?.data?.message || (error as Error)?.message;
    
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      errorMessage = Object.values(error.response.data.errors as any).join('<br>');
    }

    await Swal.fire({
      title: 'Erreur',
      html: errorMessage,
      icon: 'error'
    });
  } finally {
    isSubmitting.value = false;
  }
};

const deleteSalePoint = async (id: string) => {
  try {
    const confirm = await Swal.fire({
      title: 'Confirm deletion',
      text: "Are you sure you want to delete this sales point?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (!confirm.isConfirmed) return

    const token = localStorage.getItem('accessToken')
    if (!token) throw new Error('Authentication required')
    
    api.defaults.headers.common.Authorization = `Bearer ${token}`

    const response = await api.delete(`/salePoints/deleteSalePoint/${id}`)
    
    if (response.data.success) {
      await Swal.fire({
        title: 'Deleted!',
        text: 'Sales point has been deleted.',
        icon: 'success'
      })
      
      await loadData()
    }
  } catch (err: any) {
    Swal.fire({
      title: 'Error',
      text: err.response?.data?.message || err.message || 'Error while deleting',
      icon: 'error'
    })
  }
}

watch(itemsPerPage, () => {
  currentPage.value = 1
})

watch(selectedSalePoints, (newVal) => {
  selectAll.value = newVal.length === paginatedSalePoints.value.length && newVal.length > 0
})

onMounted(() => {
  fixLeafletIcons()
  loadData()
})

onBeforeUnmount(() => {
  Object.keys(mapInstances.value).forEach(id => {
    destroyMap(id)
  })
})
</script>

<style scoped>
.animate-in {
  animation-fill-mode: forwards;
}
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.fade-in { animation-name: fade-in; }

/* Map Utilities */
:deep(.leaflet-container) {
  border-radius: 0.75rem;
  z-index: 10;
}
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}
:deep(.leaflet-popup-content) {
  font-family: 'Inter', sans-serif;
  margin: 1rem;
}
</style>