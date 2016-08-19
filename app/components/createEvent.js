import React, { Component } from 'react'
import { View, ListView, StyleSheet, NavigatorIOS, Dimensions, Text, AlertIOS, TextInput, TouchableHighlight, TouchableOpacity, DatePickerIOS } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import myEvents from './myEvents';

const { width, height } = Dimensions.get('window');

class createEvent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: props.id,
      title: "",
      route: props.route,
      keyWords: props.keyWords,
      guests: "",
      contact_suggestions: [],
      contacts: [],
      date: new Date(),
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
    }

    this.onDateChange = this.onDateChange.bind(this);
    //  console.log("TEST:" + this.props.id + " " + this props.title + " " + this.props.route + " " + this.props.keyWords);
  }

  componentDidMount(){
    fetch("https://wegotoo.herokuapp.com/getAllUsers", {
      method: "GET",
      headers: {'Content-Type': 'application/json'},
    }).then((response) => response.json()).then(responseData => {
      console.log("createEvent:", responseData)
      this.setState({
        contacts: responseData
      });
    }).done();
  }

  searchContacts(text){
    this.setState({
      guests: text
    });
    var guests = text.split(", ");
    var search = guests[guests.length - 1].toLowerCase();
    if(search.length){
      var suggestions = [];
      this.state.contacts.forEach((contact) => {
        if(search === contact.name.slice(0, search.length).toLowerCase() &&
           contact.name !== this.props.username){
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
    var guests = this.state.guests.split(", ").slice(0, -1);
    guests.push(contact);
    this.setState({
      guests: guests.join(", ") + ", ",
      contact_suggestions: []
    });
  }

  onDateChange(date){
    this.setState({
      date: date
    });
  }

  handleSubmit(){
    // NOTE: should guests be required?
    if(this.state.title.length && this.state.guests.length){
      var guestIds = [];
      this.state.guests.split(", ").forEach((guest) => {
        this.state.contacts.forEach((contact) => {
          if(guest === contact.name){
            guestIds.push(contact.user_id);
          }
        });
      });
      var data = {
        title: this.state.title,
        host: this.props.userId,
        guests: guestIds,
        route_id: this.props.routeID,
        time: this.state.date
      }
      //console.log('Data to the server', data.guests);
      fetch("https://wegotoo.herokuapp.com/createEvent", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      }).then((response) => response.json()).then((responseData) => {
        console.log('createEvent -- SERVER', responseData)
        //this.setState({routeCoordinates: responseData});
        this.props.navigator.push({
          component: myEvents,
          title: "Events",
          passProps: {
            setEventId: this.props.setEventId,
            userId: this.props.userId
          }
        });
      }).done();

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
          onChangeText={(txt) => this.setState({title: txt})}
          onSubmitEditing={(event) => {
            this.refs.guestsInput.focus();
          }} />
        <Text style={styles.Invite}>Invite your friends</Text>
        <TextInput
          ref="guestsInput"
          style={styles.inputText}
          placeholder="Add Guest"
          value={this.state.guests}
          onChangeText={(txt) => this.searchContacts(txt)} />
        {
          this.state.contact_suggestions.map((contact, idx) => (
            <TouchableOpacity key={idx} onPress={(event) => this.addContact(contact)}>
              <Text style={styles.contacts}>{contact}</Text>
            </TouchableOpacity>
          ))
        }
        <Text style={styles.dateTime}>DateTime</Text>
        <DatePickerIOS
        style={styles.datePicker}
          date={this.state.date}
          mode="datetime"
          timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
          onDateChange={this.onDateChange} />
        <TouchableHighlight  style={styles.sendBtn} onPress={() => this.handleSubmit()}>
          <Text><Icon name="rocket" size={30} color="#3498db" /></Text>
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
    backgroundColor: '#eee'
  },
  contacts:{
    fontSize: 16,
    zIndex:2,
    left:10
  },
  datePicker:{
    zIndex:-1,
    top:50,
  },
  Invite:{
    fontSize: 18,
    top:0,
    left:120
  },
  dateTime:{
    fontSize: 18,
    top:50,
    left:148
  },
  sendBtn: {
    flex: 1,
    bottom: 20,
    left: 155,
    width:60,
    height:60,
    position: 'absolute',
    backgroundColor: '#fff',
    borderColor: "#3498db",
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 13,
    borderRadius: 50
  },
  title: {
    marginTop: 80,
    left:160,
    fontSize: 18
  },
  inputText: {
    margin: 10,
    height: 40,
    width: width -15,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
  },
});

module.exports =  createEvent;
