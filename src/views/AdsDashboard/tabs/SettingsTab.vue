<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { usersApi } from '@/services/users.api';
import { useUserStore } from '@/stores/user';
import { useGhl } from '@/composables/useGhl';
import ConnectGhlModal from '../components/ConnectGhlModal.vue';

const userStore = useUserStore();

const props = defineProps<{
  totalSpend?: number;
  totalRevenue?: number;
  overallRoas?: number;
  totalConversations?: number;
  insights?: any[];
  sales?: any[];
}>();

// Use dynamic workspaceId from store, or fallback (for edge cases)
const WORKSPACE_ID = computed(() => userStore.workspaceId || '60d5ecb8b392d70015345678');

const users = ref<any[]>([]);
const isLoadingUsers = ref(false);
const isInviting = ref(false);
const isDeleting = ref(false);
const isUpdating = ref(false);

const isInviteModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isGhlModalOpen = ref(false);

const { connectGhl, isConnecting } = useGhl();

const handleConnectGhl = async (payload: { locationId: string, apiKey: string }) => {
  await connectGhl(WORKSPACE_ID.value, payload.locationId, payload.apiKey);
  isGhlModalOpen.value = false;
  alert('GHL conectado exitosamente.');
};

const userToDelete = ref<string | null>(null);
const userToEdit = ref<string | null>(null);

const activeSettingTab = ref('profile');
const inviteForm = ref({ email: '', role: 'Lector' });
const editForm = ref({ name: '', email: '', phone: '', role: 'Lector' });

const originalProfile = ref({ name: '', email: '', phone: '' });
const myProfileForm = ref({ name: '', email: '', phone: '' });
const isUpdatingMyProfile = ref(false);
const isEditingProfile = ref(false);

const hasProfileChanges = computed(() => {
  return myProfileForm.value.name !== originalProfile.value.name ||
         myProfileForm.value.email !== originalProfile.value.email ||
         myProfileForm.value.phone !== originalProfile.value.phone;
});

const cancelEditProfile = () => {
  myProfileForm.value = { ...originalProfile.value };
  isEditingProfile.value = false;
};

