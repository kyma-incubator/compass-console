import React from 'react';
import renderer from 'react-test-renderer';
import PanelEntry from '../PanelEntry.component';

describe('PanelEntry', () => {
  it('Renders title and children', () => {
    const component = renderer.create(
      <PanelEntry title="testtitle">testcontent</PanelEntry>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
