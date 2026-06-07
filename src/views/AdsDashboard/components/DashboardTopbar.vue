<script setup lang="ts">
defineProps<{
  pageName?: string;
  pagePictureUrl?: string;
  selectedDate: string;
}>();

const emit = defineEmits<{
  (e: 'update:selectedDate', value: string): void;
}>();
</script>

<template>
  <header class="topbar">
    <div class="topbar-left">
      <h1 class="page-title">Dashboard</h1>
      <div class="date-filter">
        <div class="date-input-wrapper">
          <i class="fa-regular fa-calendar date-icon"></i>
          <input 
            type="month"
            :value="selectedDate" 
            @input="emit('update:selectedDate', ($event.target as HTMLInputElement).value)"
            class="date-input"
          />
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

  .page-title {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.25rem 0;
    letter-spacing: -0.02em;
  }

  .date-filter {
    margin-top: 0.5rem;
    
    .date-input-wrapper {
      position: relative;
      display: inline-flex;
      align-items: center;

      .date-icon {
        position: absolute;
        left: 1rem;
        color: var(--text-secondary);
        pointer-events: none;
      }

      .date-input {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
        padding: 0.5rem 1rem 0.5rem 2.5rem;
        border-radius: var(--radius-full);
        font-family: inherit;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;

        /* Estilos para el icono del calendario nativo en Webkit (Chrome/Safari) */
        &::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.5;
          cursor: pointer;
          transition: opacity 0.2s;
          
          &:hover {
            opacity: 1;
          }
        }

        &:hover {
          background-color: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        &:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
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
  }
}
</style>
