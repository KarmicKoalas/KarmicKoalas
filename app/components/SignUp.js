'use strict'

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, TextInput, AlertIOS } from 'react-native';

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
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.textHeader}>
					Sign Up
				</Text>
        <TextInput
          style={{height: 40}}
          placeholder="Enter your name: "
        />
        <TextInput
          style={{height: 40}}
          placeholder="Email Address: "
        />
				<TextInput
          style={{height: 40}}
          placeholder="Username: "
        />
        <TextInput
          style={{height: 40}}
          placeholder="Password: "
          />
        <TouchableHighlight style={styles.button}>
            <Text>Go</Text>
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
    TextInput: {
      borderWidth: 2,
      color: 'blue'
    },
    textHeader: {
      fontSize: 30,
      color: 'blue'
    },
    buttonText: {
      fontSize: 18,
      color: 'green',
      alignSelf: 'center'
    },
    button: {
      height: 44,
      flexDirection: 'row',
      backgroundColor: '#48BBEC',
      alignSelf: 'stretch',
      justifyContent: 'center'
    }
});

module.exports =  SignUp;	