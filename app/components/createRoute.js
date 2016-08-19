'use strict'

import React, { Component } from 'react'
import { View, StyleSheet, NavigatorIOS, Dimensions, Text, AlertIOS, AsyncStorage, TextInput, TouchableOpacity, TouchableHighlight } from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';

import createEvent from './createEvent';

const { width, height } = Dimensions.get('window')

var count = 0;
var regionText = {
  latitude: '0',
  longitude: '0'
};

class createRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      init: { latitude: 40.8534229, longitude: -73.9793236 },
      routeCoordinates: [],
      start: {},
      end: {},
      title: '',
      text: '',
      keywordsToTrace:'',
      keywords: [],
      pins: [{}]
    }
    this.createNewPin = this.createNewPin.bind(this);
    this.checkPinCoordinates = this.checkPinCoordinates.bind(this);
    this.changeCoordinatesAfterDrop = this.changeCoordinatesAfterDrop.bind(this);
    this._onPressButtonPOST = this._onPressButtonPOST.bind(this);
  }

  saveData() {
    // TODO: API call to POST 'route title' and 'keywords array' to database
    console.log('Route Title: ' + this.state.title + ' Key Words Array: ' + this.state.keyWords);
  }

  onRegionChangeComplete(e) {
    regionText.latitude = e.latitude
    regionText.longitude = e.longitude
  }

  createNewPin() {
    if(count === 2) return
    else if(count === 0){
       var pin = { latlng: {latitude: regionText.latitude, longitude: regionText.longitude }, key: count, color: '#3498db', title: 'Start'};
    }
    else if(count === 1){
       var pin = { latlng: {latitude: regionText.latitude, longitude: regionText.longitude }, key: count, color: '#e74c3c', title: 'Finish'};
    }
     this.state.pins[0][pin.key] = pin;
     count++
    // console.log('TEST', this.state.pins);
     this.setState({})
     console.log('id', count);
     if (count === 2) this._onPressButtonPOST(this.state.pins[0]['0'], this.state.pins[0]['1'])
  }
  changeCoordinatesAfterDrop(e, key) {
     this.state.pins[0][key]['latlng'] = e.nativeEvent.coordinate
     this.setState({});
     if (count === 2) this._onPressButtonPOST(this.state.pins[0]['0'], this.state.pins[0]['1'])
  }
  checkPinCoordinates() {
     console.log('PIN', this.state.pins[0]['0'], this.state.pins[0]['1']);
  }
  traceKeywordsString(string) {
    return string.split(',')
  }

  _onPressButtonPOST(start, end){
    if(!start || !end) { return }
    var startCoord = start.latlng.latitude + ',' + start.latlng.longitude;
    var endCoord = end.latlng.latitude + ',' + end.latlng.longitude;
    this.setState({
      start: start.latlng,
      end: end.latlng
    });
    console.log('send to back', startCoord, endCoord);
      fetch("https://wegotoo.herokuapp.com/getRouteFromGoogle", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({start: startCoord, end: endCoord})
      }).then((response) => response.json()).then((responseData) => {
        console.log('DATA FROM SERVER', responseData)
        this.setState({
         routeCoordinates: responseData
        });
      }).done();
 }

  handleCreateRoute(title, keywords, start, end, routeObject) {
    // {title:string, keywords:[],start:{}, end:{}, routeObject:[]}
    var keywordsArr = this.traceKeywordsString(keywords);
    if(this.state.title && keywordsArr.length && this.state.routeCoordinates.length) {
      fetch("https://wegotoo.herokuapp.com/createRoute", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title:title, keywords:keywordsArr,start:start, end:end, routeObject:routeObject})
      }).then((response) => response.json()).then((responseData) => {
        console.log('createRoute -- SERVER', responseData)
        //this.setState({routeCoordinates: responseData});
        // AsyncStorage.getItem("userId").then((userId) => {
          console.log('to create event view', this.props.userId, responseData.route_id)
          this.props.navigator.push({
            component: createEvent,
            title: "Create Event",
            passProps: {
              userId: this.props.userId,
              username: this.props.username,
              routeID: responseData.route_id,
              setEventId: this.props.setEventId,
            }
          })
        // })
      })
      .done();
    } else {
      console.log('Title, keywords, route are Required');
      AlertIOS.alert("Title, keywords and route are Required");
    }

   }
  createEventView() {
    console.log('STATE', this.state.title);
    this.handleCreateRoute(this.state.title, this.state.keywordsToTrace, this.state.start, this.state.end, this.state.routeCoordinates);
  }

  componentWillUnmount() {
    count = 0;
    console.log('Component has been unmounted');
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                onRegionChangeComplete={this.onRegionChangeComplete}
              >
                {Object.keys(this.state.pins[0]).map(id => (
                  <MapView.Marker
                    key={this.state.pins[0][id].key}
                    pinColor={this.state.pins[0][id].color}
                    title={this.state.pins[0][id].title}
                    coordinate={this.state.pins[0][id].latlng}
                    onDragEnd={(e) => this.changeCoordinatesAfterDrop(e, this.state.pins[0][id].key)}
                    draggable
                  />
                ))}
                <MapView.Polyline
                 coordinates={this.state.routeCoordinates}
                 strokeColor="rgba(0,0,200,0.5)"
                 strokeWidth={3}
                 lineDashPattern={[5, 2, 3, 2]}
               />
             </MapView>
         </View>
        <View style={styles.inputs}>
          <TextInput
            style={styles.inputText}
            autoFocus = {true}
            placeholder = "Enter route title"
            placeholderTextColor='#CDCDC9'
            onChangeText={(text) => this.setState({title: text})}
            onSubmitEditing={(event) => {
              this.refs.SecondInput.focus();
            }}
          />
          <TextInput
            ref='SecondInput'
            style={styles.inputText}
            placeholder="keywords"
            placeholderTextColor='#CDCDC9'
            onChangeText={(text) => this.setState({keywordsToTrace: text})}
          />
        </View>
         <View>
         <TouchableOpacity
           style={styles.buttonPin}
           onPress={() => this.createNewPin()}
          >
          <Text><Icon name="pin-drop" size={25} color="#3498db"/></Text>
        </TouchableOpacity>
          <TouchableHighlight style={styles.createRouteBtn} onPress={() => this.createEventView()}>
              <Text><Icon name="group-add" size={25} color="#3498db"/></Text>
          </TouchableHighlight>
        </View>
      </View>
      );
   }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  map: {
    position: 'relative',
    flex: 1,
    width: width,
    height: height
  },
  inputs: {
    position: 'absolute',
    top:65
  },
  inputText: {
    height: 40,
    width: width-4,
    padding: 5,
    marginTop:5,
    marginLeft:2,
    marginRight:2,
    color: "#3498db",
    backgroundColor: '#fff',
    borderColor: "#3498db",
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  buttonPin: {
    bottom: 30,
    right: 120,
    width:50,
    height:50,
    position: 'absolute',
    backgroundColor: '#fff',
    borderColor: "#3498db",
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 11,
    borderRadius: 50
  },
  createRouteBtn: {
    bottom: 30,
    left: 120,
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

module.exports =  createRoute;
