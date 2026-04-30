<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="w-2 h-2 rounded-full bg-premium-gold"></span>
          <span class="text-[10px] font-bold text-premium-gold uppercase tracking-[0.3em]">Gestion de Flotte</span>
        </div>
        <h1 class="text-3xl font-display font-black text-premium-midnight tracking-tight">Véhicules</h1>
        <p class="text-slate-500 text-sm font-medium mt-1">Suivi et gestion de votre parc automobile.</p>
      </div>
      <button @click="handleAddTruck" class="btn-gold !px-6 !py-3 !text-xs flex items-center gap-2 shrink-0">
        <Plus class="w-4 h-4" />
        Ajouter un Véhicule
      </button>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
      <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all duration-300">
        <div class="flex justify-between items-start mb-4">
          <div class="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-premium-gold/10 transition-colors duration-500">
            <Truck class="w-5 h-5 text-slate-400 group-hover:text-premium-gold transition-colors" />
          </div>
        </div>
        <p class="text-3xl font-display font-black text-premium-midnight">{{ totalTrucks }}</p>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Flotte Totale</p>
      </div>
      <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all duration-300">
        <div class="flex justify-between items-start mb-4">
          <div class="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
            <CheckCircle class="w-5 h-5 text-green-500" />
          </div>
          <span class="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Actif</span>
        </div>
        <p class="text-3xl font-display font-black text-premium-midnight">{{ availableTrucks }}</p>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Disponibles</p>
      </div>
      <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all duration-300">
        <div class="flex justify-between items-start mb-4">
          <div class="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
            <Wrench class="w-5 h-5 text-amber-500" />
          </div>
        </div>
        <p class="text-3xl font-display font-black text-premium-midnight">{{ maintenanceTrucks }}</p>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">En Maintenance</p>
      </div>
      <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all duration-300">
        <div class="flex justify-between items-start mb-4">
          <div class="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
            <ArrowRightLeft class="w-5 h-5 text-purple-500" />
          </div>
        </div>
        <p class="text-3xl font-display font-black text-premium-midnight">{{ inTransitTrucks }}</p>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">En Transit</p>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col sm:flex-row gap-3">
      <div class="relative flex-grow">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Rechercher un véhicule..."
          class="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-premium-gold/5 focus:border-premium-gold/30 transition-all font-medium placeholder:text-slate-300"
        />
      </div>
      <select v-model="selectedType" class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 focus:outline-none focus:ring-4 focus:ring-premium-gold/5 focus:border-premium-gold/30 transition-all">
        <option value="">Tous les types</option>
        <option v-for="type in truckTypes" :key="type" :value="type">{{ type }}</option>
      </select>
      <select v-model="selectedStatus" class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 focus:outline-none focus:ring-4 focus:ring-premium-gold/5 focus:border-premium-gold/30 transition-all">
        <option value="">Tous les statuts</option>
        <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
      </select>
      <button @click="resetFilters" class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shrink-0">
        <RotateCcw class="w-3.5 h-3.5" />
        Reset
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-slate-100">
            <th class="text-left px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Véhicule</th>
            <th class="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Type</th>
            <th class="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Capacité</th>
            <th class="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Statut</th>
            <th class="text-right px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-if="paginatedTrucks.length === 0">
            <td colspan="5" class="px-8 py-16 text-center">
              <div class="flex flex-col items-center gap-3">
                <div class="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <Truck class="w-7 h-7 text-slate-300" />
                </div>
                <p class="text-sm font-bold text-slate-400">Aucun véhicule trouvé</p>
              </div>
            </td>
          </tr>
          <tr v-for="truck in paginatedTrucks" :key="truck._id" class="hover:bg-slate-50/50 transition-colors group">
            <td class="px-8 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm group-hover:border-premium-gold/30 transition-colors">
                  <Truck class="w-5 h-5 text-premium-midnight group-hover:text-premium-gold transition-colors" />
                </div>
                <span class="text-sm font-bold text-premium-midnight">{{ truck.vehicle }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">{{ truck.type }}</span>
            </td>
            <td class="px-6 py-4">
              <span class="px-3 py-1 rounded-lg bg-premium-gold/10 text-premium-gold text-xs font-bold">{{ formatCapacity(truck.capacity) }}</span>
            </td>
            <td class="px-6 py-4">
              <span :class="[
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                truck.status === 'available' ? 'bg-green-50 text-green-600' :
                truck.status === 'in transit' ? 'bg-purple-50 text-purple-600' :
                'bg-amber-50 text-amber-600'
              ]">
                <span class="w-1.5 h-1.5 rounded-full" :class="[
                  truck.status === 'available' ? 'bg-green-500' :
                  truck.status === 'in transit' ? 'bg-purple-500' : 'bg-amber-500'
                ]"></span>
                {{ truck.status }}
              </span>
            </td>
            <td class="px-8 py-4">
              <div class="flex items-center justify-end gap-2">
                <button @click="handleEditTruck(truck)" class="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-premium-gold/10 hover:text-premium-gold transition-all">
                  <Pencil class="w-4 h-4" />
                </button>
                <button @click="deleteTruck(truck._id)" class="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-8 py-5 border-t border-slate-50">
        <span class="text-xs font-medium text-slate-400">
          {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredTrucks.length) }} sur {{ filteredTrucks.length }} véhicules
        </span>
        <div class="flex items-center gap-2">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <span class="text-xs font-bold text-premium-midnight px-3">{{ currentPage }} / {{ totalPages }}</span>
          <button
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
            class="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { 
  Truck, Plus, Search, RotateCcw, CheckCircle, Wrench, 
  ArrowRightLeft, Pencil, Trash2, ChevronLeft, ChevronRight 
} from 'lucide-vue-next'

