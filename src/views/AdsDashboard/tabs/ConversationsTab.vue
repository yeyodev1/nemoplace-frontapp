<script setup lang="ts">

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
</script>

<template>
  <div class="conversations-tab">
    <div class="tab-header">
      <div class="header-text">
        <h2>Bandeja de Conversaciones</h2>
        <p>Analítica de interacciones directas con tus clientes y leads.</p>
      </div>
    </div>

    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon"><i class="fa-regular fa-comments"></i></div>
        <div class="stat-info">
          <span class="stat-label">Conversaciones Generadas (Atribuidas)</span>
          <span class="stat-value">{{ formatNumber(totalConversations || 0) }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fa-solid fa-users"></i></div>
        <div class="stat-info">
          <span class="stat-label">Contactos en Base de Datos</span>
          <span class="stat-value">{{ formatNumber(sales.length) }}</span>
        </div>
      </div>
    </div>

    <div class="crm-placeholder">
      <div class="placeholder-content">
        <i class="fa-brands fa-whatsapp placeholder-icon"></i>
        <h2>Integración CRM Próximamente</h2>
        <p>Pronto podrás conectar nemoPlace con tu CRM favorito para responder mensajes de WhatsApp, Instagram y Messenger sin salir del Dashboard.</p>
        <button class="secondary-button" disabled>Conectar CRM (Próximamente)</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.conversations-tab {
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

.crm-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  
  .placeholder-content {
    background: rgba(255, 255, 255, 0.02);
    border: 1px dashed rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-lg);
    padding: 4rem;
    max-width: 600px;
    text-align: center;
    width: 100%;
  }
  
  .placeholder-icon {
    font-size: 3.5rem;
    color: #25D366; /* WhatsApp color approx */
    margin-bottom: 1.5rem;
    opacity: 0.9;
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--text-primary);
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .secondary-button {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-secondary);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-full);
    font-weight: 500;
    cursor: not-allowed;
    opacity: 0.7;
  }
}
</style>
