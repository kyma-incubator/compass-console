import { graphql } from 'react-apollo';
import { compose, fromRenderProps } from 'react-recompose';
import {
  GET_ASSIGNMENT_FOR_SCENARIO,
  UNASSIGN_FORMATION,
  GET_RUNTIMES_FOR_SCENARIO,
  createEqualityQuery,
} from '../../gql';
import { SEND_NOTIFICATION } from '../../../../gql';

import ScenarioAssignment from './ScenarioAssignment.component';
import ScenarioNameContext from './../ScenarioNameContext';

export default compose(
  fromRenderProps(ScenarioNameContext.Consumer, (scenarioName) => ({
    scenarioName,
  })),
  graphql(UNASSIGN_FORMATION, {
    props: ({ mutate }) => ({
      unassignFormation: async (formationName, objectID) =>
        await mutate({
          variables: {
            formationName,
            objectID,
            objectType: 'TENANT',
          },
        }),
    }),
  }),
  graphql(GET_ASSIGNMENT_FOR_SCENARIO, {
    name: 'getScenarioAssignment',
    options: ({ scenarioName }) => ({
      errorPolicy: 'all',
      variables: {
        scenarioName,
      },
    }),
  }),
  graphql(GET_RUNTIMES_FOR_SCENARIO, {
    name: 'getRuntimesForScenario',
    options: ({ scenarioName }) => {
      const filter = {
        key: 'scenarios',
        query: createEqualityQuery(scenarioName),
      };
      return {
        variables: {
          filter: [filter],
        },
      };
    },
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(ScenarioAssignment);
