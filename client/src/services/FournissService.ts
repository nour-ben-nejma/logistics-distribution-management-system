import api from './Api';

const fournissService = {
  // Charger la liste des fournisseurs
  fetchFournisseurs() {
    return api.get('/fournisseurs/getFournisseurs');
  },

  // Récupérer un fournisseur par ID
  getFournisseur(id: string) {
    return api.get(`/fournisseurs/getFournisseur/${id}`);
  },

  // Ajouter un nouveau fournisseur
  addFournisseur(data: any) {
    return api.post('/fournisseurs/addFournisseur', data);
  },

  // Modifier un fournisseur
  updateFournisseur(id: string, data: any) {
    return api.put(`/fournisseurs/update/${id}`, data);
  },

  // Supprimer un fournisseur
  deleteFournisseur(id: string) {
    return api.delete(`/fournisseurs/deleteFournisseur/${id}`);
  }
};