import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { createApolloClient, loadClientIdFromToken } from './store';
import { useMicrofrontendContext, useConfig } from 'react-shared';

export const ApolloClientProvider = ({ children }) => {
  const { tenantId, idToken } = useMicrofrontendContext();
  const { fromConfig } = useConfig();

  if (!idToken) {
    return <p>Loading...</p>;
  }

  loadClientIdFromToken(idToken);

  const apiUrl = fromConfig('compassApiUrl');
  const client = createApolloClient(apiUrl, tenantId, idToken);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
