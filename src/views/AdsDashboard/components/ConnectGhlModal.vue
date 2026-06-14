<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isConnecting: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'connect', payload: { locationId: string, apiKey: string }): void;
}>();

const locationId = ref('');
const apiKey = ref('');

const handleSubmit = () => {
  if (!locationId.value || !apiKey.value) return;
  emit('connect', { locationId: locationId.value, apiKey: apiKey.value });
};

const close = () => {
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Conectar Go High Level</h3>
        <button class="close-btn" @click="close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="connect-form">
        <p class="description">Ingresa las credenciales de Go High Level (PIT) para sincronizar tus prospectos de anuncios.</p>
        
        <div class="form-group">
          <label>Location ID</label>
          <input 
            v-model="locationId" 
            type="text" 
            placeholder="ej. ntPHdjfB5Ip2QRxy9lRl" 
            required 
            :disabled="isConnecting"
          />
        </div>

        <div class="form-group">
          <label>Private Integration Token (API Key)</label>
          <input 
            v-model="apiKey" 
            type="password" 
            placeholder="ej. pit-2b4c3b1e-..." 
            required 
            :disabled="isConnecting"
          />
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="close" :disabled="isConnecting">Cancelar</button>
          <button type="submit" class="btn-glow" :disabled="isConnecting || !locationId || !apiKey">
            <span v-if="isConnecting"><i class="fa-solid fa-spinner fa-spin"></i> Conectando...</span>
            <span v-else>Conectar GHL</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

.modal-content {
  background: var(--bg-dark);
  border: 1px solid var(--border-focus);
  border-radius: var(--radius-lg);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h3 { margin: 0; }
  .close-btn {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    &:hover { color: var(--text-primary); }
  }
}

.description {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.5rem;
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: var(--text-secondary);
  }
  input {
    width: 100%;
    background: rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.1);
    color: white;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
    &:disabled {
      opacity: 0.5;
    }
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;

  .btn-cancel {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    color: var(--text-primary);
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-md);
    cursor: pointer;
    &:hover:not(:disabled) { background: rgba(255,255,255,0.05); }
  }

  .btn-glow {
    background: var(--color-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    &:hover:not(:disabled) { transform: translateY(-1px); }
    &:disabled { opacity: 0.7; cursor: not-allowed; }
  }
}
</style>
