<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  modelValue: string;
  options: any[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
}>();

const isOpen = ref(false);
const searchQuery = ref('');
const dropdownRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  const q = searchQuery.value.toLowerCase();
  return props.options.filter(ad => 
    (ad.ad_name && ad.ad_name.toLowerCase().includes(q)) || 
    (ad.campaign_name && ad.campaign_name.toLowerCase().includes(q))
  );
});

const selectedLabel = computed(() => {
  if (!props.modelValue) return null;
  const ad = props.options.find(a => a.ad_id === props.modelValue);
  return ad ? ad : null;
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    // Focus search input after opening
    setTimeout(() => {
      searchInputRef.value?.focus();
    }, 50);
  } else {
    searchQuery.value = '';
  }
};

const closeDropdown = () => {
  isOpen.value = false;
  searchQuery.value = '';
};

const selectOption = (id: string) => {
  emit('update:modelValue', id);
  closeDropdown();
};

const openCreative = (url: string) => {
  if (url) {
    window.open(url, '_blank');
  }
};

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="ad-attribution-select" ref="dropdownRef">
    <label class="select-label">Anuncio de Origen (Atribución)</label>
    
    <!-- Trigger -->
    <div 
      class="select-trigger" 
      :class="{ 'is-active': isOpen }" 
      @click="toggleDropdown"
      role="button"
      tabindex="0"
    >
      <div class="trigger-content">
        <!-- If Organic (empty adId) -->
        <div class="selection-item organic" v-if="!modelValue">
          <div class="icon-wrapper organic-icon">
            <i class="fa-solid fa-leaf"></i>
          </div>
          <div class="texts">
            <span class="main-text">Venta Orgánica / Sin Atribuir</span>
            <span class="sub-text">Tráfico libre o recomendación</span>
          </div>
        </div>

        <!-- If Meta Ad -->
        <div class="selection-item meta" v-else-if="selectedLabel">
          <div class="icon-wrapper meta-icon" :class="{ 'has-image': selectedLabel.creative_url }">
            <img v-if="selectedLabel.creative_url" :src="selectedLabel.creative_url" alt="Ad Thumbnail" class="ad-thumbnail" />
            <i v-else class="fa-brands fa-meta"></i>
          </div>
          <div class="texts">
            <span class="sub-text">Campaña: <strong>{{ selectedLabel.campaign_name }}</strong></span>
            <span class="main-text">Anuncio: {{ selectedLabel.ad_name }}</span>
          </div>
          <button 
            v-if="selectedLabel.creative_url" 
            class="view-ad-btn" 
            @click.stop="openCreative(selectedLabel.creative_url)"
            title="Ver creatividad del anuncio"
          >
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </button>
        </div>
      </div>
      
      <div class="trigger-actions">
        <i class="fa-solid fa-chevron-down chevron" :class="{ 'rotate': isOpen }"></i>
      </div>
    </div>

    <!-- Dropdown Menu -->
    <transition name="fade-slide">
      <div class="dropdown-menu" v-if="isOpen">
        <div class="search-container">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            ref="searchInputRef"
            placeholder="Buscar campaña o anuncio..." 
            class="search-input"
            @click.stop
          />
        </div>

        <div class="options-list">
          <!-- Organic Option (Always at top) -->
          <div 
            class="option-item organic-option" 
            :class="{ 'is-selected': !modelValue }"
            @click="selectOption('')"
          >
            <div class="icon-wrapper organic-icon">
              <i class="fa-solid fa-leaf"></i>
            </div>
            <div class="texts">
              <span class="main-text">Venta Orgánica / Sin Atribuir</span>
              <span class="sub-text">El cliente llegó por su cuenta</span>
            </div>
            <div class="check-indicator" v-if="!modelValue">
              <i class="fa-solid fa-check"></i>
            </div>
          </div>

          <div class="divider" v-if="filteredOptions.length > 0">
            <span>Campañas de Meta Ads</span>
          </div>

          <!-- Meta Ads Options -->
          <div 
            v-for="ad in filteredOptions" 
            :key="ad.ad_id"
            class="option-item meta-option"
            :class="{ 'is-selected': modelValue === ad.ad_id }"
            @click="selectOption(ad.ad_id)"
          >
            <div class="icon-wrapper meta-icon" :class="{ 'has-image': ad.creative_url }">
              <img v-if="ad.creative_url" :src="ad.creative_url" alt="Ad Thumbnail" class="ad-thumbnail" />
              <i v-else class="fa-brands fa-meta"></i>
            </div>
            <div class="texts">
              <span class="sub-text">Campaña: <strong>{{ ad.campaign_name }}</strong></span>
              <span class="main-text">Anuncio: {{ ad.ad_name }}</span>
            </div>
            <div class="check-indicator" v-if="modelValue === ad.ad_id">
              <i class="fa-solid fa-check"></i>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-state" v-if="filteredOptions.length === 0 && searchQuery">
            <i class="fa-regular fa-face-frown"></i>
            <p>No se encontraron resultados para "{{ searchQuery }}"</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.ad-attribution-select {
  position: relative;
  width: 100%;
  font-family: 'Inter', sans-serif;
}

.select-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

/* TRIGGER */
.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.2);
  }

  &.is-active {
    background: rgba(99, 102, 241, 0.05);
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
}

.trigger-actions {
  color: var(--text-muted);
  display: flex;
  align-items: center;

  .chevron {
    transition: transform 0.3s ease;
    font-size: 0.85rem;
    
    &.rotate {
      transform: rotate(180deg);
      color: var(--color-primary);
    }
  }
}

/* SELECTION ITEMS (Trigger & Options) */
.selection-item, .option-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.icon-wrapper {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
  overflow: hidden;
  
  &.organic-icon {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }
  
  &.meta-icon {
    background: rgba(24, 119, 242, 0.15);
    color: #1877F2;
    border: 1px solid rgba(24, 119, 242, 0.2);
    
    &.has-image {
      padding: 0;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  .ad-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.view-ad-btn {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(99, 102, 241, 0.15);
    color: var(--color-primary);
    border-color: rgba(99, 102, 241, 0.3);
  }
}

.texts {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  overflow: hidden;

  .main-text {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sub-text {
    font-size: 0.75rem;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    strong {
      color: rgba(255, 255, 255, 0.85);
      font-weight: 500;
    }
  }
}

/* DROPDOWN MENU */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: #1e1e24; /* Dark solid surface */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0,0,0,0.5);
  z-index: 9999;
  overflow: hidden;
}

.search-container {
  position: relative;
  padding: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);

  .search-icon {
    position: absolute;
    left: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .search-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 0.9rem;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--color-primary);
    }
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
  }
}

.options-list {
  max-height: 280px;
  overflow-y: auto;
  padding: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.divider {
  padding: 1rem 0.75rem 0.5rem;
  
  span {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    font-weight: 700;
  }
}

.option-item {
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  &.is-selected {
    background: rgba(99, 102, 241, 0.08);
    
    .texts .main-text {
      color: var(--color-primary);
    }
  }

  .check-indicator {
    margin-left: auto;
    color: var(--color-primary);
    font-size: 1.1rem;
    animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
}

.empty-state {
  padding: 2.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--text-secondary);
  text-align: center;

  i {
    font-size: 2.5rem;
    opacity: 0.5;
  }

  p {
    font-size: 0.9rem;
  }
}

/* ANIMATIONS */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
