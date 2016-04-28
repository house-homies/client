'use strict';

import React, {
  Linking,
  Platform,
  ActionSheetIOS,
  Dimensions,
  View,
  Text,
  Navigator,
  Component,
} from 'react-native';

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
    
    this._isMounted = false;
    this._messages = this.getInitialMessages();
    
    this.state = {
      messages: this._messages,
      isLoadingEarlierMessages: false,
      typingMessage: '',
      allLoaded: false,
    };
    
  }
  
  componentDidMount() {
    this._isMounted = true;    
    
    setTimeout(() => {
      this.setState({
        typingMessage: 'React-Bot is typing a message...',
      });
    }, 1000); // simulating network

    setTimeout(() => {
      this.setState({
        typingMessage: '',
      });
    }, 3000); // simulating network
    
    
    setTimeout(() => {
      this.handleReceive({
        text: 'Hello Awesome Developer', 
        name: 'React-Bot', 
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, 
        position: 'left', 
        date: new Date(),
        uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
      });
    }, 3300); // simulating network
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  
  getInitialMessages() {
    return [
      {
        text: 'Are you building a chat app?', 
        name: 'React-Bot', 
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, 
        position: 'left', 
        date: new Date(2016, 3, 14, 13, 0),
        uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
      },
      {
        text: "Yes, and I use Gifted Messenger!", 
        name: 'Awesome Developer', 
        image: null, 
        position: 'right', 
        date: new Date(2016, 3, 14, 13, 1),
        uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
      },
    ];
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
    
    // Your logic here
    // Send message.text to your server
    
    message.uniqueId = Math.round(Math.random() * 10000); // simulating server-side unique id generation
    this.setMessages(this._messages.concat(message));
    
    // mark the sent message as Seen
    setTimeout(() => {
      this.setMessageStatus(message.uniqueId, 'Seen'); // here you can replace 'Seen' by any string you want
    }, 1000);

    // if you couldn't send the message to your server :
    // this.setMessageStatus(message.uniqueId, 'ErrorButton');
  }
  
  handleReceive(message = {}) {
    // make sure that your message contains :
    // text, name, image, position: 'left', date, uniqueId
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
