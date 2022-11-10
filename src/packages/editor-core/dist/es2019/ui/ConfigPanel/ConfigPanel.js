import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React, { useCallback, useRef, useEffect } from 'react';
import memoizeOne from 'memoize-one';
import { withAnalyticsContext, withAnalyticsEvents } from '@atlaskit/analytics-next';
import Form from '@atlaskit/form';
import { isTabGroup } from '@atlaskit/editor-common/extensions';
import _isEqual from 'lodash/isEqual';
import _mergeRecursive from 'lodash/merge';
import { fireAnalyticsEvent, EVENT_TYPE, ACTION_SUBJECT, ACTION } from '../../plugins/analytics';
import LoadingState from './LoadingState';
import Header from './Header';
import ErrorMessage from './ErrorMessage';
import { serialize, deserialize, findDuplicateFields } from './transformers';
import { injectIntl } from 'react-intl-next';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';
import { FormFooter } from '@atlaskit/form';
import { pluginKey as extensionPluginKey } from '../../plugins/extension/plugin-key';
import WithPluginState from '../WithPluginState';
import FormContent from './FormContent';
import { messages } from './messages';
import { FormErrorBoundary } from './FormErrorBoundary';

function ConfigForm({
  canSave,
  errorMessage,
  extensionManifest,
  fields,
  firstVisibleFieldName,
  hasParsedParameters,
  intl,
  isLoading,
  onCancel,
  onFieldChange,
  parameters,
  submitting,
  contextIdentifierProvider
}) {
  useEffect(() => {
    if (fields) {
      const firstDuplicateField = findDuplicateFields(fields);

      if (firstDuplicateField) {
        throw new Error(`Possible duplicate field name: \`${firstDuplicateField.name}\`.`);
      }
    }
  }, [fields]);

  if (isLoading || !hasParsedParameters && errorMessage === null) {
    return /*#__PURE__*/React.createElement(LoadingState, null);
  }

  if (errorMessage || !fields) {
    return /*#__PURE__*/React.createElement(ErrorMessage, {
      errorMessage: errorMessage || ''
    });
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormContent, {
    fields: fields,
    parameters: parameters,
    extensionManifest: extensionManifest,
    onFieldChange: onFieldChange,
    firstVisibleFieldName: firstVisibleFieldName,
    contextIdentifierProvider: contextIdentifierProvider
  }), /*#__PURE__*/React.createElement("div", {
    style: canSave ? {} : {
      display: 'none'
    }
  }, /*#__PURE__*/React.createElement(FormFooter, {
    align: "start"
  }, /*#__PURE__*/React.createElement(ButtonGroup, null, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    appearance: "primary"
  }, intl.formatMessage(messages.submit)), /*#__PURE__*/React.createElement(Button, {
    appearance: "default",
    isDisabled: submitting,
    onClick: onCancel
  }, intl.formatMessage(messages.cancel))))));
}

const ConfigFormIntl = injectIntl(ConfigForm);

const WithOnFieldChange = ({
  getState,
  autoSave,
  handleSubmit,
  children
}) => {
  const getStateRef = useRef(getState);
  useEffect(() => {
    getStateRef.current = getState;
  }, [getState]);
  const handleFieldChange = useCallback((name, isDirty) => {
    if (!autoSave) {
      return;
    } // Don't trigger submit if nothing actually changed


    if (!isDirty) {
      return;
    }

    const {
      errors,
      values
    } = getStateRef.current(); // Get only values that does not contain errors

    const validValues = {};

    for (const key of Object.keys(values)) {
      if (!errors[key]) {
        // not has error
        validValues[key] = values[key];
      }
    }

    handleSubmit(validValues);
  }, [autoSave, handleSubmit]);
  return children(handleFieldChange);
};

