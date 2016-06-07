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
var AES = require('react-native-aes');
var Buffer = require('buffer').Buffer;

var STATUS_BAR_HEIGHT = Navigator.NavigationBar.Styles.General.StatusBarHeight;
if (Platform.OS === 'android') {
  var ExtraDimensions = require('react-native-extra-dimensions-android');
  var STATUS_BAR_HEIGHT = ExtraDimensions.get('STATUS_BAR_HEIGHT');
}

// const ENDPOINT = "http://localhost:5000"
const ENDPOINT = "http://iccroutes.com:5000"
// const ENDPOINT = "https://7fd4c7b4.ngrok.io/"

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

  async getRoomKey(roomId) {

    var data = {
      roomId: roomId,
      publicKey: this.state.publicKey
    };

    this.rsa.setPublicString(serverPKey);
    AsyncStorage.setItem('payload', this.rsa.encrypt(JSON.stringify(data)));

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
    await this.socket.emit('request_server_key');
    await this.socket.on('broadcast_key', (key) => this.handleServerKey(key));
    await this.socket.on('room_key', (key) => this.handleRoomKey(key));
    await this.socket.emit('join room', roomId);

    this.socket.on('connect_error', ()    => this.connectionError());
    this.socket.on('new message',   (msg) => this.handleReceive(msg));
  }

  async componentWillUnmount() {
    this.socket.disconnect();
  }

  async setMessages(messages) {
    this._messages = messages;
    this.setState({messages: messages});
    AsyncStorage.setItem('messages_' + this.state.roomId,
      JSON.stringify(this._messages));
  }

  async handleRoomKey(key) {
    console.log(key);
    this.rsa.setPrivateString(this.state.privateKey);

    this.setState({
      roomKey: this.rsa.decrypt(key)
    })
  }

  async handleServerKey(key) {
    let roomId = await AsyncStorage.getItem('roomId');
    AsyncStorage.setItem('serverPKey', key);

    this.rsa.setPublicString(key);
    roomId = this.rsa.encrypt(roomId);

    var payload = {
      pkey: this.state.publicKey,
      roomId: roomId,
    };

    console.log('server key' + key);
    try {
      this.socket.emit('request_room_key', payload);
      console.log(payload);
      console.log('got here 69');
    } catch (e) {
      console.log("error: " + e);
    }
  }

  handleSend(message = {}) {
    let roomKey = this.state.roomKey;
    let roomId = this.state.roomId; // fix this, should not be sent, but stored on server.
    // console.log(roomKey);
    // console.log(message);

    var bufferInput = new Buffer(message.text);
    var keyBuffer = new Buffer(roomKey, 'base64');
    var cipherName = 'AES-256-CBC';
    var socket = this.socket;

    this.setMessages(this._messages.concat(message));

    AES.encryptWithCipher(cipherName, bufferInput, keyBuffer, function (err, encrypted) {
      message.text = encrypted;
      message.roomId = roomId;
      socket.emit('new message', message);
    });


  }

  handleReceive(message = {}) {
    let roomKey = this.state.roomKey;

    var bufferInput = new Buffer(message.text);
    var keyBuffer = new Buffer(roomKey, 'base64');
    var cipherName = 'AES-256-CBC';
    var socket = this.socket;

    AES.decryptWithCipher(
      cipherName, message.text.ciphertext, roomKey, message.text.iv, function (err, plaintext) {
        if (plaintext.toString() !== stringInput) {
          throw new Error('time to report an issue!')
        }
        message.text = plaintext;
      }
    )

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
