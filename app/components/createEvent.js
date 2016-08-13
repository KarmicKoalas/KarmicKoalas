import React, { Component } from 'react'
import { View, ListView, StyleSheet, NavigatorIOS, Dimensions, Text, AlertIOS, TextInput, TouchableHighlight, TouchableOpacity, DatePickerIOS } from 'react-native';

import Contacts from 'react-native-contacts';

import myEvents from './myEvents';

const { width, height } = Dimensions.get('window');

class createEvent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.id,
      title: "",
      route: this.props.route,
      keyWords: this.props.keyWords,
      invitees: "",
      contact_suggestions: [],
      contacts: [],
      date: new Date(),
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
    }

    this.onDateChange = this.onDateChange.bind(this);
    //  console.log("TEST:" + this.props.id + " " + this props.title + " " + this.props.route + " " + this.props.keyWords);
  }

  componentDidMount(){
    fetch("http://localhost:8000/getAllUsers", {
      method: "GET",
      headers: {'Content-Type': 'application/json'},
    }).then(response => response.json())
    .then(responseData => {
      this.setState({
        contacts: responseData
      });
    }).done();
  }

  searchContacts(text){
    this.setState({
      invitees: text
    });
    var invitees = text.split(", ");
    var search = invitees[invitees.length - 1].toLowerCase();
    if(search.length){
      var suggestions = [];
      this.state.contacts.forEach((contact) => {
        if(search === contact.name.slice(0, search.length).toLowerCase()){
          suggestions.push(contact.name);
        }
      });
      this.setState({
        contact_suggestions: suggestions
      });
    } else {
      this.setState({
        contact_suggestions: []
      });
    }
  }

  addContact(contact){
    var invitees = this.state.invitees.split(", ").slice(0, -1);
    invitees.push(contact);
    this.setState({
      invitees: invitees.join(", ") + ", ",
      contact_suggestions: []
    });
  }

  onDateChange(date){
    this.setState({
      date: date
    });
  }

  handleSubmit(){
    // NOTE: should invitees be required?
    if(this.state.title.length && this.state.invitees.length){
      var inviteeIds = [];
      this.state.invitees.split(", ").forEach((invitee) => {
        this.state.contacts.forEach((contact) => {
          if(invitee === contact.name){
            inviteeIds.push(contact.userId);
          }
        });
      });
      var body = {
        title: this.state.title,
        host: +this.props.userID,
        invitees: inviteeIds,
        routeID: this.props.routeID,
        time: this.state.date
      }
      fetch("http://localhost:8000/createEvent", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      }).then((responseData) => {
        console.log('createEvent -- SERVER', responseData)
        //this.setState({routeCoordinates: responseData});
      }).done();
      this.props.navigator.push({
        component: myEvents,
        title: "Events",
        passProps: {
          setEventId: this.props.setEventId
        }
      });
    }
  }

  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Title</Text>
        <TextInput
          style={styles.inputText}
          autoFocus={true}
          placeholder="title"
          placeholderTextColor="#CDCDC9"
          value={this.state.title}
          onChangeText={(txt) => this.setState({title: txt})} />
        <Text>Invite your friends</Text>
        <TextInput
          style={styles.inputText}
          placeholder="Add Contact"
          value={this.state.invitees}
          onChangeText={(txt) => this.searchContacts(txt)} />
        {
          this.state.contact_suggestions.map((contact, idx) => (
            <TouchableOpacity key={idx} onPress={(event) => this.addContact(contact)}>
              <Text>{contact}</Text>
            </TouchableOpacity>
          ))
        }
        <Text>DateTime</Text>
        <DatePickerIOS
          date={this.state.date}
          mode="datetime"
          timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
          onDateChange={this.onDateChange} />
        <TouchableHighlight onPress={() => this.handleSubmit()} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  title: {
    marginTop: 80
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
  },
  inputText: {
    height: 40,
    width: width,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    borderRadius: 20,
  },
});

module.exports =  createEvent;
