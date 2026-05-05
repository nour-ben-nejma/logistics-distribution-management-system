import api from './Api';

const warehouseService = {
  getInternalDepots(params: any) {
    return api.get('/warehouse/getInternalDepots', { params });
  }
};

export default warehouseService;
