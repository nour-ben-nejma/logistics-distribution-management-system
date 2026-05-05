import api from './Api';

export default {
  // Charger la liste des points de vente
  fetchSalePoints() {
    return api.get('/salepoints/getSalePoints');
  },

  // Récupérer un point de vente par ID
  getSalePoint(id: string) {
    return api.get(`/salepoints/${id}`);
  },

  // Ajouter un nouveau point de vente
  addSalePoint(data: any) {
    return api.post('/salepoints/addSalePoint', data);
  },

  // Modifier un point de vente
  updateSalePoint(id: string, data: any) {
    return api.put(`/salepoints/update/${id}`, data);
  },

  // Supprimer un point de vente
  deleteSalePoint(id: string) {
    return api.delete(`/salepoints/${id}`);
  }
};