const fetchUsers = async () => {
  isLoadingUsers.value = true;
  try {
    const data = await usersApi.getWorkspaceUsers(WORKSPACE_ID.value);
    users.value = data.users || [];
    
    // Sync My Profile Form
    const me = users.value.find(u => u._id === userStore.id);
    if (me) {
      const profileData = {
        name: me.name || '',
        email: me.email || '',
        phone: me.phone || ''
      };
      originalProfile.value = { ...profileData };
      if (!isEditingProfile.value) {
        myProfileForm.value = { ...profileData };
      }
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    isLoadingUsers.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});

watch(WORKSPACE_ID, (newId, oldId) => {
  if (newId !== oldId) {
    fetchUsers();
  }
});

const openInviteModal = () => {
  inviteForm.value = { email: '', role: 'Lector' };
  isInviteModalOpen.value = true;
};

const handleInviteUser = async () => {
  if (!inviteForm.value.email) return;
  isInviting.value = true;
  try {
    await usersApi.inviteUser(WORKSPACE_ID.value, inviteForm.value.email, inviteForm.value.role);
    isInviteModalOpen.value = false;
    inviteForm.value = { email: '', role: 'Lector' };
    await fetchUsers(); // Refresh list
  } catch (error) {
    console.error('Error inviting user:', error);
    alert('Hubo un error al invitar al usuario.');
  } finally {
    isInviting.value = false;
  }
};

const openEditModal = (user: any) => {
  userToEdit.value = user._id;
  editForm.value = { 
    name: user.name || '', 
    email: user.email || '', 
    phone: user.phone || '', 
    role: user.role || 'Lector' 
  };
  isEditModalOpen.value = true;
};

const handleUpdateUser = async () => {
  if (!userToEdit.value) return;
  isUpdating.value = true;
  try {
    await usersApi.updateUser(WORKSPACE_ID.value, userToEdit.value, editForm.value);
    isEditModalOpen.value = false;
    await fetchUsers(); // Refresh list
  } catch (error) {
    console.error('Error updating user:', error);
    alert('Hubo un error al actualizar el usuario.');
  } finally {
    isUpdating.value = false;
  }
};

const handleUpdateMyProfile = async () => {
  if (!userStore.id) return;
  isUpdatingMyProfile.value = true;
  try {
    // Only update name, email, phone (role should stay the same as it is in the backend)
    await usersApi.updateUser(WORKSPACE_ID.value, userStore.id, { 
      name: myProfileForm.value.name, 
      email: myProfileForm.value.email, 
      phone: myProfileForm.value.phone,
      role: users.value.find(u => u._id === userStore.id)?.role || 'Lector'
    });
    
    // Update local userStore as well
    userStore.setUser({
      name: myProfileForm.value.name,
      email: myProfileForm.value.email
    });
    
    originalProfile.value = { ...myProfileForm.value };
    isEditingProfile.value = false;
    await fetchUsers(); // Refresh list
    alert('¡Perfil actualizado con éxito!');
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Hubo un error al actualizar tu perfil.');
  } finally {
    isUpdatingMyProfile.value = false;
  }
};

const confirmRemoveUser = (id: string) => {
  userToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const executeRemoveUser = async () => {
  if (userToDelete.value !== null) {
    isDeleting.value = true;
    try {
      await usersApi.deleteUser(WORKSPACE_ID.value, userToDelete.value);
      isDeleteModalOpen.value = false;
      userToDelete.value = null;
      await fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Hubo un error al eliminar al usuario.');
    } finally {
      isDeleting.value = false;
    }
  }
};

const cancelRemoveUser = () => {
  userToDelete.value = null;
  isDeleteModalOpen.value = false;
};
</script>

<template>
  <div class="settings-tab">
    <div class="tab-header">
      <div class="header-text">
        <h2>Configuración</h2>
        <p>Administra tu espacio de trabajo, equipo y preferencias.</p>
      </div>
    </div>

    <div class="settings-content">
      <div class="settings-sidebar">
        <nav class="settings-nav">
          <a href="#" class="nav-item" :class="{ active: activeSettingTab === 'profile' }" @click.prevent="activeSettingTab = 'profile'">
            <i class="fa-solid fa-user"></i> Mi Perfil
          </a>
          <a href="#" class="nav-item" :class="{ active: activeSettingTab === 'users' }" @click.prevent="activeSettingTab = 'users'">
            <i class="fa-solid fa-users"></i> Usuarios y Equipo
          </a>
          <a href="#" class="nav-item" :class="{ active: activeSettingTab === 'workspace' }" @click.prevent="activeSettingTab = 'workspace'">
            <i class="fa-solid fa-building"></i> Espacio de Trabajo
          </a>
          <a href="#" class="nav-item" :class="{ active: activeSettingTab === 'integrations' }" @click.prevent="activeSettingTab = 'integrations'">
            <i class="fa-solid fa-plug"></i> Integraciones
          </a>
          <a href="#" class="nav-item" :class="{ active: activeSettingTab === 'billing' }" @click.prevent="activeSettingTab = 'billing'">
            <i class="fa-solid fa-credit-card"></i> Facturación
          </a>
        </nav>
      </div>

      <div class="settings-panel" v-if="activeSettingTab === 'profile'">
        <div class="panel-header">
          <div class="panel-title">
            <h3>Mi Perfil</h3>
            <p>Actualiza tu información personal y datos de contacto.</p>
          </div>
        </div>
        
        <form @submit.prevent="handleUpdateMyProfile" class="profile-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nombre Completo</label>
              <input type="text" v-model="myProfileForm.name" placeholder="Tu nombre" required :disabled="!isEditingProfile" />
            </div>
            <div class="form-group">
              <label>Correo Electrónico</label>
              <input type="email" v-model="myProfileForm.email" placeholder="tu@correo.com" required :disabled="!isEditingProfile" />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Teléfono</label>
              <input type="tel" v-model="myProfileForm.phone" placeholder="+1234567890" :disabled="!isEditingProfile" />
            </div>
            <div class="form-group">
              <!-- Placeholder for layout balance -->
            </div>
          </div>
          
          <div class="form-actions">
            <button v-if="!isEditingProfile" type="button" @click="isEditingProfile = true" class="secondary-button">
              <i class="fa-solid fa-pen"></i> Editar Perfil
            </button>
            <div v-else class="edit-actions">
              <button type="button" class="text-button" @click="cancelEditProfile" :disabled="isUpdatingMyProfile">Cancelar</button>
              <button type="submit" class="primary-button" v-if="hasProfileChanges" :disabled="isUpdatingMyProfile">
                <span v-if="isUpdatingMyProfile"><i class="fa-solid fa-spinner fa-spin"></i> Guardando...</span>
                <span v-else>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div class="settings-panel" v-else-if="activeSettingTab === 'users'">
        <div class="panel-header">
          <div class="panel-title">
            <h3>Usuarios del Equipo</h3>
            <p>Gestiona quién tiene acceso a este espacio de trabajo y sus permisos.</p>
          </div>
          <button class="primary-button" @click="openInviteModal">
            <i class="fa-solid fa-user-plus"></i> Invitar Usuario
          </button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Último Acceso</th>
                <th class="actions-col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoadingUsers">
                <td colspan="5" class="empty-state">
                  <div class="spinner inline-spinner"></div>
                  Cargando usuarios...
                </td>
              </tr>
              <tr v-else-if="users.length === 0">
                <td colspan="5" class="empty-state">No hay usuarios en este espacio.</td>
              </tr>
              <tr v-else v-for="user in users" :key="user._id">
                <td>
                  <div class="user-info">
                    <div class="user-avatar">{{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}</div>
                    <div class="user-details">
                      <span class="user-name">{{ user.name }}</span>
                      <span class="user-email">{{ user.email }}</span>
                      <span class="user-email" v-if="user.phone"><i class="fa-solid fa-phone" style="font-size:0.7rem; margin-right:4px;"></i>{{ user.phone }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="role-badge" :class="user.role ? user.role.toLowerCase() : 'lector'">{{ user.role }}</span>
                </td>
                <td>
                  <span class="status-indicator" :class="user.status ? user.status.toLowerCase() : 'activo'">
                    <span class="dot"></span> {{ user.status || 'Activo' }}
                  </span>
                </td>
                <td class="light-text">-</td>
                <td class="actions-col">
                  <button class="icon-btn" title="Editar" @click="openEditModal(user)">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button class="icon-btn danger" title="Eliminar" @click="confirmRemoveUser(user._id)" v-if="user.role !== 'Owner' && user._id !== userStore.id">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="settings-panel placeholder-panel" v-else-if="activeSettingTab === 'workspace'">
        <i class="fa-solid fa-building fa-4x"></i>
        <h3>Espacio de Trabajo</h3>
        <p>Próximamente podrás editar el nombre, logotipo y configuraciones generales de tu espacio.</p>
      </div>

      <div class="settings-panel" v-else-if="activeSettingTab === 'integrations'">
        <div class="panel-header">
          <div class="panel-title">
            <h3>Integraciones</h3>
            <p>Conecta NemoPlace con tus herramientas favoritas.</p>
          </div>
        </div>
        
        <div class="integrations-list">
          <div class="integration-card">
            <div class="integration-info">
              <div class="integration-icon ghl-icon">GHL</div>
              <div>
                <h4>Go High Level</h4>
                <p>Sincroniza tus prospectos de anuncios directamente desde GHL.</p>
              </div>
            </div>
            <button class="primary-button outline" @click="isGhlModalOpen = true">
              Conectar
            </button>
          </div>
        </div>
      </div>

      <div class="settings-panel placeholder-panel" v-else-if="activeSettingTab === 'billing'">
        <i class="fa-solid fa-credit-card fa-4x"></i>
        <h3>Facturación y Suscripción</h3>
        <p>Próximamente podrás administrar tus métodos de pago, ver facturas y mejorar tu plan.</p>
      </div>
    </div>

    <!-- Simple Invite Modal Overlay -->
    <div v-if="isInviteModalOpen" class="modal-overlay" @click.self="isInviteModalOpen = false">
      <div class="modal-content">
        <button class="close-btn" @click="isInviteModalOpen = false"><i class="fa-solid fa-xmark"></i></button>
        <h3>Invitar Nuevo Usuario</h3>
        <p>Envía una invitación para unirse a tu espacio de trabajo.</p>
        
        <form @submit.prevent="handleInviteUser" class="invite-form">
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input type="email" v-model="inviteForm.email" placeholder="ejemplo@empresa.com" required />
          </div>
          <div class="form-group">
            <label>Rol de Acceso</label>
            <select v-model="inviteForm.role">
              <option value="Administrador">Administrador (Acceso Total)</option>
              <option value="Lector">Lector (Solo ver estadísticas)</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" class="secondary-button" @click="isInviteModalOpen = false" :disabled="isInviting">Cancelar</button>
            <button type="submit" class="primary-button" :disabled="isInviting">
              <span v-if="isInviting"><i class="fa-solid fa-spinner fa-spin"></i> Enviando...</span>
              <span v-else>Enviar Invitación</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit User Modal Overlay -->
    <div v-if="isEditModalOpen" class="modal-overlay" @click.self="isEditModalOpen = false">
      <div class="modal-content">
        <button class="close-btn" @click="isEditModalOpen = false"><i class="fa-solid fa-xmark"></i></button>
        <h3>Editar Usuario</h3>
        <p>Actualiza los datos del perfil de este usuario.</p>
        
        <form @submit.prevent="handleUpdateUser" class="invite-form">
          <div class="form-group">
            <label>Nombre</label>
            <input type="text" v-model="editForm.name" placeholder="Nombre completo" required />
          </div>
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input type="email" v-model="editForm.email" placeholder="ejemplo@empresa.com" required />
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input type="tel" v-model="editForm.phone" placeholder="+1234567890" />
          </div>
          <div class="form-group">
            <label>Rol de Acceso</label>
            <select v-model="editForm.role">
              <option value="Owner">Owner (Propietario)</option>
              <option value="Administrador">Administrador (Acceso Total)</option>
              <option value="Lector">Lector (Solo ver estadísticas)</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" class="secondary-button" @click="isEditModalOpen = false" :disabled="isUpdating">Cancelar</button>
            <button type="submit" class="primary-button" :disabled="isUpdating">
              <span v-if="isUpdating"><i class="fa-solid fa-spinner fa-spin"></i> Guardando...</span>
              <span v-else>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="isDeleteModalOpen" class="modal-overlay" @click.self="cancelRemoveUser">
      <div class="modal-content confirmation-modal">
        <div class="warning-icon">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h3>¿Eliminar Usuario?</h3>
        <p>¿Estás seguro de que deseas eliminar a este usuario de tu espacio de trabajo? Esta acción no se puede deshacer y el usuario perderá acceso de inmediato.</p>
        
        <div class="modal-actions centered">
          <button type="button" class="secondary-button" @click="cancelRemoveUser" :disabled="isDeleting">Cancelar</button>
          <button type="button" class="primary-button danger" @click="executeRemoveUser" :disabled="isDeleting">
            <span v-if="isDeleting"><i class="fa-solid fa-spinner fa-spin"></i> Eliminando...</span>
            <span v-else>Sí, eliminar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- GHL Modal -->
    <ConnectGhlModal
      :isOpen="isGhlModalOpen"
      :isConnecting="isConnecting"
      @close="isGhlModalOpen = false"
      @connect="handleConnectGhl"
    />
  </div>
</template>

<style lang="scss" scoped>
.settings-tab {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tab-header {
  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  p {
    color: var(--text-secondary);
    margin: 0;
  }
}

.settings-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
}

.settings-sidebar {
  width: 250px;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    width: 100%;
  }

  .settings-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    @media (max-width: 1024px) {
      flex-direction: row;
      overflow-x: auto;
      padding-bottom: 0.5rem;
      
      &::-webkit-scrollbar {
        height: 4px;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: var(--radius-full);
      }
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.85rem 1.25rem;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: var(--radius-md);
      font-weight: 500;
      transition: all 0.2s ease;

      @media (max-width: 1024px) {
        white-space: nowrap;
      }

      i {
        font-size: 1.1rem;
        width: 20px;
        text-align: center;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
      }

      &.active {
        background: rgba(99, 102, 241, 0.1);
        color: var(--color-primary);
      }
    }
  }
}

.settings-panel {
  flex: 1;
  min-width: 0;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    padding: 1.25rem;
  }

  &.placeholder-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 6rem 2rem;
    color: var(--text-secondary);

    i {
      color: var(--color-primary);
      opacity: 0.5;
      margin-bottom: 1.5rem;
    }

    h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    h3 {
      font-size: 1.35rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    p {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin: 0;
    }

    .primary-button {
      background: var(--color-primary);
      color: white;
      border: none;
      padding: 0.75rem 1.25rem;
      border-radius: var(--radius-full);
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
      
      &:hover {
        background: var(--color-primary-hover);
        transform: translateY(-2px);
      }

      @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
      }
    }
  }
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th {
    padding: 1rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    vertical-align: middle;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: var(--text-secondary);
  }

  .spinner.inline-spinner {
    width: 24px;
    height: 24px;
    border-width: 2px;
    margin: 0 auto 1rem auto;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.2rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;

      .user-name {
        font-weight: 600;
        color: var(--text-primary);
      }
      .user-email {
        font-size: 0.85rem;
        color: var(--text-secondary);
      }
    }
  }

  .role-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-secondary);

    &.owner {
      background: rgba(139, 92, 246, 0.1);
      color: #a78bfa;
      border: 1px solid rgba(139, 92, 246, 0.2);
    }
    
    &.administrador {
      background: rgba(99, 102, 241, 0.1);
      color: var(--color-primary);
      border: 1px solid rgba(99, 102, 241, 0.2);
    }
  }

  .status-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-secondary);

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
    }

    &.activo .dot { background: var(--color-success); }
    &.pendiente .dot { background: #fbbf24; }
  }

  .light-text {
    color: var(--text-secondary);
    font-size: 0.85rem;
  }

  .actions-col {
    text-align: right;
    white-space: nowrap;
  }

  .icon-btn {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-primary);
    }

    &.danger:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;

  .modal-content {
    background: var(--bg-dark);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-lg);
    padding: 2rem;
    width: 100%;
    max-width: 450px;
    position: relative;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 1.2rem;
      cursor: pointer;
      
      &:hover { color: white; }
    }

    h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    p {
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }

    .invite-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        label {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        input, select {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          color: white;
          font-family: inherit;

          &:focus {
            outline: none;
            border-color: var(--color-primary);
          }
        }
        
        select option {
          background: var(--bg-dark);
        }
      }
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;

      button {
        padding: 0.75rem 1.5rem;
        border-radius: var(--radius-full);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .secondary-button {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: var(--text-primary);
        
        &:hover { background: rgba(255, 255, 255, 0.05); }
      }

      .primary-button {
        background: var(--color-primary);
        border: none;
        color: white;
        
        &:hover { background: var(--color-primary-hover); }

        &.danger {
          background: #ef4444;
          &:hover { background: #dc2626; }
        }
      }
    }

    &.confirmation-modal {
      text-align: center;

      .warning-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        margin: 0 auto 1.5rem auto;
      }

      p {
        margin-bottom: 2rem;
      }

      .modal-actions.centered {
        justify-content: center;
        margin-top: 0;
      }
    }
  }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255,255,255,0.1);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    input {
      padding: 0.85rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-size: 1rem;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: var(--color-primary);
        background: rgba(255, 255, 255, 0.08);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: rgba(255, 255, 255, 0.02);
      }
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
    
    .edit-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .text-button {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-weight: 500;
      cursor: pointer;
      padding: 0.5rem 1rem;
      
      &:hover {
        color: var(--text-primary);
      }
    }
    
    .secondary-button {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.75rem 2rem;
      border-radius: var(--radius-full);
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
    .primary-button {
      background: var(--color-primary);
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: var(--radius-full);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: var(--color-primary-hover);
        transform: translateY(-2px);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
      }
    }
  }
}
</style>
