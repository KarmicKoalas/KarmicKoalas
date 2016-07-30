import React, { Component } from 'react'
import { View, StyleSheet, NavigatorIOS, Text, AlertIOS, TextInput, TouchableHighlight } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
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

class SignUp extends Component {
	constructor(props) {
    super(props)
    this.state = {}
  }
	render() {
		return (
			<View style={styles.container}>
				<Text>
					Sign Up
				</Text>
				<TextInput
          style={{height: 40}}
          placeholder="Enter your username: "
        />
        <TextInput
          style={{height: 40}}
          placeholder="Enter your password: "
          />
        <TouchableHighlight style={styles.button}
        	onPress={this.showAlert}>
            <Text style={styles.buttonText}>Go</Text>
        </TouchableHighlight>
			</View>
			);
	 }

	 showalert() {
	 		AlertIOS.alert('Awesome Alert', 'This is my first React Native alert.', [{text: 'Thanks'}])
	 }	
}

module.exports =  SignUp;	