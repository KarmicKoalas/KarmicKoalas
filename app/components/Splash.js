'use strict'

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, TextInput, AlertIOS, AsyncStorage } from 'react-native';
import SignUp from './SignUp'
import Main from './Main'

class Splash extends Component {
	constructor(props) {
    super(props)
    this.state = {

    }
  }

	componentDidMount(){
		// AsyncStorage.setItem("username", '');
    	AsyncStorage.multiGet(["username", "userId"]).then((data) => {
				console.log("SPLASH:",data)
      if(data[0][1] === null){
        //new user
				this.props.navigator.push({
					navigationBarHidden: true,
					component: SignUp,
					title: "SignUp"
				});
      }
			else {
        //existing user
				this.props.navigator.resetTo({
					navigationBarHidden: true,
					component: Main,
					title: "Main",
					passProps: {
		        userId: data[1][1],
						username: data[0][1]
		      }
				});
    	}
  	});
	}

  render() {
		return (
      <View style={styles.container}>
				<Text style={styles.textHeader}>
					WeGoToo>>>>>
				</Text>
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
    }
});

module.exports =  Splash;