interface Truck {
  _id: string
  company_id: string
  vehicle: string
  type: string
  capacity: number
  status: string
}

const router = useRouter()
const trucks = ref<Truck[]>([])
const filteredTrucks = ref<Truck[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchTerm = ref('')
const selectedStatus = ref('')
const selectedType = ref('')
const minFuel = ref<number | null>(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const isSubmitting = ref(false)

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

// Available truck types
const truckTypes = ref([
  'A1',
  'A',
  'B',
   'B+E', 
   'C', 
   'C+E', 
   'D',
    'D1',
     'D+E',
      'H '
])

// Available status options
const statusOptions = ref([
  'available',
  'in transit',
  'maintenance'
])

// Computed properties
const totalTrucks = computed(() => trucks.value.length)
const availableTrucks = computed(() => trucks.value.filter(t => t.status === 'available').length)
const maintenanceTrucks = computed(() => trucks.value.filter(t => t.status === 'maintenance').length)
const inTransitTrucks = computed(() => trucks.value.filter(t => t.status === 'in transit').length)

const paginatedTrucks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTrucks.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredTrucks.value.length / itemsPerPage.value)
)

// Methods
const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'available': return 'status-available'
    case 'in transit': return 'status-transit'
    case 'maintenance': return 'status-maintenance'
    default: return 'status-default'
  }
}

const formatCapacity = (capacity: number | undefined): string => {
  if (capacity === undefined || capacity === null) {
    return 'N/A'
  }
  return capacity.toLocaleString() + ' kg'
}

const applyFilters = () => {
  filteredTrucks.value = trucks.value.filter(truck => {
    const matchesSearch = searchTerm.value === '' || 
      truck.vehicle.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      truck.type.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    const matchesStatus = selectedStatus.value === '' || 
      truck.status === selectedStatus.value
    
    const matchesType = selectedType.value === '' || 
      truck.type === selectedType.value
    
    return matchesSearch && matchesStatus && matchesType
  })
  
  currentPage.value = 1
}

const resetFilters = () => {
  searchTerm.value = ''
  selectedStatus.value = ''
  selectedType.value = ''
  applyFilters()
}

