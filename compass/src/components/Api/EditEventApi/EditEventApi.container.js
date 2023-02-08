import { graphql } from 'react-apollo';
import { compose } from 'react-recompose';
import { SEND_NOTIFICATION } from './../../../gql';
import { GET_EVENT_DEFINITION } from './../gql';
import { UPDATE_EVENT_DEFINITION } from './gql';

import EditApi from './EditEventApi.component';

export default compose(
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
  graphql(GET_EVENT_DEFINITION, {
    name: 'eventApiDataQuery',
    options: ({ applicationId, apiPackageId, eventApiId }) => ({
      variables: {
        applicationId,
        apiPackageId,
        eventDefinitionId: eventApiId,
      },
    }),
  }),
  graphql(UPDATE_EVENT_DEFINITION, {
    props: ({ mutate }) => ({
      updateEventDefinition: async (id, input) =>
        mutate({
          variables: {
            id,
            in: input,
          },
        }),
    }),
  }),
)(EditApi);
