<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const userName = computed(() => userStore.name || 'Administrador');
const userAvatar = computed(() => `https://ui-avatars.com/api/?name=${encodeURIComponent(userName.value)}&background=6366f1&color=fff`);

const props = defineProps<{
  isOpen?: boolean;
}>();

const emit = defineEmits<{
  (e: 'logout'): void;
  (e: 'close'): void;
}>();
</script>

<template>
  <div v-if="isOpen" class="sidebar-backdrop" @click="emit('close')"></div>
  <aside class="sidebar" :class="{ 'is-open': isOpen }">
    <div class="sidebar-header">
      <button class="mobile-close-btn" @click="emit('close')">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="logo-container">
        <div class="logo-glow"></div>
        <div class="logo">nemoPlace.</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-item" exact-active-class="active" @click="emit('close')">
        <span class="icon"><i class="fa-solid fa-chart-pie"></i></span>
        Resumen
      </router-link>
      <router-link to="/dashboard/campaigns" class="nav-item" exact-active-class="active" @click="emit('close')">
        <span class="icon"><i class="fa-solid fa-chart-line"></i></span>
        Campañas
      </router-link>
      <router-link to="/dashboard/conversations" class="nav-item" exact-active-class="active" @click="emit('close')">
        <span class="icon"><i class="fa-regular fa-comments"></i></span>
        Conversaciones
      </router-link>
      <router-link to="/dashboard/sales" class="nav-item" exact-active-class="active" @click="emit('close')">
        <span class="icon"><i class="fa-solid fa-cash-register"></i></span>
        Ventas
      </router-link>
      <router-link to="/dashboard/settings" class="nav-item" exact-active-class="active" @click="emit('close')">
        <span class="icon"><i class="fa-solid fa-gear"></i></span>
        Configuración
      </router-link>
    </nav>
    <div class="sidebar-footer">
      <div class="user-profile">
        <img :src="userAvatar" :alt="userName" class="avatar" />
        <div class="user-info">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role">Workspace Owner</span>
        </div>
      </div>
      <button class="logout-btn" @click="emit('logout')">
        <span class="icon"><i class="fa-solid fa-arrow-right-from-bracket"></i></span>
        Salir
      </button>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.sidebar {
  width: 280px;
  background: rgba(10, 10, 12, 0.4);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(20px);
  z-index: 100;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .sidebar-header {
    padding: 2.5rem 1.5rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .mobile-close-btn {
      display: none;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
      
      &:hover { color: var(--text-primary); }
    }
    
    .logo-container {
      position: relative;
      display: inline-block;

      .logo-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 120%;
        height: 100%;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
        filter: blur(15px);
        z-index: -1;
      }

      .logo {
        font-size: 1.75rem;
        font-weight: 800;
        letter-spacing: -0.05em;
        background: linear-gradient(135deg, #fff, #a1a1aa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

  .sidebar-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0 1.25rem;

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1.25rem;
      border-radius: 12px;
      color: var(--text-secondary);
      font-weight: 500;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      text-decoration: none;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, rgba(255,255,255,0.03), transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .icon {
        font-size: 1.2rem;
        opacity: 0.7;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }

      &:hover {
        color: var(--text-primary);
        
        &::before {
          opacity: 1;
        }

        .icon {
          transform: scale(1.1);
          opacity: 1;
        }
      }

      &.active {
        background: rgba(99, 102, 241, 0.1);
        color: var(--color-primary-hover);
        box-shadow: inset 0 0 0 1px rgba(99, 102, 241, 0.2);
        
        .icon {
          opacity: 1;
          color: var(--color-primary);
        }
      }
    }
  }

  .sidebar-footer {
    padding: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    .user-profile {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.1);
      }

      .user-info {
        display: flex;
        flex-direction: column;

        .user-name {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
      }
    }

    .logout-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.875rem;
      background: rgba(244, 63, 94, 0.05);
      border: 1px solid rgba(244, 63, 94, 0.1);
      color: #fb7185;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 12px;

      &:hover {
        background: rgba(244, 63, 94, 0.15);
        border-color: rgba(244, 63, 94, 0.3);
        transform: translateY(-2px);
      }
    }
  }

  @media (max-width: 1024px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(-100%);
    background: rgba(10, 10, 12, 0.95);
    
    &.is-open {
      transform: translateX(0);
      box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
    }

    .sidebar-header .mobile-close-btn {
      display: block;
    }
  }
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 90;
}
</style>
