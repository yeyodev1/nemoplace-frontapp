<script setup lang="ts">
const props = defineProps({
  pageName: { type: String, default: null },
  pagePictureUrl: { type: String, default: null },
  selectedDate: { type: String, default: 'last_7d' }
});

const emit = defineEmits<{
  (e: 'update:selectedDate', value: string): void;
}>();

const dateOptions = [
  { value: 'today', label: 'Hoy' },
  { value: 'yesterday', label: 'Ayer' },
  { value: 'last_7d', label: 'Últimos 7 días' },
  { value: 'this_month', label: 'Este mes' },
  { value: 'last_month', label: 'Mes pasado' },
  { value: 'maximum', label: 'Histórico' }
];
</script>

<template>
  <header class="topbar">
    <div class="topbar-left">
      <h1 class="page-title">Dashboard</h1>
      <div class="date-filter">
        <select 
          :value="selectedDate" 
          @change="emit('update:selectedDate', ($event.target as HTMLSelectElement).value)"
          class="date-select"
        >
          <option v-for="opt in dateOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
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

  .page-title {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.25rem 0;
    letter-spacing: -0.02em;
  }

  .date-filter {
    margin-top: 0.5rem;
    
    .date-select {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-secondary);
      padding: 0.5rem 2.5rem 0.5rem 1rem;
      border-radius: var(--radius-full);
      font-family: inherit;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.5)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 1rem;
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.08);
        color: var(--text-primary);
        border-color: rgba(255, 255, 255, 0.2);
      }

      &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
      }
      
      option {
        background: var(--bg-dark);
        color: var(--text-primary);
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
  }
}
</style>
