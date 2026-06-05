import { defineStore } from 'pinia'

export interface UserState {
  id: string | null
  name: string | null
  email: string | null
  workspaceId: string | null
  isAuthenticated: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: null,
    name: null,
    email: null,
    workspaceId: null,
    isAuthenticated: false,
  }),

  actions: {
    hydrate() {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token')
      const id = localStorage.getItem('user_id')
      const workspaceId = localStorage.getItem('workspace_id')

      this.isAuthenticated = !!token
      this.id = id || null
      this.workspaceId = workspaceId || null
    },

    setUser(payload: { id?: string; name?: string; email?: string; workspaceId?: string }) {
      if (payload.id !== undefined) {
        this.id = payload.id
        try {
          localStorage.setItem('user_id', payload.id)
        } catch {}
      }
      if (payload.name) this.name = payload.name
      if (payload.email) this.email = payload.email
      if (payload.workspaceId) {
        this.workspaceId = payload.workspaceId
        try {
          localStorage.setItem('workspace_id', payload.workspaceId)
        } catch {}
      }
      this.isAuthenticated = true
    },

    clear() {
      this.id = null
      this.name = null
      this.email = null
      this.workspaceId = null
      this.isAuthenticated = false
      try {
        localStorage.removeItem('access_token')
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        localStorage.removeItem('workspace_id')
      } catch {}
    },
  },
})