class ConfigPanel extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleKeyDown", e => {
      if ((e.key === 'Esc' || e.key === 'Escape') && this.props.closeOnEsc) {
        this.props.onCancel();
      }
    });

    _defineProperty(this, "backfillTabFormData", (fields, formData, currentParameters) => {
      const getRelevantData = (field, formParams, currentParams, backfill) => {
        if (field.hasGroupedValues && !(field.name in backfill)) {
          backfill[field.name] = {};
        }

        const actualFormParams = field.hasGroupedValues ? formParams[field.name] || {} : formParams;
        const actualCurrentParams = field.hasGroupedValues ? currentParams[field.name] || {} : currentParams;
        const actualBackfillParams = field.hasGroupedValues ? backfill[field.name] : backfill;
        return {
          formParams: actualFormParams,
          currentParams: actualCurrentParams,
          backfillParams: actualBackfillParams
        };
      }; // Traverse any tab structures and backfill field values on tabs
      // which aren't shown. This filter should be ok because tabs are
      // currently only allowed on top level


      const mergedTabGroups = fields.filter(isTabGroup).reduce((missingBackfill, tabGroup) => {
        const {
          formParams: tabGroupFormData,
          currentParams: tabGroupCurrentData,
          backfillParams: tabGroupParams
        } = getRelevantData(tabGroup, formData, currentParameters, missingBackfill); // Loop through tabs and see what fields are missing from current data

        tabGroup.fields.forEach(tabField => {
          const {
            formParams: tabFormData,
            currentParams: tabCurrentData,
            backfillParams: tabParams
          } = getRelevantData(tabField, tabGroupFormData, tabGroupCurrentData, tabGroupParams);
          tabField.fields.forEach(field => {
            if (field.name in tabFormData || !(field.name in tabCurrentData)) {
              return;
            }

            tabParams[field.name] = tabCurrentData[field.name];
          });
        });
        return missingBackfill;
      }, {});
      return _mergeRecursive({}, mergedTabGroups, formData);
    });

    _defineProperty(this, "handleSubmit", async formData => {
      const {
        fields,
        extensionManifest,
        onChange,
        autoSaveReject
      } = this.props;

      if (!extensionManifest || !fields) {
        if (!extensionManifest) {
          autoSaveReject === null || autoSaveReject === void 0 ? void 0 : autoSaveReject(new Error('Extension manifest not loaded'));
        } else if (!fields) {
          autoSaveReject === null || autoSaveReject === void 0 ? void 0 : autoSaveReject(new Error('Config fields not loaded'));
        }

        return;
      }

      try {
        const serializedData = await serialize(extensionManifest, this.backfillTabFormData(fields, formData, this.state.currentParameters), fields);
        onChange(serializedData);
      } catch (error) {
        autoSaveReject === null || autoSaveReject === void 0 ? void 0 : autoSaveReject(error); // eslint-disable-next-line no-console

        console.error(`Error serializing parameters`, error);
      }
    });

    _defineProperty(this, "parseParameters", async (fields, parameters) => {
      const {
        extensionManifest
      } = this.props;

      if (!extensionManifest || !fields || fields.length === 0) {
        // do not parse while fields are not returned
        return;
      }

      if (typeof parameters === 'undefined') {
        this.setState({
          currentParameters: {},
          hasParsedParameters: true
        });
        return;
      }

      const currentParameters = await deserialize(extensionManifest, parameters, fields);
      this.setState({
        currentParameters,
        hasParsedParameters: true
      });
    });

    _defineProperty(this, "renderHeader", memoizeOne(extensionManifest => {
      const {
        onCancel,
        showHeader
      } = this.props;

      if (!showHeader) {
        return null;
      }

      return /*#__PURE__*/React.createElement(Header, {
        icon: extensionManifest.icons['48'],
        title: extensionManifest.title,
        description: extensionManifest.description,
        summary: extensionManifest.summary,
        documentationUrl: extensionManifest.documentationUrl,
        onClose: onCancel
      });
    }));

    _defineProperty(this, "getFirstVisibleFieldName", memoizeOne(fields => {
      function nonHidden(field) {
        if ('isHidden' in field) {
          return !field.isHidden;
        }

        return true;
      } // finds the first visible field, true for FieldSets too


      const firstVisibleField = fields.find(nonHidden);
      let newFirstVisibleFieldName;

      if (firstVisibleField) {
        // if it was a fieldset, go deeper trying to locate the field
        if (firstVisibleField.type === 'fieldset') {
          const firstVisibleFieldWithinFieldset = firstVisibleField.fields.find(nonHidden);
          newFirstVisibleFieldName = firstVisibleFieldWithinFieldset && firstVisibleFieldWithinFieldset.name;
        } else {
          newFirstVisibleFieldName = firstVisibleField.name;
        }
      }

      return newFirstVisibleFieldName;
    }));

    _defineProperty(this, "setFirstVisibleFieldName", fields => {
      const newFirstVisibleFieldName = this.getFirstVisibleFieldName(fields);

      if (newFirstVisibleFieldName !== this.state.firstVisibleFieldName) {
        this.setState({
          firstVisibleFieldName: newFirstVisibleFieldName
        });
      }
    });

    this.state = {
      hasParsedParameters: false,
      currentParameters: {},
      firstVisibleFieldName: props.fields ? this.getFirstVisibleFieldName(props.fields) : undefined
    };
    this.onFieldChange = null;
  }

  componentDidMount() {
    const {
      fields,
      parameters
    } = this.props;
    this.parseParameters(fields, parameters);
  }

  componentWillUnmount() {
    const {
      createAnalyticsEvent,
      extensionManifest
    } = this.props;
    fireAnalyticsEvent(createAnalyticsEvent)({
      payload: {
        action: ACTION.CLOSED,
        actionSubject: ACTION_SUBJECT.CONFIG_PANEL,
        eventType: EVENT_TYPE.UI,
        attributes: {
          extensionKey: extensionManifest === null || extensionManifest === void 0 ? void 0 : extensionManifest.key,
          extensionType: extensionManifest === null || extensionManifest === void 0 ? void 0 : extensionManifest.type
        }
      }
    });
  }

  componentDidUpdate(prevProps) {
    const {
      parameters,
      fields,
      autoSaveTrigger,
      extensionManifest
    } = this.props;

    if (parameters && parameters !== prevProps.parameters || fields && (!prevProps.fields || !_isEqual(fields, prevProps.fields))) {
      this.parseParameters(fields, parameters);
    }

    if (fields && (!prevProps.fields || !_isEqual(fields, prevProps.fields))) {
      this.setFirstVisibleFieldName(fields);
    }

    if (prevProps.autoSaveTrigger !== autoSaveTrigger) {
      if (this.onFieldChange) {
        this.onFieldChange('', true);
      }
    }

    if (prevProps.extensionManifest === undefined && prevProps.extensionManifest !== extensionManifest) {
      // This will only be fired once when extensionManifest is loaded initially
      // Can't do this in componentDidMount because extensionManifest is still undefined at that point
      fireAnalyticsEvent(this.props.createAnalyticsEvent)({
        payload: {
          action: ACTION.OPENED,
          actionSubject: ACTION_SUBJECT.CONFIG_PANEL,
          eventType: EVENT_TYPE.UI,
          attributes: {
            extensionKey: extensionManifest === null || extensionManifest === void 0 ? void 0 : extensionManifest.key,
            extensionType: extensionManifest === null || extensionManifest === void 0 ? void 0 : extensionManifest.type
          }
        }
      });
    }
  }

  render() {
    const {
      extensionManifest
    } = this.props;

    if (!extensionManifest) {
      return /*#__PURE__*/React.createElement(LoadingState, null);
    }

    const {
      autoSave,
      errorMessage,
      fields,
      isLoading,
      onCancel
    } = this.props;
    const {
      currentParameters,
      hasParsedParameters,
      firstVisibleFieldName
    } = this.state;
    const {
      handleSubmit,
      handleKeyDown
    } = this;
    return /*#__PURE__*/React.createElement(Form, {
      onSubmit: handleSubmit
    }, ({
      formProps,
      getState,
      submitting
    }) => {
      return /*#__PURE__*/React.createElement(WithOnFieldChange, {
        autoSave: !!autoSave,
        getState: getState,
        handleSubmit: handleSubmit
      }, onFieldChange => {
        this.onFieldChange = onFieldChange;
        return /*#__PURE__*/React.createElement("form", _extends({}, formProps, {
          noValidate: true,
          onKeyDown: handleKeyDown,
          "data-testid": "extension-config-panel"
        }), this.renderHeader(extensionManifest), /*#__PURE__*/React.createElement(WithPluginState, {
          plugins: {
            extension: extensionPluginKey
          },
          render: ({
            extension
          }) => /*#__PURE__*/React.createElement(FormErrorBoundary, {
            contextIdentifierProvider: extension === null || extension === void 0 ? void 0 : extension.contextIdentifierProvider,
            extensionKey: extensionManifest.key,
            fields: fields || []
          }, /*#__PURE__*/React.createElement(ConfigFormIntl, {
            canSave: !autoSave,
            errorMessage: errorMessage,
            extensionManifest: extensionManifest,
            fields: fields,
            firstVisibleFieldName: firstVisibleFieldName,
            hasParsedParameters: hasParsedParameters,
            isLoading: isLoading || false,
            onCancel: onCancel,
            onFieldChange: onFieldChange,
            parameters: currentParameters,
            submitting: submitting,
            contextIdentifierProvider: extension === null || extension === void 0 ? void 0 : extension.contextIdentifierProvider
          }))
        }));
      });
    });
  }

}

export default withAnalyticsContext({
  source: 'ConfigPanel'
})(withAnalyticsEvents()(ConfigPanel));