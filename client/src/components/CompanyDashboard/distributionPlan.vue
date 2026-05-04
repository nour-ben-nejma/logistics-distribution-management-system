<script setup lang="ts">
import { ref, shallowRef, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import moment from 'moment-timezone';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { nextTick } from 'vue';

// Types
interface Location {
  lat: number;
  lng: number;
}

interface SalesPoint {
  _id: string;
  name: string;
  address?: string;
  location?: Location;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  totalQuantity?: number;
}

interface Warehouse {
  _id: string;
  name: string;
  storage_type: string;
  capacity: number;
  current_usage: number;
  currentStock?: number;
  distance?: number;
  location?: Location;
  products?: Array<{ product: string; quantity: number }>;
}

interface Supplier {
  _id: string;
  name: string;
  distance?: number;
  location?: Location;
  products?: Array<{ product: string; quantity: number }>;
}

interface Truck {
  _id: string;
  vehicle: string;
  type: 'A1' | 'A' | 'B' | 'B+E' | 'C' | 'C+E' | 'D' | 'D1' | 'D+E' | 'H';
  status: 'available' | 'in transit' | 'maintenance';
  capacity: number;
  company_id: string;
}

interface Transporter {
  _id: string;
  userId: string;
  companyId: string;
  CIN: string;
  phoneNumber: string;
  typeDrivingLicence: 'A1' | 'A' | 'B' | 'B+E' | 'C' | 'C+E' | 'D' | 'D1' | 'D+E' | 'H';
  profilePicture?: string;
  firstName: string;
  lastName: string;
  status: 'Available' | 'On mission' | 'On leave';
}

interface DeliveryDate {
  date: string;
  status: 'en cours' | 'livree' | 'en attente';
}

interface Contract {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  warehouse?: { id: string; name: string; quantity?: number };
  supplier?: { id: string; name: string; quantity?: number };
  salesPointIds: string[];
  salesPoints?: SalesPoint[];
  product: { id: string; name: string; totalQuantity: number };
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
  deliveryDays: string[];
  deliveryDates: DeliveryDate[];
  createdAt?: string;
  updatedAt?: string;
}

interface ContractForm {
  name: string;
  startDate: string;
  endDate: string;
  salesPointIds: string[];
  productId: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
  deliveryDays: string[];
  deliveryDates: { date: string; status: 'en cours' | 'livree' | 'en attente' }[];
  tonnage: number;
  warehouseId: string;
  supplierId: string;
  warehouseQuantity?: number;
  supplierQuantity?: number;
}

interface Waypoint {
  type: 'warehouse' | 'supplier' | 'salespoint' | 'warehouse-return';
  id: string;
  name: string;
  location?: Location;
  distanceFromPrevious?: number;
  cumulativeDistance?: number;
  sequence: number;
}

interface DistributionPlanEntry {
  deliveryDates: DeliveryDate[];
  dayOfWeek: string;
  contractName: string;
  warehouse: string;
  supplier?: string | null;
  salesPoints: string[];
  product: string;
  quantity: number;
  optimalTruckId?: string; // BUG FIX: was missing from interface
  truck?: {
    id: string;
    name: string;
    licensePlate: string;
    type: string;
    capacity?: number; // BUG FIX: was missing from interface
  };
  transporter?: {
    id: string;
    firstName: string;
    lastName?: string;
    licenseType?: string; // BUG FIX: was missing from interface
  };
  route: {
    waypoints: Waypoint[];
    totalDistance: number;
    totalTime: number;
    salesPointsVisited: number;
    totalPoints: number;
    hasSupplier: boolean;
  };
  editableTruckId?: string;
  editableTransporterId?: string;
}

interface TransporterConfig {
  workingDaysPerWeek: number;
  maxDeliveriesPerDay: number;
}

// Constants
const WEEK_DAYS = [
  { value: 'monday', label: 'Lundi' },
  { value: 'tuesday', label: 'Mardi' },
  { value: 'wednesday', label: 'Mercredi' },
  { value: 'thursday', label: 'Jeudi' },
  { value: 'friday', label: 'Vendredi' },
  { value: 'saturday', label: 'Samedi' },
  { value: 'sunday', label: 'Dimanche' }
];

const STORAGE_TYPES: Record<string, string> = {
  freezer: 'Congélateur',
  refrigerated: 'Réfrigéré',
  ambient: 'Ambiance',
  controlled: 'Contrôlé'
};

const FREQUENCY_LABELS: Record<string, string> = {
  daily: 'Quotidienne',
  weekly: 'Hebdomadaire',
  biweekly: 'Bimensuelle',
  monthly: 'Mensuelle',
  custom: 'Personnalisée'
};

// API Configuration
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
  }
});

// State
const contracts = ref<Contract[]>([]);
const selectedContracts = ref<Contract[]>([]);
const selectedContract = ref<Contract | null>(null);
const showContractDetails = ref(false);
const loading = ref({
  contracts: false,
  details: false,
  salesPoints: false,
  products: false,
  warehouses: false,
  suppliers: false,
  route: false,
  trucks: false,
  transporters: false,
  optimalWarehouse: false,
  nearestSupplier: false
});

const errors = ref<{
  contracts: string | null;
  salesPoints: string | null;
  products: string | null;
  warehouses: string | null;
  suppliers: string | null;
  route: string | null;
  trucks: string | null;
  transporters: string | null;
}>({
  contracts: null,
  salesPoints: null,
  products: null,
  warehouses: null,
  suppliers: null,
  route: null,
  trucks: null,
  transporters: null
});

const salesPoints = ref<SalesPoint[]>([]);
const products = ref<Product[]>([]);
const warehouses = ref<Warehouse[]>([]);
const suppliers = ref<Supplier[]>([]);
const trucks = ref<Truck[]>([]);
const transporters = ref<Transporter[]>([]);
const distributionPlan = ref<DistributionPlanEntry[]>([]);

const showModal = ref(false);
const showConfirmation = ref(false);
const showDistributionPlan = ref(false);
const showResourceManagement = ref(false);
const saving = ref(false);
const optimizingRoute = ref(false);
const salesPointSearch = ref('');
const contractSearch = ref('');

const optimalWarehouse = ref<Warehouse | null>(null);
const selectedWarehouse = ref<Warehouse | null>(null);
const suggestedSupplier = ref<Supplier | null>(null);
const requiresSupplier = ref(false);
const detailedContract = ref<Contract | null>(null);
const mapInstance = shallowRef<L.Map | null>(null);
const selectedRoute = ref<DistributionPlanEntry | null>(null);
const mapLoading = ref(false);
const lastCreatedContract = ref<Contract | null>(null);
const showTransporterConfig = ref(false);
const transporterConfig = ref<TransporterConfig>({
  workingDaysPerWeek: 5,
  maxDeliveriesPerDay: 2
});

const contractForm = ref<ContractForm>({
  name: '',
  startDate: '',
  endDate: '',
  salesPointIds: [],
  productId: '',
  frequency: 'weekly',
  deliveryDays: [],
  deliveryDates: [],
  tonnage: 1000,
  warehouseId: '',
  supplierId: '',
  warehouseQuantity: undefined,
  supplierQuantity: undefined
});

// Computed Properties
const filteredSalesPoints = computed(() => {
  const search = salesPointSearch.value.toLowerCase();
  return salesPoints.value.filter(
    sp =>
      sp.name.toLowerCase().includes(search) ||
      (sp.address && sp.address.toLowerCase().includes(search))
  );
});

const filteredContracts = computed(() => {
  const search = contractSearch.value.toLowerCase();
  return contracts.value.filter(
    c =>
      c.name.toLowerCase().includes(search) ||
      c.warehouse?.name?.toLowerCase().includes(search) ||
      c.supplier?.name?.toLowerCase().includes(search)
  );
});

const canOptimizeRoute = computed(() => {
  return selectedContracts.value.length > 0;
});

const productAvailableQuantity = computed(() => {
  if (!contractForm.value.warehouseId || !contractForm.value.productId) return 0;
  const warehouse = warehouses.value.find(w => w._id === contractForm.value.warehouseId);
  const product = warehouse?.products?.find(p => p.product === contractForm.value.productId);
  return product?.quantity || 0;
});

const missingQuantity = computed(() => {
  return Math.max(0, contractForm.value.tonnage - productAvailableQuantity.value);
});

const availableTrucks = computed(() => {
  return trucks.value.filter(t => t.status === 'available');
});

const availableTransporters = computed(() => {
  return transporters.value.filter(t => t.status === 'Available');
});

// Methods
const formatNumber = (num: number): string => {
  return Number(num).toLocaleString('fr-FR', { maximumFractionDigits: 2 });
};

const updateContract = (contract: Contract) => {
  selectedContract.value = contract;
  contractForm.value = {
    name: contract.name,
    startDate: contract.startDate.split('T')[0],
    endDate: contract.endDate.split('T')[0],
    salesPointIds: contract.salesPointIds || [],
    productId: contract.product.id,
    frequency: contract.frequency,
    deliveryDays: contract.deliveryDays || [],
    deliveryDates: contract.deliveryDates?.map(dd => ({
      date: dd.date.split('T')[0],
      status: dd.status
    })) || [],
    tonnage: contract.product.totalQuantity,
    warehouseId: contract.warehouse?.id || '',
    supplierId: contract.supplier?.id || '',
    warehouseQuantity: contract.warehouse?.quantity,
    supplierQuantity: contract.supplier?.quantity
  };

  if (contract.warehouse?.id) {
    optimalWarehouse.value = warehouses.value.find(w => w._id === contract.warehouse?.id) || null;
    isOptimalWarehouseLocked.value = true;
  }

  if (contract.supplier?.id) {
    suggestedSupplier.value = suppliers.value.find(s => s._id === contract.supplier?.id) || null;
    requiresSupplier.value = true;
  }

  fetchSalesPoints();
  fetchProducts();
  fetchSuppliers();
  fetchWarehouses();

  showModal.value = true;
};

const formatDate = (date: Date | string): string => {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return 'Date invalide';
  return dateObj.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// BUG FIX: parameter type now accepts Date objects correctly
const formatDeliveryDate = (dateInput: string | Date): string => {
  if (!dateInput) return 'N/A';
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return 'Date invalide';
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'Format invalide';
  }
};

const getTypeLabel = (type: 'warehouse' | 'supplier' | 'salespoint' | 'warehouse-return'): string => {
  const labels: Record<string, string> = {
    warehouse: 'Entrepôt',
    supplier: 'Fournisseur',
    salespoint: 'Point de Vente',
    'warehouse-return': 'Retour Entrepôt'
  };
  return labels[type] || type;
};

const formatStorageType = (type: string): string => {
  return STORAGE_TYPES[type] || type;
};

const getErrorMessage = (error: unknown, context: string): string => {
  if (axios.isAxiosError(error)) {
    switch (error.response?.status) {
      case 401: return 'Authentification requise';
      case 404: return `${context} non trouvé(s)`;
      default: return error.response?.data?.message || `Erreur ${error.response?.status}`;
    }
  }
  return `Erreur de connexion (${context})`;
};

const getContractStatus = (contract: Contract): string => {
  const now = new Date();
  const start = new Date(contract.startDate);
  const end = new Date(contract.endDate);
  if (now < start) return 'En attente';
  if (now > end) return 'Expiré';
  return 'Actif';
};

// BUG FIX: removed unused getStatusClass function (was using Record<string,boolean> but never used in template)
// Kept as-is for backwards compatibility but cleaned up
const getStatusClass = (contract: Contract): Record<string, boolean> => {
  const status = getContractStatus(contract);
  return {
    'contract-card__status--pending': status === 'En attente',
    'contract-card__status--active': status === 'Actif',
    'contract-card__status--expired': status === 'Expiré'
  };
};

