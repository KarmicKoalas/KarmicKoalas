import React, { Component } from 'react'
import { View, StyleSheet, NavigatorIOS, Text, ListView, TextInput, TouchableHighlight, TouchableOpacity } from 'react-native';

import createEvent from './createEvent';

// let routes = [
//   'New York Historic',
//   'Metropolitan Boston',
//   'Fossil Treck in NJ',
//   'Hudson River Walk',
//   'Central Park NYC',
//   'Bear Mountain Hike Easy',
//   'NYC Midtown Pub Crawl',
//   'Lower East Side NYC Historic'
// ]

  let routes = [];

class SearchRoutes extends Component {
   constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      search: '',
      dataSource: ds.cloneWithRows(routes)
    };
  }

  handleItemClick(item) {
    console.log("Route: ", item);
    this.props.navigator.push({
      component: createEvent,
      title: "Create Event"
    });
  }

  getRoutes(){
    console.log('keywords: ' + this.state.search);
    console.log("SEARCHABLES: ", this.state.search.split(''));
    var searchables = '[' + this.state.search.split(',') + ']';
    console.log("Searchables: ", searchables);

			// 	fetch("https://wegoios.herokuapp.com/signup", {
			// 	method: 'POST',
			// 	headers: {
			// 			'Accept': 'application/json',
			// 			'Content-Type': 'application/json',
			// 	},
			// 	body: JSON.stringify({
			// 		name: this.state.name,
			// 		email: this.state.email,
			// 		username: this.state.username,
			// 		password:  this.state.password,
			// 	})
			// }).then((response) => response.json())
			// 	.then((responseData) => {
			// 		console.log('DATA FROM SERVER', responseData)
			// 		//update Asynch storage
			// 		var id = '' + responseData.userId;
			// 		AsyncStorage.setItem("userId", id);
			// 		AsyncStorage.setItem('username',this.state.username)
			// 		this.navToMain(responseData.userId)
			//  })
			//  .done();
  }

  renderRow(rowData: string, sectionID: number, rowID: number,
    highlightedRow: (sectionID: nunber, rowID: number) => void) {
    return (
      <TouchableOpacity style={styles.routeRow} onPress={(event) => this.handleItemClick(rowData)}>
      <View>
        <Text style={{alignItems: 'center', padding: 3}}>{'\n'}{rowData}{'\n'}</Text>
      </View>
      </TouchableOpacity>
    );
  }

  renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#E0DFDF' : '#073AD2',
        }}
      />
    );
   }

  render() {
    return (
      <View style={styles.navBar}>
        <TextInput
          style={{height: 50}}
          autoFocus = {true}
          multiline = {true}
          numberOfLines = {8}
          borderWidth={2}
          fontSize={20}
          padding={10}
          value={this.state.search}
          placeholder="Enter search keywords: "
          onChangeText={(text) => this.setState({search: text})}/>
        <View style={{paddingTop: 2}}>
        <TouchableHighlight onPress={() => this.getRoutes()} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
        </TouchableHighlight>
          <ListView
            initialListSize={10}
            dataSource={this.state.dataSource}
            renderRow={(route) => { return this.renderRow(route) }}
            renderSeparator={this.renderSeparator}/>
          </View>
      </View>
      );
   }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#E0DFDF'
  },
  navBar: {
    height: 50,
    top: 15,
    paddingTop: 50
  },
  routeRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 40,
    backgroundColor: 'skyblue',
    paddingHorizontal: 30,
    paddingVertical: 12,
    padding: 5,
    marginTop: 4
  }
});

module.exports =  SearchRoutes;
