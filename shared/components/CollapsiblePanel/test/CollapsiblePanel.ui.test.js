import React from 'react';
import renderer from 'react-test-renderer';
import { Button, Panel } from 'fundamental-react';
import { mount, shallow } from 'enzyme';

import { CollapsiblePanel } from './../CollapsiblePanel';

describe('Collapsible Panel', () => {
  const exceptPanelVisible = (component, isVisible) => {
    const body = component.find(Panel.Body);
    expect(body.hasClass('body--closed')).toBe(!isVisible);
    expect(body.hasClass('body--open')).toBe(isVisible);
  };

  it('Renders with minimal props (opened state)', () => {
    const component = renderer.create(
      <CollapsiblePanel title="Collapsible panel test">
        <p>test</p>
      </CollapsiblePanel>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('Renders in closed state', () => {
    const component = renderer.create(
      <CollapsiblePanel title="Collapsible panel test" isOpenInitially={false}>
        <p>test</p>
      </CollapsiblePanel>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('Applies custom class names to Panel', () => {
    const component = shallow(
      <CollapsiblePanel title="Collapsible panel" className="test-class-name">
        <p>test</p>
      </CollapsiblePanel>,
    );
    expect(component.find(Panel).hasClass('test-class-name')).toBe(true);
  });

  it('Is initially closed when isOpenInitially is false', () => {
    const component = shallow(
      <CollapsiblePanel title="Collapsible panel" isOpenInitially={false}>
        <p>test</p>
      </CollapsiblePanel>,
    );

    expect(component.find(Panel.Body).hasClass('body body--closed')).toBe(true);
    expect(component.find(Panel.Body).hasClass('body body--open')).toBe(false);
  });

  // eslint-disable-next-line jest/expect-expect
  it('Opens and closes (chevron)', async () => {
    const component = mount(
      <CollapsiblePanel title="Collapsible panel">
        <p>test</p>
      </CollapsiblePanel>,
    );
    const button = component.find(Button);

    // initially opened
    exceptPanelVisible(component, true);

    // close
    button.simulate('click');
    await component.update();
    exceptPanelVisible(component, false);

    // open again
    button.simulate('click');
    await component.update();
    exceptPanelVisible(component, true);
  });

  // eslint-disable-next-line jest/expect-expect
  it('Opens and closes (header)', async () => {
    const component = mount(
      <CollapsiblePanel title="Collapsible panel">
        <p>test</p>
      </CollapsiblePanel>,
    );
    const header = component.find(Panel.Header);

    // initially opened
    exceptPanelVisible(component, true);

    // close
    header.simulate('click');
    await component.update();
    exceptPanelVisible(component, false);

    // open again
    header.simulate('click');
    await component.update();
    exceptPanelVisible(component, true);
  });

  // eslint-disable-next-line jest/expect-expect
  it('Does not open modal when clicking on custom actions', async () => {
    const component = mount(
      <CollapsiblePanel
        title="Collapsible panel"
        actions={
          <button id="action-button" onClick={() => {}}>
            test
          </button>
        }
      >
        <p>test</p>
      </CollapsiblePanel>,
    );

    const button = component.find('#action-button');

    // close
    button.simulate('click');
    await component.update();

    // expect it's still opened
    exceptPanelVisible(component, true);
  });
});
