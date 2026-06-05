<script setup lang="ts">
import { ref, computed } from 'vue';


const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  availablePages: {
    type: Array as () => any[],
    required: true
  }
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'select-page', page: any): void;
}>();

const searchQuery = ref('');

const normalizeText = (text: string) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const filteredPages = computed(() => {
  if (!searchQuery.value) return props.availablePages;
  const q = normalizeText(searchQuery.value);
  return props.availablePages.filter((page: any) => 
    normalizeText(page.name).includes(q) || page.id.includes(q)
  );
});
</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Selecciona la Página a Vincular</h3>
        </div>
        
        <div class="search-container">
          <i class="fa-solid fa-search search-icon"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar página por nombre o ID..." 
            class="search-input"
          />
        </div>

        <div class="page-list">
          <div 
            v-for="page in filteredPages" 
            :key="page.id" 
            class="page-item"
            @click="emit('select-page', page)"
          >
            <img
              v-if="page.picture?.data?.url"
              :src="page.picture.data.url"
              :alt="page.name"
              class="page-avatar"
            />
            <div v-else class="page-avatar-placeholder">
              <i class="fa-solid fa-flag"></i>
            </div>
            <div class="page-info">
              <strong>{{ page.name }}</strong>
              <span>ID: {{ page.id }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-outline" @click="emit('close')">Cancelar</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 500px;
  box-shadow: var(--shadow-glass);
  overflow: hidden;
  animation: fadeUp 0.3s ease-out forwards;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-light);
  
  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }
}

.search-container {
  padding: 1rem 1.5rem 0;
  position: relative;
  
  .search-icon {
    position: absolute;
    left: 2.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
    margin-top: 0.5rem; /* adjust for top padding */
  }

  .search-input {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 2.5rem;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-size: 0.95rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      background: rgba(0, 0, 0, 0.3);
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
  }
}

.page-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 200px; /* To prevent modal jumping too much */

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
  }
}

.page-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.2s;
  border: 1px solid transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    border-color: var(--border-light);
  }

  .page-avatar, .page-avatar-placeholder {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }

  .page-avatar-placeholder {
    background: rgba(99, 102, 241, 0.1);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
  }

  .page-info {
    display: flex;
    flex-direction: column;

    strong {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    span {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-top: 0.25rem;
    }
  }
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: flex-end;
  background: rgba(0,0,0,0.2);

  .btn-outline {
    background: transparent;
    border: 1px solid var(--border-light);
    color: var(--text-primary);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-weight: 500;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}
</style>
