import React, { useState, useEffect } from 'react';
import { useStateFromPromise } from '../../utils/react-hooks/use-state-from-promise';
import ConfigPanel from './ConfigPanel';

const getFieldsDefinitionFn = (extensionManifest, nodeKey) => {
  if (extensionManifest && extensionManifest.modules.nodes && extensionManifest.modules.nodes[nodeKey] && extensionManifest.modules.nodes[nodeKey].getFieldsDefinition) {
    return extensionManifest.modules.nodes[nodeKey].getFieldsDefinition;
  }
}; // having the default value in the props instead of a reference will cause excessive rerenders


const defaultEmptyObject = {};

const FieldDefinitionsPromiseResolver = props => {
  const {
    extensionManifest,
    nodeKey,
    extensionParameters,
    setErrorMessage
  } = props;
  const [fields, setFields] = useState(undefined); // Resolve the promise
  // useStateFromPromise() has an issue which isn't compatible with
  // DynamicFieldDefinitions when it returns a function as setState()
  // will immediately run the function returned and pass it the currentState.

  useEffect(() => {
    if (!extensionManifest) {
      return;
    }

    const promiseFn = getFieldsDefinitionFn(extensionManifest, nodeKey);

    if (typeof promiseFn !== 'function') {
      setFields(undefined);
      return;
    }

    promiseFn(extensionParameters).catch(err => {
      if (err && typeof err.message === 'string') {
        setErrorMessage(err.message);
      }

      setFields(undefined);
    }).then(value => {
      if (Array.isArray(value)) {
        // value: FieldDefinition[]
        setFields(value);
      } else if (typeof value === 'function') {
        try {
          // value: DynamicFieldDefinitions
          const dynamicFields = value(extensionParameters);
          setFields(dynamicFields);
        } catch (err) {
          if (err instanceof Error) {
            setErrorMessage(err.message);
          }

          setFields(undefined);
        }
      } else {
        // value: undefined
        setFields(undefined);
      }
    });
  }, [extensionManifest, nodeKey, extensionParameters, setErrorMessage]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, props.children(fields));
};

export default function FieldsLoader({
  extensionType,
  extensionKey,
  nodeKey,
  extensionProvider,
  extensionParameters = defaultEmptyObject,
  parameters = defaultEmptyObject,
  autoSave,
  autoSaveTrigger,
  autoSaveReject,
  closeOnEsc,
  showHeader,
  onChange,
  onCancel
}) {
  const [extensionManifest] = useStateFromPromise(() => extensionProvider.getExtension(extensionType, extensionKey), [extensionProvider, extensionType, extensionKey]);
  const [errorMessage, setErrorMessage] = useState(null);
  return /*#__PURE__*/React.createElement(FieldDefinitionsPromiseResolver, {
    setErrorMessage: setErrorMessage,
    extensionManifest: extensionManifest,
    nodeKey: nodeKey,
    extensionParameters: extensionParameters
  }, fields => /*#__PURE__*/React.createElement(ConfigPanel, {
    extensionManifest: extensionManifest,
    isLoading: !extensionManifest || errorMessage === null && !fields,
    fields: fields,
    parameters: parameters,
    autoSave: autoSave,
    autoSaveTrigger: autoSaveTrigger,
    autoSaveReject: autoSaveReject,
    closeOnEsc: closeOnEsc,
    showHeader: showHeader,
    onChange: onChange,
    onCancel: onCancel,
    errorMessage: errorMessage
  }));
}