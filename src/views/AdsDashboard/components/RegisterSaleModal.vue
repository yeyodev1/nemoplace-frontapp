<script setup lang="ts">
import { ref, computed } from 'vue';
import AdAttributionSelect from './AdAttributionSelect.vue';

const props = defineProps<{
  isOpen: boolean;
  insights: any[]; // para sacar la lista de anuncios activos
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', payload: any): void;
}>();

const amount = ref<number | ''>('');
const customerName = ref('');
const adId = ref('');
const conversationsGenerated = ref<number | ''>('');
const saleDate = ref(new Date().toISOString().slice(0, 16));
const notes = ref('');

const isSubmitting = ref(false);

const activeAds = computed(() => {
  return props.insights.filter(ad => ad.effective_status === 'ACTIVE' || ad.ad_name);
});

const handleSubmit = async () => {
  if (!amount.value || Number(amount.value) <= 0) return;
  
  isSubmitting.value = true;
  
  const payload = {
    amount: Number(amount.value),
    customerName: customerName.value,
    adId: adId.value || undefined,
    conversationsGenerated: Number(conversationsGenerated.value || 0),
    saleDate: new Date(saleDate.value).toISOString(),
    notes: notes.value
  };

  emit('submit', payload);
  
  // reset
  amount.value = '';
  customerName.value = '';
  adId.value = '';
  conversationsGenerated.value = '';
  saleDate.value = new Date().toISOString().slice(0, 16);
  notes.value = '';
  isSubmitting.value = false;
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content glass-effect">
      <button class="close-btn" @click="emit('close')">
        <i class="fa-solid fa-times"></i>
      </button>

      <div class="modal-header">
        <h2>Registrar Nueva Venta</h2>
        <p>Añade una venta manualmente y atribúyela a una campaña específica.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="register-form">
        <div class="form-row">
          <div class="form-group">
            <label>Monto de la Venta ($) *</label>
            <input type="number" v-model="amount" required min="0.01" step="0.01" placeholder="Ej. 150.00" />
          </div>
          <div class="form-group">
            <label>Cliente (Opcional)</label>
            <input type="text" v-model="customerName" placeholder="Nombre del cliente" />
          </div>
        </div>

        <div class="form-group">
          <AdAttributionSelect v-model="adId" :options="activeAds" />
          <small class="hint">Selecciona el anuncio que generó esta venta para calcular el ROAS.</small>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Conversaciones Previas</label>
            <input type="number" v-model="conversationsGenerated" min="0" placeholder="¿Cuántos chats tomó?" />
          </div>
          <div class="form-group">
            <label>Fecha de la Venta</label>
            <input type="datetime-local" v-model="saleDate" required />
          </div>
        </div>

        <div class="form-group">
          <label>Notas Adicionales</label>
          <textarea v-model="notes" rows="3" placeholder="Detalles del pedido, método de pago, etc."></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="emit('close')">Cancelar</button>
          <button type="submit" class="submit-btn" :disabled="isSubmitting || !amount">
            <span v-if="isSubmitting"><i class="fa-solid fa-circle-notch fa-spin"></i> Registrando...</span>
            <span v-else><i class="fa-solid fa-check"></i> Registrar Venta</span>
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
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: var(--bg-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  width: 100%;
  max-width: 600px;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

  &.glass-effect {
    background: rgba(23, 23, 23, 0.85);
    backdrop-filter: blur(16px);
  }
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.25rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: var(--text-primary);
  }
}

.modal-header {
  margin-bottom: 2rem;

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 0.95rem;
  }
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  input, textarea, select {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.85rem 1rem;
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-family: inherit;
    font-size: 0.95rem;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
  }
  
  select {
    width: 100%;
    appearance: none;
    cursor: pointer;
    
    option {
      background: var(--bg-dark);
      color: var(--text-primary);
    }
  }

  .hint {
    font-size: 0.75rem;
    color: var(--text-muted);
  }
}



.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;

  button {
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .cancel-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-secondary);

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
    }
  }

  .submit-btn {
    background: var(--color-primary);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover:not(:disabled) {
      background: var(--color-primary-hover);
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
