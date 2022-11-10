import _extends from "@babel/runtime/helpers/extends";
import React, { useEffect, useState } from 'react';
import { Field } from '@atlaskit/form';
import SmartUserPicker, { hydrateDefaultValues } from '@atlaskit/smart-user-picker';
import { getUserFieldContextProvider } from '@atlaskit/editor-common/extensions';
import UnhandledType from './UnhandledType';
import { validate } from '../utils';
import FieldMessages from '../FieldMessages';

function makeCompat(defaultValue) {
  if (!defaultValue) {
    return null;
  }

  if (Array.isArray(defaultValue)) {
    return defaultValue.map(id => ({
      type: 'user',
      id
    }));
  }

  return {
    type: 'user',
    id: defaultValue
  };
}

function makeSafe(value) {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    const ids = [];

    for (const {
      id
    } of value) {
      ids.push(id);
    }

    return ids;
  }

  return value.id;
}

const isOptionData = value => {
  if (!value) {
    return false;
  }

  return (Array.isArray(value) ? value : [value]).every(item => 'name' in item);
};

function SafeSmartUserPicker({
  context,
  field,
  formFieldProps,
  autoFocus,
  onBlur,
  onChange
}) {
  const [unsafeValue, setUnsafeValue] = useState(null);
  const {
    siteId,
    principalId,
    fieldId,
    productKey,
    containerId,
    objectId,
    childObjectId,
    productAttributes,
    includeUsers = true
  } = context;
  const {
    value: safeValue,
    ...formFieldPropsRest
  } = formFieldProps;
  const {
    isMultiple,
    placeholder
  } = field;

  function onChangeUnsafe(newValue) {
    setUnsafeValue(newValue);
    onChange(makeSafe(newValue));
  }

  useEffect(() => {
    let cancel = false;

    async function hydrate() {
      const hydrated = await hydrateDefaultValues(undefined, // no need to override baseUrl
      makeCompat(safeValue), productKey);

      if (cancel || !isOptionData(hydrated)) {
        return;
      }

      setUnsafeValue(hydrated);
    }

    hydrate();
    return () => {
      cancel = true;
    };
  }, [safeValue, productKey]);
  return /*#__PURE__*/React.createElement(SmartUserPicker, _extends({}, formFieldPropsRest, {
    onChange: onChangeUnsafe,
    autoFocus: autoFocus,
    onBlur: onBlur,
    maxOptions: 10,
    isClearable: true,
    isMulti: isMultiple,
    includeUsers: includeUsers,
    includeGroups: false,
    includeTeams: false,
    fieldId: fieldId,
    principalId: principalId,
    siteId: siteId,
    productKey: productKey,
    objectId: objectId,
    containerId: containerId,
    childObjectId: childObjectId,
    placeholder: placeholder,
    productAttributes: productAttributes,
    value: unsafeValue,
    width: "100%"
  }));
}

export default function UserSelect({
  name,
  autoFocus,
  extensionManifest,
  field,
  onFieldChange
}) {
  const [context, setContext] = useState({});
  const {
    siteId,
    principalId,
    fieldId,
    productKey
  } = context;
  const {
    label,
    defaultValue,
    description,
    isRequired,
    options
  } = field;
  const {
    type
  } = options.provider;
  useEffect(() => {
    let cancel = false;

    async function fetchContext() {
      try {
        const context = await (await getUserFieldContextProvider(extensionManifest, field.options.provider))();

        if (cancel) {
          return;
        }

        setContext(context);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }

    fetchContext();
    return () => {
      cancel = true;
    };
  }, [extensionManifest, field.options.provider]);
  return /*#__PURE__*/React.createElement(Field, {
    name: name,
    label: label,
    isRequired: isRequired,
    defaultValue: defaultValue,
    validate: value => validate(field, value)
  }, ({
    fieldProps,
    error
  }) => {
    // if any of these don't exists, the provider is missing
    if (!siteId || !principalId || !fieldId || !productKey) {
      return /*#__PURE__*/React.createElement(UnhandledType, {
        key: name,
        field: field,
        errorMessage: `Field "${name}" can't be renderered. Missing provider for "${type}".`
      });
    }

    function onChange(newValue) {
      fieldProps.onChange(newValue);
      onFieldChange(name, true);
    }

    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SafeSmartUserPicker, {
      context: context,
      field: field,
      formFieldProps: fieldProps,
      autoFocus: autoFocus || false,
      onBlur: () => onFieldChange(name, true),
      onChange: onChange
    }), /*#__PURE__*/React.createElement(FieldMessages, {
      error: error,
      description: description
    }));
  });
}