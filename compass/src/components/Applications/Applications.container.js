import LuigiClient from '@luigi-project/client';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { GET_APPLICATIONS, UNREGISTER_APPLICATION_MUTATION } from './gql';

import Applications from './Applications.component';

export default compose(
  graphql(GET_APPLICATIONS, {
    name: 'applications',
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }),
  graphql(UNREGISTER_APPLICATION_MUTATION, {
    options: {
      onError: (e) => {
        LuigiClient.uxManager().showAlert({
          text: `An error occurred while deleting application: ${e.graphQLErrors[0].message}`,
          type: 'error',
          closeAfter: 15000,
        });
      },
    },
    props: ({ mutate }) => ({
      deleteApplication: async (id) => {
        await mutate({
          variables: {
            id,
          },
        });
      },
    }),
  }),
)(Applications);
