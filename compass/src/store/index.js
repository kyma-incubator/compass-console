import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { setContext } from 'apollo-link-context';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import jwt_decode from 'jwt-decode';

import resolvers from './resolvers';
import defaults from './defaults';

let clientId = null;

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [],
    },
  },
});
function handleUnauthorized() {
  window.parent.postMessage('unauthorized', '*');
}

export function createApolloClient(apiUrl, tenant, token) {
  const httpLink = createHttpLink({
    uri: apiUrl,
  });
  const authLink = setContext((_, { headers }) => {
    const headersVal = {
      ...headers,
      authorization: `Bearer ${token}`,
    };
    if (tenant && tenant !== '') {
      headersVal.tenant = tenant;
    }
    return {
      headers: headersVal,
    };
  });
  const authHttpLink = authLink.concat(httpLink);

  const cache = new InMemoryCache({ fragmentMatcher });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (networkError && networkError.statusCode === 401) {
      return handleUnauthorized();
    }

    if (process.env.REACT_APP_ENV !== 'production') {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      }

      if (networkError) {
        console.error(`[Network error]: ${networkError}`);
      }
    }
  });

  if (tenant === undefined) {
    // Views such as the Overview page and Tenant Search page should initialize a dummy Apollo Client
    return new ApolloClient({
      cache,
      link: ApolloLink.from([]),
    });
  }

  const stateLink = withClientState({
    cache,
    defaults,
    resolvers,
  });

  const client = new ApolloClient({
    uri: apiUrl,
    cache,
    link: ApolloLink.from([stateLink, errorLink, authHttpLink]),
    connectToDevTools: true,
  });

  return client;
}

export function loadClientIdFromToken(token) {
  const decodedToken = jwt_decode(token);
  clientId = decodedToken.name;
}

export function getClientId() {
  if (!clientId) {
    return null;
  }
  return clientId;
}
