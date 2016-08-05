'use strict'

import React, { Component } from 'react'
import { StyleSheet, View, Text, MapView, TextInput, Dimensions, StatusBarIOS, TouchableHighlight, AsyncStorage } from 'react-native';
import Chat from './chat'
import MapComponent from './Map.js'
import SignUp from './SignUp'
import searchRoutes from './searchRoutes'
import createRoute from './createRoute'
import Events from './myEvents'
if (window.navigator && Object.keys(window.navigator).length == 0) {
  window = Object.assign(window, { navigator: { userAgent: 'ReactNative' }});
}
const io = require('socket.io-client/socket.io');
import userAgent from '../utils/userAgent'

// import io from 'socket.io-client/socket.io'

const { width, height } = Dimensions.get('window')

class Main extends Component {

  constructor(props) {
    super(props);
    
    this.setUserId = this.setUserId.bind(this); 
    this.navToSignUp = this.navToSignUp.bind(this);
    this.navToSearchRoutes = this.navToSearchRoutes.bind(this);
    this.navToEvents = this.navToEvents.bind(this);
    this.navToCreateRoute = this.navToCreateRoute.bind(this);

    this.socket = io('https://wegoios.herokuapp.com',  {jsonp: false, transports:['websocket'], allowUpgrades:true});
    this.state = {
      userId:'',
      eventId: '1',//eventId: props.eventId,   //this will come from group list view and pass to server
      socket:this.socket
    }
   // AsyncStorage.setItem("userId", "234");
    AsyncStorage.getItem("userId").then((value) => {
      if(value === null){
        this.navToSignUp();
      //console.log("userId:", value)
      // this.setState({
      //   userId = value
      // })
      } else {
        this.setUserId(value);
      }
    });
  }

  setUserId(userId){
    this.setState({
      userId: userId
    })
  }

  navToSignUp(){
    this.props.navigator.push({
      component: SignUp,
      title: "Sign Up",
      passProps: {
        setUserId: this.setUserId
      }
    });
  }

  navToSearchRoutes(){
    this.props.navigator.push({
      component: searchRoutes,
      title: "Search Routes"
    });
  }

// no view yet
  navToEvents(){
    this.props.navigator.push({
      component: Events,
      title: "Events"
    });
  }

  navToCreateRoute(){
    this.props.navigator.push({
      component: createRoute,
      title: "Create Route"
    });
  }

   componentDidMount() {
      this.state.socket = this.socket
      this.socket.emit('intitialize',{eventId:this.state.eventId, userId:this.state.userId})
 }

  render() {
    return (
      <View style={styles.container}>
        <MapComponent socket={this.state.socket}/>
        <Chat socket={this.socket}/>
        <TouchableHighlight
          style={styles.searchRoutesBtn}
          onPress={this.navToSearchRoutes}>
          <Text>Search</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.eventsBtn}
          onPress={this.navToEvents}>
          <Text>Events</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.createRouteBtn}
          onPress={this.navToCreateRoute}>
          <Text>Create Route</Text>
        </TouchableHighlight>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  searchRoutesBtn: {
    flex: 1,
    bottom:0,
    position: 'absolute',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  eventsBtn: {
    flex: 1,
    bottom: 0,
    left: 75,
    position: 'absolute',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 12
  },
  createRouteBtn: {
    flex: 1,
    bottom: 0,
    left: 150,
    position: 'absolute',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 12
  }
});

module.exports = Main;
