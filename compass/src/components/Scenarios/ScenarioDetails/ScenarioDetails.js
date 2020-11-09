import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ParentSize from '@visx/responsive/lib/components/ParentSize';

import ScenarioDetailsHeader from './ScenarioDetailsHeader/ScenarioDetailsHeader';
import ScenarioApplications from './ScenarioApplications/ScenarioApplications';
import ScenarioRuntimes from './ScenarioRuntimes/ScenarioRuntimes.container';
// import ScenarioAssignment from './ScenarioAssignment/ScenarioAssignment.container';

import ScenarioNameContext from './ScenarioNameContext';
import ScenarioApplicationsGraph from './ScenarioApplicationsGraph/ScenarioApplicationsGraph.component';

ScenarioDetails.propTypes = {
  scenarioName: PropTypes.string.isRequired,
};

export default function ScenarioDetails({ scenarioName }) {
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [runtimesCount, setRuntimesCount] = useState(0);

  return (
    <ScenarioNameContext.Provider value={scenarioName}>
      <ScenarioDetailsHeader
        applicationsCount={applicationsCount}
        runtimesCount={runtimesCount}
      />
      <ScenarioApplications updateApplicationsCount={setApplicationsCount} />
      <ScenarioRuntimes updateRuntimesCount={setRuntimesCount} />
      {/* <ScenarioAssignment /> */}
      <ParentSize>
        {({ width, height }) => (
          <ScenarioApplicationsGraph width={width} height={'400'} />
        )}
      </ParentSize>
    </ScenarioNameContext.Provider>
  );
}
