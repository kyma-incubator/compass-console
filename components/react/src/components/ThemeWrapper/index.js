import React, { Component } from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

import buildGlobalStyles from '../../../config/buildGlobalStyles';
import configureFonts from '../../../config/configureFonts';
import theme from '../../../config/theme';

createGlobalStyle([buildGlobalStyles()]);
configureFonts();

export default class ThemeWrapper extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div>{this.props.children}</div>
      </ThemeProvider>
    );
  }
}
