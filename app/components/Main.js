'use strict'

import React, { Component } from 'react'
import { StyleSheet, View, Text, MapView, TextInput, Dimensions, StatusBarIOS, TouchableHighlight, AsyncStorage } from 'react-native';
import Chat from './chat'
import MapComponent from './Map.js'
import searchRoutes from './searchRoutes'
import createRoute from './createRoute'
import myEvents from './myEvents'
import Icon from 'react-native-vector-icons/FontAwesome';

if (window.navigator && Object.keys(window.navigator).length == 0) {
  window = Object.assign(window, { navigator: { userAgent: 'ReactNative' }});
}

const io = require('socket.io-client/socket.io');
import userAgent from '../utils/userAgent'


const { width, height } = Dimensions.get('window')

class Main extends Component {

  constructor(props) {
    super(props);
    // this.navToSearchRoutes = this.navToSearchRoutes.bind(this);
    // this.navToMyEvents = this.navToMyEvents.bind(this);
    // this.navToCreateRoute = this.navToCreateRoute.bind(this);

    this.setEventId = this.setEventId.bind(this);
    this.initializesEvent = this.initializesEvent.bind(this);

    this.socket = io('https://wegotoo.herokuapp.com',  {jsonp: false, transports:['websocket'], allowUpgrades:true});
    this.state = {
      routeCoordinates: [],
      start: {
        longitudeDelta: 0.2574920897512953,
        latitude: 40.72530277772641,
        longitude: -73.92195948302341,
        latitudeDelta: 0.3286146645283381
      },
      pinStart: {
        latitude: 0,
        longitude: 0
      },
      pinEnd: {
        latitude: 0,
        longitude: 0
      },
      userId: this.props.userId,
      username: this.props.username,
      eventId: '1',//eventId: props.eventId,   //this will come from group list view and pass to server
      socket: this.socket
    }
    console.log("MAIN:");
    console.log("  eventId:", this.state.eventId);
    console.log("  userId:", this.state.userId);
  }

  setEventId(eventId){
    console.log('Event Id has been changed', eventId);
    this.setState({
      eventId: eventId
    });
    this.playEvent(eventId);
  }

  navToSearchRoutes(){
    this.props.navigator.push({
      component: searchRoutes,
      title: "Search Routes",
      passProps: {
        userId: this.props.userId,
        setEventId: this.setEventId
      }
    });
  }

  navToMyEvents(){
    this.props.navigator.push({
      component: myEvents,
      title: "Events",
      passProps: {
        setEventId: this.setEventId,
        userId: this.props.userId
      }
    });
  }

  navToCreateRoute(){
    this.props.navigator.push({
      component: createRoute,
      title: "Create Route",
      passProps: {
        userId: this.props.userId,
        username: this.props.username,
        setEventId: this.setEventId
      }
    });
  }
  onRegionChangeComplete(e) {
    console.log(e);
    this.setState({
        start: e
     })
  }

  initializesEvent(eventId){
    //console.log('Connected to Main', eventId, this.state.userId, this.state.username)
    //this.socket.emit('initialize',{eventId: eventId, userId: this.state.userId, username: this.state.username})
    this.socket.emit('initialize',{eventId: eventId})
  }
  playEvent(eventId){
    //this.setState({ points: [] });
    console.log('Event ID', eventId);
     fetch("https://wegotoo.herokuapp.com/getRouteById", {method: "POST", headers: {'Content-Type': 'application/json'} ,body: JSON.stringify({event_id: eventId})})
     .then((response) => response.json())
     .then((responseData) => {

       //console.log('SERVER', JSON.parse(responseData.start));
       var parseStart = JSON.parse(responseData.start);
       var parseEnd = JSON.parse(responseData.end);
      // parseStart['title'] = 'start';
      // console.log('start object',parseStart );
      // var pointsArr = this.state.points.push(parseStart)
       var newStart = {
         latitude: parseStart.latitude,
         longitude: parseStart.longitude,
         latitudeDelta: 0.008471502763114813,
         longitudeDelta: 0.010554364489337331
       }
       this.setState({
         routeCoordinates: JSON.parse(responseData.route_object),
         start: newStart,
         pinStart: { latitude: parseStart.latitude, longitude: parseStart.longitude},
         pinEnd: { latitude: parseEnd.latitude, longitude: parseEnd.longitude}
       });
      // console.log('New Start',this.state.start)
       this.initializesEvent(eventId);
     })
     .done();
   }

  componentDidMount() {
    //this.playEvent(48);
    AsyncStorage.multiGet(["username", "userId"]).then((data) => {
      console.log("Multi Get from Async:", data)
      this.setState({
        username : data[0][1],
        userId: data[1][1]
      })
      //this.socket.emit('initialize',{eventId: this.state.eventId, userId: data[1][1], username: data[0][1]})

    });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapComponent informParent={(e)=>this.setState({start: e })} pinStart={this.state.pinStart} pinEnd={this.state.pinEnd} socket={this.state.socket} eventId={this.state.eventId} username={this.state.username} initializesEvent={this.initializesEvent} routeCoordinates={this.state.routeCoordinates} start={this.state.start}/>
        <Chat socket={this.socket} eventId={this.state.eventId} username={this.props.username}/>
        <TouchableHighlight
          style={styles.searchRoutesBtn}
          onPress={() => this.navToSearchRoutes()}>
          <Text><Icon name="search" size={25} color="#3498db" /></Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.eventsBtn}
          onPress={() => this.navToMyEvents()}>
          <Text><Icon name="calendar" size={25} color="#3498db" /></Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.createRouteBtn}
          onPress={() => this.navToCreateRoute()}>
          <Text><Icon name="map" size={25} color="#3498db" /></Text>
        </TouchableHighlight>
        <Text style={styles.welcome}>
        </Text>
        <MapView
          style={styles.map}
          annotations={this.state.users}
          showsUserLocation={true}
          followUserLocation={true}
          overlays={[{
            coordinates: this.state.routeCoordinates,
            strokeColor: 'blue',
            lineWidth: 8,
          }]}
        />
        <View style={styles.navBar}><Text style={styles.navBarText}>WeGoToo</Text></View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  searchRoutesBtn: {
    flex: 1,
    bottom:20,
    left:20,
    width:50,
    height:50,
    position: 'absolute',
    backgroundColor: '#fff',
    borderColor: "#3498db",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 50
  },
  eventsBtn: {
    flex: 1,
    bottom: 20,
    left: 170,
    width:50,
    height:50,
    position: 'absolute',
    backgroundColor: '#fff',
    borderColor: "#3498db",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 50
  },
  createRouteBtn: {
    bottom: 20,
    right: 20,
    width:50,
    height:50,
    position: 'absolute',
    backgroundColor: '#fff',
    borderColor: "#3498db",
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 11,
    borderRadius: 50
  }
});

module.exports = Main;