const toggleDeliveryDay = (day: string) => {
  const index = contractForm.value.deliveryDays.indexOf(day);
  if (index === -1) {
    contractForm.value.deliveryDays.push(day);
  } else {
    contractForm.value.deliveryDays.splice(index, 1);
  }
};

const addDeliveryDate = () => {
  contractForm.value.deliveryDates.push({
    date: new Date().toISOString().split('T')[0],
    status: 'en attente'
  });
};

const removeDeliveryDate = (index: number) => {
  contractForm.value.deliveryDates.splice(index, 1);
};

const toggleContractSelection = (contract: Contract) => {
  const index = selectedContracts.value.findIndex(c => c._id === contract._id);
  if (index === -1) {
    selectedContracts.value.push(contract);
  } else {
    selectedContracts.value.splice(index, 1);
  }
};

const updateFrequency = () => {
  if (contractForm.value.frequency !== 'custom') {
    contractForm.value.deliveryDays = [];
  }
};

// API Calls
const fetchContracts = async () => {
  try {
    loading.value.contracts = true;
    errors.value.contracts = null;
    const response = await api.get('/contract/');

    contracts.value = Array.isArray(response.data.data)
      ? response.data.data
      : Array.isArray(response.data)
        ? response.data
        : [];

    if (contracts.value.length === 0) {
      await Swal.fire({
        icon: 'info',
        title: 'Information',
        text: 'Aucun contrat trouvé',
        confirmButtonColor: '#3b82f6'
      });
    }
  } catch (error) {
    console.error('Failed to fetch contracts:', error);
    errors.value.contracts = getErrorMessage(error, 'contrats');

    const isNetworkError = axios.isAxiosError(error) && !error.response;

    await Swal.fire({
      icon: isNetworkError ? 'warning' : 'error',
      title: isNetworkError ? 'Problème de connexion' : 'Erreur',
      text: errors.value.contracts ?? undefined,
      confirmButtonColor: '#3b82f6',
      showCancelButton: isNetworkError,
      cancelButtonText: 'Réessayer',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isDismissed && isNetworkError) {
        fetchContracts();
      }
    });
  } finally {
    loading.value.contracts = false;
  }
};

const showDetails = async (contract: Contract | null) => {
  // BUG FIX: guard against null contract (called from confirmation modal with lastCreatedContract which can be null)
  if (!contract) return;

  try {
    loading.value.details = true;

    const isValidId = (id: string) => {
      return /^[0-9a-fA-F]{24}$/.test(id);
    };

    // BUG FIX: proper typing for id which could be object or string
    const validIds = contract.salesPointIds
      .map((id: any) => {
        if (typeof id === 'object') {
          return id?._id || id?.id || null;
        }
        return id;
      })
      .filter((id): id is string => id !== null && isValidId(id.toString()));

    const response = await api.get('/salePoints/getSalePointsByIds', {
      params: {
        ids: validIds.join(',')
      }
    });

    detailedContract.value = {
      ...contract,
      salesPoints: response.data.data || []
    };

    showContractDetails.value = true;

  } catch (error) {
    console.error('Erreur de chargement:', error);

    const cachedPoints = salesPoints.value.filter(sp =>
      contract.salesPointIds.some((id: any) => {
        const compareId = typeof id === 'object' ? id._id || id.id : id;
        return sp._id.toString() === compareId?.toString();
      })
    );

    detailedContract.value = {
      ...contract,
      salesPoints: cachedPoints
    };

    showContractDetails.value = true;

    await Swal.fire({
      icon: 'info',
      title: 'Chargement partiel',
      html: `Contrat chargé<br>
             <small>${cachedPoints.length}/${contract.salesPointIds.length} points chargés</small>`,
      confirmButtonColor: '#3b82f6'
    });
  } finally {
    loading.value.details = false;
  }
};

const fetchSalesPoints = async () => {
  try {
    loading.value.salesPoints = true;
    errors.value.salesPoints = null;
    const response = await api.get('/salePoints/getSalePoints');
    salesPoints.value = response.data.data || response.data;
  } catch (error) {
    console.error('Échec du chargement des points de vente', error);
    errors.value.salesPoints = getErrorMessage(error, 'points de vente');
    await Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: errors.value.salesPoints ?? undefined,
      confirmButtonColor: '#3b82f6'
    });
  } finally {
    loading.value.salesPoints = false;
  }
};

const fetchProducts = async () => {
  try {
    loading.value.products = true;
    errors.value.products = null;
    const response = await api.get('/products/get');
    products.value = response.data.data || response.data;
  } catch (error) {
    console.error('Échec du chargement des produits', error);
    errors.value.products = getErrorMessage(error, 'produits');
    await Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: errors.value.products ?? undefined,
      confirmButtonColor: '#3b82f6'
    });
  } finally {
    loading.value.products = false;
  }
};

const fetchWarehouses = async () => {
  try {
    loading.value.warehouses = true;
    errors.value.warehouses = null;
    const response = await api.get('/warehouses/getCompanyWarehouses');

    if (!response.data || !response.data.data) {
      throw new Error('Invalid API response: missing data');
    }

    const warehouseData = response.data.data;
    const internalWarehouses = Array.isArray(warehouseData.internal) ? warehouseData.internal : [];
    const externalWarehouses = Array.isArray(warehouseData.external) ? warehouseData.external : [];
    const allWarehouses = [...internalWarehouses, ...externalWarehouses];

    if (!allWarehouses.length) {
      errors.value.warehouses = 'Aucun entrepôt disponible pour cette entreprise.';
      warehouses.value = [];
      await Swal.fire({
        icon: 'warning',
        title: 'Aucun entrepôt',
        text: errors.value.warehouses,
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    warehouses.value = allWarehouses.map(warehouse => {
      if (!warehouse._id || !warehouse.name) {
        console.warn('Invalid warehouse data:', warehouse);
        return null;
      }
      return {
        _id: warehouse._id,
        name: warehouse.name,
        storage_type: warehouse.storage_type || 'unknown',
        capacity: Number(warehouse.capacity) || 0,
        current_usage: Number(warehouse.current_usage) || 0,
        products: Array.isArray(warehouse.products) ? warehouse.products : [],
        location: warehouse.location && typeof warehouse.location === 'object'
          ? { lat: Number(warehouse.location.lat) || 0, lng: Number(warehouse.location.lng) || 0 }
          : { lat: 0, lng: 0 },
      } as Warehouse;
    }).filter((w): w is Warehouse => w !== null);

  } catch (error) {
    console.error('Erreur fetchWarehouses:', error);
    errors.value.warehouses = getErrorMessage(error, 'entrepôts');
    warehouses.value = [];
    await Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: errors.value.warehouses ?? undefined,
      confirmButtonColor: '#3b82f6',
    });
  } finally {
    loading.value.warehouses = false;
  }
};

const fetchSuppliers = async () => {
  try {
    loading.value.suppliers = true;
    errors.value.suppliers = null;
    const response = await api.get('/fournisseur/getFourniseurs');
    suppliers.value = response.data.data || response.data;
  } catch (error) {
    console.error('Échec du chargement des fournisseurs', error);
    errors.value.suppliers = getErrorMessage(error, 'fournisseurs');
    await Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: errors.value.suppliers ?? undefined,
      confirmButtonColor: '#3b82f6'
    });
  } finally {
    loading.value.suppliers = false;
  }
};

const fetchTrucks = async () => {
  try {
    loading.value.trucks = true;
    errors.value.trucks = null;
    const response = await api.get('/trucks/getTrucks');
    trucks.value = response.data.data || response.data;
  } catch (error) {
    console.error('Failed to fetch trucks:', error);
    errors.value.trucks = getErrorMessage(error, 'camions');
    await Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: errors.value.trucks ?? undefined,
      confirmButtonColor: '#3b82f6'
    });
  } finally {
    loading.value.trucks = false;
  }
};

const fetchTransporters = async () => {
  try {
    loading.value.transporters = true;
    errors.value.transporters = null;
    const response = await api.get('/users/transporters');
    transporters.value = response.data.data || response.data;
  } catch (error) {
    console.error('Failed to fetch transporters:', error);
    errors.value.transporters = getErrorMessage(error, 'transporteurs');
    await Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: errors.value.transporters ?? undefined,
      confirmButtonColor: '#3b82f6'
    });
  } finally {
    loading.value.transporters = false;
  }
};

const getProductStock = (warehouse: Warehouse | Supplier, productId: string): number => {
  const product = warehouse.products?.find(p => p.product === productId);
  return product ? Number(product.quantity) || 0 : 0;
};

const isOptimalWarehouseLocked = ref(false);

const fetchOptimalWarehouse = async (force = false) => {
  if (!contractForm.value.salesPointIds?.length || !contractForm.value.productId || !contractForm.value.tonnage || contractForm.value.tonnage <= 0) {
    optimalWarehouse.value = null;
    contractForm.value.warehouseId = '';
    isOptimalWarehouseLocked.value = false;
    requiresSupplier.value = false;
    contractForm.value.supplierId = '';
    contractForm.value.supplierQuantity = undefined;
    contractForm.value.warehouseQuantity = undefined;
    return;
  }

  if (isOptimalWarehouseLocked.value && !force) {
    await checkWarehouseStock();
    return;
  }

  try {
    loading.value.optimalWarehouse = true;
    const payload = {
      salesPointIds: contractForm.value.salesPointIds,
      productId: contractForm.value.productId,
      requiredQuantity: Number(contractForm.value.tonnage),
    };

    const response = await api.post('/distances/find-optimal-warehouse', payload);

    if (response.data.success && response.data.optimal) {
      if (response.data.solution === 'warehouse' || response.data.solution === 'supplier') {
        const optimal = response.data.optimal;
        if (!optimal || !optimal._id || !optimal.name || !optimal.products) {
          throw new Error('Invalid warehouse data received');
        }

        optimalWarehouse.value = {
          _id: optimal._id,
          name: optimal.name,
          storage_type: optimal.storage_type || 'unknown',
          capacity: Number(optimal.capacity) || 0,
          current_usage: Number(optimal.current_usage) || 0,
          products: Array.isArray(optimal.products) ? optimal.products : [],
          location: optimal.position && typeof optimal.position === 'object'
            ? { lat: Number(optimal.position.coordinates[1]) || 0, lng: Number(optimal.position.coordinates[0]) || 0 }
            : { lat: 0, lng: 0 },
        };
        contractForm.value.warehouseId = optimal._id;
        isOptimalWarehouseLocked.value = true;
        contractForm.value.warehouseQuantity = Math.min(
          contractForm.value.tonnage,
          optimal.products?.find((p: any) => p.product === contractForm.value.productId)?.quantity || 0
        );

        if (!warehouses.value.some((w) => w._id === optimal._id)) {
          warehouses.value.push(optimalWarehouse.value!);
        }

        await Swal.fire({
          icon: 'success',
          title: 'Entrepôt optimal trouvé',
          text: `Entrepôt suggéré : ${optimalWarehouse.value.name} (Stock : ${formatNumber(
            optimalWarehouse.value.products?.find((p) => p.product === contractForm.value.productId)?.quantity || 0
          )} kg)`,
          confirmButtonColor: '#3b82f6',
        });

        await checkWarehouseStock();
      } else {
        throw new Error('Invalid solution type received');
      }
    } else {
      throw new Error(response.data.message || 'Aucune solution trouvée');
    }
  } catch (error) {
    console.error('fetchOptimalWarehouse: Error:', error);
    let message = error instanceof Error ? error.message : 'Erreur lors de la recherche de l\'entrepôt optimal';
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data.message || `Erreur ${error.response.status}`;
    }
    await Swal.fire({
      icon: 'warning',
      title: 'Erreur',
      text: message,
      confirmButtonColor: '#3b82f6',
    });

    // Fallback to local best warehouse
    let maxStock = 0;
    let bestWarehouse: Warehouse | null = null;
    warehouses.value.forEach((warehouse) => {
      const product = warehouse.products?.find((p) => p.product === contractForm.value.productId);
      const stock = product ? Number(product.quantity) || 0 : 0;
      if (stock > maxStock) {
        maxStock = stock;
        bestWarehouse = warehouse;
      }
    });

    if (bestWarehouse) {
      optimalWarehouse.value = bestWarehouse;
      contractForm.value.warehouseId = (bestWarehouse as Warehouse)._id;
      isOptimalWarehouseLocked.value = true;
      contractForm.value.warehouseQuantity = Math.min(
        contractForm.value.tonnage,
        (bestWarehouse as Warehouse).products?.find((p) => p.product === contractForm.value.productId)?.quantity || 0
      );
      await checkWarehouseStock();
    } else {
      optimalWarehouse.value = null;
      contractForm.value.warehouseId = '';
      isOptimalWarehouseLocked.value = false;
      contractForm.value.supplierQuantity = contractForm.value.tonnage;
      requiresSupplier.value = true;
      await Swal.fire({
        icon: 'warning',
        title: 'Aucun entrepôt disponible',
        text: 'Aucun entrepôt avec stock suffisant trouvé.',
        confirmButtonColor: '#3b82f6',
      });
    }
  } finally {
    loading.value.optimalWarehouse = false;
  }
};

