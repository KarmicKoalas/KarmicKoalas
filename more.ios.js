'use strict'

import React, { Component } from 'react';
import { StyleSheet, NavigatorIOS, View, Text, TabBarIOS, TouchableHighlight } from 'react-native';

var styles = StyleSheet.create({
	description: {
		fontSize: 20,
		textAlign: 'center',
		color: '#FFFFFF'
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'skyblue'
	}
});

class More extends Component {

	_onPressButton() {
    console.log("You tapped the button!");
  }

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.description}>
					Set some user routes??? First Sign Up!
				</Text>
				<TouchableHighlight onPress={this._onPressButton}>
					<Text>Button</Text>
				</TouchableHighlight>
			</View>				
		);
	}
}

module.exports = More;