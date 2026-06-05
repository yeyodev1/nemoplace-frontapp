<script setup lang="ts">


const props = defineProps({
  totalSpend: {
    type: Number,
    required: true
  },
  totalRevenue: {
    type: Number,
    required: true
  },
  overallRoas: {
    type: Number,
    required: true
  },
  totalConversations: {
    type: Number,
    required: true
  }
});
</script>

<template>
  <section class="stats-grid">
    <div class="stat-card" style="animation-delay: 0.1s">
      <div class="stat-header">
        <h4>Gasto Total</h4>
        <div class="trend positive">+12%</div>
      </div>
      <div class="stat-body">
        <span class="value">${{ totalSpend.toFixed(2) }}</span>
      </div>
      <div class="stat-chart spend-chart"></div>
    </div>

    <div class="stat-card highlight" style="animation-delay: 0.2s">
      <div class="stat-header">
        <h4>Ingresos Totales</h4>
        <div class="trend positive">+24%</div>
      </div>
      <div class="stat-body">
        <span class="value">${{ totalRevenue.toFixed(2) }}</span>
      </div>
      <div class="stat-chart revenue-chart"></div>
    </div>

    <div class="stat-card" style="animation-delay: 0.3s">
      <div class="stat-header">
        <h4>ROAS General</h4>
        <div class="trend neutral">0%</div>
      </div>
      <div class="stat-body">
        <span class="value">{{ overallRoas.toFixed(2) }}x</span>
      </div>
    </div>

    <div class="stat-card" style="animation-delay: 0.4s">
      <div class="stat-header">
        <h4>Conversaciones</h4>
        <div class="trend positive">+5%</div>
      </div>
      <div class="stat-body">
        <span class="value">{{ totalConversations }}</span>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;

  .stat-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
    opacity: 0;
    transform: translateY(20px);
    animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transition: transform 0.3s ease, border-color 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      border-color: rgba(255, 255, 255, 0.1);
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h4 {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.85rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .trend {
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-full);
        
        &.positive {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        &.neutral {
          background: rgba(161, 161, 170, 0.1);
          color: var(--text-secondary);
        }
      }
    }

    .stat-body {
      .value {
        font-size: 2.5rem;
        font-weight: 700;
        letter-spacing: -0.03em;
      }
    }

    .stat-chart {
      height: 40px;
      margin-top: auto;
      border-radius: 4px;
      opacity: 0.5;

      &.spend-chart {
        background: linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.2) 100%);
      }
      &.revenue-chart {
        background: linear-gradient(90deg, rgba(99,102,241,0.1) 0%, rgba(99,102,241,0.4) 100%);
      }
    }

    &.highlight {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.02) 100%);
      border-color: var(--border-focus);
      
      .value {
        color: var(--color-primary-hover);
        text-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
      }
    }
  }
}

@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}
</style>
