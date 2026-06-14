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

const emit = defineEmits<{
  (e: 'open-register-modal'): void;
  (e: 'edit-sale', sale: any): void;
  (e: 'delete-sale', id: string): void;
}>();

const formatCurrency = (val: string | number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(val));
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

const searchQuery = ref('');

const getAdName = (adId: string) => {
  if (!adId) return 'Venta Orgánica';
  const ad = props.insights.find(a => a.ad_id === adId);
  if (ad) {
    return `${ad.campaign_name} - ${ad.ad_name}`;
  }
  return 'Anuncio Desconocido';
};

const filteredSales = computed(() => {
  if (!props.sales) return [];
  if (!searchQuery.value) return props.sales;
  const q = searchQuery.value.toLowerCase();
  return props.sales.filter(sale => 
    (sale.customerName && sale.customerName.toLowerCase().includes(q)) || 
    (sale.notes && sale.notes.toLowerCase().includes(q))
  );
});

const handleDelete = (id: string) => {
  if (confirm('¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.')) {
    emit('delete-sale', id);
  }
};
</script>

<template>
  <div class="sales-tab">
    <div class="tab-header">
      <div class="header-text">
        <h2>Registro de Ventas</h2>
        <p>Historial de ventas y cálculo de ROAS (Return On Ad Spend).</p>
      </div>
      
      <div class="header-actions">
        <div class="search-box">
          <i class="fa-solid fa-search search-icon"></i>
          <input type="text" v-model="searchQuery" placeholder="Buscar por cliente..." />
        </div>
        <button class="primary-button" @click="emit('open-register-modal')">
          <i class="fa-solid fa-plus"></i> Registrar Venta
        </button>
      </div>
    </div>

    <div class="summary-cards">
      <div class="metric-card highlight-card">
        <div class="metric-icon">
          <i class="fa-solid fa-sack-dollar"></i>
        </div>
        <div class="metric-info">
          <h3>Total Ventas</h3>
          <div class="metric-value">{{ formatCurrency(totalRevenue || 0) }}</div>
        </div>
      </div>

      <div class="metric-card highlight-card">
        <div class="metric-icon">
          <i class="fa-solid fa-chart-line"></i>
        </div>
        <div class="metric-info">
          <h3>ROAS Global</h3>
          <div class="metric-value">{{ (overallRoas || 0).toFixed(2) }}x</div>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">
          <i class="fa-solid fa-comments"></i>
        </div>
        <div class="metric-info">
          <h3>Conversaciones</h3>
          <div class="metric-value">{{ totalConversations || 0 }}</div>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Origen</th>
            <th>Monto</th>
            <th>Conversaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredSales.length === 0">
            <td colspan="6" class="empty-state">
              <div class="empty-icon"><i class="fa-solid fa-cash-register"></i></div>
              <h3>No hay ventas registradas</h3>
              <p>Aún no se han registrado ventas. Usa el botón "Registrar Venta" para comenzar.</p>
            </td>
          </tr>
          <tr v-else v-for="sale in filteredSales" :key="sale._id">
            <td>{{ formatDate(sale.saleDate) }}</td>
            <td>
              <div class="customer-info">
                <span class="customer-name">{{ sale.customerName || 'Cliente Anónimo' }}</span>
                <span class="customer-notes" v-if="sale.notes">{{ sale.notes }}</span>
              </div>
            </td>
            <td>
              <span class="origin-badge" :class="sale.adId ? 'meta-ad' : 'organic'">
                <i :class="sale.adId ? 'fa-brands fa-meta' : 'fa-solid fa-seedling'"></i>
                {{ getAdName(sale.adId) }}
              </span>
            </td>
            <td class="amount-cell">{{ formatCurrency(sale.amount) }}</td>
            <td>{{ sale.conversationsGenerated || '-' }}</td>
            <td class="actions-cell">
              <button class="action-btn edit-btn" @click="emit('edit-sale', sale)" title="Editar">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="action-btn delete-btn" @click="handleDelete(sale._id)" title="Eliminar">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sales-tab {
  animation: fadeIn 0.3s ease;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }
  
  p {
    color: var(--text-secondary);
    font-size: 0.95rem;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  width: 250px;
  
  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
  }
  
  input {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border-radius: var(--radius-full);
    color: var(--text-primary);
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      background: rgba(255, 255, 255, 0.08);
      width: 280px;
    }
  }
}

.primary-button {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-primary-hover);
    transform: translateY(-2px);
  }
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: var(--bg-surface);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.1);
  }

  &.highlight-card {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.02) 100%);
    border-color: rgba(99, 102, 241, 0.2);
    
    .metric-icon {
      background: rgba(99, 102, 241, 0.2);
      color: var(--color-primary);
    }
    
    .metric-value {
      color: var(--color-primary);
    }
  }
}

.metric-icon {
  width: 54px;
  height: 54px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.metric-info {
  h3 {
    font-size: 0.85rem;
    color: var(--text-secondary);
    font-weight: 500;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .metric-value {
    font-size: 1.5rem;
    font-weight: 700;
  }
}

.table-container {
  background: var(--bg-surface);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-xl);
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  th {
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: rgba(0, 0, 0, 0.2);
  }
  
  tr:last-child td {
    border-bottom: none;
  }

  tbody tr {
    transition: background-color 0.2s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.02);
    }
  }
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  
  .customer-name {
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .customer-notes {
    font-size: 0.8rem;
    color: var(--text-secondary);
    max-width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.origin-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
  
  &.meta-ad {
    background: rgba(6, 104, 225, 0.15);
    color: #4facfe;
  }
  
  &.organic {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }
}

.amount-cell {
  font-weight: 600;
  color: var(--color-primary);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem !important;
  color: var(--text-secondary);
  
  .empty-icon {
    font-size: 3rem;
    color: rgba(255, 255, 255, 0.1);
    margin-bottom: 1rem;
  }
  
  h3 {
    color: var(--text-primary);
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .search-box {
    width: 100%;
    
    input:focus {
      width: 100%;
    }
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