const fetchNearestSupplier = async () => {
  let payload: any = null;
  try {
    if (!contractForm.value.supplierQuantity || contractForm.value.supplierQuantity <= 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Quantité requise pour le fournisseur invalide ou nulle.',
        confirmButtonColor: '#3b82f6',
      });
      suggestedSupplier.value = null;
      contractForm.value.supplierId = '';
      requiresSupplier.value = true;
      return;
    }

    if (!contractForm.value.warehouseId) {
      await Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Aucun entrepôt sélectionné.',
        confirmButtonColor: '#3b82f6',
      });
      suggestedSupplier.value = null;
      contractForm.value.supplierId = '';
      requiresSupplier.value = true;
      return;
    }

    loading.value.suppliers = true;
    payload = {
      warehouseId: contractForm.value.warehouseId,
      productId: contractForm.value.productId || '',
      requiredQuantity: Number(contractForm.value.supplierQuantity),
    };

    const response = await api.post('/distances/find-optimal', payload);

    if (response.data.success && response.data.data?.optimalSupplier) {
      suggestedSupplier.value = {
        _id: response.data.data.optimalSupplier._id,
        name: response.data.data.optimalSupplier.name || 'Fournisseur sans nom',
        products: Array.isArray(response.data.data.optimalSupplier.products)
          ? response.data.data.optimalSupplier.products
          : [],
        location:
          response.data.data.optimalSupplier.position &&
          typeof response.data.data.optimalSupplier.position === 'object'
            ? {
                lat: Number(response.data.data.optimalSupplier.position.coordinates[1]) || 0,
                lng: Number(response.data.data.optimalSupplier.position.coordinates[0]) || 0,
              }
            : { lat: 0, lng: 0 },
      };
      contractForm.value.supplierId = response.data.data.optimalSupplier._id;
      requiresSupplier.value = true;

      if (!suppliers.value.some((s) => s._id === response.data.data.optimalSupplier._id)) {
        suppliers.value.push(suggestedSupplier.value!);
      }

      await Swal.fire({
        icon: 'success',
        title: 'Fournisseur trouvé',
        text: `Fournisseur suggéré : ${suggestedSupplier.value.name} (Quantité : ${formatNumber(
          contractForm.value.supplierQuantity!
        )} kg)`,
        confirmButtonColor: '#3b82f6',
      });
    } else {
      throw new Error(response.data.message || 'Aucun fournisseur trouvé');
    }
  } catch (error: any) {
    console.error('fetchNearestSupplier: Error:', error);
    let message = 'Erreur lors de la recherche du fournisseur';
    if (axios.isAxiosError(error) && error.response) {
      const errorDetails = error.response.data.message || error.response.data.errors || `Erreur serveur ${error.response.status}`;
      message = `Erreur ${error.response.status}: ${errorDetails}`;
    }
    await Swal.fire({
      icon: 'error',
      title: 'Erreur de recherche de fournisseur',
      text: message,
      confirmButtonColor: '#3b82f6',
    });
    suggestedSupplier.value = null;
    contractForm.value.supplierId = '';
    requiresSupplier.value = true;
  } finally {
    loading.value.suppliers = false;
  }
};

const checkWarehouseStock = async () => {
  try {
    if (!contractForm.value.warehouseId || !contractForm.value.productId || !contractForm.value.tonnage) {
      requiresSupplier.value = false;
      contractForm.value.supplierId = '';
      contractForm.value.supplierQuantity = undefined;
      contractForm.value.warehouseQuantity = undefined;
      suggestedSupplier.value = null;
      await Swal.fire({
        icon: 'warning',
        title: 'Erreur',
        text: 'Veuillez sélectionner un entrepôt, un produit et un tonnage valide.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    const warehouse = warehouses.value.find((w) => w._id === contractForm.value.warehouseId);
    if (!warehouse) {
      contractForm.value.warehouseQuantity = 0;
      contractForm.value.supplierQuantity = contractForm.value.tonnage;
      requiresSupplier.value = true;
      await Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Entrepôt non trouvé.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    const product = warehouse.products?.find((p) => p.product === contractForm.value.productId);
    const stock = product ? Number(product.quantity) || 0 : 0;

    contractForm.value.warehouseQuantity = Math.min(stock, contractForm.value.tonnage);
    requiresSupplier.value = stock < contractForm.value.tonnage;

    if (requiresSupplier.value) {
      contractForm.value.supplierQuantity = contractForm.value.tonnage - contractForm.value.warehouseQuantity;
      await fetchNearestSupplier();
    } else {
      contractForm.value.supplierId = '';
      contractForm.value.supplierQuantity = undefined;
      suggestedSupplier.value = null;
      requiresSupplier.value = false;
    }
  } catch (error) {
    console.error('checkWarehouseStock: Error:', error);
    contractForm.value.supplierQuantity = contractForm.value.tonnage - (contractForm.value.warehouseQuantity || 0);
    requiresSupplier.value = true;
    if (contractForm.value.warehouseId) {
      await fetchNearestSupplier();
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de rechercher un fournisseur sans entrepôt sélectionné.',
        confirmButtonColor: '#3b82f6',
      });
    }
  }
};

// BUG FIX: validateForm used a shadowed local `errors` variable that conflicted with the top-level ref
const validateForm = async (): Promise<boolean> => {
  const validationErrors: string[] = [];

  if (!contractForm.value.name) {
    validationErrors.push('Veuillez entrer un nom pour le contrat');
  }

  if (!contractForm.value.startDate || !contractForm.value.endDate) {
    validationErrors.push('Veuillez sélectionner une période valide');
  } else if (new Date(contractForm.value.startDate) > new Date(contractForm.value.endDate)) {
    validationErrors.push('La date de fin doit être postérieure à la date de début');
  }

  if (!contractForm.value.salesPointIds?.length) {
    validationErrors.push('Veuillez sélectionner au moins un point de vente');
  }

  if (!contractForm.value.productId) {
    validationErrors.push('Veuillez sélectionner un produit');
  }

  if (!contractForm.value.tonnage || contractForm.value.tonnage <= 0) {
    validationErrors.push('Veuillez entrer un tonnage valide');
  }

  if (!contractForm.value.warehouseId) {
    validationErrors.push('Veuillez sélectionner un entrepôt');
  }

  const warehouseQty = Number(contractForm.value.warehouseQuantity) || 0;
  const supplierQty = Number(contractForm.value.supplierQuantity) || 0;
  const totalQty = warehouseQty + supplierQty;

  if (totalQty !== contractForm.value.tonnage) {
    validationErrors.push(
      `La somme des quantités (${formatNumber(totalQty)} kg) ne correspond pas au tonnage total requis (${formatNumber(contractForm.value.tonnage)} kg).`
    );
  }

  if (contractForm.value.frequency === 'custom') {
    if (!contractForm.value.deliveryDays.length) {
      validationErrors.push('Veuillez sélectionner au moins un jour de livraison pour une fréquence personnalisée');
    }

    if (!contractForm.value.deliveryDates.length) {
      validationErrors.push('Veuillez spécifier au moins une date de livraison');
    } else {
      contractForm.value.deliveryDates.forEach((dd, index) => {
        if (!dd.date) {
          validationErrors.push(`La date de livraison ${index + 1} est manquante`);
        }
        if (!['en cours', 'livree', 'en attente'].includes(dd.status)) {
          validationErrors.push(`Le statut de la date de livraison ${index + 1} est invalide`);
        }
      });
    }
  }

  if (validationErrors.length) {
    await Swal.fire({
      icon: 'error',
      title: 'Erreur de validation',
      html: validationErrors.join('<br>'),
      confirmButtonColor: '#3b82f6',
    });
    return false;
  }
  return true;
};

const getAvailableTrucksForEntry = (entry: DistributionPlanEntry): Truck[] => {
  return [...availableTrucks.value]
    .filter(t => t.status === 'available')
    .sort((a, b) => {
      if (a._id === entry.optimalTruckId) return -1;
      if (b._id === entry.optimalTruckId) return 1;

      const aFit = a.capacity - entry.quantity;
      const bFit = b.capacity - entry.quantity;

      if (aFit >= 0 && bFit < 0) return -1;
      if (aFit < 0 && bFit >= 0) return 1;

      if (aFit >= 0 && bFit >= 0) return aFit - bFit;

      return b.capacity - a.capacity;
    });
};

const saveContract = async () => {
  try {
    saving.value = true;

    const isValid = await validateForm();
    if (!isValid) return;

    const payload = {
      name: contractForm.value.name,
      startDate: contractForm.value.startDate,
      endDate: contractForm.value.endDate,
      salesPointIds: contractForm.value.salesPointIds,
      productId: contractForm.value.productId,
      tonnage: Number(contractForm.value.tonnage),
      frequency: contractForm.value.frequency,
      deliveryDays: contractForm.value.frequency === 'custom'
        ? contractForm.value.deliveryDays
        : [],
      deliveryDates: contractForm.value.frequency === 'custom'
        ? contractForm.value.deliveryDates.map(dd => ({
            date: moment(dd.date).toISOString(),
            status: dd.status
          }))
        : [],
      warehouseId: contractForm.value.warehouseId || null,
      supplierId: requiresSupplier.value ? contractForm.value.supplierId || null : null,
      warehouseQuantity: contractForm.value.warehouseQuantity !== undefined
        ? Number(contractForm.value.warehouseQuantity)
        : undefined,
      supplierQuantity: requiresSupplier.value && contractForm.value.supplierQuantity !== undefined
        ? Number(contractForm.value.supplierQuantity)
        : undefined
    };

    let response;
    if (selectedContract.value?._id) {
      response = await api.put(`/contract/${selectedContract.value._id}`, payload);
    } else {
      response = await api.post('/contract', payload);
    }

    const updatedContract = response.data.data || response.data;

    const index = contracts.value.findIndex(c => c._id === selectedContract.value?._id);
    if (index !== -1) {
      contracts.value[index] = updatedContract;
    } else {
      contracts.value.push(updatedContract);
    }

    showModal.value = false;
    showConfirmation.value = true;
    lastCreatedContract.value = updatedContract;

    await Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: `Contrat ${contractForm.value.name} ${selectedContract.value?._id ? 'modifié' : 'créé'} avec succès!`,
      confirmButtonColor: '#3b82f6'
    });
  } catch (error) {
    console.error('Error saving contract:', error);
    let errorMessage = 'Erreur lors de la sauvegarde du contrat';
    if (axios.isAxiosError(error) && error.response?.data) {
      errorMessage = error.response.data.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    await Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: errorMessage,
      confirmButtonColor: '#3b82f6'
    });
  } finally {
    saving.value = false;
  }
};

