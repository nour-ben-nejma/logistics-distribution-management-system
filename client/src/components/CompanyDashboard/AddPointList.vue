<template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content !max-w-md">
        <div class="modal-header">
          <h2 class="text-xl font-display font-bold text-premium-midnight flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-premium-gold/10 flex items-center justify-center">
              <i class="fas fa-store text-premium-gold"></i>
            </div>
            Add Sales Point
          </h2>
          <button @click="$emit('close')" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-premium-midnight transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addSalePoint" id="addPointForm" class="space-y-6">
            <div class="space-y-2 text-left">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Name</label>
              <div class="relative group">
                <i class="fas fa-tag absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors"></i>
                <input type="text" v-model="newPoint.name" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all" />
              </div>
            </div>
    
            <div class="space-y-2 text-left">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Type</label>
              <div class="relative group">
                <i class="fas fa-layer-group absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors"></i>
                <select v-model="newPoint.type" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-10 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all appearance-none cursor-pointer">
                  <option value="Store">Store</option>
                  <option value="Pickup Point">Pickup Point</option>
                  <option value="Distribution Center">Distribution Center</option>
                </select>
                <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
              </div>
            </div>
    
            <div class="space-y-2 text-left">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Address</label>
              <div class="relative group">
                <i class="fas fa-map-marker-alt absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors"></i>
                <input type="text" v-model="newPoint.address" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all" />
              </div>
            </div>
    
            <div class="space-y-2 text-left">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Status</label>
              <div class="relative group">
                <i class="fas fa-check-circle absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-premium-gold transition-colors"></i>
                <select v-model="newPoint.status" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-10 text-premium-midnight focus:outline-none focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold transition-all appearance-none cursor-pointer">
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Limited Hours">Limited Hours</option>
                </select>
                <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors" @click="$emit('close')">Cancel</button>
          <button type="submit" form="addPointForm" class="flex-1 btn-gold">Add</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Swal from "sweetalert2";
  import axios from "axios";
  
  export default {
    data() {
      return {
        newPoint: {
          name: "",
          type: "Store",
          address: "",
          status: "Open"
        }
      };
    },
    methods: {
      async addSalePoint() {
        try {
          await axios.post("http://localhost:5000/api/salePoints", this.newPoint);
          Swal.fire({
            title: "Success",
            text: "Point de vente ajouté !",
            icon: "success",
            customClass: {
              popup: 'premium-swal-popup',
              title: 'premium-swal-title',
              htmlContainer: 'premium-swal-html',
              confirmButton: 'premium-swal-confirm'
            }
          });
          this.$emit("added");
          this.$emit("close");
        } catch (error) {
          console.error("Erreur lors de l'ajout :", error);
          Swal.fire({
            title: "Error",
            text: "Échec de l'ajout",
            icon: "error",
            customClass: {
              popup: 'premium-swal-popup',
              title: 'premium-swal-title',
              htmlContainer: 'premium-swal-html',
              confirmButton: 'premium-swal-confirm'
            }
          });
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Local modal styles removed to use global index.css rules */
  </style>
  