<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  totalSpend?: number;
  totalRevenue?: number;
  overallRoas?: number;
  totalConversations?: number;
  insights: any[];
  sales: any[];
}>();

const formatNumber = (val: string | number) => {
  return new Intl.NumberFormat('en-US').format(Number(val));
};

const formatCurrency = (val: string | number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(val));
};

interface AdAttribution {
  adId: string;
  adName: string;
  campaignName: string;
  creativeUrl?: string;
  adLink?: string;
  totalSales: number;
  metaConversations: number;
  registeredConversations: number;
  totalRevenue: number;
  customers: string[];
}

const attributionData = computed(() => {
  if (!props.sales && !props.insights) return [];

  const adMap = new Map<string, AdAttribution>();

  // Pre-llenar con los anuncios activos para asegurar que tengan nombre y conversaciones de Meta
  if (props.insights) {
    props.insights.forEach(ad => {
      // Buscar la métrica de conversaciones de Meta
      const msgAction = ad.actions?.find((a: any) => 
        a.action_type === 'onsite_conversion.messaging_conversation_started_7d' ||
        a.action_type === 'onsite_conversion.total_messaging_connection'
      );
      const metaConv = msgAction ? parseInt(msgAction.value, 10) : 0;

      adMap.set(ad.ad_id, {
        adId: ad.ad_id,
        adName: ad.ad_name || 'Desconocido',
        campaignName: ad.campaign_name || 'Desconocida',
        creativeUrl: ad.creative_url,
        adLink: ad.ad_link,
        totalSales: 0,
        metaConversations: metaConv,
        registeredConversations: 0,
        totalRevenue: 0,
        customers: []
      });
    });
  }

  // Grupo orgánico
  adMap.set('organic', {
    adId: 'organic',
    adName: 'Venta Orgánica / Sin Atribuir',
    campaignName: '-',
    totalSales: 0,
    metaConversations: 0,
    registeredConversations: 0,
    totalRevenue: 0,
    customers: []
  });

  // Grupo genérico para anuncios de WhatsApp
  adMap.set('whatsapp_ad', {
    adId: 'whatsapp_ad',
    adName: 'Anuncios de WhatsApp (General)',
    campaignName: 'Atribución General',
    totalSales: 0,
    metaConversations: 0,
    registeredConversations: 0,
    totalRevenue: 0,
    customers: []
  });

  if (props.sales) {
    props.sales.forEach(sale => {
      const key = sale.adId || 'organic';
      let group = adMap.get(key);
      
      if (!group) {
        group = {
          adId: key,
          adName: 'Anuncio Inactivo / No Encontrado',
          campaignName: '-',
          totalSales: 0,
          metaConversations: 0,
          registeredConversations: 0,
          totalRevenue: 0,
          customers: []
        };
        adMap.set(key, group);
      }

      group.totalSales += 1;
      group.registeredConversations += (sale.conversationsGenerated || 0);
      group.totalRevenue += (sale.amount || 0);
      
      if (sale.customerName) {
        group.customers.push(sale.customerName);
      } else {
        group.customers.push('Cliente Anónimo');
      }
    });
  }

  // Filtramos solo los que tienen datos y ordenamos por ventas y luego conversaciones
  return Array.from(adMap.values())
    .filter(g => g.totalSales > 0 || g.metaConversations > 0 || g.registeredConversations > 0)
    .sort((a, b) => b.totalSales !== a.totalSales ? b.totalSales - a.totalSales : b.metaConversations - a.metaConversations);
});

const expandedRow = ref<string | null>(null);

const toggleExpand = (adId: string) => {
  if (expandedRow.value === adId) {
    expandedRow.value = null;
  } else {
    expandedRow.value = adId;
  }
};
</script>

