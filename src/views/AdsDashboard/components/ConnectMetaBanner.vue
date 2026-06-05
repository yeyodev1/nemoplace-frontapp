<script setup lang="ts">


const props = defineProps({
  isLoggingIn: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<{
  (e: 'connect'): void;
}>();
</script>

<template>
  <div class="connect-banner">
    <div class="banner-content">
      <h2>Desbloquea tus Estadísticas</h2>
      <p>Conecta tu cuenta de Meta Ads para ver tu ROAS en vivo y métricas de rendimiento.</p>
    </div>
    <button 
      class="btn-glow" 
      @click="emit('connect')"
      :disabled="isLoggingIn"
    >
      <span v-if="isLoggingIn"><i class="fa-solid fa-spinner fa-spin"></i> Conectando...</span>
      <span v-else>Conectar con Meta Ads</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.connect-banner {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(244, 63, 94, 0.05) 100%);
  border: 1px solid var(--border-focus);
  border-radius: var(--radius-lg);
  padding: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  animation: slideUp 0.6s ease-out forwards;

  h2 {
    font-size: 1.75rem;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: var(--text-secondary);
    margin: 0;
  }
}

.btn-glow {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-glow);
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-primary-hover);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
