import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import '@testing-library/jest-dom/extend-expect';
import { act } from '@testing-library/react';

Enzyme.configure({ adapter: new Adapter() });

global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

const nodeCrypto = require('crypto');
global.crypto = {
  getRandomValues(buffer) {
    return nodeCrypto.randomFillSync(Buffer.from(buffer));
  },
};
global.URL.createObjectURL = jest.fn();

global.wait = async (ms = 0) => {
  await act(
    () =>
      new Promise((resolve) => {
        setTimeout(resolve, ms);
      }),
  );
};
