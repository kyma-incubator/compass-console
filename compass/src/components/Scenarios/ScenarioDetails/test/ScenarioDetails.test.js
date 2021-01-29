import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ScenarioDetails from './../ScenarioDetails';

describe('ScenarioDetailsHeader', () => {
  it('Renders with minimal props', () => {
    const component = shallow(<ScenarioDetails scenarioName={'scenario'} />);
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
