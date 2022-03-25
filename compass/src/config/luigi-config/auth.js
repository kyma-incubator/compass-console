import OpenIdConnect from '@luigi-project/plugin-auth-oidc';
import { clusterConfig } from './clusterConfig';
import { getPreviousLocation } from './helpers/navigation-helpers';

async function fetchOIDCMetadata() {
  const domain = clusterConfig['domain'];

  try {
    const response = await fetch(
      `${clusterConfig.idpUrl}/.well-known/openid-configuration`,
    );
    return await response.json();
  } catch (e) {
    alert('Cannot fetch OIDC metadata');
    console.error('cannot fetch OIDC metadata', e);
  }
}

export default async function createAuth() {
  const domain = clusterConfig['domain'];

  const clientId = `${clusterConfig.oidcClientID}`;
  const oidcUserStoreKey = `oidc.user:${clusterConfig.idpUrl}:${clientId}`;

  const oidcMetadata = await fetchOIDCMetadata();
  return {
    use: 'openIdConnect',
    openIdConnect: {
      metadata: {
        ...oidcMetadata,
      },
      idpProvider: OpenIdConnect,
      authority: `${clusterConfig.idpUrl}`,
      client_id: clientId,
      scope: `${clusterConfig.oidcScopes}`,
      loadUserInfo: false,
      response_type: 'id_token',
      logoutUrl: `${clusterConfig.idpUrl}/oauth2/logout`,
      profileStorageInterceptorFn: () => {
        try {
          const oidsUserStore = JSON.parse(
            sessionStorage.getItem(oidcUserStoreKey),
          );
          oidsUserStore.profile = undefined;
          sessionStorage.setItem(
            oidcUserStoreKey,
            JSON.stringify(oidsUserStore),
          );
        } catch (e) {
          console.error('Error parsing oidc user data', e);
        }
      },
    },
    events: {
      onAuthSuccessful: () => {
        const prevLocation = getPreviousLocation();
        if (prevLocation) {
          window.location.replace(prevLocation);
        }
      },
    },
    storage: 'sessionStorage',
  };
}
