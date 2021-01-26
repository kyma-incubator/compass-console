import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import ScenarioRuntimes from '../ScenarioRuntimes.component';
import { responseMock } from './mock';
jest.mock('react-shared', () => ({
  GenericList: (props) => 'generic-list-mocked-content',
}));

describe('ScenarioRuntimes', () => {
  it('Renders with minimal props', () => {
    const component = shallow(
      <ScenarioRuntimes
        scenarioName="scenario name"
        getRuntimesForScenario={responseMock}
        deleteRuntimeScenarios={() => {}}
        setRuntimeScenarios={() => {}}
        getScenarioAssignment={() => {}}
        sendNotification={() => {}}
        updateRuntimesCount={() => {}}
      />,
    );

    expect(toJson(component)).toMatchSnapshot();
  });
});
