<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { authApi } from '@/services/auth.api';

const userStore = useUserStore();

onMounted(async () => {
  userStore.hydrate();
  
  // If we have a token but no full user data (or just missing workspaceId), fetch it
  if (userStore.isAuthenticated && !userStore.workspaceId) {
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
