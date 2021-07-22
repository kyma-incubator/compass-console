import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import {
  UPDATE_SCENARIOS,
  GET_SCENARIOS_LABEL_SCHEMA,
  CREATE_SCENARIOS_LABEL,
  SET_APPLICATION_SCENARIOS,
  SET_RUNTIME_SCENARIOS,
  REQUEST_BUNDLE_INSTANCE_AUTH_CREATION,
  SET_BUNDLE_INSTANCE_AUTH,
} from '../../gql';
import { SEND_NOTIFICATION } from '../../../../gql';

import CreateScenarioModal from './CreateScenarioModal.component';

// create input for both create and update
function createLabelDefinitionInput(scenarios) {
  const schema = {
    type: 'array',
    minItems: 1,
    uniqueItems: true,
    items: { type: 'string', enum: scenarios },
  };
  return {
    key: 'scenarios',
    schema: JSON.stringify(schema),
  };
}

export default compose(
  graphql(UPDATE_SCENARIOS, {
    props: (props) => ({
      addScenario: async (currentScenarios, newScenario) => {
        const input = createLabelDefinitionInput([
          ...currentScenarios,
          newScenario,
        ]);
        await props.mutate({ variables: { in: input } });
      },
    }),
  }),
  graphql(CREATE_SCENARIOS_LABEL, {
    props: (props) => ({
      createScenarios: async (scenarios) => {
        // add required scenario
        if (!scenarios.includes('DEFAULT')) {
          scenarios.push('DEFAULT');
        }
        const input = createLabelDefinitionInput(scenarios);
        await props.mutate({ variables: { in: input } });
      },
    }),
  }),
  graphql(SET_APPLICATION_SCENARIOS, {
    props: (props) => ({
      setApplicationScenarios: async (applicationId, scenarios) => {
        await props.mutate({
          variables: {
            id: applicationId,
            scenarios,
          },
        });
      },
    }),
  }),
  graphql(SET_RUNTIME_SCENARIOS, {
    props: (props) => ({
      setRuntimeScenarios: async (runtimeId, scenarios) => {
        await props.mutate({
          variables: {
            id: runtimeId,
            scenarios,
          },
        });
      },
    }),
  }),
  graphql(GET_SCENARIOS_LABEL_SCHEMA, {
    name: 'scenariosQuery',
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
  graphql(REQUEST_BUNDLE_INSTANCE_AUTH_CREATION, {
    props: (props) => ({
      requestBundleInstanceAuthCreation: async (bundleId) =>
        // in variables are hardcoded as they give no meaning in the current situation
        props.mutate({
          variables: {
            id: bundleId,
            in: {
              context: '{"ContextData":"ContextValue"}',
              inputParams: '{"InKey":"InValue"}',
            },
          },
        }),
    }),
  }),
  graphql(SET_BUNDLE_INSTANCE_AUTH, {
    props: (props) => ({
      setBundleInstanceAuth: async (authId, rawInput) => {
        const input = {
          auth: {
            credential: rawInput,
          },
        };

        return props.mutate({
          variables: {
            id: authId,
            in: input,
          },
        });
      },
    }),
  }),
)(CreateScenarioModal);
