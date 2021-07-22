import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import CustomPropTypes from '../../typechecking/CustomPropTypes';
import { TextFormItem } from '../TextFormItem/TextFormItem';

export const CREDENTIAL_TYPE_OAUTH = 'OAuth';

export const oAuthRefPropTypes = PropTypes.shape({
  clientId: CustomPropTypes.ref,
  clientSecret: CustomPropTypes.ref,
  url: CustomPropTypes.ref,
});

OAuthCredentialsForm.propTypes = {
  refs: oAuthRefPropTypes,
  defaultValues: PropTypes.object,
  id: PropTypes.string,
};

OAuthCredentialsForm.defaultProps = {
  id: uuidv4(),
};

export function OAuthCredentialsForm({ refs, defaultValues, id }) {
  return (
    <>
      <TextFormItem
        inputKey={id + 'client-id'}
        required
        type="password"
        label="Client ID"
        inputRef={refs.clientId}
        defaultValue={defaultValues && defaultValues.clientId}
      />
      <TextFormItem
        inputKey={id + 'client-secret'}
        required
        type="password"
        label="Client Secret"
        inputRef={refs.clientSecret}
        defaultValue={defaultValues && defaultValues.clientSecret}
      />
      <TextFormItem
        inputKey={id + 'url'}
        required
        type="url"
        label="Url"
        inputRef={refs.url}
        defaultValue={defaultValues && defaultValues.url}
      />
    </>
  );
}