const onWarehouseSelect = async () => {
  if (isOptimalWarehouseLocked.value) return;
  selectedWarehouse.value = warehouses.value.find(w => w._id === contractForm.value.warehouseId) || null;
  if (selectedWarehouse.value) {
    await checkWarehouseStock();
  }
};

const onSupplierSelect = () => {
  if (contractForm.value.supplierId) {
    contractForm.value.supplierQuantity = contractForm.value.supplierQuantity || missingQuantity.value;
  } else {
    contractForm.value.supplierQuantity = undefined;
  }
};

const updateTruckForEntry = (entry: DistributionPlanEntry, truckId: string) => {
  const selectedTruck = trucks.value.find(t => t._id === truckId);

  if (selectedTruck) {
    if (entry.transporter) {
      const currentTransporter = transporters.value.find(t => t._id === entry.transporter?.id);
      if (currentTransporter && !isTransporterCompatible(currentTransporter, selectedTruck.type)) {
        entry.transporter = undefined;
        entry.editableTransporterId = undefined;
      }
    }

    entry.truck = {
      id: selectedTruck._id,
      name: selectedTruck.vehicle,
      licensePlate: selectedTruck.vehicle,
      type: selectedTruck.type,
      capacity: selectedTruck.capacity
    };
    entry.editableTruckId = truckId;
  } else {
    entry.truck = undefined;
    entry.editableTruckId = undefined;
    entry.transporter = undefined;
    entry.editableTransporterId = undefined;
  }
};

const updateTransporterForEntry = (entry: DistributionPlanEntry, transporterId: string) => {
  const selected = transporters.value.find(t => t._id === transporterId);
  if (selected) {
    entry.transporter = {
      id: selected._id,
      firstName: selected.firstName,
      lastName: selected.lastName
    };
    entry.editableTransporterId = transporterId;
  } else {
    entry.transporter = undefined;
    entry.editableTransporterId = undefined;
  }
};

const isTransporterCompatible = (transporter: Transporter, truckType?: string): boolean => {
  if (!truckType || transporter.status !== 'Available') return false;

  const licenseHierarchy: Record<string, string[]> = {
    'A1': ['A1'],
    'A': ['A', 'A1'],
    'B': ['B', 'B+E', 'C', 'C+E', 'D', 'D+E', 'D1', 'H'],
    'B+E': ['B+E', 'C+E', 'D+E', 'H'],
    'C': ['C', 'C+E', 'D', 'D+E', 'D1', 'H'],
    'C+E': ['C+E', 'D+E', 'H'],
    'D': ['D', 'D+E', 'D1', 'H'],
    'D1': ['D1', 'D', 'D+E', 'H'],
    'D+E': ['D+E', 'H'],
    'H': ['H']
  };

  return licenseHierarchy[truckType]?.includes(transporter.typeDrivingLicence) || false;
};

