import React from 'react';
import PropTypes from 'prop-types';
import './InputWithPrefix.scss';

export const InputWithPrefix = ({
  prefix,
  required,
  onChange,
  value,
  replacePrefix,
  ...props
}) => {
  if (replacePrefix && value.startsWith(prefix)) {
    value = value.substring(prefix.length);
  }

  const onValueChange = (event) => {
    if (replacePrefix) {
      const targetValue = event.target.value;
      if (targetValue.startsWith(prefix)) {
        event.target.value = targetValue.substring(prefix.length);
      }
    }
    onChange && onChange(event);
  };

  return (
    <div className="input-with-prefix">
      <span className="input-with-prefix__prefix">{prefix}</span>
      <input
        data-prefix={prefix}
        role="input"
        className="fd-form__control"
        required={required}
        type="text"
        aria-required={required}
        onChange={onValueChange}
        value={value}
        {...props}
      />
    </div>
  );
};

InputWithPrefix.propTypes = {
  prefix: PropTypes.string.isRequired,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
  replacePrefix: PropTypes.bool,
};

InputWithPrefix.defaultProps = {
  required: false,
  replacePrefix: false,
};
