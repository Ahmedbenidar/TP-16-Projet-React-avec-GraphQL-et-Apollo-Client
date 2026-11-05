import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

const lienHttp = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI ?? 'http://localhost:8090/graphql',
  credentials: 'omit'
});

const journalErreurs = new ApolloLink((operation, forward) => {
  return forward(operation).map((reponse) => {
    const erreurs = reponse.errors ?? [];
    if (erreurs.length > 0) {
      console.warn('[GraphQL]', operation.operationName, erreurs.map((e) => e.message).join(' | '));
    }
    return reponse;
  });
});

export const client = new ApolloClient({
  link: ApolloLink.from([journalErreurs, lienHttp]),
  cache: new InMemoryCache({
    typePolicies: {
      Compte: { keyFields: ['id'] },
      Transaction: { keyFields: ['id'] }
    }
  }),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'network-only', nextFetchPolicy: 'cache-first' },
    query: { fetchPolicy: 'network-only' },
    mutate: { errorPolicy: 'all' }
  }
});
