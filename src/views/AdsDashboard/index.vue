<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { metaApi } from '@/services/meta.api';
import { salesApi } from '@/services/sales.api';
import { useMetaAds } from '@/composables/useMetaAds';

import {
  DashboardSidebar,
  DashboardTopbar,
  ConnectMetaBanner,
  PagePickerModal,
  AdAccountPickerModal
} from './components';

import RegisterSaleModal from './components/RegisterSaleModal.vue';

import { useUserStore } from '@/stores/user';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// Use dynamic workspace ID, fallback to mock only for extreme edge cases
const WORKSPACE_ID = computed(() => userStore.workspaceId || '60d5ecb8b392d70015345678');

const isAuthenticated = ref(false);
const isLoading = ref(false);

const insights = ref<any[]>([]);
const sales = ref<any[]>([]);
const salesStats = ref<any>({ totalRevenue: 0, totalConversations: 0, totalSales: 0 });

const pageName = ref<string | undefined>(undefined);
const pagePictureUrl = ref<string | undefined>(undefined);
const currentMonthStr = new Date().toISOString().slice(0, 7);
const savedMonth = localStorage.getItem('dashboard_selected_month');
const selectedMonth = ref(savedMonth || currentMonthStr);

const isRegisterModalOpen = ref(false);
const isErrorModalOpen = ref(false);
const errorMessage = ref('');
const isSidebarOpen = ref(false);

const {
  isLoggingIn,
  authStep,
  availablePages,
  availableAdAccounts,
  loginWithMeta,
  selectPageAndSave,
  selectAdAccountAndSave,
  initSDK
} = useMetaAds();

const fetchDashboardData = async () => {
  isLoading.value = true;
  try {
    const [year, month] = selectedMonth.value.split('-');
    const since = `${year}-${month}-01`;
    const lastDay = new Date(Number(year), Number(month), 0).getDate();
    const until = `${year}-${month}-${lastDay}`;

    const insightsRes = await metaApi.getAdsInsights(WORKSPACE_ID.value, { since, until });
    insights.value = insightsRes.data.insights || [];
    pageName.value = insightsRes.data.pageName || undefined;
    pagePictureUrl.value = insightsRes.data.pagePictureUrl || undefined;
    isAuthenticated.value = true;

    const [salesRes, statsRes] = await Promise.all([
      salesApi.getSalesByWorkspace(WORKSPACE_ID.value),
      salesApi.getSalesStats(WORKSPACE_ID.value)
    ]);
    
    sales.value = salesRes.data.sales || [];
    salesStats.value = statsRes.data.stats || { totalRevenue: 0, totalConversations: 0, totalSales: 0 };
    
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('Meta integration')) {
      isAuthenticated.value = false;
    } else {
      console.error("Failed to load dashboard data", error);
    }
  } finally {
    isLoading.value = false;
  }
};

const handleMetaLogin = async () => {
  await loginWithMeta(WORKSPACE_ID.value);
};

const handlePageSelection = async (page: any) => {
  try {
    await selectPageAndSave(WORKSPACE_ID.value, page);
    // authStep moves to 'pick_ad_account' automatically inside useMetaAds
  } catch (err) {
    console.error('Page selection failed:', err);
  }
};

const handleAdAccountSelection = async (account: any) => {
  try {
    await selectAdAccountAndSave(WORKSPACE_ID.value, account);
    isAuthenticated.value = true;
    authStep.value = 'idle'; // Close modal
    await fetchDashboardData();
  } catch (err) {
    console.error('Ad Account selection failed:', err);
  }
};

const handleLogout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

const handleRegisterSale = async (payload: any) => {
  try {
    await salesApi.createSale({
      workspaceId: WORKSPACE_ID.value,
      ...payload
    });
    isRegisterModalOpen.value = false;
    // Recargar los datos del dashboard para reflejar la nueva venta
    await fetchDashboardData();
  } catch (error) {
    console.error('Error registrando la venta:', error);
    errorMessage.value = 'Hubo un error al registrar la venta. Por favor intenta nuevamente.';
    isErrorModalOpen.value = true;
  }
};

