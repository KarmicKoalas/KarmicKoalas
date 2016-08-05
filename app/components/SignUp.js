'use strict'

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, TextInput, AlertIOS, AsyncStorage } from 'react-native';

class SignUp extends Component {
	constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      username: '',
      password: ''
    }
  }
  getData(){
    console.log('name: '+ this.state.name + '\nemail: '+ this.state.email + '\nusername: '+ this.state.username + '\npassword: '+ this.state.password);
  }

  signUp(){
    // TODO: Signup logic
    //post request to server /signup response will be userId then store that value
    //.then(
    // AsyncStorage.setItem("userId", userId.toString());
    //)
    this.props.setUserId("123");
    AsyncStorage.setItem("userId", "123");
    this.props.navigator.pop();
  }

  render() {
		return (
      <View style={styles.container}>
				<Text style={styles.textHeader}>
					Sign Up
				</Text>
        <TextInput
          style = {styles.inputText}
          returnKeyType = {"next"}
          autoFocus = {true}
          placeholder = "Name: "
          placeholderTextColor="white"
          onChangeText={(text) => this.setState({name: text})}
          onSubmitEditing={(event) => {
            this.refs.SecondInput.focus();
          }}
        />
        <TextInput
          ref='SecondInput'
          style = {styles.inputText}
          placeholder="Email Address: "
          placeholderTextColor="white"
          onChangeText={(text) => this.setState({email: text})}
          onSubmitEditing={(event) => {
            this.refs.ThirdInput.focus();
          }}
        />
				<TextInput
          ref='ThirdInput'
          style={styles.inputText}
          placeholder="Username: "
          placeholderTextColor="white"
          onChangeText={(text) => this.setState({username: text})}
          onSubmitEditing={(event) => {
            this.refs.FourthInput.focus();
          }}
        />
        <TextInput
          ref='FourthInput'
          style={styles.inputText}
          placeholder="Password: "
          placeholderTextColor="white"
          password={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableHighlight onPress={() => this.signUp()} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
        </TouchableHighlight>
			</View>
			)
	}
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'cornflowerblue'
    },
    text: {
      color: 'blue',
      backgroundColor: 'lightblue',
      fontSize: 30,
      margin: 80
    },
    navBar: {
      backgroundColor: 'cornflowerblue',
      height: 64,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },
    navText: {
      color: 'white',
      fontSize: 16,
      fontWeight: "700",
      textAlign: 'center',
      paddingTop: 30
    },
    inputText: {
      height: 40,
      color: 'white'
    },
    placeholder: {
      color: 'white'
    },
    textHeader: {
      fontSize: 30,
      color: 'white',
      justifyContent: 'flex-start'
    },
    buttonText: {
      fontSize: 20,
      color: 'white',
      alignSelf: 'center'
    },
    button: {
      height: 44,
      flexDirection: 'row',
      alignSelf: 'stretch',
      justifyContent: 'center',
      backgroundColor: 'skyblue'
      // color: 'white'
    }
});

module.exports =  SignUp;
