'use strict';

import React, {
  ActionSheetIOS,
  Alert,
  AsyncStorage,
  Component,
  Dimensions,
  Linking,
  Navigator,
  Platform,
  Text,
  View,
} from 'react-native';

require("./UserAgent");
var Router = require('./Router.js');
var io = require("socket.io-client/socket.io");
var GiftedMessenger = require('react-native-gifted-messenger');
var Communications = require('react-native-communications');
var RSAKey = require('react-native-rsa');

var STATUS_BAR_HEIGHT = Navigator.NavigationBar.Styles.General.StatusBarHeight;
if (Platform.OS === 'android') {
  var ExtraDimensions = require('react-native-extra-dimensions-android');
  var STATUS_BAR_HEIGHT = ExtraDimensions.get('STATUS_BAR_HEIGHT');
}

// const ENDPOINT = "http://localhost:5000"
const ENDPOINT = "http://iccroutes.com:5000"

class MessengerScene extends Component {

  constructor(props) {
    super(props)

    this.rsa = new RSAKey();

    this.state = {
      roomId:     '',
      username:   '',
      publicKey:  {},
      privateKey: {},
    };
  }

  connectionError() {
    let reconnectBtn = {
      text: 'Reconnect', 
      onPress: () => { 
        this.socket.connect() 
      }
    }

    let cancelBtn = {
      text: 'Cancel', 
      onPress: () => {
        AsyncStorage.removeItem("roomId");
        let route = Router.JoinRoomScene();
        this.props.navigator.replace(route);
      }, 
      style: 'cancel'
    }

    Alert.alert('Error', 'Failed connecting to room', [reconnectBtn, cancelBtn])
  }

  async componentDidMount() {
    let roomId     = await AsyncStorage.getItem('roomId');
    let username   = await AsyncStorage.getItem('username');
    let messages   = await AsyncStorage.getItem('messages_' + roomId)
    let publicKey  = await AsyncStorage.getItem('publicKey');
    let privateKey = await AsyncStorage.getItem('privateKey');

    this._messages = (messages) ? JSON.parse(messages) : [];

    this.setState({
      messages:   this._messages,
      roomId:     roomId,
      username:   username,
      publicKey:  publicKey,
      privateKey: privateKey
    });

    this.socket = io(ENDPOINT, {jsonp: false, transports: ['websocket'], reconnection: false})
    this.socket.on('connect_error', ()    => this.connectionError())
    this.socket.on('new message',   (msg) => this.handleReceive(msg))
    this.socket.emit('join room', roomId);
  }

  async setMessages(messages) {
    this._messages = messages;
    this.setState({messages: messages});
    AsyncStorage.setItem('messages_' + this.state.roomId, 
      JSON.stringify(this._messages));
  }

  handleSend(message = {}) {
    message.pkey   = this.state.privateKey;
    message.roomId = this.state.roomId;

    // Encrypt message
    this.rsa.setPublicString(this.state.publicKey);
    var originText  = message.text;
    var encryptText = this.rsa.encrypt(originText);
    message.text    = encryptText;

    // Send message
    this.socket.emit('new message', message);

    // Simulate server-side unique id generation
    message.uniqueId = Math.round(Math.random() * 10000);
    message.text     = originText;

    this.setMessages(this._messages.concat(message));
  }

  handleReceive(message = {}) {
    // message must contain: text, name, image, position: 'left', date, uniqueId
    message.position = 'left';
    message.image    = null;

    // Decrypt
    this.rsa.setPrivateString(message.pkey);
    message.text = this.rsa.decrypt(message.text);

    this.setMessages(this._messages.concat(message));
  }

  render() {
    return (
      <GiftedMessenger
        ref={(c) => this._GiftedMessenger = c}

        styles={{
          bubbleRight: {
            marginLeft: 70,
            backgroundColor: '#007aff',
          },
        }}

        autoFocus={false}
        messages={this.state.messages}
        handleSend={this.handleSend.bind(this)}
        maxHeight={Dimensions.get('window').height - Navigator.NavigationBar.Styles.General.NavBarHeight - STATUS_BAR_HEIGHT}
        loadEarlierMessagesButton={false}
        senderName={this.state.username}
        senderImage={null}
        displayNames={true}
        displayNamesInsideBubble={true}
      />
    );
  }
}

module.exports = MessengerScene;
