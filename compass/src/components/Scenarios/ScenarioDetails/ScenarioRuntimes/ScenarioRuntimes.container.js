import { graphql } from 'react-apollo';
import { compose, fromRenderProps } from 'react-recompose';
import {
  GET_RUNTIMES_FOR_SCENARIO,
  SET_RUNTIME_SCENARIOS,
  createEqualityQuery,
  DELETE_RUNTIME_SCENARIOS_LABEL,
  GET_ASSIGNMENT_FOR_SCENARIO,
} from '../../gql';
import { SEND_NOTIFICATION } from '../../../../gql';

import ScenarioRuntimes from './ScenarioRuntimes.component';
import ScenarioNameContext from './../ScenarioNameContext';

export default compose(
  fromRenderProps(ScenarioNameContext.Consumer, (scenarioName) => ({
    scenarioName,
  })),
  graphql(SET_RUNTIME_SCENARIOS, {
    props: ({ mutate }) => ({
      setRuntimeScenarios: async (variables) => await mutate(variables),
    }),
  }),
  graphql(DELETE_RUNTIME_SCENARIOS_LABEL, {
    props: ({ mutate }) => ({
      deleteRuntimeScenarios: async (id) =>
        await mutate({
          variables: { id },
        }),
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
  graphql(GET_ASSIGNMENT_FOR_SCENARIO, {
    name: 'getScenarioAssignment',
    options: ({ scenarioName }) => ({
      errorPolicy: 'all',
      variables: {
        scenarioName,
      },
    }),
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(ScenarioRuntimes);