onMounted(() => {
  if (userStore.workspaceId) {
    fetchDashboardData();
  }
  initSDK();
});

watch(selectedMonth, (newVal) => {
  localStorage.setItem('dashboard_selected_month', newVal);
  if (isAuthenticated.value) {
    fetchDashboardData();
  }
});

watch(() => route.path, () => {
  if (isAuthenticated.value) {
    fetchDashboardData();
  }
});

watch(WORKSPACE_ID, (newId, oldId) => {
  if (newId !== oldId) {
    fetchDashboardData();
  }
});

const totalSpend = computed(() => {
  return insights.value.reduce((acc, ad) => acc + Number(ad.spend || 0), 0);
});

const overallRoas = computed(() => {
  if (totalSpend.value === 0) return 0;
  return salesStats.value.totalRevenue / totalSpend.value;
});
</script>

<template>
  <div class="dashboard-layout">
    <DashboardSidebar 
      :isOpen="isSidebarOpen"
      @close="isSidebarOpen = false"
      @logout="handleLogout" 
    />

    <main class="main-content">
      <DashboardTopbar 
        v-model:selectedDate="selectedMonth"
        :pageName="pageName"
        :pagePictureUrl="pagePictureUrl"
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
      />

      <div class="content-scroll">
        <ConnectMetaBanner 
          v-if="!isAuthenticated && !isLoading" 
          :isLoggingIn="isLoggingIn"
          @connect="handleMetaLogin" 
        />

        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando datos...</p>
        </div>

        <template v-else-if="isAuthenticated">
          <router-view 
            :totalSpend="totalSpend"
            :totalRevenue="salesStats.totalRevenue"
            :overallRoas="overallRoas"
            :totalConversations="salesStats.totalConversations"
            :insights="insights"
            :sales="sales"
            @open-register-modal="isRegisterModalOpen = true"
          />
        </template>
      </div>
    </main>

    <RegisterSaleModal 
      :isOpen="isRegisterModalOpen"
      :insights="insights"
      @close="isRegisterModalOpen = false"
      @submit="handleRegisterSale"
    />

    <PagePickerModal 
      :isOpen="authStep === 'pick_page'"
      :availablePages="availablePages"
      @close="authStep = 'idle'"
      @select-page="handlePageSelection"
    />

    <AdAccountPickerModal 
      :isOpen="authStep === 'pick_ad_account'"
      :availableAdAccounts="availableAdAccounts"
      @close="authStep = 'idle'"
      @select-account="handleAdAccountSelection"
    />

    <!-- Global Error Modal -->
    <div v-if="isErrorModalOpen" class="modal-overlay" @click.self="isErrorModalOpen = false">
      <div class="modal-content error-modal">
        <div class="error-icon">
          <i class="fa-solid fa-circle-xmark"></i>
        </div>
        <h3>Ha ocurrido un error</h3>
        <p>{{ errorMessage }}</p>
        
        <div class="modal-actions centered">
          <button type="button" class="primary-button outline" @click="isErrorModalOpen = false">Entendido</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  max-width: 100%;
  background-color: var(--bg-dark);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

.main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -150px;
    right: -150px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
}

.content-scroll {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 2rem 3rem;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 0;
  color: var(--text-secondary);
  text-align: center;

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255,255,255,0.1);
    border-radius: 50%;
    border-top-color: var(--color-primary);
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1.5rem;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .dashboard-layout {
    flex-direction: column;
  }
  .content-scroll {
    padding: 1.5rem;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content.error-modal {
  background: var(--bg-dark);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

  .error-icon {
    font-size: 3rem;
    color: #ef4444;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }

  .primary-button {
    background: transparent;
    border: 1px solid #ef4444;
    color: #ef4444;
    padding: 0.75rem 2rem;
    border-radius: var(--radius-full);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover { 
      background: rgba(239, 68, 68, 0.1);
      transform: translateY(-2px); 
    }
  }
}
</style>
