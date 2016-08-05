'use strict'

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, NavigatorIOS, View, Text, TouchableHighlight, TextInput, TabBarIOS, AlertIOS } from 'react-native';

import Main from './app/components/Main'
import Welcome from './welcome.ios'
import SignUp from './app/components/SignUp'
//import ViewContainer from './app/components/ViewContainer'
//import StatusBarBackground from './app/components/StatusBarBackground'
import TopNavigation from './app/components/TopNavigation'
//import ListViewScreen from './app/components/ListViewScreen'
// import welcome_Icon from './app/assets/google_maps_icon.png';

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
          component: Main,
          title: "Main"
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