const loadData = async () => {
  try {
    loading.value = true
    error.value = null

    const token = localStorage.getItem('accessToken')
    if (!token) throw new Error('Authentication required')

    api.defaults.headers.common.Authorization = `Bearer ${token}`

    const { data: userData } = await api.get('/users/meCompany')
    const companyId = userData.companyId
    if (!companyId) throw new Error('Company not found')

    const { data } = await api.get('/trucks/getTrucks', {
      params: { 
        company_id: companyId,
        status: selectedStatus.value,
        type: selectedType.value,
        search: searchTerm.value
      }
    })

    if (data.success) {
      trucks.value = data.data
      filteredTrucks.value = [...trucks.value]
    } else {
      throw new Error(data.message || 'Failed to load trucks')
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Error loading trucks'
    
    await Swal.fire({
      title: 'Error',
      text: error.value || undefined,
      icon: 'error',
      confirmButtonText: 'OK'
    })

    if (error.value && error.value.includes('Company not found')) {
      router.push('/company-setup')
    }
  } finally {
    loading.value = false
  }
}

const handleAddTruck = async () => {
  try {
    isSubmitting.value = true;
    
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Authentication required');

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    const { data: userData } = await api.get('/users/meCompany');
    const companyId = userData.companyId;
    if (!companyId) throw new Error('Company not found');

    const { value: formValues } = await Swal.fire({
      title: 'Add New Vehicle',
      html: `
        <div class="custom-form">
          <div class="form-group">
            <label for="swal-vehicle">Vehicle Name *</label>
            <input id="swal-vehicle" class="swal2-input" placeholder="Enter vehicle name" required>
          </div>
          <div class="form-group">
            <label for="swal-type">Vehicle Type *</label>
            <select id="swal-type" class="swal2-select" required>
              <option value="">Select a type</option>
              ${truckTypes.value.map(type => 
                `<option value="${type}">${type}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="swal-capacity">Capacity (kg) *</label>
            <input id="swal-capacity" type="number" class="swal2-input" 
                   placeholder="Enter capacity (500-20000)" 
                   min="500" max="20000" required>
          </div>
          <div class="form-group">
            <label for="swal-status">Initial Status *</label>
            <select id="swal-status" class="swal2-select" required>
              ${statusOptions.value.map(status => 
                `<option value="${status}">${status}</option>`
              ).join('')}
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Add Vehicle',
      cancelButtonText: 'Cancel',
      focusConfirm: false,
      preConfirm: () => {
        const vehicle = (document.getElementById('swal-vehicle') as HTMLInputElement)?.value.trim();
        const type = (document.getElementById('swal-type') as HTMLSelectElement)?.value;
        const capacity = Number((document.getElementById('swal-capacity') as HTMLInputElement)?.value);
        const status = (document.getElementById('swal-status') as HTMLSelectElement)?.value;

        if (!vehicle) {
          Swal.showValidationMessage('Vehicle name is required');
          return false;
        }
        if (!type) {
          Swal.showValidationMessage('Vehicle type is required');
          return false;
        }
        if (!capacity || isNaN(capacity) || capacity < 500 || capacity > 20000) {
          Swal.showValidationMessage('Please enter a valid capacity between 500 and 20000 kg');
          return false;
        }
        if (!status) {
          Swal.showValidationMessage('Status is required');
          return false;
        }

        return { vehicle, type, capacity, status };
      }
    });

    if (!formValues) return;

    const response = await api.post('/trucks/addTruck', {
      vehicle: formValues.vehicle,
      type: formValues.type,
      capacity: formValues.capacity,
      status: formValues.status,
      company_id: companyId
    });

    if (response.data.success) {
      await Swal.fire({
        title: 'Success!',
        text: 'Vehicle added successfully',
        icon: 'success'
      });
      await loadData();
    } else {
      throw new Error(response.data.message || 'Failed to add vehicle');
    }
  } catch (err: any) {
    console.error('Add vehicle error:', err);
    await Swal.fire({
      title: 'Error',
      text: err.response?.data?.message || 
           err.message || 
           'An error occurred while adding the vehicle',
      icon: 'error'
    });
  } finally {
    isSubmitting.value = false;
  }
};

const handleEditTruck = async (truck: Truck) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Authentication required');
    
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    const { value: formValues } = await Swal.fire({
      title: 'Edit Vehicle',
      html: `
        <div class="custom-form">
          <div class="form-group">
            <label>Vehicle Name *</label>
            <input id="swal-vehicle" class="swal2-input" 
                   value="${truck.vehicle}" required>
          </div>
          <div class="form-group">
            <label>Type *</label>
            <select id="swal-type" class="swal2-select" required>
              ${truckTypes.value.map(type => 
                `<option value="${type}" ${truck.type.trim() === type.trim() ? 'selected' : ''}>
                  ${type}
                </option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Capacity (kg) *</label>
            <input id="swal-capacity" type="number" class="swal2-input" 
                   value="${truck.capacity}" min="500" max="20000" required>
          </div>
          <div class="form-group">
            <label>Status *</label>
            <select id="swal-status" class="swal2-select" required>
              ${statusOptions.value.map(status => 
                `<option value="${status}" ${truck.status === status ? 'selected' : ''}>
                  ${status}
                </option>`
              ).join('')}
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      preConfirm: () => {
        const vehicle = (document.getElementById('swal-vehicle') as HTMLInputElement)?.value.trim();
        const type = (document.getElementById('swal-type') as HTMLSelectElement)?.value;
        const capacity = Number((document.getElementById('swal-capacity') as HTMLInputElement)?.value);
        const status = (document.getElementById('swal-status') as HTMLSelectElement)?.value;

        if (!vehicle || !type || !status) {
          Swal.showValidationMessage('All fields are required');
          return false;
        }
        if (isNaN(capacity)) {
          Swal.showValidationMessage('Capacity must be a number');
          return false;
        }

        return { vehicle, type, capacity, status };
      }
    });

    if (formValues) {
      const response = await api.put(`/trucks/updateTruck/${truck._id}`, formValues);
      
      if (response.data.success) {
        await Swal.fire('Success!', 'Vehicle updated successfully', 'success');
        await loadData();
      }
    }
  } catch (err: any) {
    await Swal.fire({
      title: 'Error',
      text: err.response?.data?.message || err.message,
      icon: 'error'
    });
  }
};

