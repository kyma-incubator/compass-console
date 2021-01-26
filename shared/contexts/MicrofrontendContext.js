import React, { createContext, useContext, useState, useEffect } from 'react';
import LuigiClient from '@luigi-project/client';

export const MicrofrontendContext = createContext({});

export function MicrofrontendContextProvider({ children }) {
  const [context, setContext] = useState({});
  const ctx = React.useRef({});
  function callback(newContext) {
    if (
      !Object.keys(ctx.current).length ||
      ctx.current.tenantId !== newContext.tenantId
    ) {
      ctx.current = newContext;
      setContext(ctx.current);
    }
  }
  useEffect(() => {
    const initHandle = LuigiClient.addInitListener(callback);
    const updateHandle = LuigiClient.addContextUpdateListener(callback);
    return () => {
      LuigiClient.removeContextUpdateListener(updateHandle);
      LuigiClient.removeInitListener(initHandle);
    };
  }, []);
  return (
    <MicrofrontendContext.Provider value={context}>
      {children}
    </MicrofrontendContext.Provider>
  );
}

export function useModuleEnabled(module) {
  const { backendModules } = useMicrofrontendContext();
  return backendModules && backendModules.includes(module);
}

export const useMicrofrontendContext = () => useContext(MicrofrontendContext);
