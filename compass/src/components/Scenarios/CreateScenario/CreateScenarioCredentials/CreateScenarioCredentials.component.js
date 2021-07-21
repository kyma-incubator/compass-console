import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  CREDENTIAL_TYPE_OAUTH,
  CREDENTIAL_TYPE_BASIC,
  getRefsValues,
  CredentialsForm,
} from 'react-shared';

import { FormSet, FormMessage } from 'fundamental-react';

const error = 'At least one form value in empty';

export default function CreateScenarioCredentials({
  applicationTemplates,
  applicationToAssign,
  updateCredentialsError,
  updateCredentials,
  credentials,
  credentialsType,
  updateCredentialType,
}) {
  const credentialsList = {
    [CREDENTIAL_TYPE_OAUTH]: CREDENTIAL_TYPE_OAUTH,
    [CREDENTIAL_TYPE_BASIC]: CREDENTIAL_TYPE_BASIC,
  };

  const [credentialsError, setCredentialsError] = React.useState(error);
  const credentialRefs = {
    oAuth: {
      clientId: React.useRef(null),
      clientSecret: React.useRef(null),
      url: React.useRef(null),
    },
    basic: {
      username: React.useRef(null),
      password: React.useRef(null),
    },
  };

  let defaultValues;
  if (credentials) {
    defaultValues = {
      oAuth: {
        clientId: credentials.clientId,
        clientSecret: credentials.clientSecret,
        url: credentials.url,
      },
      basic: {
        username: credentials.username,
        password: credentials.password,
      },
    };
  }

  useEffect(() => {
    updateCredentialsError(checkForError());
  }, []);

  const onCredentialsChange = () => {
    const credentialValues =
      credentialsType === CREDENTIAL_TYPE_OAUTH
        ? getRefsValues(credentialRefs.oAuth)
        : getRefsValues(credentialRefs.basic);

    updateCredentials(credentialValues, applicationToAssign.id);

    setCredentialsError(checkForError());

    updateCredentialsError(credentialsError);
  };

  const checkForError = () => {
    if (credentialsType === CREDENTIAL_TYPE_OAUTH) {
      return credentialRefs.oAuth.clientId.current.value.length === 0 ||
        credentialRefs.oAuth.clientSecret.current.value.length === 0 ||
        credentialRefs.oAuth.url.current.value.length === 0
        ? error
        : null;
    } else if (credentialsType === CREDENTIAL_TYPE_BASIC) {
      return credentialRefs.basic.username.current.value.length === 0 ||
        credentialRefs.basic.password.current.value.length === 0
        ? error
        : null;
    }
  };

  return (
    <section className="create-scenario-credentials">
      <h3>{applicationToAssign.name}</h3>
      <FormSet onChange={onCredentialsChange}>
        <CredentialsForm
          credentialRefs={credentialRefs}
          credentialType={credentialsType}
          setCredentialType={(v) =>
            updateCredentialType(v, applicationToAssign.id)
          }
          availableCredentialsList={credentialsList}
          defaultValues={defaultValues}
          message="These credentials will be used to communicate with the on-premise application"
        />
        {credentialsError && (
          <FormMessage type="error">{credentialsError}</FormMessage>
        )}
      </FormSet>
    </section>
  );
}

CreateScenarioCredentials.propTypes = {
  applicationTemplates: PropTypes.object.isRequired,
  applicationToAssign: PropTypes.object.isRequired,
  updateCredentialsError: PropTypes.func.isRequired,
  credentials: PropTypes.object,
  updateCredentials: PropTypes.func,
  credentialsType: PropTypes.string,
  updateCredentialType: PropTypes.func,
};