<template>
  <div class="conversations-tab">
    <div class="tab-header">
      <div class="header-text">
        <h2>Bandeja y Atribución</h2>
        <p>Analítica de interacciones directas y atribución de clientes por anuncio.</p>
      </div>
    </div>

    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon"><i class="fa-brands fa-meta"></i></div>
        <div class="stat-info">
          <span class="stat-label">Conversaciones (Reportadas por Meta)</span>
          <span class="stat-value">{{ formatNumber(totalConversations || 0) }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fa-solid fa-users"></i></div>
        <div class="stat-info">
          <span class="stat-label">Contactos / Ventas (CRM)</span>
          <span class="stat-value">{{ formatNumber(sales?.length || 0) }}</span>
        </div>
      </div>
    </div>

    <div class="attribution-section">
      <div class="section-header">
        <h3>Atribución por Anuncio</h3>
        <p>Descubre cuántos contactos vinieron de cada anuncio y quiénes son.</p>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Campaña / Anuncio</th>
              <th>Ventas (CRM)</th>
              <th>Conversaciones (Meta)</th>
              <th>Ingresos Generados</th>
              <th>Ver Clientes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="attributionData.length === 0">
              <td colspan="5" class="empty-state">
                <i class="fa-solid fa-chart-pie empty-icon"></i>
                <p>No hay datos de atribución disponibles todavía.</p>
              </td>
            </tr>
            <template v-for="group in attributionData" :key="group.adId">
              <tr class="main-row" @click="toggleExpand(group.adId)">
                <td>
                  <div class="ad-info">
                    <div v-if="group.creativeUrl" class="ad-creative-thumbnail">
                      <img :src="group.creativeUrl" :alt="group.adName" />
                    </div>
                    <span v-else class="ad-badge" :class="group.adId === 'organic' ? 'organic' : (group.adId === 'whatsapp_ad' ? 'whatsapp-ad' : 'meta-ad')">
                      <i :class="group.adId === 'organic' ? 'fa-solid fa-seedling' : (group.adId === 'whatsapp_ad' ? 'fa-brands fa-whatsapp' : 'fa-brands fa-meta')"></i>
                    </span>
                    <div class="ad-names">
                      <span class="campaign">{{ group.campaignName }}</span>
                      <span class="ad">
                        {{ group.adName }}
                        <a v-if="group.adLink" :href="group.adLink" target="_blank" title="Ver Anuncio en Instagram/Facebook" class="ad-link-btn" @click.stop>
                          <i class="fa-solid fa-external-link-alt"></i>
                        </a>
                      </span>
                    </div>
                  </div>
                </td>
                <td class="highlight-val">{{ formatNumber(group.totalSales) }}</td>
                <td class="meta-val">
                  <span v-if="group.adId === 'organic'">-</span>
                  <span v-else>{{ formatNumber(group.metaConversations) }}</span>
                </td>
                <td class="revenue-val">{{ formatCurrency(group.totalRevenue) }}</td>
                <td>
                  <button class="expand-btn" :class="{ active: expandedRow === group.adId }">
                    <i class="fa-solid fa-chevron-down"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="expandedRow === group.adId" class="expanded-row">
                <td colspan="5">
                  <div class="customers-list">
                    <template v-if="group.customers.length > 0">
                      <h4><i class="fa-solid fa-users"></i> Clientes atribuidos a este anuncio:</h4>
                      <div class="tags-container">
                        <span v-for="(customer, idx) in group.customers" :key="idx" class="customer-tag">
                          {{ customer }}
                        </span>
                      </div>
                    </template>
                    <template v-else>
                      <p class="no-customers"><i class="fa-solid fa-circle-info"></i> Meta reporta conversaciones, pero aún no has registrado ventas manuales para este anuncio.</p>
                    </template>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <div class="crm-integration-card">
      <div class="card-content">
        <div class="icon-wrapper">
          <i class="fa-solid fa-users-viewfinder crm-icon"></i>
        </div>
        <div class="text-content">
          <h2>Gestiona tus Prospectos</h2>
          <p>Revisa todas tus conversaciones, administra tus leads y responde mensajes (WhatsApp, Instagram, Messenger) directamente desde tu CRM avanzado.</p>
        </div>
        <a href="https://crm.bakano.ec" target="_blank" class="btn-glow crm-button">
          Abrir CRM <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.conversations-tab {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 0.3s ease;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

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

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;

  .stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    background: rgba(99, 102, 241, 0.1);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }

  .stat-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .stat-label {
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 500;
    }

    .stat-value {
      color: var(--text-primary);
      font-size: 1.5rem;
      font-weight: 700;
    }
  }
}

/* Attribution Table Section */
.attribution-section {
  background: var(--bg-surface);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .section-header {
    h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }
    p {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
  }
}

.table-container {
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
}

.data-table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 1rem 1.25rem;
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

  .main-row {
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.03);
    }
  }
}

.ad-info {
  display: flex;
  align-items: center;
  gap: 1rem;

  .ad-creative-thumbnail {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .ad-badge {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;

    &.meta-ad {
      background: rgba(6, 104, 225, 0.15);
      color: #4facfe;
    }

    &.whatsapp-ad {
      background: rgba(37, 211, 102, 0.15);
      color: #25D366;
    }

    &.organic {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
    }
  }

  .ad-names {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;

    .campaign {
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .ad {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
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
  }
}

.highlight-val {
  font-weight: 700;
  font-size: 1.1rem;
}

.revenue-val {
  font-weight: 600;
  color: #10b981;
}

.expand-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
  }

  &.active {
    transform: rotate(180deg);
  }
}

.expanded-row {
  background: rgba(0, 0, 0, 0.15);
  
  td {
    padding: 0;
    border-bottom: 2px solid rgba(255, 255, 255, 0.05);
  }

  .customers-list {
    padding: 1.5rem 2.5rem;
    
    h4 {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;

      .customer-tag {
        background: rgba(99, 102, 241, 0.1);
        border: 1px solid rgba(99, 102, 241, 0.2);
        color: var(--text-primary);
        padding: 0.4rem 1rem;
        border-radius: var(--radius-full);
        font-size: 0.85rem;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;

        &::before {
          content: "\f007";
          font-family: "Font Awesome 6 Free";
          font-weight: 900;
          color: var(--color-primary);
        }
      }
    }
  }
}

.empty-state {
  text-align: center;
  padding: 3rem !important;
  color: var(--text-secondary);

  .empty-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
}

/* CRM Integration Card */
.crm-integration-card {
  margin-top: 1rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(99, 102, 241, 0.4);
  }

  .card-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
    }
  }

  .icon-wrapper {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);

    .crm-icon {
      font-size: 1.8rem;
      color: white;
    }
  }

  .text-content {
    flex: 1;

    h2 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    p {
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.5;
      font-size: 0.95rem;
    }
  }

  .crm-button {
    text-decoration: none;
    background: var(--color-primary);
    color: white;
    padding: 1rem 2rem;
    border-radius: var(--radius-full);
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    white-space: nowrap;
    box-shadow: var(--shadow-glow);
    transition: all 0.3s ease;

    &:hover {
      background: var(--color-primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
