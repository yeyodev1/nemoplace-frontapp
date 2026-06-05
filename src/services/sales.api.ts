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
}

export const salesApi = new SalesApi();
