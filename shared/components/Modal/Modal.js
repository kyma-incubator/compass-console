import React from 'react';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Modal.scss';
import { Modal as FdModal, Button } from 'fundamental-react';
import { Tooltip } from '../Tooltip/Tooltip';
import { Spinner } from '../Spinner/Spinner';

Modal.propTypes = {
  title: PropTypes.any,
  modalOpeningComponent: PropTypes.any.isRequired,
  onShow: PropTypes.func,
  actions: PropTypes.any,
  onHide: PropTypes.func,
  onConfirm: PropTypes.func,
  isConfirmHidden: PropTypes.bool,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  additionalButtonsText: PropTypes.array,
  onAdditionalButtons: PropTypes.array,
  areAdditionalButtonDisabled: PropTypes.array,
  type: PropTypes.string,
  disabledConfirm: PropTypes.bool,
  waiting: PropTypes.bool,
  tooltipData: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.any,
};

Modal.defaultProps = {
  title: 'Modal',
  confirmText: 'Confirm',
  actions: null,
  type: 'default',
  disabledConfirm: false,
  waiting: false,
  isConfirmHidden: false,
};

export function Modal({
  title,
  actions,
  modalOpeningComponent,
  onShow,
  onHide,
  onConfirm,
  confirmText,
  cancelText,
  type,
  disabledConfirm,
  waiting,
  tooltipData,
  children,
  className,
  additionalButtonsText,
  onAdditionalButtons,
  isConfirmHidden,
  areAdditionalButtonDisabled,
}) {
  const [show, setShow] = React.useState(false);
  function onOpen() {
    if (onShow) {
      onShow();
    }
    LuigiClient.uxManager().addBackdrop();
    setShow(true);
  }

  function onClose() {
    if (onHide) {
      onHide();
    }
    LuigiClient.uxManager().removeBackdrop();
    setShow(false);
  }

  function handleConfirmClicked() {
    if (onConfirm) {
      const result = onConfirm();
      // check if confirm is not explicitly cancelled
      if (result !== false) {
        onClose();
      }
    } else {
      onClose();
    }
  }

  function handleAdditionButtonClicked(fn) {
    if (fn) {
      fn();
    }
  }

  const createActions = () => {
    const confirmMessage = waiting ? (
      <div style={{ width: '97px', height: '16px' }}>
        <Spinner />
      </div>
    ) : (
      confirmText
    );

    const confirmButton = (
      <Button
        option="emphasized"
        onClick={handleConfirmClicked}
        disabled={disabledConfirm}
        data-e2e-id="modal-confirmation-button"
      >
        {confirmMessage}
      </Button>
    );

    const additionalButtons = onAdditionalButtons
      ? onAdditionalButtons.map((buttonFn, idx) => {
          return (
            <Button
              option="emphasized"
              onClick={handleAdditionButtonClicked.bind(this, buttonFn)}
              disabled={areAdditionalButtonDisabled[idx]}
              data-e2e-id={'modal-addition-button-' + idx}
            >
              {additionalButtonsText[idx]}
            </Button>
          );
        })
      : null;

    return (
      <>
        <div className="position-wrapper">
          <div className="position-wrapper__left">{additionalButtons}</div>
          <div className="position-wrapper__right">
            {cancelText && (
              <Button
                style={{ marginRight: '12px' }}
                option="light"
                onClick={onClose}
              >
                {cancelText}
              </Button>
            )}
            {!isConfirmHidden ? (
              tooltipData ? (
                <Tooltip
                  {...tooltipData}
                  minWidth={
                    tooltipData.minWidth ? tooltipData.minWidth : '191px'
                  }
                >
                  {confirmButton}
                </Tooltip>
              ) : (
                confirmButton
              )
            ) : null}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div style={{ display: 'inline-block' }} onClick={onOpen}>
        {modalOpeningComponent}
      </div>
      <FdModal
        className={classNames('custom-modal', className)}
        type={type}
        title={title}
        show={show}
        onClose={onClose}
        actions={actions || createActions()}
      >
        {children}
      </FdModal>
    </>
  );
}
