<script setup lang="ts">
import { computed } from 'vue';
import { Bar, Line } from 'vue-chartjs';
import { 
  Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler);

const props = defineProps<{
  insights: any[];
  sales?: any[];
}>();

const getAdStats = (adId: string) => {
  let salesAmount = 0;
  if (props.sales) {
    props.sales.forEach(s => {
      if (s.adId === adId) salesAmount += (s.amount || 0);
    });
  }
  return salesAmount;
};

// Data preparation
const chartData = computed(() => {
  const labels: string[] = [];
  const spendData: number[] = [];
  const salesData: number[] = [];
  const roasData: number[] = [];

  props.insights.forEach(ad => {
    // Only show ads that have some spend or sales
    const spend = Number(ad.spend || 0);
    const sales = getAdStats(ad.ad_id);
    const roas = Number(ad.purchase_roas?.[0]?.value || 0);

    if (spend > 0 || sales > 0) {
      // Use ad name, truncate if too long
      const name = ad.ad_name.length > 20 ? ad.ad_name.substring(0, 20) + '...' : ad.ad_name;
      labels.push(name);
      spendData.push(spend);
      salesData.push(sales);
      roasData.push(roas);
    }
  });

  return {
    labels,
    spendData,
    salesData,
    roasData
  };
});

const barChartData = computed(() => ({
  labels: chartData.value.labels,
  datasets: [
    {
      label: 'Inversión ($)',
      backgroundColor: 'rgba(239, 68, 68, 0.7)', // Red-ish
      borderColor: 'rgb(239, 68, 68)',
      borderWidth: 1,
      borderRadius: 4,
      data: chartData.value.spendData,
    },
    {
      label: 'Ventas Generadas ($)',
      backgroundColor: 'rgba(16, 185, 129, 0.7)', // Green-ish
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 1,
      borderRadius: 4,
      data: chartData.value.salesData,
    }
  ]
}));

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: 'rgba(255, 255, 255, 0.7)' }
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: 'rgba(255, 255, 255, 0.5)' }
    },
    x: {
      grid: { display: false },
      ticks: { color: 'rgba(255, 255, 255, 0.5)' }
    }
  }
};

const roasChartData = computed(() => ({
  labels: chartData.value.labels,
  datasets: [
    {
      label: 'ROAS (x)',
      backgroundColor: 'rgba(99, 102, 241, 0.2)', // Indigo
      borderColor: 'rgb(99, 102, 241)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(99, 102, 241)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(99, 102, 241)',
      fill: true,
      tension: 0.4,
      data: chartData.value.roasData,
    }
  ]
}));

const roasChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: 'rgba(255, 255, 255, 0.7)' }
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          return `ROAS: ${context.parsed.y.toFixed(2)}x`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: 'rgba(255, 255, 255, 0.5)' }
    },
    x: {
      grid: { display: false },
      ticks: { color: 'rgba(255, 255, 255, 0.5)' }
    }
  }
};
</script>

<template>
  <div class="charts-section" v-if="chartData.labels.length > 0">
    <div class="chart-card">
      <div class="chart-header">
        <h3>Inversión vs Ventas (USD)</h3>
      </div>
      <div class="chart-body">
        <Bar :data="barChartData" :options="barChartOptions" />
      </div>
    </div>
    
    <div class="chart-card">
      <div class="chart-header">
        <h3>Retorno de Inversión (ROAS)</h3>
      </div>
      <div class="chart-body">
        <Line :data="roasChartData" :options="roasChartOptions" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.charts-section {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.chart-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0; /* Prevent horizontal explosion */
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(99, 102, 241, 0.2);
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);
  }

  .chart-header {
    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }
  }

  .chart-body {
    position: relative;
    height: 300px;
    width: 100%;
  }
}

@media (max-width: 1024px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
}
</style>