const initMap = async (mapId: string): Promise<boolean> => {
  try {
    await nextTick();

    const container = document.getElementById(mapId);
    if (!container) {
      console.error(`Map container '${mapId}' not found`);
      return false;
    }

    if (mapInstance.value) {
      mapInstance.value.remove();
      mapInstance.value = null;
    }

    mapInstance.value = L.map(mapId, {
      preferCanvas: true,
      center: [35.82, 10.64],
      zoom: 10,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(mapInstance.value);

    return true;
  } catch (error) {
    console.error('Error initializing map:', error);
    return false;
  }
};

const displayRoute = async (routes: DistributionPlanEntry[], highlightRoute: DistributionPlanEntry | null = null) => {
  if (!mapInstance.value) {
    const initialized = await initMap('distribution-map');
    if (!initialized) return;
  }

  selectedRoute.value = highlightRoute;
  mapLoading.value = true;

  try {
    // BUG FIX: safe null check before calling eachLayer
    mapInstance.value!.eachLayer(layer => {
      if (!(layer instanceof L.TileLayer)) {
        mapInstance.value?.removeLayer(layer);
      }
    });

    if (!highlightRoute) {
      mapInstance.value!.setView([35.82, 10.64], 10);
      return;
    }

    const waypoints = highlightRoute.route.waypoints.filter(wp => wp.location?.lat && wp.location?.lng);

    if (!waypoints.length) {
      console.warn(`No valid waypoints for route ${highlightRoute.contractName}`);
      return;
    }

    waypoints.sort((a, b) => a.sequence - b.sequence);

    // BUG FIX: typed as [number, number][] for Leaflet compatibility
    const latlngs: [number, number][] = waypoints.map(wp => [wp.location!.lat, wp.location!.lng]);

    L.polyline(latlngs, {
      color: '#3b82f6',
      weight: 6,
      opacity: 1,
    }).addTo(mapInstance.value as any);

    waypoints.forEach(wp => {
      const icon = L.divIcon({
        className: `map-marker map-marker--${wp.type} map-marker--highlighted`,
        html: `<div style="background-color: ${getMarkerColor(wp.type)};
               width: 24px;
               height: 24px;
               border-radius: 50%;
               display: flex;
               align-items: center;
               justify-content: center;
               color: white;
               font-weight: bold;
               border: 2px solid white;
               box-shadow: 0 0 5px rgba(0,0,0,0.3);">${wp.sequence}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([wp.location!.lat, wp.location!.lng], { icon })
        .bindPopup(`
          <div style="min-width: 200px;">
            <strong>${wp.name}</strong><br>
            <small>Type: ${getTypeLabel(wp.type)}</small><br>
            <small>Sequence: ${wp.sequence}</small>
            ${wp.distanceFromPrevious ? `<br><small>Distance: ${wp.distanceFromPrevious.toFixed(2)} km</small>` : ''}
          </div>
        `)
        .addTo(mapInstance.value as any);
    });

    mapInstance.value!.fitBounds(latlngs, {
      padding: [50, 50],
      maxZoom: 15
    });

  } catch (error) {
    console.error('Error displaying route:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Route Display Error',
      text: error instanceof Error ? error.message : 'Unable to display route on the map.',
      confirmButtonColor: '#3b82f6',
    });
  } finally {
    mapLoading.value = false;
  }
};

const getMarkerColor = (type: string): string => {
  switch (type) {
    case 'warehouse': return '#3b82f6';
    case 'supplier': return '#f59e0b';
    case 'salespoint': return '#10b981';
    case 'warehouse-return': return '#0ea5e9';
    default: return '#64748b';
  }
};

const generateDistributionPlan = async (planDate = new Date()) => {
  try {
    optimizingRoute.value = true;
    distributionPlan.value = [];

    if (!selectedContracts.value?.length) {
      await Swal.fire({
        icon: 'warning',
        title: 'Aucun contrat',
        text: 'Veuillez sélectionner au moins un contrat.',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    const validContracts = selectedContracts.value.filter(
      c => c._id && typeof c._id === 'string' && c._id.length === 24
    );

    if (!validContracts.length) {
      await Swal.fire({
        icon: 'error',
        title: 'Contrats invalides',
        text: 'Aucun contrat valide sélectionné.',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    await Promise.all([fetchTrucks(), fetchTransporters()]);

    if (!trucks.value.length || !transporters.value.length) {
      await Swal.fire({
        icon: 'warning',
        title: 'Ressources manquantes',
        text: 'Aucun camion ou transporteur disponible.',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    const requestData = {
      selectedContracts: validContracts.map(c => ({
        _id: c._id,
        productQuantity: c.product.totalQuantity
      })),
      planDate: moment(planDate).toISOString(),
    };

    const { data } = await api.post('/routes/optimize-greedy', requestData);

    if (!data.success) {
      throw new Error(data.message || 'Erreur lors de la génération du plan');
    }

    const availableTrucksSorted = [...trucks.value]
      .filter(t => t.status === 'available')
      .sort((a, b) => b.capacity - a.capacity);

    const transporterAssignments = new Map<string, {
      dateCounts: Map<string, number>,
      days: Set<string>
    }>();

    distributionPlan.value = await Promise.all(data.distributionPlan.map(async (entry: any) => {
      const deliveryDates: DeliveryDate[] = Array.isArray(entry.deliveryDates) && entry.deliveryDates.length > 0
        ? entry.deliveryDates.map((dd: any) => ({
            date: dd.date ? new Date(dd.date).toISOString() : new Date().toISOString(),
            status: dd.status || 'en attente'
          }))
        : [{ date: new Date().toISOString(), status: 'en attente' }];

      let assignedTruck = availableTrucksSorted.find(t =>
        t.capacity >= entry.quantity && t.status === 'available'
      );

      if (!assignedTruck) {
        assignedTruck = availableTrucksSorted[0];
      }

      let assignedTransporter: Transporter | null = null;
      if (assignedTruck) {
        const deliveryDate = new Date(deliveryDates[0]?.date || new Date());
        const dateStr = moment(deliveryDate).format('YYYY-MM-DD');
        const dayOfWeek = moment(deliveryDate).format('dddd').toLowerCase();

        const compatibleTransporters = transporters.value.filter(t =>
          isTransporterCompatible(t, assignedTruck?.type)
        );

        for (const transporter of compatibleTransporters) {
          if (!transporterAssignments.has(transporter._id)) {
            transporterAssignments.set(transporter._id, {
              dateCounts: new Map<string, number>(),
              days: new Set<string>()
            });
          }

          const assignments = transporterAssignments.get(transporter._id)!;
          const currentDateCount = assignments.dateCounts.get(dateStr) || 0;
          const uniqueDays = assignments.days;

          if (currentDateCount < transporterConfig.value.maxDeliveriesPerDay &&
              (uniqueDays.size < transporterConfig.value.workingDaysPerWeek || uniqueDays.has(dayOfWeek))) {

            assignedTransporter = transporter;
            assignments.dateCounts.set(dateStr, currentDateCount + 1);
            assignments.days.add(dayOfWeek);
            break;
          }
        }
      }

      return {
        ...entry,
        deliveryDates,
        truck: assignedTruck ? {
          id: assignedTruck._id,
          name: assignedTruck.vehicle,
          licensePlate: assignedTruck.vehicle,
          type: assignedTruck.type,
          capacity: assignedTruck.capacity
        } : undefined,
        transporter: assignedTransporter ? {
          id: (assignedTransporter as Transporter)._id,
          firstName: (assignedTransporter as Transporter).firstName,
          lastName: (assignedTransporter as Transporter).lastName,
          licenseType: (assignedTransporter as Transporter).typeDrivingLicence
        } : undefined,
        editableTruckId: assignedTruck?._id,
        editableTransporterId: (assignedTransporter as Transporter | null)?._id,
        route: entry.route || {
          waypoints: [],
          totalDistance: 0,
          totalTime: 0,
          salesPointsVisited: entry.salesPoints?.length || 0,
          totalPoints: 0,
          hasSupplier: false
        }
      } as DistributionPlanEntry;
    }));

    const unassignedTrucks = distributionPlan.value.filter(entry => !entry.truck).length;
    const unassignedTransporters = distributionPlan.value.filter(entry => entry.truck && !entry.transporter).length;
    const capacityIssues = distributionPlan.value.filter(entry =>
      entry.truck && (entry.truck.capacity ?? 0) < entry.quantity
    ).length;

    let warningMessage = '';
    if (unassignedTrucks > 0) warningMessage += `${unassignedTrucks} livraison(s) sans camion attribué. `;
    if (unassignedTransporters > 0) warningMessage += `${unassignedTransporters} livraison(s) sans transporteur compatible. `;
    if (capacityIssues > 0) warningMessage += `${capacityIssues} livraison(s) avec camion sous-dimensionné. `;

    if (warningMessage) {
      await Swal.fire({
        icon: 'warning',
        title: 'Attention',
        html: warningMessage,
        confirmButtonColor: '#3b82f6'
      });
    }

    if (distributionPlan.value.length) {
      await nextTick();
      const mapInitialized = await initMap('distribution-map');
      if (mapInitialized) {
        await displayRoute(distributionPlan.value, null);
      }
    }

    return distributionPlan.value;
  } catch (error: any) {
    console.error('Erreur génération plan:', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la génération du plan';
    await Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: errorMessage,
      confirmButtonColor: '#3b82f6'
    });
    throw error;
  } finally {
    optimizingRoute.value = false;
  }
};

const downloadCSV = () => {
  try {
    if (!distributionPlan.value.length) {
      throw new Error('Aucun plan de distribution à exporter');
    }

    const headers = [
      'Date', 'Statut', 'Jour', 'Contrat', 'Entrepôt', 'Fournisseur',
      'Points de Vente', 'Produit', 'Quantité (kg)', 'Camion',
      'Transporteur', 'Distance (km)', 'Temps (min)'
    ];

    const rows = distributionPlan.value.flatMap(entry =>
      entry.deliveryDates.map(dd => [
        formatDeliveryDate(dd.date),
        dd.status,
        entry.dayOfWeek,
        entry.contractName,
        entry.warehouse,
        entry.supplier || '-',
        entry.salesPoints.join('; '),
        entry.product,
        entry.quantity,
        entry.truck ? `${entry.truck.name} (${entry.truck.type})` : 'Non attribué',
        entry.transporter
          ? `${entry.transporter.firstName} ${entry.transporter.lastName || ''}`.trim()
          : 'Non attribué',
        entry.route.totalDistance.toFixed(2),
        entry.route.totalTime
      ])
    );

    let csvContent = headers.join(';') + '\n';
    rows.forEach(row => {
      csvContent += row.join(';') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `plan-distribution-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // BUG FIX: release object URL to prevent memory leak
    URL.revokeObjectURL(url);

    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: 'Fichier CSV téléchargé avec succès',
      confirmButtonColor: '#3b82f6'
    });
  } catch (error) {
    console.error('Erreur lors de la génération du CSV:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: error instanceof Error ? error.message : 'Échec du téléchargement CSV',
      confirmButtonColor: '#3b82f6'
    });
  }
};

const downloadPDF = async () => {
  try {
    if (!distributionPlan.value.length) {
      throw new Error('Aucun plan de distribution à exporter');
    }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm' });

    const mainColor = '#3b82f6';
    const fontSize = 7;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = { left: 10, right: 10, top: 30, bottom: 20 };
    let currentY = margin.top;

    doc.setFontSize(16);
    doc.setTextColor(mainColor);
    doc.text('Plan de Distribution', pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, 22, { align: 'center' });

    const columns = [
      { header: 'Date', width: 20 }, { header: 'Statut', width: 15 },
      { header: 'Jour', width: 15 }, { header: 'Contrat', width: 25 },
      { header: 'Entrepôt', width: 20 }, { header: 'Fournisseur', width: 20 },
      { header: 'Points de Vente', width: 40 }, { header: 'Produit', width: 20 },
      { header: 'Quantité', width: 15 }, { header: 'Camion', width: 25 },
      { header: 'Transporteur', width: 25 }, { header: 'Distance', width: 15 },
      { header: 'Temps', width: 15 }
    ];
    const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);
    const rowHeight = 8;
    const headerHeight = 10;

    const drawTableRow = (y: number, data: string[], isHeader = false) => {
      let x = margin.left;
      doc.setFontSize(fontSize);
      doc.setTextColor(0);
      if (isHeader) {
        doc.setFillColor(mainColor);
        doc.rect(margin.left, y, totalWidth, headerHeight, 'F');
        doc.setTextColor(255);
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }

      columns.forEach((col, i) => {
        doc.setDrawColor(100);
        doc.rect(x, y, col.width, isHeader ? headerHeight : rowHeight);
        const text = data[i] || '';
        const maxWidth = col.width - 4;
        const textLines = doc.splitTextToSize(text, maxWidth);
        const textY = y + (isHeader ? 7 : 6);
        doc.text(textLines[0] || '', x + 2, textY);
        x += col.width;
      });
    };

    const checkPageBreak = (requiredHeight: number) => {
      if (currentY + requiredHeight >= pageHeight - margin.bottom) {
        doc.addPage();
        currentY = margin.top;
        drawTableRow(currentY, columns.map(col => col.header), true);
        currentY += headerHeight;
      }
    };

    const tableData = distributionPlan.value.flatMap(entry =>
      entry.deliveryDates.map(dd => ({
        date: formatDeliveryDate(dd.date),
        status: dd.status,
        dayOfWeek: entry.dayOfWeek,
        contractName: entry.contractName,
        warehouse: entry.warehouse,
        supplier: entry.supplier || '-',
        salesPoints: entry.salesPoints.join(', '),
        product: entry.product,
        quantity: `${entry.quantity} kg`,
        truck: entry.truck ? `${entry.truck.name} (${entry.truck.type})` : 'Non attribué',
        transporter: entry.transporter
          ? `${entry.transporter.firstName} ${entry.transporter.lastName || ''}`.trim()
          : 'Non attribué',
        distance: `${entry.route.totalDistance.toFixed(2)} km`,
        time: `${entry.route.totalTime} min`
      }))
    );

    drawTableRow(currentY, columns.map(col => col.header), true);
    currentY += headerHeight;

    tableData.forEach(row => {
      checkPageBreak(rowHeight);
      drawTableRow(currentY, [
        row.date, row.status, row.dayOfWeek, row.contractName,
        row.warehouse, row.supplier, row.salesPoints, row.product,
        row.quantity, row.truck, row.transporter, row.distance, row.time
      ]);
      currentY += rowHeight;
    });

    // BUG FIX: groupedData accumulator typed properly to avoid implicit any
    const groupedData: Record<string, any> = distributionPlan.value.reduce((acc: Record<string, any>, entry) => {
      const key = `${entry.contractName}-${entry.warehouse}-${entry.truck?.id}`;
      if (!acc[key]) {
        acc[key] = {
          ...entry,
          dates: [...new Set(entry.deliveryDates.map(d => d.date))],
          count: 1
        };
      } else {
        entry.deliveryDates.forEach(date => {
          if (!acc[key].dates.includes(date.date)) {
            acc[key].dates.push(date.date);
          }
        });
        acc[key].count++;
      }
      return acc;
    }, {});

    const savePayload = {
      distributionOrders: Object.values(groupedData).map((entry: any) => ({
        contract: selectedContracts.value.find(c => c.name === entry.contractName)?._id,
        deliveryDates: entry.dates.map((date: string) => ({ date, status: 'en attente' })),
        waypoints: entry.route.waypoints,
        truck: entry.truck,
        transporter: entry.transporter
      })),
      metadata: {
        savedAt: new Date().toISOString(),
        savedBy: 'current-user-id'
      }
    };

    const response = await api.post('/contract/save', savePayload);
    const { saved = [], skipped = [], errors: saveErrors = [] } = response.data.data || {};

    if (skipped.length > 0) {
      checkPageBreak(10);
      doc.setFontSize(8);
      doc.setTextColor(150, 0, 0);
      doc.text(
        `${skipped.length} distribution(s) déjà existante(s) - non sauvegardée(s)`,
        pageWidth / 2,
        currentY + 10,
        { align: 'center' }
      );
      currentY += 10;
    }

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Page ${i}`, margin.left, pageHeight - 10);
    }

    const fileName = `plan-distribution-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);

    let successMessage = `
      <div>
        <p><strong>${Object.keys(groupedData).length} groupes</strong> traités</p>
        <p>Fichier PDF généré : <code>${fileName}</code></p>
    `;
    if (saved.length > 0) successMessage += `<p>${saved.length} nouvelle(s) distribution(s) sauvegardée(s)</p>`;
    if (skipped.length > 0) successMessage += `<p>${skipped.length} distribution(s) déjà existante(s) - non sauvegardée(s)</p>`;
    successMessage += `</div>`;

    await Swal.fire({
      icon: 'success',
      title: 'Export réussi',
      html: successMessage,
      confirmButtonColor: mainColor
    });
  } catch (error) {
    console.error('Erreur complète:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: error instanceof Error ? error.message : 'Échec de la génération du PDF',
      confirmButtonColor: '#ef4444'
    });
  }
};

const confirmTransporterConfig = async () => {
  showTransporterConfig.value = false;
  showDistributionPlan.value = true;

  if (selectedContracts.value.length > 0) {
    try {
      await generateDistributionPlan();
      if (distributionPlan.value.length) {
        await nextTick();
        await initMap('distribution-map');
        displayRoute(distributionPlan.value, null);
      }
    } catch (error) {
      console.error('Erreur génération plan:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de générer le plan',
        confirmButtonColor: '#3b82f6'
      });
    }
  }
};

const openDistributionPlan = async () => {
  showTransporterConfig.value = true;
  showDistributionPlan.value = false;
};

const openModal = () => {
  showModal.value = true;
  fetchSalesPoints();
  fetchProducts();
  fetchSuppliers();
  fetchWarehouses();
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const closeConfirmation = () => {
  showConfirmation.value = false;
  resetForm();
  fetchContracts();
};

const resetForm = () => {
  contractForm.value = {
    name: '',
    startDate: '',
    endDate: '',
    salesPointIds: [],
    productId: '',
    frequency: 'weekly',
    deliveryDays: [],
    deliveryDates: [],
    tonnage: 1000,
    warehouseId: '',
    supplierId: '',
    warehouseQuantity: undefined,
    supplierQuantity: undefined
  };
  salesPointSearch.value = '';
  optimalWarehouse.value = null;
  selectedWarehouse.value = null;
  suggestedSupplier.value = null;
  requiresSupplier.value = false;
  selectedContract.value = null;
  isOptimalWarehouseLocked.value = false;
};

const openResourceManagement = () => {
  showResourceManagement.value = true;
  fetchTrucks();
  fetchTransporters();
};

const deleteContract = async (contractId: string) => {
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Confirmation',
    text: 'Êtes-vous sûr de vouloir supprimer ce contrat ?',
    showCancelButton: true,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  });

  if (!result.isConfirmed) return;

  try {
    loading.value.contracts = true;
    await api.delete(`/contract/${contractId}`);
    contracts.value = contracts.value.filter(c => c._id !== contractId);
    await Swal.fire({
      icon: 'success',
      title: 'Supprimé',
      text: 'Contrat supprimé avec succès',
      confirmButtonColor: '#3b82f6'
    });
  } catch (error) {
    console.error('Échec de la suppression du contrat', error);
    await Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: getErrorMessage(error, 'suppression du contrat'),
      confirmButtonColor: '#3b82f6'
    });
  } finally {
    loading.value.contracts = false;
  }
};

// Lifecycle Hooks
onMounted(() => {
  fetchContracts();
  fetchTrucks();
  fetchTransporters();
  fetchWarehouses();
});

