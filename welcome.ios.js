'use strict'

import React, { Component } from 'react';
import { StyleSheet, NavigatorIOS, View, Text, TabBarIOS } from 'react-native';

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
		backgroundColor: 'cornflowerblue'
	},
	icon: {

	}
});

class Welcome extends Component {
	render() {
		return (
			<View style={styles.container}>
				 	<Text style={styles.description}>
						Welcome to WeGo. Build cool routes and chat with your friends on the go!
					</Text>
			</View>				
		);
	}
}

module.exports = Welcome;