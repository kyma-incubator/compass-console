import React from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'react-shared';
import { Button } from 'fundamental-react';
import ConnectApplication from './ConnectApplication';

ConnectApplicationModal.propTypes = {
  applicationId: PropTypes.string.isRequired,
};

export default function ConnectApplicationModal(props) {
  return (
    <Modal
      modalOpeningComponent={
        <Button option="emphasized">Connect Business System</Button>
      }
      title="Connect Business System"
      confirmText="Close"
    >
      <ConnectApplication {...props} />
    </Modal>
  );
}
