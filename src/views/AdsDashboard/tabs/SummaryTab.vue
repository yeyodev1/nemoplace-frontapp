<script setup lang="ts">
import DashboardStatsGrid from '../components/DashboardStatsGrid.vue';
import DashboardCharts from '../components/DashboardCharts.vue';
import ActiveCampaignsList from '../components/ActiveCampaignsList.vue';

const props = defineProps<{
  totalSpend: number;
  totalRevenue: number;
  overallRoas: number;
  totalConversations: number;
  insights: any[];
  sales?: any[];
}>();

const emit = defineEmits<{
  (e: 'open-register-modal'): void;
}>();

const formatCurrency = (val: string | number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(val));
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', { 
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const getAdName = (adId: string) => {
  if (!adId) return 'Venta Orgánica';
  const ad = props.insights.find(i => i.ad_id === adId);
  return ad ? ad.ad_name : 'Anuncio Desconocido';
};

const getAdLink = (adId: string) => {
  if (!adId) return null;
  const ad = props.insights.find(i => i.ad_id === adId);
  return ad ? ad.ad_link : null;
};
</script>

<template>
  <div class="summary-tab">
    <DashboardStatsGrid 
      :totalSpend="totalSpend"
      :totalRevenue="totalRevenue"
      :overallRoas="overallRoas"
      :totalConversations="totalConversations"
    />
    
    <DashboardCharts :insights="insights" :sales="sales" />

    <ActiveCampaignsList :insights="insights" :sales="sales" />

    <div class="sales-history-section">
      <div class="section-header">
        <div class="header-text">
          <h2>Historial de Ventas</h2>
          <p>Registro de ventas recientes atribuidas a campañas o canales orgánicos.</p>
        </div>
        <button class="primary-button" @click="emit('open-register-modal')">
          <i class="fa-solid fa-plus"></i> Registrar Venta
        </button>
      </div>

      <div v-if="!sales || sales.length === 0" class="empty-state-card">
        <div class="empty-icon">
          <i class="fa-solid fa-receipt"></i>
        </div>
        <h3>Aún no tienes ventas registradas</h3>
        <p>Comienza a medir el retorno real de tu inversión (ROAS) vinculando tus ventas a los anuncios que las generaron.</p>
        <button class="primary-button" @click="emit('open-register-modal')">
          <i class="fa-solid fa-plus"></i> Registrar mi primera venta
        </button>
      </div>

      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Anuncio de Origen</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in sales" :key="sale._id">
              <td class="date-cell">{{ formatDate(sale.saleDate) }}</td>
              <td class="customer-cell">{{ sale.customerName || 'Cliente Anónimo' }}</td>
              <td class="numeric highlight">{{ formatCurrency(sale.amount) }}</td>
              <td>
                <span class="ad-source-badge" :class="{ 'organic': !sale.adId }">
                  <i class="fa-brands fa-meta" v-if="sale.adId"></i>
                  <i class="fa-solid fa-leaf" v-else></i>
                  {{ getAdName(sale.adId) }}
                </span>
                <a v-if="sale.adId && getAdLink(sale.adId)" :href="getAdLink(sale.adId)" target="_blank" class="table-ad-link" title="Ver Anuncio en Instagram/Facebook" @click.stop>
                  <i class="fa-solid fa-external-link-alt"></i>
                </a>
              </td>
              <td class="notes-cell">{{ sale.notes || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.summary-tab {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sales-history-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  p {
    color: var(--text-secondary);
    margin: 0;
    font-size: 0.9rem;
  }

  .primary-button {
    background: var(--color-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-full);
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    
    &:hover {
      background: var(--color-primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
    }
  }
}

.table-container {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th {
    padding: 1rem 1.5rem;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
  }

  td {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    vertical-align: middle;
  }

  tbody tr {
    transition: background 0.2s ease;
    &:hover {
      background: rgba(255, 255, 255, 0.03);
    }
  }

  .date-cell {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .customer-cell {
    font-weight: 600;
    color: var(--text-primary);
  }

  .numeric {
    font-variant-numeric: tabular-nums;
    font-family: 'Inter', monospace;
  }

  .highlight {
    color: var(--color-success);
    font-weight: 600;
  }

  .notes-cell {
    color: var(--text-secondary);
    font-size: 0.85rem;
    max-width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.empty-state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: 4rem 2rem;
  text-align: center;
  margin-top: 0.5rem;

  .empty-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(99, 102, 241, 0.1);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-secondary);
    max-width: 400px;
    margin-bottom: 2rem;
    line-height: 1.5;
  }

  .primary-button {
    background: transparent;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-full);
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(99, 102, 241, 0.1);
      transform: translateY(-2px);
    }
  }
}

.ad-source-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-primary);
  border: 1px solid rgba(99, 102, 241, 0.2);

  &.organic {
    background: rgba(16, 185, 129, 0.1);
    color: var(--color-success);
    border-color: rgba(16, 185, 129, 0.2);
  }
}

.table-ad-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  font-size: 0.8rem;
  transition: all 0.2s ease;
  text-decoration: none;
  margin-left: 0.5rem;
  vertical-align: middle;

  &:hover {
    background: rgba(99, 102, 241, 0.2);
    color: var(--color-primary);
  }
}
</style>
