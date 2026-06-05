<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from '@/services/auth.api';

const router = useRouter();

const isLoading = ref(false);
const errorMsg = ref('');

const form = ref({
  email: '',
  password: ''
});

const handleSubmit = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    const res = await authApi.login({ email: form.value.email, password: form.value.password });
    localStorage.setItem('token', res.data.token);
    router.push('/');
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || 'Authentication failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-split">
      <!-- Left side: Branding / Image -->
      <div class="auth-brand">
        <div class="brand-content">
          <h1 class="logo">nemoPlace.</h1>
          <p class="tagline">Scale your Ads performance to the next level.</p>
        </div>
        <div class="glass-overlay"></div>
      </div>
      
      <!-- Right side: Form -->
      <div class="auth-form-container">
        <transition name="fade" mode="out-in">
          <div class="auth-form-wrapper" key="login">
            <h2>Bienvenido de Nuevo</h2>
            <p class="subtitle">Ingresa tus datos para acceder al dashboard.</p>
            
            <form @submit.prevent="handleSubmit" class="auth-form">
              <div class="input-group">
                <label for="email">Correo Electrónico</label>
                <input id="email" v-model="form.email" type="email" placeholder="juan@ejemplo.com" required />
              </div>
              
              <div class="input-group">
                <label for="password">Contraseña</label>
                <input id="password" v-model="form.password" type="password" placeholder="••••••••" required />
              </div>

              <div v-if="errorMsg" class="error-message">
                {{ errorMsg }}
              </div>

              <button type="submit" class="btn-submit" :disabled="isLoading">
                <span v-if="isLoading" class="loader"></span>
                <span v-else>Iniciar Sesión</span>
              </button>
            </form>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auth-container {
  min-height: 100vh;
  background-color: var(--bg-dark);
  color: var(--text-primary);
  display: flex;
  font-family: 'Inter', sans-serif;
}

.auth-split {
  display: flex;
  width: 100%;
}

.auth-brand {
  flex: 1;
  display: none;
  position: relative;
  background: linear-gradient(135deg, #0a0a0a 0%, #171717 100%);
  overflow: hidden;

  @media (min-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, var(--color-primary) 0%, transparent 70%);
    opacity: 0.15;
    top: -100px;
    left: -100px;
    border-radius: 50%;
    filter: blur(80px);
  }

  &::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, var(--color-accent) 0%, transparent 70%);
    opacity: 0.1;
    bottom: -50px;
    right: -50px;
    border-radius: 50%;
    filter: blur(60px);
  }

  .brand-content {
    position: relative;
    z-index: 10;
    text-align: left;
    padding: 4rem;
    max-width: 600px;
  }

  .logo {
    font-size: 4rem;
    font-weight: 800;
    letter-spacing: -0.05em;
    margin: 0;
    background: linear-gradient(to right, #fff, #a1a1aa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .tagline {
    font-size: 1.5rem;
    color: var(--text-secondary);
    margin-top: 1rem;
    font-weight: 300;
  }

  .glass-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.0) 100%);
    backdrop-filter: blur(10px);
    pointer-events: none;
  }
}

.auth-form-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--bg-dark);
}

.auth-form-wrapper {
  width: 100%;
  max-width: 420px;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 3rem 2.5rem;
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-glass);

  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.02em;
  }

  .subtitle {
    color: var(--text-secondary);
    font-size: 0.95rem;
    margin-bottom: 2rem;
  }
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    input {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid var(--border-light);
      color: var(--text-primary);
      padding: 0.875rem 1rem;
      border-radius: var(--radius-sm);
      font-size: 1rem;
      transition: all 0.2s ease;
      font-family: inherit;

      &::placeholder {
        color: var(--text-muted);
      }

      &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
      }
    }
  }

  .btn-submit {
    background: var(--color-primary);
    color: white;
    border: none;
    padding: 1rem;
    border-radius: var(--radius-sm);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 1rem;
    transition: all 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover:not(:disabled) {
      background: var(--color-primary-hover);
      box-shadow: var(--shadow-glow);
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}

.error-message {
  color: var(--color-accent);
  font-size: 0.875rem;
  padding: 0.75rem;
  background: rgba(244, 63, 94, 0.1);
  border-left: 3px solid var(--color-accent);
  border-radius: 4px;
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// Vue Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
