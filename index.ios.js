'use strict'

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, NavigatorIOS, View, Text, TouchableHighlight, TextInput, TabBarIOS, AlertIOS } from 'react-native';

import Main from './app/components/Main'
import Welcome from './welcome.ios'
import More from './more.ios'
import SignUp from './app/components/SignUp'
//import SocketView from './app/utils/sockets'
import ViewContainer from './app/components/ViewContainer'
import StatusBarBackground from './app/components/StatusBarBackground'
import TopNavigation from './app/components/TopNavigation'
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
      <TabBarIOS selectedTab={this.state.selectedTab}>
      <TabBarIOS.Item
        selected={this.state.selectedTab === 'welcome'}
        title='Welcome'
        onPress={() => {
            this.setState({
              selectedTab: 'welcome',
            });
        }}>
        <Welcome />
      </TabBarIOS.Item>

      <TabBarIOS.Item
        selected={this.state.selectedTab === 'SignUp'}
        title='SignUp'
        onPress={() => {
            this.setState({
              selectedTab: 'SignUp',
            });
        }}>
        <SignUp />
      </TabBarIOS.Item>

      <TabBarIOS.Item
        selected={this.state.selectedTab === 'TopNavigation'}
        title='TopNav'
        onPress={() => {
            this.setState({
              selectedTab: 'TopNavigation',
            });
        }}>
        <TopNavigation />
      </TabBarIOS.Item>
      <TabBarIOS.Item
        selected={this.state.selectedTab === 'Main'}
        title='Main'
        onPress={() => {
            this.setState({
              selectedTab: 'Main',
            });
        }}>
        <Main />
      </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}
const styles = StyleSheet.create({
    title: {
      height: 20,
      flexDirection: 'row',
    }
});

AppRegistry.registerComponent('KarmicKoalas', () => KarmicKoalas);
