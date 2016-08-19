'use strict'

import React, { Component } from 'react'
import { StyleSheet, View, Text, MapView, TextInput, Dimensions, StatusBarIOS, TouchableHighlight } from 'react-native';
if (window.navigator && Object.keys(window.navigator).length == 0) {
  window = Object.assign(window, { navigator: { userAgent: 'ReactNative' }});
}
const { width, height } = Dimensions.get('window')

class Chat extends Component {

  constructor(props) {
    super(props);
    this.socket = props.socket
    this.eventId = props.eventId
    this.state = {
      username: props.username,
      eventId: props.eventId,
      message: props.message,
      socket:props.socket,
      incomingMessage: ' '
     }
  }

  componentDidMount() {
    console.log('mounted socket, eventid',this.state.socket, this.eventId)
    //this.state.socket = props.socket

    //this.socket.emit('intitialize',{eventId:this.state.eventId})
    console.log('intialaze client side')


    this.socket.on('tweet', (data) => {
      console.log("Chat message from server", data);
       this.setState({
         incomingMessage: data
       });
    });
   }

  handleKeyDown(e) {
    if(e.nativeEvent.key == "Enter"){
      var message = this.state.username + ': ' + this.state.message;
      console.log('sending tweet', message, this.props.eventId)
    this.socket.emit('tweet', {'text':message, 'eventId': this.props.eventId})
    this.state.message = "";
    }
  }
  jewelStyle(options) {
   if(options !== ' '){
     return {
       height: 40,
       justifyContent: 'center',
       fontSize:18,
       width: width-18,
       padding: 10,
       color: "#3498db",
       backgroundColor: '#fff',
     }
   } else {
     return {
       height: 0,
       justifyContent: 'center',
       fontSize:18,
       width: width-18,
       padding: 0,
       color: "#3498db",
       backgroundColor: '#fff',
     }
   }
 }

 navBar(options) {
  if(options === '1'){
    return {  }
  } else {
    return {
      width: width-16,
      position: 'absolute',
      borderColor: "#3498db",
      borderWidth: 1,
      marginLeft:10,
      marginRight:10,
      top: 20
    }
  }
}

  render() {
    return (
        <View style={this.navBar(this.props.eventId)}>
          <TextInput
             onKeyPress={this.handleKeyDown.bind(this)}
             placeholder="Send a Message to the Group"
             autoFocus = {true}
             style={styles.chat}
             onChangeText={(message) => this.setState({message})}
             value={this.state.message}/>
           <Text style={this.jewelStyle(this.state.incomingMessage)}>
               {this.state.incomingMessage}
           </Text>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  chat: {
    height: 40,
    width: width-18,
    padding: 10,
    color: "#3498db",
    backgroundColor: '#fff',
  },
  navBar: {
    width: width-16,
    position: 'absolute',
    borderColor: "#3498db",
    borderWidth: 1,
    marginLeft:10,
    marginRight:10,
    top: 20
  }
})

module.exports = Chat;
