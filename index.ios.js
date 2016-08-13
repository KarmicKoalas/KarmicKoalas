'use strict'

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, NavigatorIOS, View, Text, TouchableHighlight, TextInput, TabBarIOS, AlertIOS } from 'react-native';

import Splash from './app/components/Splash'

class KarmicKoalas extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedTab: 'welcome'
    };
  }

  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          navigationBarHidden: true,
          component: Splash,
          title: "Splash"
        }}
        style={{flex: 1}}
      />
    );
  }
}

const styles = StyleSheet.create({
    title: {
      height: 20,
      flexDirection: 'row',
    },
    tabItem: {
      height: 10,
      color: 'white'
    }
});

AppRegistry.registerComponent('KarmicKoalas', () => KarmicKoalas);
