import { ref } from 'vue';
import { metaApi } from '@/services/meta.api';

export interface MetaPage {
  id: string;
  name: string;
  access_token: string;
  category?: string;
  picture?: { data: { url: string } };
}

/**
 * Composable to handle Meta Ads integration flow following Official SDK patterns
 */
export function useMetaAds() {
  const isSDKLoaded = ref(false);
  const isLoggingIn = ref(false);
  const loginStatus = ref<'connected' | 'not_authorized' | 'unknown' | 'idle'>('idle');
  const error = ref<string | null>(null);

  // Flow steps for the UI
  const authStep = ref<'idle' | 'pick_page' | 'pick_ad_account' | 'done'>('idle');
  const availablePages = ref<MetaPage[]>([]);
  const availableAdAccounts = ref<any[]>([]);
  const currentSelectedPage = ref<MetaPage | null>(null);
  const longToken = ref<string | null>(null);

  const META_APP_ID = '1465122391696717'; // From the user's instructions

  /**
   * IMPORTANT: Reduced scopes to avoid "Invalid Scopes" if the app is not yet a verified Business App.
   * Eliminamos 'ads_management' porque la aplicación solo requiere LECTURA de métricas ('ads_read').
   * Añadimos 'instagram_basic' para habilitar la lectura de posts orgánicos en el Dashboard.
   * Añadimos 'pages_manage_posts' + 'instagram_content_publish' para programar publicaciones.
   */
  const REQUIRED_SCOPES = 'pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish,ads_read,business_management';

  const statusChangeCallback = async (response: any, workspaceId?: string) => {
    console.log('FB Status Change Response:', response);

    if (response.status === 'connected') {
      loginStatus.value = 'connected';
      const shortToken = response.authResponse.accessToken;

      if (isLoggingIn.value && workspaceId) {
        await handleBackendAuth(shortToken, workspaceId);
      }
    } else if (response.status === 'not_authorized') {
      loginStatus.value = 'not_authorized';
      isLoggingIn.value = false;
    } else {
      loginStatus.value = 'unknown';
      isLoggingIn.value = false;
    }
  };

  const checkLoginState = (workspaceId?: string) => {
    // @ts-ignore
    if (window.FB) {
      // @ts-ignore
      FB.getLoginStatus((response) => {
        statusChangeCallback(response, workspaceId);
      });
    }
  };

  const initSDK = (): Promise<void> => {
    return new Promise((resolve) => {
      // @ts-ignore
      if (window.FB) {
        isSDKLoaded.value = true;
        resolve();
        return;
      }

      // @ts-ignore
      window.fbAsyncInit = function () {
        // @ts-ignore
        FB.init({
          appId: META_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v22.0'
        });

        // @ts-ignore
        FB.AppEvents.logPageView();
        isSDKLoaded.value = true;

        // @ts-ignore
        FB.getLoginStatus((response) => {
          statusChangeCallback(response);
          resolve();
        });
      };

      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        // @ts-ignore
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        // @ts-ignore
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    });
  };

  const loginWithMeta = async (workspaceId: string) => {
    isLoggingIn.value = true;
    error.value = null;

    try {
      await initSDK();

      // @ts-ignore
      FB.login((response) => {
        statusChangeCallback(response, workspaceId);
      }, { scope: REQUIRED_SCOPES, auth_type: 'rerequest' });

    } catch (err: any) {
      isLoggingIn.value = false;
      error.value = 'No se pudo cargar el SDK de Meta.';
      console.error(err);
    }
  };

  const handleBackendAuth = async (shortToken: string, workspaceId: string) => {
    try {
      const res = await metaApi.authenticateMeta(shortToken, workspaceId);
      availablePages.value = res.data.pages || [];
      longToken.value = res.data.longToken || null;
      authStep.value = 'pick_page';
      isLoggingIn.value = false;
    } catch (err: any) {
      isLoggingIn.value = false;
      error.value = 'Error al verificar la cuenta con el servidor.';
      console.error(err);
    }
  };

  const selectPageAndSave = async (workspaceId: string, page: MetaPage) => {
    isLoggingIn.value = true;
    try {
      await metaApi.saveIntegration({
        workspaceId,
        pageId: page.id,
        pageName: page.name,
        pagePictureUrl: page.picture?.data?.url,
        accessToken: longToken.value || page.access_token,
        pageAccessToken: page.access_token
      });
      
      currentSelectedPage.value = page;
      
      // Fetch Ad Accounts automatically
      const res = await metaApi.getAdAccounts(workspaceId);
      let accounts = res.data.accounts || [];
      
      // Prioritize ad accounts that match the page name
      const pageNameLower = page.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      accounts.sort((a: any, b: any) => {
        const aName = a.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const bName = b.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        const aMatch = aName.includes(pageNameLower) || pageNameLower.includes(aName) ? 1 : 0;
        const bMatch = bName.includes(pageNameLower) || pageNameLower.includes(bName) ? 1 : 0;
        
        return bMatch - aMatch;
      });

      availableAdAccounts.value = accounts;
      authStep.value = 'pick_ad_account';
    } catch (err: any) {
      error.value = 'Error al guardar la página seleccionada.';
      console.error(err);
      throw err;
    } finally {
      isLoggingIn.value = false;
    }
  };

  const selectAdAccountAndSave = async (workspaceId: string, account: any) => {
    isLoggingIn.value = true;
    try {
      await metaApi.saveIntegration({
        workspaceId,
        pageId: currentSelectedPage.value!.id,
        pageName: currentSelectedPage.value!.name,
        pagePictureUrl: currentSelectedPage.value!.picture?.data?.url,
        accessToken: longToken.value || currentSelectedPage.value!.access_token,
        adAccountId: account.account_id,
        adAccountName: account.name
      });
      authStep.value = 'done';
    } catch (err: any) {
      error.value = 'Error al guardar la página seleccionada.';
      console.error(err);
      throw err;
    } finally {
      isLoggingIn.value = false;
    }
  };

  return {
    isSDKLoaded,
    isLoggingIn,
    loginStatus,
    error,
    authStep,
    availablePages,
    availableAdAccounts,
    initSDK,
    loginWithMeta,
    checkLoginState,
    selectPageAndSave,
    selectAdAccountAndSave,
    resetFlow: () => { authStep.value = 'idle'; error.value = null; }
  };
}
