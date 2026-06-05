<script setup lang="ts">
const props = defineProps<{
  totalSpend?: number;
  totalRevenue?: number;
  overallRoas?: number;
  totalConversations?: number;
  insights?: any[];
  sales?: any[];
}>();
</script>

<template>
  <div class="settings-tab placeholder-tab">
    <div class="placeholder-content">
      <i class="fa-solid fa-gear placeholder-icon"></i>
      <h2>Configuración del Espacio</h2>
      <p>Ajustes de facturación, integraciones y permisos de usuario estarán aquí.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.placeholder-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
  
  .placeholder-content {
    background: rgba(255, 255, 255, 0.02);
    border: 1px dashed rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-lg);
    padding: 4rem;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .placeholder-icon {
    font-size: 3rem;
    color: var(--color-primary);
    margin-bottom: 1.5rem;
    opacity: 0.8;
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-secondary);
    line-height: 1.5;
  }
}
</style>
