import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import App from './js';

export default class imagesrn extends Component {
  render() {
    console.log("---------", App);
    return <App />;
  }
}

AppRegistry.registerComponent('imagesrn', () => imagesrn);
