import APIBase from "./httpBase";

class SalesApi extends APIBase {
  createSale(data: {
    workspaceId: string;
    amount: number;
    conversationsGenerated?: number;
    adId?: string;
    customerName?: string;
    notes?: string;
    saleDate?: string;
  }) {
    return this.post("sales", data);
  }

  getSalesByWorkspace(workspaceId: string) {
    return this.get(`sales/${workspaceId}`);
  }

  getSalesStats(workspaceId: string) {
    return this.get(`sales/${workspaceId}/stats`);
  }

  updateSale(id: string, data: any) {
    return this.put(`sales/${id}`, data);
  }

  deleteSale(id: string) {
    return this.delete(`sales/${id}`);
  }
}

export const salesApi = new SalesApi();
