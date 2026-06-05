<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="landing-page">
    <header class="navbar">
      <div class="logo">nemoPlace.</div>
      <nav class="nav-links">
        <a href="#features">Características</a>
        <a href="#about">Acerca de</a>
        <button class="btn-outline" @click="navigateToLogin">Iniciar Sesión</button>
      </nav>
    </header>

    <main class="hero-section">
      <div class="hero-content">
        <div class="badge"><i class="fa-solid fa-rocket"></i> La Plataforma de Ads de Siguiente Generación</div>
        <h1 class="hero-title">
          Escala tus Anuncios<br />
          <span class="gradient-text">Como Nunca Antes</span>
        </h1>
        <p class="hero-subtitle">
          Obtén información detallada, rastrea tu ROAS real y administra tus campañas de Meta Ads sin problemas en un único y elegante espacio de trabajo.
        </p>
        <div class="cta-group">
          <button class="btn-primary" @click="navigateToLogin">Comenzar Ahora</button>
          <button class="btn-secondary">Ver Demo</button>
        </div>
      </div>
      
      <!-- Visual abstract element -->
      <div class="hero-visual">
        <div class="glass-card">
          <div class="skeleton-line title"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-graph">
            <div class="bar bar-1"></div>
            <div class="bar bar-2"></div>
            <div class="bar bar-3"></div>
            <div class="bar bar-4"></div>
            <div class="bar bar-5"></div>
          </div>
        </div>
        <div class="glow-orb primary"></div>
        <div class="glow-orb accent"></div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.landing-page {
  min-height: 100vh;
  background-color: var(--bg-dark);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  position: relative;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 5%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(7, 7, 9, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-light);

  .logo {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.05em;
    background: linear-gradient(to right, #fff, #a1a1aa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;

    a {
      color: var(--text-secondary);
      font-size: 0.95rem;
      font-weight: 500;
      transition: color 0.3s ease;
      
      &:hover {
        color: var(--text-primary);
      }
    }
  }
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-focus);
  color: var(--text-primary);
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-full);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.1);
    box-shadow: var(--shadow-glow);
  }
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  padding: 0 5%;
  position: relative;
  z-index: 10;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding-top: 100px;
    gap: 4rem;
  }
}

.hero-content {
  flex: 1;
  max-width: 600px;
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;

  @media (max-width: 1024px) {
    margin: 0 auto;
  }
}

.badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: var(--color-primary-hover);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.04em;
  margin: 0 0 1.5rem 0;

  @media (max-width: 768px) {
    font-size: 3rem;
  }

  .gradient-text {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2.5rem;
  font-weight: 400;
}

.cta-group {
  display: flex;
  gap: 1rem;
  
  @media (max-width: 1024px) {
    justify-content: center;
  }

  button {
    padding: 1rem 2rem;
    border-radius: var(--radius-full);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-primary {
    background: var(--color-primary);
    color: white;
    border: none;

    &:hover {
      background: var(--color-primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.5);
    }
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-primary);
    border: 1px solid var(--border-light);
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
  }
}

.hero-visual {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  animation: fadeIn 1s ease-in forwards 0.5s;
  opacity: 0;

  .glow-orb {
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    filter: blur(80px);
    z-index: 1;

    &.primary {
      background: var(--color-primary);
      opacity: 0.15;
      top: 10%;
      right: 10%;
    }

    &.accent {
      background: var(--color-accent);
      opacity: 0.1;
      bottom: 10%;
      left: 10%;
    }
  }

  .glass-card {
    position: relative;
    z-index: 2;
    width: 350px;
    height: 450px;
    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-glass);
    padding: 2rem;
    transform: rotateY(-15deg) rotateX(10deg);
    transition: transform 0.5s ease;

    &:hover {
      transform: rotateY(0deg) rotateX(0deg) scale(1.05);
    }
  }

  .skeleton-line {
    height: 12px;
    background: rgba(255,255,255,0.1);
    border-radius: 6px;
    margin-bottom: 1rem;
    width: 100%;

    &.title {
      height: 24px;
      width: 60%;
      margin-bottom: 2rem;
    }

    &.short {
      width: 40%;
    }
  }

  .skeleton-graph {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    height: 150px;
    margin-top: 3rem;

    .bar {
      flex: 1;
      background: linear-gradient(to top, var(--color-primary) 0%, var(--color-accent) 100%);
      border-radius: 6px 6px 0 0;
      opacity: 0.8;
      animation: growUp 1s ease-out forwards;
      transform-origin: bottom;
      transform: scaleY(0);

      &.bar-1 { height: 40%; animation-delay: 0.6s; }
      &.bar-2 { height: 60%; animation-delay: 0.7s; }
      &.bar-3 { height: 30%; animation-delay: 0.8s; }
      &.bar-4 { height: 80%; animation-delay: 0.9s; }
      &.bar-5 { height: 100%; animation-delay: 1.0s; }
    }
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@keyframes growUp {
  to {
    transform: scaleY(1);
  }
}
</style>