// Watchers
watch(
  [
    () => contractForm.value.salesPointIds,
    () => contractForm.value.productId,
    () => contractForm.value.tonnage,
    () => warehouses.value,
  ],
  async ([newSalesPointIds, newProductId, newTonnage]) => {
    try {
      const conditionsMet = (
        // BUG FIX: safe cast for watch tuple values
        Array.isArray(newSalesPointIds) && (newSalesPointIds as string[]).length > 0 &&
        newProductId &&
        (newTonnage as number) > 0 &&
        !selectedContract.value?._id &&
        Array.isArray(warehouses.value) &&
        warehouses.value.length > 0
      );

      if (conditionsMet) {
        await fetchOptimalWarehouse();
      }
    } catch (error) {
      console.error('Error in watch:', error);
    }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div class="p-6 md:p-8 animate-in fade-in duration-500">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
      <div>
        <h1 class="text-3xl font-display font-bold text-premium-midnight tracking-tight">Plan de Distribution</h1>
        <p class="text-slate-500 mt-1">Gérez vos contrats et optimisez vos tournées logistiques</p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div class="relative min-w-[280px]">
          <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            v-model="contractSearch"
            placeholder="Rechercher un contrat..."
            class="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-premium-gold focus:ring-1 focus:ring-premium-gold transition-all shadow-sm"
          />
        </div>

        <div class="flex items-center gap-2">
          <button class="btn-gold group" @click="openModal">
            <i class="fas fa-plus mr-2 group-hover:rotate-90 transition-transform"></i>
            Nouveau Contrat
          </button>
          <button
            class="btn-outline flex items-center gap-2"
            @click="openDistributionPlan"
            :disabled="!canOptimizeRoute"
            :class="{'opacity-50 cursor-not-allowed': !canOptimizeRoute}"
          >
            <i class="fas fa-calendar-alt"></i>
            Planification
          </button>
          <button class="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-premium-gold hover:border-premium-gold transition-all shadow-sm" @click="openResourceManagement" title="Ressources">
            <i class="fas fa-truck"></i>
          </button>
          <button class="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-premium-gold hover:border-premium-gold transition-all shadow-sm" @click="fetchContracts" title="Rafraîchir">
            <i class="fas fa-sync-alt" :class="{'animate-spin': loading.contracts}"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Contracts Section -->
    <div class="space-y-6 mb-8">
      <div class="flex items-end justify-between px-2">
        <h2 class="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <span class="w-8 h-px bg-slate-200"></span>
          Contrats Actuels
        </h2>
        <span class="text-[10px] font-bold text-premium-gold bg-premium-gold/10 px-3 py-1 rounded-full uppercase tracking-wider">
          {{ filteredContracts.length }} Contrat(s)
        </span>
      </div>

      <div v-if="loading.contracts" class="loading-state">
        <div class="spinner"></div>
        <span>Chargement des contrats...</span>
      </div>
      <div v-else-if="errors.contracts" class="error-state">
        <span class="icon">⚠️</span>
        {{ errors.contracts }}
      </div>
      <div v-else-if="!filteredContracts.length" class="empty-state">
        <span>Aucun contrat trouvé.</span>
        <button class="btn-gold mt-4" @click="openModal">Créer un contrat</button>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          v-for="contract in filteredContracts"
          :key="contract._id"
          class="card-premium group flex flex-col relative"
          :class="{ 'ring-2 ring-premium-gold border-premium-gold': selectedContracts.some(c => c._id === contract._id) }"
        >
          <!-- Selection Checkbox -->
          <button
            @click="toggleContractSelection(contract)"
            class="absolute top-4 left-4 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all z-10"
            :class="selectedContracts.some(c => c._id === contract._id) ? 'bg-premium-gold border-premium-gold text-white' : 'bg-white border-slate-200 text-transparent'"
          >
            <i class="fas fa-check text-[10px]"></i>
          </button>

          <div class="flex justify-between items-start mb-6 ml-8">
            <div>
              <h3 class="text-lg font-bold text-premium-midnight group-hover:text-premium-gold transition-colors">{{ contract.name }}</h3>
              <div class="flex items-center gap-2 mt-1">
                <span class="w-2 h-2 rounded-full"
                  :class="{
                    'bg-emerald-500': getContractStatus(contract) === 'Actif',
                    'bg-amber-500': getContractStatus(contract) === 'En attente',
                    'bg-slate-300': getContractStatus(contract) === 'Expiré'
                  }"></span>
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">{{ getContractStatus(contract) }}</span>
              </div>
            </div>

            <div class="flex gap-1">
              <button @click="showDetails(contract)" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-premium-midnight transition-all">
                <i class="fas fa-info-circle"></i>
              </button>
              <button @click="deleteContract(contract._id)" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>

          <div class="space-y-4 mb-6">
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 group-hover:border-premium-gold/20 transition-all">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Période du Contrat</p>
              <div class="flex items-center gap-3">
                <i class="fas fa-calendar-alt text-premium-gold"></i>
                <span class="text-sm font-bold text-premium-midnight">{{ formatDate(contract.startDate) }} — {{ formatDate(contract.endDate) }}</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Entrepôt</p>
                <p class="text-sm font-bold text-premium-midnight truncate" :title="contract.warehouse?.name">{{ contract.warehouse?.name || 'Non assigné' }}</p>
              </div>
              <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quantité</p>
                <p class="text-sm font-bold text-premium-midnight">{{ formatNumber(contract.product.totalQuantity) }} kg</p>
              </div>
            </div>
          </div>

          <button @click="updateContract(contract)" class="w-full py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-premium-gold hover:text-white hover:border-premium-gold transition-all mt-auto">
            Modifier le contrat
          </button>
        </div>
      </div>
    </div>

    <!-- Contract Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content !max-w-4xl">
        <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 class="text-xl font-display font-bold text-premium-midnight flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-premium-gold/10 flex items-center justify-center">
              <i :class="['fas', selectedContract?._id ? 'fa-edit' : 'fa-plus']" class="text-premium-gold"></i>
            </div>
            {{ selectedContract?._id ? 'Modifier le Contrat' : 'Nouveau Contrat' }}
          </h2>
          <button @click="closeModal" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-premium-midnight transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- BUG FIX: form now properly contained within the scrollable div -->
        <div class="overflow-y-auto p-8 custom-scrollbar flex-1">
          <form @submit.prevent="saveContract">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Left Column -->
              <div class="space-y-8">
                <div class="space-y-6">
                  <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span class="w-8 h-px bg-slate-200"></span>
                    Informations Générales
                  </h3>

                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nom du Contrat *</label>
                    <div class="relative group">
                      <i class="fas fa-file-contract absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors"></i>
                      <input
                        v-model="contractForm.name"
                        type="text"
                        required
                        placeholder="ex: Contrat Distribution Region Nord"
                        class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Date de Début *</label>
                      <input v-model="contractForm.startDate" type="date" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all cursor-pointer" />
                    </div>
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Date de Fin *</label>
                      <input v-model="contractForm.endDate" type="date" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div class="space-y-6">
                  <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span class="w-8 h-px bg-slate-200"></span>
                    Points de Vente *
                  </h3>

                  <div class="space-y-4">
                    <div class="relative">
                      <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                      <input v-model="salesPointSearch" type="text" placeholder="Rechercher un point de vente..." class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-premium-gold transition-colors" />
                    </div>

                    <div class="h-64 overflow-y-auto custom-scrollbar border border-slate-100 rounded-2xl bg-slate-50/50 p-2 space-y-1">
                      <div v-if="loading.salesPoints" class="flex flex-col items-center justify-center py-10 text-premium-gold animate-pulse">
                        <i class="fas fa-circle-notch fa-spin mb-2"></i>
                        <span class="text-xs font-bold uppercase tracking-widest">Chargement...</span>
                      </div>

                      <label
                        v-for="point in filteredSalesPoints"
                        :key="point._id"
                        class="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all cursor-pointer group"
                        :class="{'bg-white shadow-sm border border-slate-100': contractForm.salesPointIds.includes(point._id)}"
                      >
                        <div class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                          :class="contractForm.salesPointIds.includes(point._id) ? 'bg-premium-gold border-premium-gold text-white' : 'bg-white border-slate-200 text-transparent'">
                          <i class="fas fa-check text-[8px]"></i>
                        </div>
                        <input type="checkbox" v-model="contractForm.salesPointIds" :value="point._id" class="hidden" />
                        <div class="flex-1">
                          <p class="text-sm font-bold text-premium-midnight group-hover:text-premium-gold transition-colors">{{ point.name }}</p>
                          <p v-if="point.address" class="text-[10px] text-slate-500 truncate max-w-[200px]">{{ point.address }}</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-8">
                <div class="space-y-6">
                  <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span class="w-8 h-px bg-slate-200"></span>
                    Produit & Fréquence
                  </h3>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Produit *</label>
                      <div class="relative">
                        <select v-model="contractForm.productId" required :disabled="!!selectedContract?._id" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-premium-midnight focus:outline-none focus:border-premium-gold transition-all appearance-none cursor-pointer">
                          <option value="" disabled>Sélectionner</option>
                          <option v-for="product in products" :key="product._id" :value="product._id">{{ product.name }}</option>
                        </select>
                        <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Quantité (kg) *</label>
                      <input v-model.number="contractForm.tonnage" type="number" min="1" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-premium-midnight focus:outline-none focus:border-premium-gold transition-all" />
                    </div>
                  </div>

                  <div class="space-y-4">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Fréquence de Livraison *</label>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button
                        v-for="(label, value) in FREQUENCY_LABELS"
                        :key="value"
                        type="button"
                        @click="contractForm.frequency = value as ContractForm['frequency']; updateFrequency()"
                        class="py-2 px-3 rounded-xl border text-xs font-bold transition-all"
                        :class="contractForm.frequency === value ? 'bg-premium-gold border-premium-gold text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-premium-gold/30'"
                      >
                        {{ label }}
                      </button>
                    </div>
                  </div>

                  <div v-if="contractForm.frequency === 'custom'" class="animate-in slide-in-from-top-2 duration-300">
                    <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Jours de Livraison</p>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="day in WEEK_DAYS"
                        :key="day.value"
                        type="button"
                        @click="toggleDeliveryDay(day.value)"
                        class="px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all"
                        :class="contractForm.deliveryDays.includes(day.value) ? 'bg-premium-midnight border-premium-midnight text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-premium-midnight/20'"
                      >
                        {{ day.label }}
                      </button>
                    </div>
                  </div>

                  <!-- BUG FIX: custom delivery dates section was missing from template -->
                  <div v-if="contractForm.frequency === 'custom'" class="space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <div class="flex items-center justify-between">
                      <p class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Dates de Livraison</p>
                      <button type="button" @click="addDeliveryDate" class="text-xs font-bold text-premium-gold hover:underline">+ Ajouter</button>
                    </div>
                    <div v-for="(dd, idx) in contractForm.deliveryDates" :key="idx" class="flex gap-2 items-center">
                      <input v-model="dd.date" type="date" class="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-premium-gold transition-all" />
                      <select v-model="dd.status" class="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-premium-gold transition-all">
                        <option value="en attente">En attente</option>
                        <option value="en cours">En cours</option>
                        <option value="livree">Livrée</option>
                      </select>
                      <button type="button" @click="removeDeliveryDate(idx)" class="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors">
                        <i class="fas fa-times text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Optimization Section -->
                <div class="space-y-6">
                  <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span class="w-8 h-px bg-slate-200"></span>
                    Optimisation Logistique
                  </h3>

                  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                    <div class="flex justify-between items-center">
                      <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Entrepôt Source *</label>
                      <div v-if="loading.optimalWarehouse" class="text-[10px] font-bold text-premium-gold animate-pulse uppercase">Calcul optimal...</div>
                      <div v-else-if="optimalWarehouse" class="flex items-center gap-2">
                        <span class="px-2 py-1 rounded bg-premium-gold text-white text-[10px] font-black uppercase">Conseillé</span>
                      </div>
                    </div>

                    <div class="relative">
                      <select
                        v-model="contractForm.warehouseId"
                        required
                        @change="onWarehouseSelect"
                        :disabled="loading.optimalWarehouse"
                        class="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-premium-midnight focus:outline-none focus:border-premium-gold transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Sélectionner un entrepôt</option>
                        <option v-for="wh in warehouses" :key="wh._id" :value="wh._id">
                          {{ wh.name }} (Stock: {{ formatNumber(getProductStock(wh, contractForm.productId)) }} kg)
                        </option>
                      </select>
                      <i class="fas fa-warehouse absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"></i>
                    </div>

                    <div v-if="optimalWarehouse && contractForm.warehouseId === optimalWarehouse._id" class="bg-emerald-50 rounded-xl p-3 border border-emerald-100 flex items-start gap-3 animate-in fade-in">
                      <i class="fas fa-check-circle text-emerald-500 mt-0.5"></i>
                      <div class="text-[11px] text-emerald-700">
                        <strong>{{ optimalWarehouse.name }}</strong> est l'entrepôt optimal pour cette zone.
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2" v-if="contractForm.warehouseId">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Quantité depuis l'entrepôt (kg)</label>
                    <input
                      type="number"
                      v-model.number="contractForm.warehouseQuantity"
                      :disabled="!contractForm.warehouseId"
                      :max="productAvailableQuantity"
                      :placeholder="`Max: ${formatNumber(productAvailableQuantity)} kg`"
                      min="0"
                      class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-premium-midnight focus:outline-none focus:border-premium-gold transition-all"
                    />
                  </div>

                  <div v-if="requiresSupplier" class="bg-amber-50 rounded-2xl p-6 border border-amber-200 space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <div class="flex justify-between items-center">
                      <label class="text-xs font-bold text-amber-700 uppercase tracking-widest">Fournisseur (Complément)</label>
                      <span class="px-2 py-1 rounded bg-amber-500 text-white text-[10px] font-black uppercase">Stock insuffisant</span>
                    </div>

                    <div class="relative">
                      <select
                        v-model="contractForm.supplierId"
                        required
                        @change="onSupplierSelect"
                        class="w-full bg-white border border-amber-200 rounded-xl py-3 px-4 text-premium-midnight focus:outline-none focus:border-amber-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Sélectionner un fournisseur</option>
                        <option v-for="sup in suppliers" :key="sup._id" :value="sup._id">
                          {{ sup.name }} (Stock: {{ formatNumber(getProductStock(sup, contractForm.productId)) }} kg)
                        </option>
                      </select>
                      <i class="fas fa-truck-loading absolute right-4 top-1/2 -translate-y-1/2 text-amber-300 pointer-events-none"></i>
                    </div>
                  </div>

                  <!-- Contract Summary -->
                  <div class="bg-premium-midnight rounded-[2rem] p-8 text-white space-y-6 relative overflow-hidden mt-6">
                    <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-premium-gold/10 rounded-full blur-3xl"></div>

                    <h4 class="text-xs font-black uppercase tracking-[0.2em] text-premium-gold flex items-center gap-2">
                      <i class="fas fa-clipboard-list text-xs"></i>
                      Résumé du Contrat
                    </h4>

                    <div class="space-y-3">
                      <div class="flex justify-between items-center pb-3 border-b border-white/5">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Quantité Totale</span>
                        <span class="text-lg font-display font-bold text-white">{{ formatNumber(contractForm.tonnage) }} <span class="text-[10px] text-slate-400">kg</span></span>
                      </div>
                      <div class="flex justify-between items-center" v-if="contractForm.warehouseId">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Via Entrepôt</span>
                        <span class="text-sm font-bold text-emerald-400">+ {{ formatNumber(contractForm.warehouseQuantity || 0) }} kg</span>
                      </div>
                      <div class="flex justify-between items-center" v-if="requiresSupplier && contractForm.supplierId">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Via Fournisseur</span>
                        <span class="text-sm font-bold text-amber-400">+ {{ formatNumber(contractForm.supplierQuantity || 0) }} kg</span>
                      </div>
                    </div>

                    <div class="pt-4 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full" :class="missingQuantity <= 0 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'"></div>
                        <span class="text-[10px] font-black uppercase tracking-widest" :class="missingQuantity <= 0 ? 'text-emerald-400' : 'text-amber-400'">
                          {{ missingQuantity <= 0 ? 'Prêt pour planification' : 'Stock incomplet' }}
                        </span>
                      </div>
                      <div v-if="missingQuantity > 0" class="text-[10px] font-bold text-slate-400">
                        Manque: {{ formatNumber(missingQuantity) }} kg
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer inside form -->
            <div class="pt-8 flex justify-end gap-3 border-t border-slate-100 mt-8">
              <button type="button" @click="closeModal" class="px-8 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-white transition-all">
                Annuler
              </button>
              <button type="submit" class="btn-gold px-10 shadow-premium" :disabled="saving">
                <i v-if="saving" class="fas fa-circle-notch fa-spin mr-2"></i>
                {{ selectedContract?._id ? 'Mettre à jour' : 'Enregistrer le Contrat' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Contract Details Modal -->
    <div v-if="showContractDetails && detailedContract" class="modal-overlay" @click.self="showContractDetails = false">
      <div class="modal-content !max-w-2xl">
        <div class="modal-header">
          <h2 class="text-xl font-display font-bold text-premium-midnight flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-premium-gold/10 flex items-center justify-center">
              <i class="fas fa-info-circle text-premium-gold"></i>
            </div>
            Détails du Contrat
          </h2>
          <button @click="showContractDetails = false" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-premium-midnight transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-1">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom du Contrat</p>
              <p class="text-lg font-bold text-premium-midnight">{{ detailedContract.name }}</p>
            </div>
            <div class="space-y-1 text-right">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</p>
              <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase">{{ getContractStatus(detailedContract) }}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span class="w-4 h-px bg-slate-200"></span>
                Produit & Livraison
              </h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center py-2 border-b border-slate-50">
                  <span class="text-xs font-bold text-slate-500">Produit</span>
                  <span class="text-xs font-black text-premium-midnight uppercase">{{ detailedContract.product.name }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-slate-50">
                  <span class="text-xs font-bold text-slate-500">Quantité Totale</span>
                  <span class="text-xs font-black text-premium-midnight">{{ formatNumber(detailedContract.product.totalQuantity) }} kg</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-slate-50">
                  <span class="text-xs font-bold text-slate-500">Fréquence</span>
                  <span class="text-xs font-black text-premium-gold uppercase">{{ FREQUENCY_LABELS[detailedContract.frequency] }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span class="w-4 h-px bg-slate-200"></span>
                Source Logistique
              </h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center py-2 border-b border-slate-50">
                  <span class="text-xs font-bold text-slate-500">Entrepôt</span>
                  <span class="text-xs font-black text-premium-midnight uppercase">{{ detailedContract.warehouse?.name || 'Non assigné' }}</span>
                </div>
                <div v-if="detailedContract.supplier" class="flex justify-between items-center py-2 border-b border-slate-50">
                  <span class="text-xs font-bold text-slate-500">Fournisseur</span>
                  <span class="text-xs font-black text-amber-600 uppercase">{{ detailedContract.supplier.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span class="w-4 h-px bg-slate-200"></span>
              Points de Vente ({{ detailedContract.salesPoints?.length || 0 }})
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div v-for="sp in detailedContract.salesPoints" :key="sp._id" class="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <p class="text-[11px] font-bold text-premium-midnight">{{ sp.name }}</p>
                <p class="text-[9px] text-slate-400 truncate">{{ sp.address }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showContractDetails = false" class="px-8 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-white transition-all">
            Fermer
          </button>
          <button @click="updateContract(detailedContract)" class="btn-gold px-10">
            <i class="fas fa-edit mr-2"></i>Modifier
          </button>
        </div>
      </div>
    </div>

    <!-- Transporter Config Modal -->
    <div v-if="showTransporterConfig" class="modal-overlay" @click.self="showTransporterConfig = false">
      <div class="modal-content !max-w-lg">
        <div class="modal-header">
          <h2 class="text-xl font-display font-bold text-premium-midnight flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-premium-gold/10 flex items-center justify-center">
              <i class="fas fa-truck-loading text-premium-gold"></i>
            </div>
            Configuration Logistique
          </h2>
          <button @click="showTransporterConfig = false" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-premium-midnight transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <p class="text-xs font-medium text-slate-500 leading-relaxed">
            Définissez les contraintes de travail pour tous les transporteurs lors de la génération automatique du plan.
          </p>
          <div class="space-y-4">
            <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jours de travail / semaine</label>
              <div class="relative">
                <input v-model.number="transporterConfig.workingDaysPerWeek" type="number" min="1" max="7" class="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-premium-midnight focus:outline-none focus:border-premium-gold transition-all" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">Jours</span>
              </div>
            </div>
            <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Livraisons max / jour</label>
              <div class="relative">
                <input v-model.number="transporterConfig.maxDeliveriesPerDay" type="number" min="1" max="5" class="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-premium-midnight focus:outline-none focus:border-premium-gold transition-all" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">Points</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showTransporterConfig = false" class="px-8 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-white transition-all">Annuler</button>
          <button @click="confirmTransporterConfig" class="btn-gold px-10 shadow-premium">Générer le Plan</button>
        </div>
      </div>
    </div>

    <!-- Distribution Plan Modal -->
    <div v-if="showDistributionPlan" class="modal-overlay" @click.self="showDistributionPlan = false">
      <div class="modal-content !max-w-6xl !max-h-[95vh] flex flex-col">
        <div class="modal-header shrink-0">
          <h2 class="text-xl font-display font-bold text-premium-midnight flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-premium-gold/10 flex items-center justify-center">
              <i class="fas fa-route text-premium-gold"></i>
            </div>
            Plan de Distribution Optimisé
          </h2>
          <div class="flex items-center gap-2">
            <button @click="downloadPDF" class="btn-outline py-2 px-4 text-xs"><i class="fas fa-file-pdf mr-2"></i>PDF</button>
            <button @click="downloadCSV" class="btn-outline py-2 px-4 text-xs"><i class="fas fa-file-csv mr-2"></i>CSV</button>
            <button @click="showDistributionPlan = false" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-premium-midnight transition-colors ml-4">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div class="modal-body !p-8 flex-1 overflow-y-auto">
          <div v-if="optimizingRoute" class="flex flex-col items-center justify-center py-20 text-premium-gold">
            <i class="fas fa-circle-notch fa-spin text-4xl mb-4"></i>
            <span class="text-sm font-bold uppercase tracking-[0.2em] animate-pulse">Calcul de l'itinéraire optimal...</span>
          </div>

          <div v-else-if="!distributionPlan.length" class="text-center py-20">
            <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fas fa-exclamation-triangle text-slate-300 text-3xl"></i>
            </div>
            <p class="text-slate-500 font-bold">Aucun plan généré. Veuillez sélectionner des contrats.</p>
            <button class="btn-gold mt-6" @click="showDistributionPlan = false">Retour aux contrats</button>
          </div>

          <div v-else class="space-y-8">
            <!-- Map -->
            <div class="relative group">
              <div class="absolute inset-0 bg-premium-gold/5 rounded-[2.5rem] -rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
              <div class="relative h-[450px] rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-premium bg-white">
                <div id="distribution-map" class="w-full h-full"></div>

                <div v-if="mapLoading" class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[1000]">
                  <div class="flex flex-col items-center gap-3">
                    <i class="fas fa-spinner fa-spin text-premium-gold text-2xl"></i>
                    <span class="text-xs font-black uppercase tracking-widest text-slate-400">Chargement de la carte...</span>
                  </div>
                </div>

                <div v-if="!selectedRoute" class="absolute bottom-6 left-6 right-6 bg-premium-midnight/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white flex items-center gap-4 z-[999] animate-in slide-in-from-bottom-4 duration-500">
                  <div class="w-10 h-10 rounded-xl bg-premium-gold/20 flex items-center justify-center shrink-0">
                    <i class="fas fa-mouse-pointer text-premium-gold"></i>
                  </div>
                  <p class="text-sm font-medium text-slate-300">Sélectionnez une tournée dans le tableau ci-dessous pour l'afficher sur la carte.</p>
                </div>
              </div>
            </div>

            <!-- Route selector -->
            <div class="route-selection">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Sélectionner une tournée</h3>
              <select
                v-model="selectedRoute"
                @change="displayRoute(distributionPlan, selectedRoute)"
                class="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-premium-midnight focus:outline-none focus:border-premium-gold transition-all"
              >
                <option :value="null">Toutes les tournées</option>
                <option v-for="(entry, index) in distributionPlan" :key="index" :value="entry">
                  {{ entry.contractName }} — {{ formatDeliveryDate(entry.deliveryDates[0]?.date) }}
                </option>
              </select>
            </div>

            <!-- Distribution Table -->
            <div class="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-premium">
              <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full border-collapse distribution-table">
                  <thead>
                    <tr class="bg-slate-50/50 border-b border-slate-100">
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Jour</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Contrat</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Entrepôt</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Fournisseur</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Points de vente</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Produit</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Qté</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Camion</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Transporteur</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Distance</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Temps</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- BUG FIX: table rows were misaligned with headers (13 headers but only 11 data cells rendered correctly) -->
                    <tr
                      v-for="(entry, index) in distributionPlan"
                      :key="index"
                      @click="displayRoute(distributionPlan, entry)"
                      class="route-row border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-colors"
                      :class="{ 'bg-premium-gold/5': selectedRoute === entry }"
                    >
                      <td class="px-4 py-3 text-xs text-premium-midnight">{{ formatDeliveryDate(entry.deliveryDates[0]?.date) || 'N/A' }}</td>
                      <td class="px-4 py-3 text-xs text-slate-500">{{ entry.dayOfWeek }}</td>
                      <td class="px-4 py-3 text-xs font-bold text-premium-midnight">{{ entry.contractName }}</td>
                      <td class="px-4 py-3 text-xs text-slate-500">{{ entry.warehouse }}</td>
                      <td class="px-4 py-3 text-xs text-slate-500">{{ entry.supplier || '-' }}</td>
                      <td class="px-4 py-3 text-xs text-slate-500 max-w-[150px] truncate" :title="entry.salesPoints.join(', ')">{{ entry.salesPoints.join(', ') }}</td>
                      <td class="px-4 py-3 text-xs text-slate-500">{{ entry.product }}</td>
                      <td class="px-4 py-3 text-xs font-bold text-premium-midnight">{{ formatNumber(entry.quantity) }} kg</td>
                      <td class="px-4 py-3">
                        <select
                          v-model="entry.editableTruckId"
                          @change="updateTruckForEntry(entry, ($event.target as HTMLSelectElement).value)"
                          class="editable-select text-xs"
                          @click.stop
                        >
                          <option value="">Non attribué</option>
                          <option
                            v-for="truck in getAvailableTrucksForEntry(entry)"
                            :key="truck._id"
                            :value="truck._id"
                          >
                            {{ truck.vehicle }} ({{ truck.type }}, {{ formatNumber(truck.capacity) }} kg){{ truck._id === entry.optimalTruckId ? ' ★' : '' }}
                          </option>
                        </select>
                      </td>
                      <td class="px-4 py-3">
                        <select
                          v-model="entry.editableTransporterId"
                          @change="updateTransporterForEntry(entry, ($event.target as HTMLSelectElement).value)"
                          class="editable-select text-xs"
                          :disabled="!entry.truck"
                          @click.stop
                        >
                          <option value="">Non attribué</option>
                          <option
                            v-for="transporter in availableTransporters"
                            :key="transporter._id"
                            :value="transporter._id"
                            :disabled="!isTransporterCompatible(transporter, entry.truck?.type)"
                          >
                            {{ transporter.firstName }} {{ transporter.lastName }} ({{ transporter.typeDrivingLicence }})
                          </option>
                        </select>
                      </td>
                      <td class="px-4 py-3 text-xs text-slate-500">{{ formatNumber(entry.route.totalDistance) }} km</td>
                      <td class="px-4 py-3 text-xs text-slate-500">{{ formatNumber(entry.route.totalTime) }} min</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer shrink-0">
          <button class="btn-outline px-6" @click="downloadPDF" :disabled="!distributionPlan.length">
            <i class="fas fa-file-pdf mr-2"></i> Export PDF
          </button>
          <button class="btn-outline px-6" @click="downloadCSV" :disabled="!distributionPlan.length">
            <i class="fas fa-file-csv mr-2"></i> Export CSV
          </button>
          <button @click="showDistributionPlan = false" class="px-8 py-3 rounded-xl bg-premium-midnight text-white text-sm font-bold hover:bg-slate-800 transition-all ml-4">
            Fermer
          </button>
        </div>
      </div>
    </div>

    <!-- Resource Management Modal -->
    <div v-if="showResourceManagement" class="modal-overlay" @click.self="showResourceManagement = false">
      <div class="modal-content !max-w-5xl">
        <div class="modal-header">
          <h2 class="text-xl font-display font-bold text-premium-midnight flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-premium-gold/10 flex items-center justify-center">
              <i class="fas fa-boxes text-premium-gold"></i>
            </div>
            Gestion des Ressources
          </h2>
          <button @click="showResourceManagement = false" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-premium-midnight transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body !p-8">
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span class="w-4 h-px bg-slate-200"></span>
                Flotte de Camions
              </h3>
              <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{{ trucks.length }} unités</span>
            </div>
            <div v-if="loading.trucks" class="flex justify-center py-10">
              <i class="fas fa-circle-notch fa-spin text-premium-gold text-2xl"></i>
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="truck in trucks" :key="truck._id" class="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                <div class="flex justify-between items-start mb-4">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-premium-gold/10 group-hover:text-premium-gold transition-colors">
                    <i class="fas fa-truck"></i>
                  </div>
                  <span class="px-2 py-1 rounded text-[8px] font-black uppercase tracking-wider"
                    :class="{
                      'bg-emerald-100 text-emerald-600': truck.status === 'available',
                      'bg-amber-100 text-amber-600': truck.status === 'in transit',
                      'bg-slate-100 text-slate-600': truck.status === 'maintenance'
                    }">
                    {{ truck.status }}
                  </span>
                </div>
                <h4 class="text-sm font-bold text-premium-midnight mb-1">{{ truck.vehicle }}</h4>
                <div class="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                  <span class="flex items-center gap-1"><i class="fas fa-tag"></i> {{ truck.type }}</span>
                  <span class="w-1 h-1 rounded-full bg-slate-200"></span>
                  <span class="flex items-center gap-1"><i class="fas fa-weight-hanging"></i> {{ formatNumber(truck.capacity) }} kg</span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span class="w-4 h-px bg-slate-200"></span>
                Équipe de Transport
              </h3>
              <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{{ transporters.length }} membres</span>
            </div>
            <div v-if="loading.transporters" class="flex justify-center py-10">
              <i class="fas fa-circle-notch fa-spin text-premium-gold text-2xl"></i>
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="tp in transporters" :key="tp._id" class="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                <div class="flex justify-between items-start mb-4">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-premium-gold/10 group-hover:text-premium-gold transition-colors">
                    <i class="fas fa-user-tie"></i>
                  </div>
                  <span class="px-2 py-1 rounded text-[8px] font-black uppercase tracking-wider"
                    :class="{
                      'bg-emerald-100 text-emerald-600': tp.status === 'Available',
                      'bg-amber-100 text-amber-600': tp.status === 'On mission',
                      'bg-slate-100 text-slate-600': tp.status === 'On leave'
                    }">
                    {{ tp.status }}
                  </span>
                </div>
                <h4 class="text-sm font-bold text-premium-midnight mb-1">{{ tp.firstName }} {{ tp.lastName }}</h4>
                <div class="flex flex-col gap-1 text-[10px] text-slate-400 font-medium">
                  <span class="flex items-center gap-2"><i class="fas fa-id-card text-[9px]"></i> {{ tp.typeDrivingLicence }}</span>
                  <span class="flex items-center gap-2"><i class="fas fa-phone text-[9px]"></i> {{ tp.phoneNumber }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showResourceManagement = false" class="px-10 py-3 rounded-xl bg-premium-midnight text-white text-sm font-bold hover:bg-slate-800 transition-all">Fermer</button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmation" class="modal-overlay z-[60]" @click.self="closeConfirmation">
      <div class="modal-content !max-w-md p-10 flex flex-col items-center text-center">
        <div class="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50/50">
          <i class="fas fa-check text-3xl text-emerald-500"></i>
        </div>

        <h2 class="text-2xl font-display font-bold text-premium-midnight mb-2">Contrat Enregistré !</h2>
        <p class="text-slate-500 text-sm leading-relaxed mb-8">
          Le contrat <span class="font-bold text-premium-midnight">{{ lastCreatedContract?.name }}</span> a été sauvegardé avec succès dans votre base de données.
        </p>

        <div class="w-full space-y-3">
          <!-- BUG FIX: showDetails now safely called with lastCreatedContract (null check added in function) -->
          <button @click="showDetails(lastCreatedContract)" class="w-full btn-gold py-4 shadow-premium">
            <i class="fas fa-info-circle mr-2"></i>Voir les détails
          </button>
          <button @click="closeConfirmation" class="w-full py-4 rounded-2xl border border-slate-100 text-sm font-bold text-slate-400 hover:bg-slate-50 transition-all">
            Continuer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Loading and Error States */
.loading-state,
.error-state,
.empty-state {
  padding: 40px;
  text-align: center;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  color: #ef4444;
}

/* Distribution Table */
.distribution-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.85rem;
  table-layout: auto;
}

.distribution-table th,
.distribution-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
  white-space: nowrap;
}

.distribution-table th {
  position: sticky;
  top: 0;
  background-color: #f8fafc;
  font-weight: 600;
  z-index: 10;
}

.distribution-table tr:last-child td {
  border-bottom: none;
}

.route-row {
  cursor: pointer;
  transition: all 0.2s;
}

.route-row:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

.editable-select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.8rem;
  background-color: white;
  cursor: pointer;
}

.editable-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.editable-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.route-selection {
  margin-bottom: 20px;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

/* Leaflet Overrides */
:global(.map-marker) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px !important;
  height: 24px !important;
  font-weight: bold;
  color: white;
  border-radius: 50%;
}

:global(.map-marker--warehouse) { background-color: #3b82f6; }
:global(.map-marker--supplier) { background-color: #f59e0b; }
:global(.map-marker--salespoint) { background-color: #10b981; }
:global(.map-marker--warehouse-return) { background-color: #0ea5e9; }

:global(.map-marker--highlighted) {
  box-shadow: 0 0 0 3px white, 0 0 0 6px #3b82f6;
  z-index: 1000 !important;
}

@media (max-width: 768px) {
  .distribution-table {
    font-size: 0.75rem;
  }
  .distribution-table th,
  .distribution-table td {
    padding: 6px 8px;
  }
  .editable-select {
    font-size: 0.75rem;
    padding: 5px 7px;
  }
}
</style>
