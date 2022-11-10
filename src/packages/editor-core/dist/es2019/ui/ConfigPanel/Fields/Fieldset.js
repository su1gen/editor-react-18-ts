import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import SectionMessage from '@atlaskit/section-message';
import Button from '@atlaskit/button/custom-theme-button';
import Select from '@atlaskit/select';
import AddCircleIcon from '@atlaskit/icon/glyph/add-circle';
import { messages } from '../messages'; // eslint-disable-next-line import/no-cycle

import FormContent from '../FormContent';
import { getNameFromDuplicateField, isDuplicateField } from '../utils';
import { gridSize } from '@atlaskit/theme/constants';
import { N40A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
const actionsWrapper = css`
  border-top: 1px solid ${token('color.border', N40A)};
  margin-top: ${gridSize() * 2}px;
  padding-top: ${gridSize() * 2}px;
`;

const populateFromParameters = (parameters, fields) => {
  if (Object.keys(parameters).length) {
    const keys = Object.keys(parameters);
    const existingFieldKeys = keys.filter(key => fields.find(field => field.name === getNameFromDuplicateField(key)));

    if (existingFieldKeys.length > 0) {
      return existingFieldKeys;
    }
  }
};

const populateFromRequired = fields => {
  return fields.filter(field => field.isRequired).map(field => field.name);
};

const getInitialFields = (parameters = {}, fields, isDynamic) => {
  if (!isDynamic) {
    return new Set(fields.map(field => field.name));
  }

  const dynamicFields = [];
  const fromRequired = populateFromRequired(fields);

  if (fromRequired) {
    dynamicFields.push(...fromRequired);
  }

  const fromParameters = populateFromParameters(parameters, fields);

  if (fromParameters) {
    dynamicFields.push(...fromParameters);
  }

  if (dynamicFields.length === 0 && Array.isArray(fields) && fields.length > 0) {
    dynamicFields.push(fields[0].name);
  }

  return new Set(dynamicFields);
};

class FieldsetField extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "getSelectedFields", visibleFields => {
      const {
        field
      } = this.props;
      return [...visibleFields].map(fieldName => {
        const originalFieldDef = field.fields.find(field => field.name === getNameFromDuplicateField(fieldName));
        const fieldDef = { ...originalFieldDef,
          name: fieldName
        }; // for duplicate fields we only want the first one to actually be required

        if (originalFieldDef.name !== fieldName && fieldDef.isRequired === true) {
          fieldDef.isRequired = false;
        }

        return fieldDef;
      });
    });

    _defineProperty(this, "getSelectOptions", visibleFields => {
      const {
        field
      } = this.props;
      return field.fields.filter(field => field.allowDuplicates || !visibleFields.has(field.name)).map(field => ({
        value: field.name,
        label: field.label
      }));
    });

    _defineProperty(this, "setIsAdding", value => {
      this.setState(state => ({ ...state,
        isAdding: value
      }));
    });

    _defineProperty(this, "setCurrentParameters", parameters => {
      this.setState(state => ({ ...state,
        currentParameters: parameters
      }), // callback required so autosave can be triggered on
      // the right moment if fields are being removed
      () => this.props.onFieldChange(this.props.field.name, true));
    });

    _defineProperty(this, "setVisibleFields", fields => {
      this.setState(state => ({ ...state,
        visibleFields: fields,
        selectedFields: this.getSelectedFields(fields),
        selectOptions: this.getSelectOptions(fields)
      }));
    });

    _defineProperty(this, "onSelectItem", option => {
      const {
        visibleFields
      } = this.state;
      let newItem = option.value;
      const duplicates = [...visibleFields].filter(field => getNameFromDuplicateField(field) === newItem);

      if (duplicates.length > 0) {
        newItem += `:${duplicates.length}`;
      }

      this.setVisibleFields(new Set([...visibleFields, newItem]));
      this.setIsAdding(false);
    });

    _defineProperty(this, "onClickRemove", fieldName => {
      const {
        visibleFields,
        currentParameters
      } = this.state;
      visibleFields.delete(fieldName);
      this.setVisibleFields(new Set(visibleFields));
      const newParameters = { ...currentParameters
      };
      delete newParameters[fieldName]; // if any there are duplicate fields that come after the one removed, we want to reduce their
      // duplicate index eg. label:2 -> label:1

      if (isDuplicateField(fieldName)) {
        const [key, idx] = fieldName.split(':');
        let currentIdx = +idx;

        while (currentParameters[`${key}:${currentIdx + 1}`]) {
          newParameters[`${key}:${currentIdx}`] = currentParameters[`${key}:${currentIdx + 1}`];
          currentIdx++;
        }

        delete newParameters[`${key}:${currentIdx}`];
      }

      this.setCurrentParameters(newParameters);
    });

    _defineProperty(this, "renderActions", () => {
      const {
        intl
      } = this.props;
      const {
        selectOptions,
        isAdding
      } = this.state;

      if (selectOptions.length === 0) {
        return null;
      }

      return jsx(React.Fragment, null, isAdding ? jsx(Select, {
        testId: "field-picker",
        defaultMenuIsOpen: true,
        autoFocus: true,
        placeholder: intl.formatMessage(messages.addField),
        options: selectOptions,
        onChange: option => {
          if (option) {
            this.onSelectItem(option);
          }
        }
      }) : jsx(Button, {
        testId: "add-more",
        appearance: "subtle",
        iconBefore: jsx(AddCircleIcon, {
          size: "small",
          label: intl.formatMessage(messages.addField)
        }),
        onClick: () => this.setIsAdding(true)
      }, intl.formatMessage(messages.addField)));
    });

    const initialFields = getInitialFields(props.parameters, props.field.fields, props.field.options.isDynamic);
    this.state = {
      isAdding: false,
      currentParameters: props.parameters || {},
      visibleFields: initialFields,
      selectedFields: this.getSelectedFields(initialFields),
      selectOptions: this.getSelectOptions(initialFields)
    };
  }

  render() {
    const {
      name,
      field,
      extensionManifest,
      onFieldChange,
      firstVisibleFieldName,
      error
    } = this.props;
    const {
      label,
      options
    } = field;
    const {
      selectedFields,
      currentParameters,
      visibleFields
    } = this.state;
    const children = this.renderActions();
    return jsx(Fragment, null, error && jsx(FieldsetError, {
      message: error
    }), jsx("div", null, options.showTitle && jsx("h5", null, label), jsx(FormContent, {
      fields: selectedFields,
      parentName: name,
      extensionManifest: extensionManifest,
      parameters: currentParameters,
      canRemoveFields: field.options.isDynamic && visibleFields.size > 1,
      onClickRemove: this.onClickRemove,
      onFieldChange: onFieldChange,
      firstVisibleFieldName: firstVisibleFieldName
    }), children && jsx("div", {
      css: actionsWrapper,
      "data-testId": "fieldset-actions"
    }, children)));
  }

}

function FieldsetError({
  message
}) {
  return jsx("div", {
    css: sectionMessageWrapper
  }, jsx(SectionMessage, {
    appearance: "error"
  }, jsx("p", null, message)));
}

const sectionMessageWrapper = css`
  margin-bottom: 24px;
`;
export default injectIntl(FieldsetField);