const deleteTruck = async (id: string) => {
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'custom-confirm-button-delete',
        cancelButton: 'custom-cancel-button'
      }
    })

    if (result.isConfirmed) {
      const token = localStorage.getItem('accessToken')
      if (!token) throw new Error('Authentication required')
      
      api.defaults.headers.common.Authorization = `Bearer ${token}`
      const response = await api.delete(`/trucks/deleteTruck/${id}`)
      
      if (response.data.success) {
        await Swal.fire({
          title: 'Deleted!',
          text: 'Vehicle has been deleted.',
          icon: 'success'
        })
        await loadData()
      }
    }
  } catch (err: any) {
    Swal.fire({
      title: 'Error',
      text: err.response?.data?.message || err.message || 'Error while deleting vehicle',
      icon: 'error'
    })
  }
}

const viewTruck = async (id: string) => {
  try {
    const token = localStorage.getItem('accessToken')
    if (!token) throw new Error('Authentication required')
    
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    const response = await api.get(`/trucks/getTruck/${id}`)
    
    if (response.data.success) {
      const truck = response.data.data
      await Swal.fire({
        title: truck.vehicle,
        html: `
          <div class="vehicle-details">
            <p><strong>Type:</strong> ${truck.type}</p>
            <p><strong>Status:</strong> ${truck.status}</p>
            <p><strong>Created:</strong> ${new Date(truck.createdAt).toLocaleDateString()}</p>
            <p><strong>Last Updated:</strong> ${new Date(truck.updatedAt).toLocaleDateString()}</p>
          </div>
        `,
        customClass: {
          container: 'custom-modal',
          popup: 'custom-modal-popup',
          title: 'custom-modal-title'
        }
      })
    }
  } catch (err: any) {
    Swal.fire({
      title: 'Error',
      text: err.response?.data?.message || err.message || 'Error while viewing vehicle details',
      icon: 'error'
    })
  }
}

// Watchers
watch([searchTerm, selectedStatus, selectedType], () => {
  applyFilters()
})

watch(itemsPerPage, () => {
  currentPage.value = 1
})

// Initialize
onMounted(loadData)
</script>

<style>
/* SweetAlert Custom Styles */
.swal2-input, .swal2-select {
  width: 100% !important;
  padding: 0.75rem !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 0.75rem !important;
  font-size: 0.875rem !important;
  margin: 0.5rem 0 !important;
  box-shadow: none !important;
}
.swal2-input:focus, .swal2-select:focus {
  border-color: #D4AF37 !important;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1) !important;
}
.custom-confirm-button-delete {
  background-color: #dc2626 !important;
  color: white !important;
  font-weight: 500;
}
</style>