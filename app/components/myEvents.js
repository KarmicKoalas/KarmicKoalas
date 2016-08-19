'use strict'
// My Events Template to render views of user created views.

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableHighlight, Dimensions, ScrollView, ListView, TextInput, AlertIOS, AsyncStorage } from 'react-native';
import icon from '../icons/noun_14294.png'
import Icon from 'react-native-vector-icons/MaterialIcons';

import Main from './Main';
// Test Data Objects
//TODO Get request to database for event data.

const { width, height } = Dimensions.get('window')
let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class myEvents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      objectdataSource: dataSource.cloneWithRows([]),
      highlightedRow: {}
    };

    this.goMap = this.goMap.bind(this);
  }

  componentDidMount(){
    fetch("https://wegotoo.herokuapp.com/getMyEvents", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({user_id: this.props.userId})
    }).then((response) => response.json()).then(responseData => {
      // var data = responseData.filter(event => {
      //   return new Date(event.time) > new Date();
      // });
      if (responseData.message){
        console.log('You have no current events');
        AlertIOS.alert("You have no current events");
      }else {
        this.setState({
          objectdataSource: dataSource.cloneWithRows(responseData)
        })
      }
    }).done();
  }

  goMap(rowData) {
    console.log("Hello: ", rowData);
    this.props.setEventId(rowData.event_id);
    this.props.navigator.popToTop();
  }

  renderRow(rowData: string, sectionID: number, rowID: number,
    highlightedRow: (sectionID: nunber, rowID: number) => void)  {
    return (
      <TouchableOpacity style={styles.eventRow} onPress={() => this.goMap(rowData)}>
        <View style={styles.box}>
          <View style={styles.img}>
            <Text><Icon name="event" size={25} color="#3498db"/></Text>
          </View>
          <View style={styles.text}>
             <View>
                 <Text style={styles.titleRow}>{rowData.title}</Text>
             </View>
             <View>
                 <Text style={styles.start}>Start: {rowData.start_address}</Text>
             </View>
             <View>
                 <Text style={styles.start}>End: {rowData.end_address}</Text>
             </View>
             <View>
                 <Text style={styles.time}>{rowData.time}</Text>
             </View>
          </View>
        <View>
          <Text><Image source={icon} style={styles.image}/>{rowData.title}{'\n'}Start:{rowData.start_address}  End:{rowData.end_address}{'\n'}{rowData.time}{'\n'}</Text>
        <View />
      </View></View>
      </TouchableOpacity>
    );
  }

  renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#B2B0B2' : '#073AD2',
        }}
      />
    );
   }

   render() {
    return (
      <View style={styles.container}>
        <ListView style={styles.eventRow}
          style={{marginTop: 0, alignSelf: 'center', padding: 0}}
          initialListSize={10}
          dataSource={this.state.objectdataSource}
          renderRow={(item) => { return this.renderRow(item) }}
          enableEmptySections={true}
          contentInset={{bottom:10}}/>
      </View>
    );
  }
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#eee'
    },
    eventRow: {
      backgroundColor: '#fff',
      flexDirection: "row",
      width: width-27,
      height: 100,
      marginTop: 5,
      borderColor:'#3498db',
      borderWidth:1,
      padding:5,
      overflow: 'hidden',
    },
    box: {
      flexDirection: "row",
      height: 92,
    },
    text: {
      width: width-75,
      paddingRight:10,
      height: 90,
      overflow: 'hidden',
    },
    img: {
      paddingLeft:15,
      paddingRight:25,
      backgroundColor: '#fff',
      justifyContent: 'center'
    },
    titleRow: {
      marginTop:5,
      marginBottom:5,
      fontWeight:'bold',
      color:'#000',
      textAlign:'left',
    },
    start: {
      color:'#ccc',
      fontSize:11
    },
    time: {
      color:'#000',
      fontSize:11,
      textAlign:'left',
      paddingTop:10,
    }
});

module.exports =  myEvents;
