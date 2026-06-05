import APIBase from "./httpBase";

class AuthApi extends APIBase {
  login(data: any) {
    return this.post("auth/login", data);
  }
  register(data: any) {
    return this.post("auth/register", data);
  }
  me() {
    return this.get("auth/me");
  }
}

export const authApi = new AuthApi();
