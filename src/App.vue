<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { authApi } from '@/services/auth.api';

const userStore = useUserStore();
const router = useRouter();

const handleTokenExpired = () => {
  userStore.clear();
  router.push('/login');
};

onMounted(async () => {
  window.addEventListener('auth:token-expired', handleTokenExpired);
  userStore.hydrate();
  
  // If we have a token but no full user data (missing name or workspaceId), fetch it
  if (userStore.isAuthenticated && (!userStore.workspaceId || !userStore.name)) {
    try {
      const res = await authApi.me();
      if (res.data && res.data.user) {
        userStore.setUser({
          id: res.data.user._id,
          name: res.data.user.name,
          email: res.data.user.email,
          workspaceId: res.data.user.workspaceId
        });
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  }
});

onUnmounted(() => {
  window.removeEventListener('auth:token-expired', handleTokenExpired);
});
</script>

<template>
  <div class="app-container">
    <RouterView />
  </div>
</template>

<style lang="scss">
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
