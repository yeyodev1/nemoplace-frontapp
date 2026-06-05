import APIBase from "./httpBase";

class UsersApi extends APIBase {
  async getWorkspaceUsers(workspaceId: string) {
    const { data } = await this.get(`workspaces/${workspaceId}/users`);
    return data;
  }

  async inviteUser(workspaceId: string, email: string, role: string) {
    const { data } = await this.post(`workspaces/${workspaceId}/users`, { email, role });
    return data;
  }

  async updateUser(workspaceId: string, userId: string, payload: { name: string; email: string; phone: string; role: string }) {
    const { data } = await this.put(`workspaces/${workspaceId}/users/${userId}`, payload);
    return data;
  }

  async deleteUser(workspaceId: string, userId: string) {
    const { data } = await this.delete(`workspaces/${workspaceId}/users/${userId}`);
    return data;
  }
}

export const usersApi = new UsersApi();
