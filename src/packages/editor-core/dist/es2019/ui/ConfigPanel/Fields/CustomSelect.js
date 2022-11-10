import _extends from "@babel/runtime/helpers/extends";
import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl-next';
import { messages } from '../messages';
import { Field } from '@atlaskit/form';
import { AsyncCreatableSelect } from '@atlaskit/select';
import { formatOptionLabel } from './SelectItem';
import { getCustomFieldResolver } from '@atlaskit/editor-common/extensions';
import FieldMessages from '../FieldMessages';
import UnhandledType from './UnhandledType';
import { validate } from '../utils';

function FieldError({
  name,
  field
}) {
  const {
    type
  } = field.options.resolver;
  return /*#__PURE__*/React.createElement(UnhandledType, {
    key: name,
    field: field,
    errorMessage: `Field "${name}" can't be rendered. Missing resolver for "${type}".`
  });
}

function CustomSelect({
  name,
  autoFocus,
  extensionManifest,
  placeholder,
  field,
  onFieldChange,
  parameters,
  intl
}) {
  const {
    defaultValue: fieldDefaultValue,
    description,
    isMultiple,
    isRequired,
    label,
    options
  } = field;
  const [loading, setLoading] = useState(true);
  const [resolver, setResolver] = useState(null);
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [defaultValue, setDefaultValue] = useState(undefined);
  useEffect(() => {
    let cancel = false;

    async function fetchResolver() {
      setLoading(true);

      try {
        const resolver = await getCustomFieldResolver(extensionManifest, field.options.resolver);

        if (cancel) {
          return;
        }

        setResolver(() => resolver); // fetch the default values

        const options = await resolver(undefined, fieldDefaultValue, parameters);
        setDefaultOptions(options);

        if (cancel) {
          return;
        } // filter returned values to match the defaultValue


        if (fieldDefaultValue && isMultiple) {
          setDefaultValue(options.filter(option => fieldDefaultValue.includes(option.value)));
        }

        if (fieldDefaultValue && !isMultiple) {
          setDefaultValue(options.find(option => fieldDefaultValue === option.value));
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }

      setLoading(false);
    }

    fetchResolver();
    return () => {
      cancel = true;
    };
  }, [extensionManifest, field.options.resolver, fieldDefaultValue, isMultiple, parameters]);

  function formatCreateLabel(value) {
    if (!value) {
      return null;
    }

    const message = intl.formatMessage(messages.createOption);
    return `${message} "${value}"`;
  }

  const {
    isCreatable
  } = options;
  return /*#__PURE__*/React.createElement(Field, {
    name: name,
    label: label,
    isRequired: isRequired,
    defaultValue: defaultValue,
    validate: value => validate(field, value)
  }, ({
    fieldProps,
    error
  }) => /*#__PURE__*/React.createElement(React.Fragment, null, resolver && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AsyncCreatableSelect, _extends({}, fieldProps, {
    onChange: value => {
      fieldProps.onChange(value); // We assume onChange is called whenever values actually changed
      // for isDirty

      onFieldChange(name, true);
    } // @see DST-2386 & ED-12503
    ,
    enableAnimation: false // add type cast to avoid adding a "IsMulti" generic prop (TODO: ED-12072)
    ,
    isMulti: isMultiple || false,
    isClearable: true,
    isValidNewOption: value => isCreatable && value,
    validationState: error ? 'error' : 'default',
    defaultOptions: defaultOptions,
    formatCreateLabel: value => formatCreateLabel(value),
    formatOptionLabel: formatOptionLabel,
    loadOptions: searchTerm => {
      return resolver(searchTerm, fieldDefaultValue, parameters);
    },
    autoFocus: autoFocus,
    placeholder: placeholder
  })), /*#__PURE__*/React.createElement(FieldMessages, {
    error: error,
    description: description
  })), !loading && !resolver && /*#__PURE__*/React.createElement(FieldError, {
    name: name,
    field: field
  })));
}

export default injectIntl(CustomSelect);