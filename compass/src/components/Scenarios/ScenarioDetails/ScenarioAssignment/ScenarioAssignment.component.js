import React from 'react';
import PropTypes from 'prop-types';

import { GenericList } from 'react-shared';
import { useMutation } from '@apollo/react-hooks';

import unassignFormationHandler from '../shared/unassginFormationHandler';
import { SEND_NOTIFICATION } from '../../../../gql';

ScenarioAssignment.propTypes = {
  scenarioName: PropTypes.string.isRequired,
  getRuntimesForScenario: PropTypes.object.isRequired,
  getScenarioAssignment: PropTypes.object.isRequired,
  unassignFormation: PropTypes.func.isRequired,
};

export default function ScenarioAssignment({
  scenarioName,
  getRuntimesForScenario,
  getScenarioAssignment,
  unassignFormation,
}) {
  const [sendNotification] = useMutation(SEND_NOTIFICATION);
  const NOT_FOUND_MSG = 'NotFound';

  let hasScenarioAssignment = true;
  if (getScenarioAssignment.loading) {
    return <p>Loading...</p>;
  }
  if (getScenarioAssignment.error) {
    const errorType =
      getScenarioAssignment.error.graphQLErrors[0].extensions.error;
    if (!errorType.includes(NOT_FOUND_MSG)) {
      return `Error! ${getScenarioAssignment.error.message}`;
    }

    hasScenarioAssignment = false;
  }

  const showSuccessNotification = (scenarioAssignmentName) => {
    sendNotification({
      variables: {
        content: `Removed automatic scenario assignment from "${scenarioName}".`,
        title: 'Successfully removed',
        color: '#359c46',
        icon: 'accept',
        instanceName: scenarioName,
      },
    });
  };

  const actions = [
    {
      name: 'Delete',
      handler: async (scenarioAssignment) => {
        await unassignFormationHandler(
          unassignFormation,
          scenarioName,
          scenarioAssignment.selector.value,
          async () => {
            showSuccessNotification(scenarioAssignment.selector.key);
            await getScenarioAssignment.refetch();
            await getRuntimesForScenario.refetch();
          },
        );
      },
    },
  ];

  const scenarioAssignments = [];
  if (hasScenarioAssignment) {
    scenarioAssignments[0] =
      getScenarioAssignment.automaticScenarioAssignmentForScenario;
  }

  return (
    <GenericList
      title="Automatic Scenario Assignment"
      notFoundMessage="No Automatic Scenario Assignment for this Scenario"
      entries={scenarioAssignments}
      headerRenderer={() => ['Key', 'Value']}
      actions={actions}
      rowRenderer={(asa) => [asa.selector.key, asa.selector.value]}
      showSearchField={false}
    />
  );
}
