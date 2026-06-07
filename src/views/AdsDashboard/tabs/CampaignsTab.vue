<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  totalSpend?: number;
  totalRevenue?: number;
  overallRoas?: number;
  totalConversations?: number;
  insights: any[];
  sales?: any[];
}>();

const formatCurrency = (val: string | number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(val));
};

const formatNumber = (val: string | number) => {
  return new Intl.NumberFormat('en-US').format(Number(val));
};

const searchQuery = ref('');

const filteredInsights = computed(() => {
  if (!searchQuery.value) return props.insights;
  const q = searchQuery.value.toLowerCase();
  return props.insights.filter(ad => 
    (ad.ad_name && ad.ad_name.toLowerCase().includes(q)) || 
    (ad.campaign_name && ad.campaign_name.toLowerCase().includes(q))
  );
});
</script>

<template>
  <div class="campaigns-tab">
    <div class="tab-header">
      <div class="header-text">
        <h2>Gestión de Campañas y Anuncios</h2>
        <p>Vista detallada del rendimiento de cada anuncio activo en Meta.</p>
      </div>
      <div class="search-box">
        <i class="fa-solid fa-search search-icon"></i>
        <input type="text" v-model="searchQuery" placeholder="Buscar por nombre de campaña o anuncio..." />
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Estado</th>
            <th>Anuncio / Campaña</th>
            <th>Inversión</th>
            <th>Impresiones</th>
            <th>Clics</th>
            <th>CPC</th>
            <th>ROAS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredInsights.length === 0">
            <td colspan="7" class="empty-state">
              {{ searchQuery ? 'No se encontraron resultados para tu búsqueda.' : 'No hay anuncios activos en el rango de fechas seleccionado.' }}
            </td>
          </tr>
          <tr v-for="ad in filteredInsights" :key="ad.ad_id">
            <td>
              <span class="status-badge" :class="ad.effective_status.toLowerCase()">
                <span class="pulse" v-if="ad.effective_status === 'ACTIVE'"></span>
                {{ ad.effective_status === 'ACTIVE' ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <div class="ad-info">
                <img v-if="ad.creative_url" :src="ad.creative_url" alt="Creative" class="ad-thumbnail" />
                <div class="ad-icon-placeholder" v-else>
                  <i class="fa-solid fa-image"></i>
                </div>
                <div class="ad-names">
                  <span class="ad-name">
                    {{ ad.ad_name }}
                    <a v-if="ad.ad_link" :href="ad.ad_link" target="_blank" title="Ver Anuncio en Instagram/Facebook" class="ad-link-btn" @click.stop>
                      <i class="fa-solid fa-external-link-alt"></i>
                    </a>
                  </span>
                  <span class="campaign-name">{{ ad.campaign_name }}</span>
                </div>
              </div>
            </td>
            <td class="numeric">{{ formatCurrency(ad.spend || 0) }}</td>
            <td class="numeric">{{ formatNumber(ad.impressions || 0) }}</td>
            <td class="numeric">{{ formatNumber(ad.clicks || 0) }}</td>
            <td class="numeric">{{ formatCurrency(ad.cpc || 0) }}</td>
            <td class="numeric highlight">{{ ad.purchase_roas?.[0]?.value ? parseFloat(ad.purchase_roas[0].value).toFixed(2) + 'x' : '0.00x' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.campaigns-tab {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  p {
    color: var(--text-secondary);
    margin: 0;
  }
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 350px;

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
  }

  input {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border-radius: var(--radius-full);
    font-family: inherit;
    font-size: 0.9rem;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
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

  .numeric {
    font-variant-numeric: tabular-nums;
    font-family: 'Inter', monospace;
  }

  .highlight {
    color: var(--color-success);
    font-weight: 600;
  }

  .empty-state {
    text-align: center;
    padding: 4rem;
    color: var(--text-secondary);
  }
}

.ad-info {
  display: flex;
  align-items: center;
  gap: 1rem;

  .ad-thumbnail {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }

  .ad-icon-placeholder {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
  }

  .ad-names {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .ad-name {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: var(--text-primary);

      .ad-link-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-secondary);
        font-size: 0.75rem;
        transition: all 0.2s ease;
        text-decoration: none;

        &:hover {
          background: rgba(99, 102, 241, 0.2);
          color: var(--color-primary);
        }
      }
    }
    
    .campaign-name {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
  }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);

  &.active {
    background: rgba(16, 185, 129, 0.1);
    color: var(--color-success);
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  .pulse {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--color-success);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    animation: pulse-animation 2s infinite;
  }
}

@keyframes pulse-animation {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}
</style>
