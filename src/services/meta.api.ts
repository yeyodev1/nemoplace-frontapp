import APIBase from "./httpBase";

class MetaApi extends APIBase {
  authenticateMeta(shortToken: string, workspaceId: string) {
    return this.post("meta/authenticate", { shortToken, workspaceId });
  }

  saveIntegration(data: {
    workspaceId: string;
    pageId: string;
    pageName: string;
    pagePictureUrl?: string;
    accessToken: string;
    pageAccessToken?: string;
    adAccountId?: string;
    adAccountName?: string;
  }) {
    return this.post("meta/save-integration", data);
  }

  getAdAccounts(workspaceId: string) {
    return this.get(`meta/${workspaceId}/adaccounts`);
  }

  getAdsInsights(workspaceId: string, params?: { adAccountId?: string; since?: string; until?: string; datePreset?: string }) {
    return this.get(`meta/${workspaceId}/ads-insights`, undefined, { params });
  }
}

export const metaApi = new MetaApi();
