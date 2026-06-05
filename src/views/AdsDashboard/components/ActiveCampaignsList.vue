<script setup lang="ts">
import AdMetricsCard from '@/components/ads/AdMetricsCard.vue';

const props = defineProps({
  insights: {
    type: Array as () => any[],
    required: true
  }
});
</script>

<template>
  <section class="campaigns-section">
    <div class="section-header">
      <h2>Campañas Activas</h2>
      <button class="btn-outline">Filtrar</button>
    </div>
    
    <div class="cards-container">
      <AdMetricsCard 
        v-for="(ad, index) in insights" 
        :key="ad.ad_id"
        :adName="ad.ad_name"
        :creativeUrl="ad.creative_url"
        :spend="Number(ad.spend)"
        :impressions="Number(ad.impressions)"
        :clicks="Number(ad.clicks)"
        :conversations="0" 
        :salesAmount="0" 
        :roas="Number(ad.purchase_roas?.[0]?.value || 0)"
        class="staggered-entry"
        :style="`animation-delay: ${0.5 + (index * 0.1)}s`"
      />
      <div v-if="insights.length === 0" class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-chart-column"></i></div>
        <h3>No se encontraron campañas activas</h3>
        <p>Intenta ajustar el rango de fechas o lanza una nueva campaña en Meta Ads.</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.campaigns-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    h2 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }

    .btn-outline {
      background: transparent;
      border: 1px solid var(--border-light);
      color: var(--text-primary);
      padding: 0.5rem 1.25rem;
      border-radius: var(--radius-full);
      font-size: 0.9rem;
      cursor: pointer;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }

  .cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.5rem;
  }
}

.staggered-entry {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 0;
  color: var(--text-secondary);
  text-align: center;
  grid-column: 1 / -1;

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  h3 {
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
  }
}

@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}
</style>
