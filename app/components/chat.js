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
    this.state = {
      eventId: '1',//eventId: props.eventId,   //this will come from group list view and pass to server
      message: props.message,
      socket:props.socket,
      incomingMessage: props.incomingMessage
     }
  }

  componentDidMount() {
    console.log('mounted',this.state.socket)
    //this.state.socket = props.socket

    this.socket.emit('intitialize',{eventId:this.state.eventId})
    console.log('intialaze client side')


    this.socket.on('tweet', (data) => {
      console.log("Chat message from server", data);
       this.setState({
         incomingMessage: data.text
       });
    });
   }

  handleKeyDown(e) {
    if(e.nativeEvent.key == "Enter"){
      console.log('sending tweet', this.state.message)
    this.socket.emit('tweet', {text:this.state.message})
    this.state.message = "";
    }
  }

  render() {
    return (
        <View style={styles.navBar}>
          <TextInput
             onKeyPress={this.handleKeyDown.bind(this)}
             placeholder="Send a Message to the Group"
             autoFocus = {true}
             style={styles.chat}
             onChangeText={(message) => this.setState({message})}
             value={this.state.message}/>
           <Text style={styles.chatIn}>
               {this.state.incomingMessage}
           </Text>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
    chatIn: {
    height: 40,
    padding:10,
    backgroundColor: 'white',
    top:20,
    color: '#19B5FE',
    padding: 8
  },
  chat: {
    height: 40,
    padding:10,
    borderColor: 'rgba(0,0,0,0.7)',
    borderWidth: 2,
    backgroundColor: 'white',
    top:20,
    color: '#19B5FE',
    padding: 8
  },
  navBar: {
    backgroundColor: 'grey',
    height: 64,
    width: width,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
})

module.exports = Chat;
