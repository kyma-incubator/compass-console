import { graphql } from 'react-apollo';
import { compose } from 'react-recompose';

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
