<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  adName: {
    type: String,
    required: true,
  },
  creativeUrl: {
    type: String,
    default: null,
  },
  adLink: {
    type: String,
    default: null,
  },
  spend: {
    type: Number,
    required: true,
  },
  impressions: {
    type: Number,
    required: true,
  },
  clicks: {
    type: Number,
    required: true,
  },
  conversations: {
    type: Number,
    default: 0,
  },
  salesAmount: {
    type: Number,
    default: 0,
  },
  roas: {
    type: Number,
    default: 0,
  },
});

const formattedSpend = computed(() => `$${props.spend.toFixed(2)}`);
const formattedSales = computed(() => `$${props.salesAmount.toFixed(2)}`);
const formattedRoas = computed(() => `${props.roas.toFixed(2)}x`);

</script>

<template>
  <div class="ad-metrics-card">
    <div class="card-visual">
      <img 
        :src="creativeUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop'" 
        alt="Ad Creative" 
        class="ad-image" 
      />
      <div class="visual-overlay">
        <span class="status-badge"><span class="pulse"></span> Activa</span>
      </div>
    </div>
    
    <div class="card-content">
      <div class="card-header">
        <h3 class="ad-title">
          {{ adName }}
          <a v-if="adLink" :href="adLink" target="_blank" title="Ver Anuncio en Instagram/Facebook" class="ad-link-btn" @click.stop>
            <i class="fa-solid fa-external-link-alt"></i>
          </a>
        </h3>
      </div>
    <div class="card-body">
      <div class="metric-item">
        <span class="metric-label">Spend</span>
        <span class="metric-value">{{ formattedSpend }}</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Sales</span>
        <span class="metric-value text-success">{{ formattedSales }}</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">ROAS</span>
        <span class="metric-value text-primary">{{ formattedRoas }}</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Impressions</span>
        <span class="metric-value">{{ impressions.toLocaleString() }}</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Conversations</span>
        <span class="metric-value">{{ conversations.toLocaleString() }}</span>
      </div>
    </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ad-metrics-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(20px);
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.01);
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(99, 102, 241, 0.1);
    
    &::before {
      opacity: 1;
    }

    .ad-image {
      transform: scale(1.05);
    }
  }
}

.card-visual {
  width: 100%;
  height: 160px;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  .ad-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .visual-overlay {
    position: absolute;
    top: 1rem;
    right: 1rem;
    
    .status-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      padding: 0.4rem 0.8rem;
      border-radius: 30px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.1);

      .pulse {
        width: 8px;
        height: 8px;
        background: #10b981;
        border-radius: 50%;
        box-shadow: 0 0 8px #10b981;
        animation: pulse 2s infinite;
      }
    }
  }
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card-header {
  .ad-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    .ad-link-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-secondary);
      font-size: 0.75rem;
      transition: all 0.2s ease;
      text-decoration: none;
      vertical-align: middle;

      &:hover {
        background: rgba(99, 102, 241, 0.2);
        color: var(--color-primary);
      }
    }
  }
}

.card-body {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem 1.5rem;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  .metric-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
  }

  .metric-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    font-family: 'Inter', sans-serif;
    letter-spacing: -0.02em;

    &.text-success {
      color: #10b981;
      text-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
    }
    
    &.text-primary {
      color: var(--color-primary-hover);
      text-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
    }
  }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

@media (max-width: 640px) {
  .card-body {
    grid-template-columns: 1fr;
  }
}
</style>
