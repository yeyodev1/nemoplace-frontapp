<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  pageName?: string;
  pagePictureUrl?: string;
  selectedDate: string;
}>();

const emit = defineEmits<{
  (e: 'update:selectedDate', value: string): void;
  (e: 'toggle-sidebar'): void;
}>();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectMonth = (val: string) => {
  emit('update:selectedDate', val);
  isOpen.value = false;
};

// Generate last 12 months
const monthOptions = computed(() => {
  const options = [];
  const formatter = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
  const today = new Date();
  
  for (let i = 0; i < 12; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = formatter.format(d);
    // capitalize first letter
    const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
    
    options.push({ value, label: capitalizedLabel });
  }
  return options;
});

const currentLabel = computed(() => {
  const opt = monthOptions.value.find(o => o.value === props.selectedDate);
  return opt ? opt.label : props.selectedDate;
});

// Close dropdown on click outside
const closeDropdown = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>

<template>
  <header class="topbar">
    <div class="topbar-left">
      <button class="mobile-menu-toggle" @click="emit('toggle-sidebar')">
        <i class="fa-solid fa-bars"></i>
      </button>
      <h1 class="page-title">Dashboard</h1>
      <div class="date-filter">
        <div class="custom-dropdown" ref="dropdownRef">
          <button class="dropdown-toggle" @click="toggleDropdown" :class="{ 'is-open': isOpen }">
            <div class="toggle-content">
              <i class="fa-regular fa-calendar date-icon"></i>
              <span class="date-label">{{ currentLabel }}</span>
            </div>
            <i class="fa-solid fa-chevron-down caret"></i>
          </button>
          
          <div v-if="isOpen" class="dropdown-menu">
            <button 
              v-for="opt in monthOptions" 
              :key="opt.value"
              class="dropdown-item"
              :class="{ 'active': opt.value === selectedDate }"
              @click="selectMonth(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="topbar-right">
      <div v-if="pageName" class="connected-page">
        <img v-if="pagePictureUrl" :src="pagePictureUrl" :alt="pageName" class="page-icon" />
        <div v-else class="page-icon-placeholder"><i class="fa-solid fa-flag"></i></div>
        <span class="page-name">{{ pageName }}</span>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);

  .topbar-left {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .mobile-menu-toggle {
    display: none;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    margin-left: -0.5rem;
    transition: color 0.2s ease;
    
    &:hover {
      color: var(--color-primary);
    }
  }

  .page-title {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.02em;
  }

  .date-filter {
    margin-top: 0.5rem;
    
    .custom-dropdown {
      position: relative;
      display: inline-block;

      .dropdown-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
        padding: 0.6rem 1.25rem;
        border-radius: var(--radius-full);
        font-family: inherit;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 220px;

        .toggle-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;

          .date-icon {
            color: var(--text-secondary);
          }
        }

        .caret {
          font-size: 0.8rem;
          color: var(--text-secondary);
          transition: transform 0.3s ease;
        }

        &:hover {
          background-color: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        &.is-open {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
          
          .caret {
            transform: rotate(180deg);
          }
        }
      }

      .dropdown-menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        left: 0;
        width: 100%;
        background: var(--bg-dark);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-lg);
        padding: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        z-index: 100;
        max-height: 300px;
        overflow-y: auto;

        &::-webkit-scrollbar {
          width: 6px;
        }
        &::-webkit-scrollbar-track {
          background: transparent;
        }
        &::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .dropdown-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: inherit;
          font-size: 0.9rem;
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;

          &:hover {
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-primary);
          }

          &.active {
            background: rgba(99, 102, 241, 0.15);
            color: var(--color-primary);
            font-weight: 600;
          }
        }
      }
    }
  }

  .connected-page {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1.25rem 0.5rem 0.5rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 40px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
    }

    .page-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .page-icon-placeholder {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.1);
      color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .page-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-primary);
    }
  }

  @media (max-width: 1024px) {
    padding: 1.5rem;
    
    .mobile-menu-toggle {
      display: block;
    }
    
    .page-title {
      font-size: 1.5rem;
    }
    
    .connected-page {
      .page-name {
        display: none;
      }
    }
  }
  
  @media (max-width: 600px) {
    .topbar {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    .topbar-left {
      width: 100%;
      flex-wrap: wrap;
    }
    .topbar-right {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
