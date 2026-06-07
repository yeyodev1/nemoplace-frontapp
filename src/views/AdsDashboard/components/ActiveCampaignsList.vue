<script setup lang="ts">
const props = defineProps({
  insights: {
    type: Array as () => any[],
    required: true
  },
  sales: {
    type: Array as () => any[],
    default: () => []
  }
});

const getAdStats = (adId: string) => {
  let salesAmount = 0;
  if (props.sales) {
    props.sales.forEach(s => {
      if (s.adId === adId) salesAmount += (s.amount || 0);
    });
  }
  return salesAmount;
};

const getMetaConversations = (ad: any) => {
  const msgAction = ad.actions?.find((a: any) => 
    a.action_type === 'onsite_conversion.messaging_conversation_started_7d' ||
    a.action_type === 'onsite_conversion.total_messaging_connection'
  );
  return msgAction ? parseInt(msgAction.value, 10) : 0;
};
</script>

<template>
  <section class="campaigns-section">
    <div class="section-header">
      <h2>Campañas Activas</h2>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Anuncio / Campaña</th>
            <th>Inversión</th>
            <th>Ventas (CRM)</th>
            <th>ROAS</th>
            <th>Impresiones</th>
            <th>Conversaciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="insights.length === 0">
            <td colspan="6" class="empty-state">
              <i class="fa-solid fa-chart-column empty-icon"></i>
              <p>No se encontraron campañas activas en este periodo.</p>
            </td>
          </tr>
          <tr v-for="ad in insights" :key="ad.ad_id">
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
            <td class="numeric">${{ Number(ad.spend || 0).toFixed(2) }}</td>
            <td class="numeric highlight-success">${{ getAdStats(ad.ad_id).toFixed(2) }}</td>
            <td class="numeric highlight-primary">{{ Number(ad.purchase_roas?.[0]?.value || 0).toFixed(2) }}x</td>
            <td class="numeric">{{ Number(ad.impressions || 0).toLocaleString() }}</td>
            <td class="numeric">{{ getMetaConversations(ad).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.campaigns-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h2 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
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

  .highlight-success {
    color: var(--color-success);
    font-weight: 600;
  }

  .highlight-primary {
    color: var(--color-primary-hover);
    font-weight: 600;
  }

  .empty-state {
    text-align: center;
    padding: 4rem;
    color: var(--text-secondary);
    
    .empty-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }
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
</style>
