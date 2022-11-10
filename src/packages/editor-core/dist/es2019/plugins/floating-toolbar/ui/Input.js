import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { Component } from 'react';
import { panelTextInput } from '../../../ui/PanelTextInput/styles';
export default class TextField extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleChange", e => {
      this.setState({
        text: e.target.value
      });
    });

    _defineProperty(this, "handleSubmit", e => {
      e.preventDefault();

      if (this.props.onSubmit) {
        this.props.onSubmit(this.state.text);
      }
    });

    _defineProperty(this, "handleBlur", e => {
      e.preventDefault();

      if (this.props.onBlur) {
        this.props.onBlur(this.state.text);
      }
    });

    this.state = {
      text: props.defaultValue || ''
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.text !== nextProps.defaultValue) {
      this.setState({
        text: nextProps.defaultValue || ''
      });
    }
  }

  render() {
    const {
      placeholder
    } = this.props;
    return jsx("form", {
      onSubmit: this.handleSubmit
    }, jsx("input", {
      css: panelTextInput,
      value: this.state.text,
      onChange: this.handleChange,
      placeholder: placeholder,
      onBlur: this.handleBlur
    }));
  }

}