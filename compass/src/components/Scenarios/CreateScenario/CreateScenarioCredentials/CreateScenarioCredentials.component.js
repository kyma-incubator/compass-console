import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormSet, FormMessage } from 'fundamental-react';

import {
  CREDENTIAL_TYPE_OAUTH,
  CREDENTIAL_TYPE_BASIC,
  getRefsValues,
  CredentialsForm,
} from 'react-shared';

const error = 'At least one form value is empty';

export default function CreateScenarioCredentials({
  applicationToAssign,
  updateCredentialsError,
  updateCredentials,
  credentials,
  credentialsType,
  updateCredentialType,
  credentialsError,
}) {
  const credentialsList = {
    [CREDENTIAL_TYPE_OAUTH]: CREDENTIAL_TYPE_OAUTH,
    [CREDENTIAL_TYPE_BASIC]: CREDENTIAL_TYPE_BASIC,
  };

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

  const defaultValues = credentials
    ? {
        oAuth: {
          clientId: credentials.clientId,
          clientSecret: credentials.clientSecret,
          url: credentials.url,
        },
        basic: {
          username: credentials.username,
          password: credentials.password,
        },
      }
    : null;

  useEffect(() => {
    updateCredentialsError(checkForError(), applicationToAssign.id);
    console.log(applicationToAssign.name, checkForError());
  }, [credentials, credentialsType]);

  const onCredentialsChange = () => {
    const credentialValues =
      credentialsType === CREDENTIAL_TYPE_OAUTH
        ? getRefsValues(credentialRefs.oAuth)
        : getRefsValues(credentialRefs.basic);

    updateCredentials(credentialValues, applicationToAssign.id);

    updateCredentialsError(credentialsError, applicationToAssign.id);
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

  // console.log( 'credentialsError', credentialsError, applicationToAssign.id)

  return (
    <section className="create-scenario-credentials">
      <h3>{applicationToAssign.name}</h3>
      <FormSet onChange={onCredentialsChange}>
        <CredentialsForm
          id={applicationToAssign.id}
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
  applicationToAssign: PropTypes.object.isRequired,
  updateCredentialsError: PropTypes.func.isRequired,
  credentials: PropTypes.object,
  updateCredentials: PropTypes.func,
  credentialsType: PropTypes.string,
  updateCredentialType: PropTypes.func,
  credentialsError: PropTypes.string,
};
