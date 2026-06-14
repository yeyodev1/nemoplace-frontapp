import { ref } from 'vue';
import { ghlApi } from '@/services/ghl.api';

export function useGhl() {
  const isConnecting = ref(false);
  const isFetchingLeads = ref(false);
  const leads = ref<any[]>([]);

  const connectGhl = async (workspaceId: string, locationId: string, apiKey: string) => {
    isConnecting.value = true;
    try {
      await ghlApi.saveIntegration(workspaceId, locationId, apiKey);
    } finally {
      isConnecting.value = false;
    }
  };

  const removeGhl = async (workspaceId: string) => {
    try {
      await ghlApi.removeIntegration(workspaceId);
    } catch (e) {
      console.error('Error removing GHL integration', e);
    }
  };

  const fetchAdLeads = async (workspaceId: string) => {
    isFetchingLeads.value = true;
    try {
      const response = await ghlApi.getAdLeads(workspaceId);
      leads.value = response.data.leads || [];
    } catch (e) {
      console.error('Error fetching GHL leads', e);
      leads.value = [];
    } finally {
      isFetchingLeads.value = false;
    }
  };

  return {
    isConnecting,
    isFetchingLeads,
    leads,
    connectGhl,
    removeGhl,
    fetchAdLeads
  };
}
