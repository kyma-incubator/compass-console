import LuigiClient from '@luigi-project/client';

export const useShowSystemNamespaces = () =>
  (LuigiClient.getActiveFeatureToggles() || []).includes(
    'showSystemNamespaces',
  );
