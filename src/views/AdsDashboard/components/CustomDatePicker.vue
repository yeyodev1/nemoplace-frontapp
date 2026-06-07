<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const initDate = new Date(props.modelValue || new Date());
const selectedDay = ref(initDate.getDate());
const selectedMonth = ref(initDate.getMonth() + 1);
const selectedYear = ref(initDate.getFullYear());

const activeDropdown = ref<'day' | 'month' | 'year' | null>(null);
const containerRef = ref<HTMLElement | null>(null);

const toggleDropdown = (type: 'day' | 'month' | 'year') => {
  activeDropdown.value = activeDropdown.value === type ? null : type;
};

const selectValue = (type: 'day' | 'month' | 'year', val: number) => {
  if (type === 'day') selectedDay.value = val;
  if (type === 'month') selectedMonth.value = val;
  if (type === 'year') selectedYear.value = val;
  activeDropdown.value = null;
};

const days = computed(() => {
  const d = new Date(selectedYear.value, selectedMonth.value, 0).getDate();
  return Array.from({length: d}, (_, i) => i + 1);
});

const months = [
  { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' }, { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' }, { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' }, { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' }
];

const currentYear = new Date().getFullYear();
const years = [currentYear - 1, currentYear, currentYear + 1];

const currentMonthLabel = computed(() => {
  return months.find(m => m.value === selectedMonth.value)?.label || '';
});

watch([selectedDay, selectedMonth, selectedYear], () => {
  const maxDay = new Date(selectedYear.value, selectedMonth.value, 0).getDate();
  if (selectedDay.value > maxDay) {
    selectedDay.value = maxDay;
  }
  
  const dateObj = new Date(selectedYear.value, selectedMonth.value - 1, selectedDay.value);
  emit('update:modelValue', dateObj.toISOString());
});

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    const d = new Date(newVal);
    selectedDay.value = d.getDate();
    selectedMonth.value = d.getMonth() + 1;
    selectedYear.value = d.getFullYear();
  }
});

const closeDropdown = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    activeDropdown.value = null;
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
  <div class="custom-date-picker" ref="containerRef">
    <!-- Day Dropdown -->
    <div class="custom-dropdown">
      <button type="button" class="dropdown-toggle" @click="toggleDropdown('day')" :class="{ 'is-open': activeDropdown === 'day' }">
        <span class="value-text">{{ selectedDay }}</span>
        <i class="fa-solid fa-chevron-down caret"></i>
      </button>
      <div v-if="activeDropdown === 'day'" class="dropdown-menu">
        <button 
          v-for="d in days" 
          :key="d" 
          type="button"
          class="dropdown-item" 
          :class="{'active': d === selectedDay}"
          @click="selectValue('day', d)"
        >
          {{ d }}
        </button>
      </div>
    </div>

    <!-- Month Dropdown -->
    <div class="custom-dropdown month-dropdown">
      <button type="button" class="dropdown-toggle" @click="toggleDropdown('month')" :class="{ 'is-open': activeDropdown === 'month' }">
        <span class="value-text">{{ currentMonthLabel }}</span>
        <i class="fa-solid fa-chevron-down caret"></i>
      </button>
      <div v-if="activeDropdown === 'month'" class="dropdown-menu">
        <button 
          v-for="m in months" 
          :key="m.value" 
          type="button"
          class="dropdown-item" 
          :class="{'active': m.value === selectedMonth}"
          @click="selectValue('month', m.value)"
        >
          {{ m.label }}
        </button>
      </div>
    </div>

    <!-- Year Dropdown -->
    <div class="custom-dropdown">
      <button type="button" class="dropdown-toggle" @click="toggleDropdown('year')" :class="{ 'is-open': activeDropdown === 'year' }">
        <span class="value-text">{{ selectedYear }}</span>
        <i class="fa-solid fa-chevron-down caret"></i>
      </button>
      <div v-if="activeDropdown === 'year'" class="dropdown-menu">
        <button 
          v-for="y in years" 
          :key="y" 
          type="button"
          class="dropdown-item" 
          :class="{'active': y === selectedYear}"
          @click="selectValue('year', y)"
        >
          {{ y }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.custom-date-picker {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 0.5rem;
  width: 100%;
}

.custom-dropdown {
  position: relative;
  width: 100%;

  .dropdown-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    padding: 0.85rem 1rem;
    border-radius: var(--radius-md);
    font-family: inherit;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;

    .caret {
      font-size: 0.75rem;
      color: var(--text-secondary);
      transition: transform 0.3s ease;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.08);
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
    border-radius: var(--radius-md);
    padding: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    z-index: 100;
    max-height: 250px;
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
      padding: 0.7rem 1rem;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-family: inherit;
      font-size: 0.9rem;
      cursor: pointer;
      border-radius: var(--radius-sm);
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

@media (max-width: 480px) {
  .custom-date-picker {
    grid-template-columns: 1fr;
  }
}
</style>
