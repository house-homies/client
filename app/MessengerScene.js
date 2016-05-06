'use strict';

import React, {
  ActionSheetIOS,
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
var io = require("socket.io-client/socket.io");
var GiftedMessenger = require('react-native-gifted-messenger');
var Communications = require('react-native-communications');

var STATUS_BAR_HEIGHT = Navigator.NavigationBar.Styles.General.StatusBarHeight;
if (Platform.OS === 'android') {
  var ExtraDimensions = require('react-native-extra-dimensions-android');
  var STATUS_BAR_HEIGHT = ExtraDimensions.get('STATUS_BAR_HEIGHT');
}


class MessengerScene extends Component {

  constructor(props) {
    super(props);

    this.socket = io("http://iccroutes.com:5000", {jsonp:false, transports: ['websocket']});
    this._isMounted = false;
    this._messages = this.getInitialMessages();

    this.state = {
      messages: this._messages,
      isLoadingEarlierMessages: false,
      typingMessage: '',
      allLoaded: false,
      roomId: '',
      username: '',
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('roomId', (error, result) => {
      if (error) {
        this.setState({roomId: '[ERROR]'});
      } else {
        this.setState({roomId: result,});
        this.socket.emit('join room', result);
      }
    });
    AsyncStorage.getItem('username', (error, result) => {
      if (error) {
        this.setState({username: '[ERROR]'});
      } else {
        this.setState({username: result,});
      }
    });

    this._isMounted = true;

    this.socket.on('new message', (msg) => {
      console.log(msg);
      this.handleReceive(msg);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getInitialMessages() {
    return [];
  }

  setMessageStatus(uniqueId, status) {
    let messages = [];
    let found = false;

    for (let i = 0; i < this._messages.length; i++) {
      if (this._messages[i].uniqueId === uniqueId) {
        let clone = Object.assign({}, this._messages[i]);
        clone.status = status;
        messages.push(clone);
        found = true;
      } else {
        messages.push(this._messages[i]);
      }
    }

    if (found === true) {
      this.setMessages(messages);
    }
  }

  setMessages(messages) {
    this._messages = messages;

    // append the message
    this.setState({
      messages: messages,
    });
  }

  handleSend(message = {}) {
    message.name = this.state.username;

    // Send message.text to your server
    // this.socket.send(JSON.stringify(message));
    this.socket.emit('new message',  message);

    // simulating server-side unique id generation    
    message.uniqueId = Math.round(Math.random() * 10000); 
    this.setMessages(this._messages.concat(message));

    // if you couldn't send the message to your server :
    // this.setMessageStatus(message.uniqueId, 'ErrorButton');
  }

  handleReceive(message = {}) {
    // make sure that your message contains :
    // text, name, image, position: 'left', date, uniqueId
    message.position = 'left';
    message.image = null;
    this.setMessages(this._messages.concat(message));
  }

  onErrorButtonPress(message = {}) {
    // Your logic here
    // re-send the failed message

    // remove the status
    this.setMessageStatus(message.uniqueId, '');
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
        onErrorButtonPress={this.onErrorButtonPress.bind(this)}
        maxHeight={Dimensions.get('window').height - Navigator.NavigationBar.Styles.General.NavBarHeight - STATUS_BAR_HEIGHT}

        loadEarlierMessagesButton={false}

        senderName='Awesome Developer'
        senderImage={null}
        displayNames={true}

        typingMessage={this.state.typingMessage}
      />
    );
  }

}

module.exports = MessengerScene;
