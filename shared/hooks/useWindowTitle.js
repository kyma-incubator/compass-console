import React, { useEffect } from 'react';
import LuigiClient from '@luigi-project/client';

export function setWindowTitle(title) {
  setImmediate(() =>
    LuigiClient.sendCustomMessage({ id: 'console.setWindowTitle', title }),
  );
}

export function useWindowTitle(title) {
  useEffect(() => setWindowTitle(title), [title]);
}

export function withTitle(title, Component) {
  // eslint-disable-next-line react/display-name
  return (props) => {
    setWindowTitle(title);
    return <Component {...props} />;
  };
}
